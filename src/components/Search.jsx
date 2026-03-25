import React, { useState, useRef, useEffect, useContext } from "react";
import 'react-toastify/dist/ReactToastify.css';
import SearchContext from "../context/SearchContext";
import CollectionsContext from "../context/CollectionsContext";
import { toast } from 'react-toastify';
import MuiModal from "./MuiModal";

import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { createSavedPlace, deleteSavedPlace } from '../graphql/mutations';
import { getCollection, listSavedPlaces } from '../graphql/queries';

const client = generateClient();

const searchPlaceByName = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=100`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Vette/1.0 (paolobenincasa1984@gmail.com)',
        },
    });

    if (!response.ok) {
        throw new Error("Errore nella richiesta.");
    }

    return await response.json();
};

export default function Search() {
    const { user } = useAuthenticator((context) => [context.user]);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resultsVisible, setResultsVisible] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const searchResultsRef = useRef(null);
    const debounceTimeout = useRef(null);

    const { setPlaces } = useContext(SearchContext);
    const { collections } = useContext(CollectionsContext);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (value.trim()) {
            debounceTimeout.current = setTimeout(() => {
                handleSearch(value);
            }, 500);
        } else {
            setResultsVisible(false);
            setResults([]);
        }
    };

    const handleSearch = async (searchValue) => {
        try {
            setLoading(true);
            setError(null);
            const data = await searchPlaceByName(searchValue);

            setResults(data.length > 0 ? data : []);
            if (data.length === 0) setError("Nessun risultato trovato.");

            setLoading(false);
            setResultsVisible(true);
            setPlaces(data);

        } catch (err) {
            console.error("Errore nella ricerca:", err);
            setError("Errore nella ricerca. Riprova.");
            setLoading(false);
        }
    };

    const handlePlaceClick = (place) => {
        setSelectedPlace(place);
        setOpenModal(true);
        setResultsVisible(false);
        setQuery("");
    };

    const handleSavePlace = async (place, collection) => {
        if (!user) {
            toast.error("Devi essere loggato per salvare un luogo");
            return;
        }

        if (!collection) {
            toast.error("Seleziona una raccolta");
            return;
        }

        const collectionId = collection.id;
        const placeName = place.display_name;

        try {
            // 1. recupero la collezione selezionata e i suoi vincoli (exclusive_with)
            const collectionResponse = await client.graphql({
                query: getCollection,
                variables: { id: collectionId }
            });
            const selectedCollection = collectionResponse.data.getCollection;
            const exclusive_with = selectedCollection?.exclusive_with || [];

            // 2. controllo l'esclusività
            for (const exclusiveCollectionId of exclusive_with) {
                // cerco se questo posto esiste già in una collezione esclusiva
                const existingPlacesResponse = await client.graphql({
                    query: listSavedPlaces,
                    variables: {
                        filter: {
                            collectionID: { eq: exclusiveCollectionId },
                            name: { eq: placeName }
                        }
                    }
                });

                const existingPlaces = existingPlacesResponse.data.listSavedPlaces.items;

                if (existingPlaces && existingPlaces.length > 0) {
                    const placeToDelete = existingPlaces[0];

                    // Lo cancello dalla collezione esclusiva
                    await client.graphql({
                        query: deleteSavedPlace,
                        variables: { input: { id: placeToDelete.id } }
                    });

                    const exclusiveCollectionInfo = collections.find(c => c.id === exclusiveCollectionId);
                    toast.info(`"${placeName}" rimosso da "${exclusiveCollectionInfo?.name}" per esclusività.`);
                }
            }

            // 3. salvo il nuovo posto nella collezione desiderata
            const newPlaceInput = {
                name: placeName,
                latitude: parseFloat(place.lat),
                longitude: parseFloat(place.lon),
                collectionID: collectionId 
            };

            const response = await client.graphql({
                query: `
        mutation CreateSavedPlace($input: CreateSavedPlaceInput!) {
            createSavedPlace(input: $input) {
                id
                name
                latitude
                longitude
                collectionID
                createdAt
                updatedAt
            }
        }
    `,
                variables: { input: newPlaceInput }
            });

            const savedData = response.data.createSavedPlace;

            toast.success("Luogo salvato con successo!");
            setSelectedPlace(null);
            setOpenModal(false);

            // Notifico ad AppProfile
            window.dispatchEvent(new CustomEvent("placeSaved", {
                detail: savedData,
            }));

        } catch (err) {
            console.error('Errore nel salvataggio:', err);
            toast.error("Errore durante il salvataggio");
        }
    };

    const handleClickOutside = (event) => {
        if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
            setResultsVisible(false);
            setQuery("");
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="p-4 d-flex justify-content-center search-nav" style={{ position: 'relative' }}>
            <input
                type="text"
                placeholder="Cerca un luogo..."
                value={query}
                onChange={handleInputChange}
                className="border p-2 rounded input-search"
            />

            {loading &&
                <div className="d-flex justify-content-center loading">
                    <div className="spinner-border txtWhite ms-2" role="status">
                    </div>
                </div>}
            {error && <p className="mt-4 text-danger">{error}</p>}

            {resultsVisible && (
                <div className='d-flex justify-content-center search-results'>
                    <ul ref={searchResultsRef} className="mb-0 list-unstyled w-100">
                        {results.map((place, index) => (
                            <li key={index} className="border-bottom w-100">
                                <button
                                    type="button"
                                    className="btn-results btn text-start text-decoration-none w-100"
                                    onClick={() => handlePlaceClick(place)}
                                >
                                    {place.display_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedPlace && (
                <MuiModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    selectedPlace={selectedPlace}
                    collections={collections}
                    onSave={handleSavePlace}
                />
            )}
        </div>
    );
}
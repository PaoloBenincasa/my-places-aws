import { useEffect, useState, useContext, useRef } from "react";
import Map from "../components/Map";
import CreateCollectionForm from "../components/CreateCollectionForm";
import CollectionsContext from "../context/CollectionsContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- INIZIO IMPORT AWS ---
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { listSavedPlaces, listCollections, getSavedPlace } from '../graphql/queries';
import { deleteSavedPlace as deleteSavedPlaceMutation } from '../graphql/mutations';
// --- FINE IMPORT AWS ---

const client = generateClient();

export default function AppProfile() {
    // Sostituito SessionContext con useAuthenticator
    const { user } = useAuthenticator((context) => [context.user]);
    
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const placeRefs = useRef({});
    const mapSectionRef = useRef(null);
    const [selectedCollectionsFilter, setSelectedCollectionsFilter] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { collections, setCollections } = useContext(CollectionsContext);

    // Recupero i luoghi salvati
    useEffect(() => {
        if (user) {
            const fetchSavedPlaces = async () => {
                try {
                    // La chiamata a listSavedPlaces recupera in automatico anche la 'collection' collegata
                    const response = await client.graphql({
                        query: listSavedPlaces
                    });
                    
                    const data = response.data.listSavedPlaces.items;
                    setSavedPlaces(data || []);
                } catch (error) {
                    console.error("Errore nel recupero dei luoghi da AWS:", error);
                }
            };
            fetchSavedPlaces();
        }
    }, [user]);

    // Recupero le collections dell'utente
    useEffect(() => {
        if (user) {
            const fetchCollections = async () => {
                try {
                    const response = await client.graphql({
                        query: listCollections
                    });
                    const data = response.data.listCollections.items;
                    setCollections(data || []);
                } catch (error) {
                    console.error("Errore nel recupero delle raccolte da AWS:", error);
                }
            };
            fetchCollections();
        }
    }, [user, setCollections]);

    // Filtro i luoghi (In AWS la chiave esterna generata si chiama collectionID con ID maiuscolo)
    const filteredPlaces = selectedCollections.length > 0
        ? savedPlaces.filter(place => selectedCollections.includes(place.collectionID))
        : savedPlaces;

    // Elimino un luogo
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Sei sicuro di voler eliminare questo luogo?");
        if (confirmDelete) {
            try {
                await client.graphql({
                    query: deleteSavedPlaceMutation,
                    variables: { input: { id: id } }
                });
                
                setSavedPlaces((prev) => prev.filter((place) => place.id !== id));
                toast.success("Luogo eliminato.");
            } catch (error) {
                console.error("Errore nell'eliminazione del luogo su AWS:", error);
                toast.error("Errore durante l'eliminazione.");
            }
        }
    };

    const updateCollections = (updatedCollections) => {
        setCollections(updatedCollections);
    };

    const handleScrollToPlace = (placeId) => {
        const place = savedPlaces.find(p => p.id === placeId);
        if (!place?.latitude || !place?.longitude) return;
        
        if (mapSectionRef.current) {
            mapSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        window.dispatchEvent(new CustomEvent("scrollToMarker", { detail: placeId }));
    };

    const toggleInfo = (placeId) => {
        const details = document.querySelector(`#details-${placeId}`);
        if (details) {
            details.classList.toggle("d-none");
        }
    };
    
    const handleCollectionFilterChange = (collectionId) => {
        setSelectedCollectionsFilter((prev) => {
            if (prev.includes(collectionId)) {
                return prev.filter((id) => id !== collectionId);
            } else {
                return [...prev, collectionId];
            }
        });
    };
    
    // Filtro per la lista
    const filteredPlacesList = selectedCollectionsFilter.length > 0
        ? savedPlaces.filter(place =>
            place.collectionID &&
            selectedCollectionsFilter.includes(place.collectionID) &&
            place.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : savedPlaces.filter(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Hook di comunicazione con Search.jsx
    useEffect(() => {
        const handlePlaceSaved = async (event) => {
            try {
                // Leggiamo il luogo appena creato dal DB per assicurarci di avere tutte le relazioni (es. collection)
                const response = await client.graphql({
                    query: getSavedPlace,
                    variables: { id: event.detail.id }
                });
                
                const data = response.data.getSavedPlace;
                
                if (data) {
                    setSavedPlaces((prevPlaces) => [...prevPlaces.filter(place => place.id !== event.detail.id), data]);
                }
            } catch (error) {
                console.error("Errore nel recupero del luogo aggiornato da AWS:", error);
            }
        };
        
        window.addEventListener("placeSaved", handlePlaceSaved);
        return () => {
            window.removeEventListener("placeSaved", handlePlaceSaved);
        };
    }, []);

    if (!user) {
        return <p>Caricamento...</p>;
    }

    return (
        <div className="profile">
            <div className="collections pt-3 pb-5 d-flex flex-column align-items-start max-h-75 p-1 bgDarkgreen container">
                <div className="w-100">
                    <CreateCollectionForm setCollections={setCollections} collections={collections} />
                </div>
            </div>
            
            <div className="map-container" ref={mapSectionRef}>
                <Map
                    savedPlaces={filteredPlaces}
                    setSavedPlaces={setSavedPlaces}
                    updateCollections={updateCollections}
                    handleScrollToPlace={handleScrollToPlace}
                />
            </div>

            <div className="txtWhite places-list container ">
                <h4 className="pt-5 underBlue">Tutti i luoghi che hai visitato</h4>

                <div className="mb-3">
                    <h5 className="mt-3 ms-1 fs-6 txtGrey">Filtra per raccolta</h5>
                    {collections.map((collection) => (
                        <div
                            key={collection.id}
                            className={`${selectedCollectionsFilter.includes(collection.id) ? 'active' : ''}`}
                            onClick={() => handleCollectionFilterChange(collection.id)}
                            style={{
                                backgroundColor: selectedCollectionsFilter.includes(collection.id) ? collection.color : 'transparent',
                                marginLeft: '5px',
                                marginTop: '3px',
                                marginBottom: '3px',
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                borderRadius: '1%',
                                cursor: 'pointer',
                                border: '1px solid grey',
                                display: 'inline-block'
                            }}
                        >
                            {selectedCollectionsFilter.includes(collection.id) ? '✓' : '+'} {collection.name}
                        </div>
                    ))}
                </div>
                
                <input
                    type="text"
                    placeholder="Cerca tra i tuoi luoghi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control listSearch mb-3 ms-2"
                />

                <ul className="mt-4">
                    {filteredPlacesList.map((place) => {
                        const [mainName, ...rest] = place.name.split(",");

                        return (
                            <li
                                key={place.id}
                                ref={(el) => (placeRefs.current[place.id] = el)}
                                className="list-unstyled"
                            >
                                <span
                                    className="main-name"
                                    onClick={() => handleScrollToPlace(place.id)}
                                >
                                    {mainName}
                                </span>
                                <small
                                    className="txtGrey info ms-1"
                                    onClick={() => toggleInfo(place.id)}
                                >
                                    info
                                </small>
                                <div id={`details-${place.id}`} className="d-none p-2">
                                    <div>
                                        {rest.length > 0 && <span className="secondary-name">{rest.join(",")}</span>}
                                        <small className="ps-1 btn-delete" onClick={() => handleDelete(place.id)}>
                                            elimina luogo
                                        </small>
                                    </div>
                                    <div>
                                        <span
                                            style={{
                                                // IN AWS L'OGGETTO COLLEGATO E' AL SINGOLARE: place.collection (e non place.collections)
                                                backgroundColor: place.collection?.color || "gray",
                                                borderRadius: "50%",
                                                height: "12px",
                                                width: "12px",
                                                display: "inline-block"
                                            }}
                                        ></span>
                                        <span className="ms-2">
                                            {place.collection?.name || "Senza nome"}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {/* Lasciamo qui il ToastContainer in caso serva mostrare messaggi (es. eliminazione avvenuta) */}
            <ToastContainer />
        </div>
    );
}
import { useState, useContext } from "react";
import CollectionsContext from '../context/CollectionsContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- INIZIO IMPORT AWS ---
import { generateClient } from 'aws-amplify/api';
import { createCollection as createCollectionMutation } from '../graphql/mutations'; 
// --- FINE IMPORT AWS ---

const client = generateClient();

const CreateCollectionForm = () => {
    // Estraiamo anche handleCollectionChange dal Context per poter selezionare la nuova raccolta
    const { collections, setCollections, handleCollectionChange } = useContext(CollectionsContext);
    const [collectionName, setCollectionName] = useState("");
    const [collectionColor, setCollectionColor] = useState("#000000");
    const [exclusiveCollections, setExclusiveCollections] = useState([]);

    const createCollection = async () => {
        if (!collectionName.trim()) return;

        try {
            const inputData = {
                name: collectionName,
                color: collectionColor,
                exclusive_with: exclusiveCollections
            };

            const response = await client.graphql({
                query: createCollectionMutation,
                variables: { input: inputData }
            });

            const nuovaRaccolta = response.data.createCollection;

            // 1. Aggiorniamo l'elenco locale delle raccolte
            setCollections(prevCollections => [...prevCollections, nuovaRaccolta]);
            
            // 2. AUTO-SELEZIONE: Attiviamo subito la nuova raccolta sulla mappa
            // Chiamiamo la funzione del context passando l'ID della nuova raccolta
            handleCollectionChange(nuovaRaccolta.id);

            // 3. Reset dei campi del form
            setCollectionName("");
            setCollectionColor("#000000");
            setExclusiveCollections([]);

            toast.success("Raccolta creata e attivata sulla mappa! ☁️");
        } catch (error) {
            console.error("Errore durante la creazione della raccolta su AWS:", error);
            toast.error("Si è verificato un errore nel salvataggio.");
        }
    };

    const handleExclusiveCollectionChange = (collectionId) => {
        setExclusiveCollections(prev => 
            prev.includes(collectionId)
                ? prev.filter(id => id !== collectionId)
                : [...prev, collectionId]
        );
    }

    return (
        <div className="w-100 container">
            <h4 className="pt-5 underBlue txtWhite">Crea le tue raccolte</h4>
            <p className="txtGrey ms-3">organizza i tuoi posti del cuore in raccolte divise come più preferisci</p>
            <form
                className="d-flex flex-column align-items-start gap-3 ms-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    createCollection();
                }}>
                <input
                    type="text"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    placeholder="Nome raccolta"
                    required
                    className="form-control create-name"
                />
                <div>
                    <label htmlFor="color" className="txtWhite">Scegli il colore</label>
                    <input
                        type="color"
                        className="ms-2"
                        value={collectionColor}
                        onChange={(e) => setCollectionColor(e.target.value)}
                    />
                </div>
                <div>
                    <label className="txtWhite">Vincolo di esclusività con</label>
                    {collections && collections.length > 0 && collections.map((collection) => (
                        <div key={collection.id} className="ms-3">
                            <input
                                type="checkbox"
                                value={collection.id}
                                checked={exclusiveCollections.includes(collection.id)}
                                onChange={() => handleExclusiveCollectionChange(collection.id)}
                            />
                            <span className="txtWhite ms-1 mapCollectionName">{collection.name}</span>
                        </div>
                    ))}
                </div>
                <div>
                    <button type="submit" className="btn btn-search">Crea raccolta</button>
                </div>
            </form>

            <ToastContainer position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default CreateCollectionForm;
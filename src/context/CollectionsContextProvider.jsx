import { useState, useEffect } from "react";
import CollectionsContext from "./CollectionsContext";

import { generateClient } from 'aws-amplify/api';
import { listCollections } from '../graphql/queries';
import { deleteCollection as deleteCollectionMutation } from '../graphql/mutations';

const client = generateClient();

const CollectionsContextProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);

  // fetch delle raccolte al montaggio del componente
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        // chiamata ad AWS AppSync per leggere le raccolte
        const response = await client.graphql({
          query: listCollections
        });

        const data = response.data.listCollections.items;

        setCollections(data);
        
        // inizializzo selectedCollections con tutti gli ID 
        // delle raccolte caricate per rendere subito visibili i marker sulla mappa
        if (data && data.length > 0) {
          const allIds = data.map(collection => collection.id);
          setSelectedCollections(allIds);
        }
      } catch (error) {
        console.error("Errore nel recuperare le raccolte da AWS:", error);
      }
    };

    fetchCollections();
  }, []);

  // selezione e deselezione di una raccolta (checkbox sulla mappa)
  const handleCollectionChange = (collectionId) => {
    setSelectedCollections((prev) => {
      if (prev.includes(collectionId)) {
        // se l'id è già presente, lo rimuovo 
        return prev.filter((id) => id !== collectionId);
      } else {
        // altrimenti lo aggiungo (seleziono)
        return [...prev, collectionId];
      }
    });
  };

  // cancello la collezione dal database e aggiorna gli stati locali
  const handleDeleteCollection = async (id) => {
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare questa raccolta?");
    
    if (confirmDelete) {
      try {
        //chiamo AWS per eliminare la raccolta
        await client.graphql({
          query: deleteCollectionMutation,
          variables: { input: { id: id } }
        });
        
        // rimuovo la raccolta dall'elenco generale
        setCollections((prev) => prev.filter((c) => c.id !== id));
        // la rimuovo anche dalle selezionate se presente
        setSelectedCollections((prev) => prev.filter((collectionId) => collectionId !== id));
        
      } catch (error) {
        console.error("Errore nell'eliminazione della raccolta su AWS:", error);
      }
    }
  };

  return (
    <CollectionsContext.Provider value={{
      collections,
      setCollections, 
      selectedCollections,
      handleCollectionChange,
      handleDeleteCollection
    }}>
      {children}
    </CollectionsContext.Provider>
  );
}

export default CollectionsContextProvider;
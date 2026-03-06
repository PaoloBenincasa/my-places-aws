import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter } from 'react-router-dom';

// Importa i tuoi Context (Quelli che sono sopravvissuti alla pulizia!)
import CollectionsContextProvider from './context/CollectionsContextProvider';
import SearchContextProvider from './context/SearchContextProvider';

// Importa le tue rotte
import AppRoutes from './routes/Routes'; // Assicurati che questo import corrisponda al nome che hai nel file Routes.jsx

import './App.css';

function App() {
  return (
    // L'Authenticator fa da "Guardia giurata". Finché non sei loggato, mostra la sua schermata.
    // Appena fai il login, sblocca il contenuto qui dentro!
    <Authenticator>
      {({ signOut, user }) => (
        <CollectionsContextProvider>
          <SearchContextProvider>
            <BrowserRouter>
              
              {/* Qui viene caricata la TUA vera applicazione! */}
              <AppRoutes />

              {/* Tasto di emergenza temporaneo per farti fare il logout finché non lo mettiamo nella Navbar */}
              <button 
                onClick={signOut} 
                style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, padding: '10px', background: 'red', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
              >
                Esci da AWS
              </button>

            </BrowserRouter>
          </SearchContextProvider>
        </CollectionsContextProvider>
      )}
    </Authenticator>
  );
}

export default App;
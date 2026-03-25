import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter } from 'react-router';


import CollectionsContextProvider from './context/CollectionsContextProvider';
import SearchContextProvider from './context/SearchContextProvider';
import AppRoutes from './routes/Routes';

import './App.css';

function App() {
  return (

    <>
      <Authenticator>
        {({ signOut, user }) => (
          <CollectionsContextProvider>
            <SearchContextProvider>
              <BrowserRouter>

                <AppRoutes />

              </BrowserRouter>
            </SearchContextProvider>
          </CollectionsContextProvider>
        )}
      </Authenticator>
     


    </>
  );
}

export default App;
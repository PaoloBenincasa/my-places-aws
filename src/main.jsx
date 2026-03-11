// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// import { Amplify } from 'aws-amplify';
// import awsconfig from './aws-exports';
// Amplify.configure(awsconfig);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css'
import App from './App.jsx'

// --- CONFIGURAZIONE AWS AMPLIFY ---
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
// Importa gli stili CSS predefiniti per i componenti UI di Amplify
import '@aws-amplify/ui-react/styles.css'; 

// Esegui la configurazione il prima possibile
Amplify.configure(awsconfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

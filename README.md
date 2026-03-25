# 🗺️ My Places - AWS Serverless Travel Tracker

**🔗 [Guarda l'app live qui!](https://main.d36vvl92r6xjti.amplifyapp.com)**

Un'applicazione web full-stack progettata per i viaggiatori che vogliono tenere traccia dei luoghi visitati, organizzarli in raccolte personalizzate e visualizzarli su una mappa interattiva. 

Il progetto unisce un'interfaccia utente moderna e reattiva a un'infrastruttura cloud **100% serverless**, sicura e scalabile ospitata su Amazon Web Services (AWS).

---

## ✨ Funzionalità Principali

* 🔐 **Autenticazione Sicura:** Registrazione, login e gestione delle sessioni tramite AWS Cognito.
* 📍 **Mappa Interattiva:** Ricerca di luoghi reali (tramite OpenStreetMap) e salvataggio delle coordinate.
* 🗂️ **Raccolte Personalizzate:** Organizzazione dei luoghi in categorie con colori personalizzati e filtri dinamici.
* ⚡ **Aggiornamenti in Tempo Reale:** UI reattiva che si aggiorna istantaneamente all'aggiunta o all'eliminazione di un luogo, senza ricaricare la pagina.

---

## 💻 Web Development (Frontend)

L'interfaccia utente è stata sviluppata puntando su performance, pulizia del codice e responsività.

* **Core:** React.js (inizializzato con Vite per build ultra-veloci).
* **Gestione dello Stato:** Utilizzo combinato di Hooks (`useState`, `useEffect`) e **Context API** per gestire lo stato globale delle raccolte in modo efficiente.
* **Routing:** `react-router-dom` per una navigazione fluida (Single Page Application).
* **Mappe e Geocoding:** Integrazione di **Leaflet.js** (`react-leaflet`) per la mappa interattiva e utilizzo dell'API gratuita **OpenStreetMap (Nominatim)** per la ricerca degli indirizzi.
* **Styling:** Bootstrap 5 per il layout e la responsività, unito a CSS personalizzato.

---

## ☁️ Architettura Cloud AWS (Backend)

Il backend è stato progettato garantendo alta disponibilità, scalabilità automatica, sicurezza e costi ottimizzati (Pay-as-you-go).

* **AWS Amplify Hosting (CI/CD):** Distribuzione automatizzata del frontend con una pipeline collegata direttamente al branch `main`.
* **Amazon Cognito:** Gestione completa dell'identità degli utenti (User Pools) integrata nei componenti React tramite `@aws-amplify/ui-react`.
* **AWS AppSync (GraphQL):** API GraphQL gestita per la comunicazione tra frontend e database, ottimizzata per recuperare solo i dati strettamente necessari.
* **Amazon DynamoDB:** Database NoSQL altamente performante per memorizzare i dati degli utenti.

### 🗄️ Modellazione dei Dati e Sicurezza

Il database sfrutta direttive GraphQL avanzate per garantire isolamento dei dati e query efficienti:

```graphql
type Collection @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  name: String!
  color: String
  exclusive_with: [String]
  places: [SavedPlace] @hasMany(indexName: "byCollection", fields: ["id"])
}

type SavedPlace @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  name: String!
  latitude: Float!
  longitude: Float!
  collectionID: ID! @index(name: "byCollection")
  collection: Collection @belongsTo(fields: ["collectionID"])
}

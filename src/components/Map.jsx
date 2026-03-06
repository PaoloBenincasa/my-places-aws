import { useContext, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import CollectionsContext from "../context/CollectionsContext";

export default function Map({ savedPlaces, setSavedPlaces }) {
  const { collections, selectedCollections, handleCollectionChange, handleDeleteCollection } = useContext(CollectionsContext);
  const mapRef = useRef(null);

  // Utilizziamo direttamente savedPlaces dalle props
  const places = savedPlaces;

  const getMarkerColor = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.color : "blue";
  };

  const createCustomDivIcon = (color) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: ${color}; width: 13px; height: 13px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  // Da aggiungere dentro Map.jsx se vuoi l'auto-centramento
  useEffect(() => {
    if (places.length > 0 && mapRef.current) {
      const validPlaces = places.filter(p => selectedCollections.includes(p.collectionID));
      if (validPlaces.length > 0) {
        const bounds = L.latLngBounds(validPlaces.map(p => [p.latitude, p.longitude]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [places, selectedCollections]);
  
  useEffect(() => {
    const handleScrollToMarker = (event) => {
      const placeId = event.detail;
      const place = savedPlaces.find((p) => p.id === placeId);

      if (place && place.latitude && place.longitude && mapRef.current) {
        mapRef.current.flyTo([place.latitude, place.longitude], 15);
      }
    };

    window.addEventListener("scrollToMarker", handleScrollToMarker);
    return () => {
      window.removeEventListener("scrollToMarker", handleScrollToMarker);
    };
  }, [savedPlaces]);

  console.log("Map renderizzata.");
  console.log("Dati ricevuti nella mappa:", places);
  console.log("Collezioni selezionate:", selectedCollections);

  return (
    <div className="container">
      <h4 className="mb-2 pt-3 txtWhite underBlue">Seleziona le raccolte da visualizzare</h4>
      {collections.map((collection) => (
        <div key={collection.id} className="ms-3 ">
          <label>
            <input
              type="checkbox"
              checked={selectedCollections.includes(collection.id)}
              onChange={() => handleCollectionChange(collection.id)}
            />
            <span className="txtWhite ms-1 mapCollectionName">{collection.name}</span>
          </label>
          <small
            className="btn-delete ms-2"
            onClick={() => handleDeleteCollection(collection.id)}
          >
            elimina
          </small>
        </div>
      ))}

      <div className="container mt-3">
        <MapContainer ref={mapRef} center={[42, 12]} zoom={5} style={{ height: "500px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {places
            // ATTENZIONE: Usa collectionID (CamelCase) come definito nel nostro schema AWS!
            .filter(place => selectedCollections.includes(place.collectionID))
            .map((place) => (
              <Marker
                key={place.id}
                position={[place.latitude, place.longitude]}
                // ATTENZIONE: Usa collectionID (CamelCase) anche qui!
                icon={createCustomDivIcon(getMarkerColor(place.collectionID))}
              >
                <Popup>{place.name}</Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
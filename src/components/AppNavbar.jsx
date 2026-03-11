// import { useEffect, useState } from "react";
// import { Link } from "react-router";
// import Search from "./Search";

// // --- INIZIO IMPORT AWS ---
// import { useAuthenticator } from '@aws-amplify/ui-react';
// // --- FINE IMPORT AWS ---

// export default function AppNavbar() {
//     // La magia di AWS: estraiamo l'utente e la funzione di logout in una riga sola!
//     const { user, signOut } = useAuthenticator((context) => [context.user]);
    
//     const [isScrolled, setIsScrolled] = useState(false);

//     const handleScroll = () => {
//         setIsScrolled(window.scrollY > 80);
//     };

//     useEffect(() => {
//         window.addEventListener('scroll', handleScroll);
//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, []);

//     // Se l'utente è loggato, prendiamo la parte prima della @ dalla sua email per usarla come nome
//     const username = user?.signInDetails?.loginId?.split('@')[0] || "Utente";

//     // Funzione fittizia per evitare crash (nel tuo codice originale mancava la definizione di handleSave)
//     const handleSave = (newPlace) => {
//         console.log("Posto da salvare:", newPlace);
//     };

//     return (
//         <nav className={`${isScrolled ? 'scrolled' : ''}`}>

//             <div className="col-md-4 col-0 home-container text-center ">
//                 <Link to="/" className="home-link">
//                     home
//                 </Link>
//             </div>

//             <div className="search-container col-10 col-md-4">
//                 <Search onSave={(newPlace) => handleSave(newPlace)} />
//             </div>

//             {/* Versione Desktop */}
//             {user ? (
//                 <div className="dropdown col-md-4 col-2 text-end account-container text-center">
//                     <div className=" dropdown-toggle txtWhite" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                         {username}
//                     </div>
//                     <ul className="dropdown-menu p-2">
//                         <li>
//                             <Link to="/profile" className="navlink">La tua mappa</Link>
//                         </li>
//                         <li>
//                             <a href="#logout" onClick={(e) => { e.preventDefault(); signOut(); }} className="navlink">Logout</a>
//                         </li>
//                     </ul>
//                 </div>
//             ) : (
//                 <div className="dropdown col-md-4 col-2 text-end account-container text-center">
//                     <div className="txtWhite dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                         benvenuto!
//                     </div>
//                     {/* Nota: L'Authenticator nasconde l'app a chi non è loggato, quindi questa parte non si vedrà quasi mai */}
//                 </div>
//             )}

//             {/* Versione Mobile (Responsive) */}
//             {user ? (
//                 <div className="dropdown col-md-4 col-2 account-container-resp text-center ">
//                     <div className=" dropdown-toggle txtWhite" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                         <i className="bi bi-list fs-1"></i>
//                     </div>
//                     <ul className="dropdown-menu p-2">
//                         <li>
//                             <Link to="/" className="navlink">Home</Link>
//                         </li>
//                         <li>
//                             <Link to="/profile" className="navlink">La tua mappa</Link>
//                         </li>
//                         <li>
//                             <a href="#logout" onClick={(e) => { e.preventDefault(); signOut(); }} className="navlink">Logout</a>
//                         </li>
//                     </ul>
//                 </div>
//             ) : (
//                 <div className="dropdown col-md-4 col-2 account-container-resp text-center ">
//                     <div className="txtWhite dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                         <i className="bi bi-list fs-1"></i>
//                     </div>
//                 </div>
//             )}
//         </nav >
//     );
// }

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // Aggiunto useNavigate per sicurezza
import Search from "./Search";
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function AppNavbar() {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 80);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Pulizia dell'email per visualizzare il nome
    const username = user?.signInDetails?.loginId?.split('@')[0] || "Utente";

    const handleLogout = async () => {
        await signOut();
        navigate("/"); // Dopo il logout, riportiamo l'utente alla home (l'Authenticator farà il resto)
    };

    return (
        <nav className={`${isScrolled ? 'scrolled' : ''}`}>

            <div className="col-md-4 col-0 home-container text-center ">
                <Link to="/" className="home-link">
                    home
                </Link>
            </div>

            <div className="search-container col-10 col-md-4">
                <Search onSave={(newPlace) => console.log("Salvato:", newPlace)} />
            </div>

            {/* Versione Desktop */}
            <div className="dropdown col-md-4 col-2 text-end account-container text-center">
                <div 
                    className="dropdown-toggle txtWhite" 
                    type="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    style={{ cursor: 'pointer' }}
                >
                    {user ? username : "Benvenuto!"}
                </div>
                {user && (
                    <ul className="dropdown-menu p-2">
                        <li>
                            <Link to="/profile" className="navlink">La tua mappa</Link>
                        </li>
                        <hr className="dropdown-divider" />
                        <li>
                            <button 
                                onClick={handleLogout} 
                                className="navlink btn btn-link p-0 text-start w-100"
                                style={{ border: 'none', background: 'none' }}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                )}
            </div>

            {/* Versione Mobile (Responsive) */}
            <div className="dropdown col-md-4 col-2 account-container-resp text-center ">
                <div 
                    className="dropdown-toggle txtWhite" 
                    type="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                >
                    <i className="bi bi-list fs-1"></i>
                </div>
                {user && (
                    <ul className="dropdown-menu p-2">
                        <li><Link to="/" className="navlink">Home</Link></li>
                        <li><Link to="/profile" className="navlink">La tua mappa</Link></li>
                        <li>
                             <button 
                                onClick={handleLogout} 
                                className="navlink btn btn-link p-0 text-start w-100"
                                style={{ border: 'none', background: 'none' }}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </nav >
    );
}
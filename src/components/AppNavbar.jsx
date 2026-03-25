import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; 
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

    // pulizia email per visualizzare il nome
    const username = user?.signInDetails?.loginId?.split('@')[0] || "Utente";

    const handleLogout = async () => {
        await signOut();
        navigate("/");
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

            {/* desktop*/}
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

            {/* versione mobile  */}
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
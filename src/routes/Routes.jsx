import { Routes, Route } from 'react-router-dom';

// Importiamo solo le pagine che ci servono (niente più SignIn/SignUp!)
import AppHome from '../Pages/AppHome';
import AppLayout from '../Layout/AppLayout';
import AppProfile from '../Pages/AppProfile';

function AppRoutes() {
  return (
    <Routes>
      {/* Tutte le nostre rotte sono avvolte dal Layout principale (che avrà la Navbar) */}
      <Route path="/" element={<AppLayout />}>
        
        {/* Rotta base (Home) */}
        <Route index element={<AppHome />} />
        
        {/* Rotta del profilo utente */}
        <Route path="profile" element={<AppProfile />} />

      </Route>
    </Routes>
  );
}

export default AppRoutes;
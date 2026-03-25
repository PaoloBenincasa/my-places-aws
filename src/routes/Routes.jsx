import { Routes, Route } from 'react-router-dom';

import AppHome from '../Pages/AppHome';
import AppLayout from '../Layout/AppLayout';
import AppProfile from '../Pages/AppProfile';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>

        <Route index element={<AppHome />} />
        <Route path="profile" element={<AppProfile />} />

      </Route>
    </Routes>
  );
}

export default AppRoutes;
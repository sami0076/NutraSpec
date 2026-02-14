import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LandingScreen from './screens/LandingScreen';
import ScanScreen from './screens/ScanScreen';
import ResultScreen from './screens/ResultScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/scan" element={<ScanScreen />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

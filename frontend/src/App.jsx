import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ReportsProvider } from './contexts/ReportsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import MapDashboard from './pages/MapDashboard';

function App() {
  return (
    <ThemeProvider>
      <ReportsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapDashboard />} />
          </Routes>
          <Toaster position="bottom-right" />
        </Router>
      </ReportsProvider>
    </ThemeProvider>
  );
}

export default App;
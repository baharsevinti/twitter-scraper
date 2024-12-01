import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ScrapDetails from './pages/ScrapDetails';
import APIProvider from './services/api'; // Import the APIProvider

function App() {
  return (
    <APIProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/scrape-details" element={<ScrapDetails />} />
          </Routes>
        </div>
      </Router>
    </APIProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Survey from './pages/Survey';
import Itinerary from './pages/Itinerary';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/survey" element={<Survey />} />
                <Route path="/itinerary" element={<Itinerary />} />
            </Routes>
        </Router>
    );
}

export default App;

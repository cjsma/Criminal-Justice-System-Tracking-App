import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MissingPerson from './pages/MissingPerson';
import CorrectionalService from './pages/CorrectionalService';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/missing-person" element={<MissingPerson />} />
        <Route path="/correctional-service" element={<CorrectionalService />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MissingPerson from './pages/MissingPerson';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/missing-person" element={<MissingPerson />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [newCase, setNewCase] = useState({
    caseNumber: '',
    policeOfficer: '',
    station: '',
    status: 'Under Investigation',
    description: '',
    documents: [],
  });

  const handleChange = (e) => {
    setNewCase({ ...newCase, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    setNewCase({ ...newCase, documents: [...e.target.files] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCases([...cases, newCase]);
    setNewCase({
      caseNumber: '',
      policeOfficer: '',
      station: '',
      status: 'Under Investigation',
      description: '',
      documents: [],
    });
  };

  return (
    <div>
      <h2>Log a New Case</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="caseNumber"
          placeholder="Case Number"
          onChange={handleChange}
          required
        />
        <input
          name="policeOfficer"
          placeholder="Police Officer"
          onChange={handleChange}
          required
        />
        <input
          name="station"
          placeholder="Police Station"
          onChange={handleChange}
          required
        />
        <select name="status" onChange={handleChange}>
          <option value="Under Investigation">Under Investigation</option>
          <option value="On Trial">On Trial</option>
        </select>
        <textarea
          name="description"
          placeholder="Incident Description"
          onChange={handleChange}
          required
        />
        <input type="file" multiple onChange={handleFileUpload} />
        <button type="submit">Submit Case</button>
      </form>
    </div>
  );
};

export default Cases;

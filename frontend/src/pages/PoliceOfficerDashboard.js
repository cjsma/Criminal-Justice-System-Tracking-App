import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/PoliceOfficerDashboard.css';

const correctionalServicesByProvince = {
  Gauteng: [
    'Leeuhof Prison Hospital',
    'Johannesburg Correctional Centre',
    'Boksburg Correctional Centre',
  ],
  'KwaZulu-Natal': [
    'Durban Correctional Centre',
    'Westville Correctional Centre',
    'Pietermaritzburg Correctional Centre',
  ],
  'Western Cape': [
    'Pollsmoor Prison',
    'Goodwood Correctional Centre',
    'Brandvlei Correctional Centre',
  ],
  'Eastern Cape': [
    'East London Correctional Centre',
    'St. Albans Correctional Centre',
    'Mthatha Correctional Centre',
  ],
  'Free State': [
    'Grootvlei Prison',
    'Bethlehem Correctional Centre',
    'Kroonstad Correctional Centre',
  ],
  Limpopo: [
    'Polokwane Correctional Centre',
    'Thohoyandou Correctional Centre',
    'Modimolle Correctional Centre',
  ],
  Mpumalanga: [
    'Barberton Prison',
    'Nelspruit Correctional Centre',
    'Witbank Correctional Centre',
  ],
  'Northern Cape': [
    'Kimberley Correctional Centre',
    'Upington Correctional Centre',
    'Kuruman Correctional Centre',
  ],
  'North West': [
    'Rustenburg Correctional Centre',
    'Mafikeng Correctional Centre',
    'Potchefstroom Correctional Centre',
  ],
};

const PoliceOfficerDashboard = () => {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedOfficerData, setSubmittedOfficerData] = useState(null);

  const [formData, setFormData] = useState({
    province: '',
    serviceName: '',
    officerName: '',
    employeeNumber: '',
    ranking: '',
  });

  useEffect(() => {
    if (selectedProvince) {
      setServices(correctionalServicesByProvince[selectedProvince] || []);
      setFormData((prev) => ({ ...prev, serviceName: '' }));
    } else {
      setServices([]);
    }
  }, [selectedProvince]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'province') {
      setSelectedProvince(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'policeOfficers'), formData);
      setSubmitSuccess(true);
      setSubmittedOfficerData(formData); // Save form data for profile display
    } catch (error) {
      console.error('Error adding document: ', error);
      setSubmitError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="correctional-service-page">
      <div className="form-container">
        <div className="logo-container">
          <img
            className="logo"
            src="https://i.postimg.cc/FH0rkXfF/IMG-20241205-WA0007.png"
            alt="Logo"
          />
        </div>
        <h1>Correctional Service Information</h1>

        <div className="action-buttons">
          <button
            onClick={() => navigate('/missingPerson')}
            className="action-button"
          >
            Report Missing Person
          </button>
          <button
            onClick={() => navigate('/addCase')}
            className="action-button"
          >
            Add New Case
          </button>
          <button
            onClick={() => navigate('/applyProtection')}
            className="action-button"
          >
            Apply for Protection
          </button>
          <button
            onClick={() => navigate('/mostWanted')}
            className="action-button"
          >
            Wanted by Law
          </button>
        </div>

        {submitError && <div className="error-message">{submitError}</div>}

        {submitSuccess && submittedOfficerData ? (
          <div className="profile-view">
            <h2>Officer Profile</h2>
            <p>
              <strong>Province:</strong> {submittedOfficerData.province}
            </p>
            <p>
              <strong>Correctional Service:</strong>{' '}
              {submittedOfficerData.serviceName}
            </p>
            <p>
              <strong>Officer Name:</strong> {submittedOfficerData.officerName}
            </p>
            <p>
              <strong>Employee Number:</strong>{' '}
              {submittedOfficerData.employeeNumber}
            </p>
            <p>
              <strong>Ranking:</strong> {submittedOfficerData.ranking}
            </p>

            <Link to="/dashboard" className="dashboard-link">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <form id="PoliceOfficerDashboard" onSubmit={handleSubmit}>
            <label htmlFor="province">Province</label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select province
              </option>
              {Object.keys(correctionalServicesByProvince).map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>

            <label htmlFor="serviceName">Correctional Service Name</label>
            <select
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select correctional service
              </option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <label htmlFor="officerName">Officer's Full Name</label>
            <input
              type="text"
              id="officerName"
              name="officerName"
              value={formData.officerName}
              onChange={handleInputChange}
              placeholder="Enter officer's full name"
              required
            />

            <label htmlFor="employeeNumber">Employee Number</label>
            <input
              type="text"
              id="employeeNumber"
              name="employeeNumber"
              value={formData.employeeNumber}
              onChange={handleInputChange}
              placeholder="Enter employee number"
              required
              minLength="6"
              maxLength="10"
            />

            <label htmlFor="ranking">Ranking</label>
            <select
              id="ranking"
              name="ranking"
              value={formData.ranking}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select rank
              </option>
              <option value="National Commissioner">
                National Commissioner
              </option>
              <option value="Regional Commissioner">
                Regional Commissioner
              </option>
              <option value="Director">Director</option>
              <option value="Deputy Director">Deputy Director</option>
              <option value="Assistant Director">Assistant Director</option>
              <option value="Principal Correctional Officer">
                Principal Correctional Officer
              </option>
              <option value="Warrant Officer">Warrant Officer</option>
              <option value="Senior Correctional Officer">
                Senior Correctional Officer
              </option>
              <option value="Correctional Officer">Correctional Officer</option>
              <option value="Administrative Support">
                Administrative Support
              </option>
              <option value="Technical Support">Technical Support</option>
              <option value="Psychological Support">
                Psychological Support
              </option>
              <option value="Health and Medical Support">
                Health and Medical Support
              </option>
              <option value="Support Services Officer">
                Support Services Officer
              </option>
            </select>

            <button
              type="submit"
              disabled={isSubmitting}
              className={isSubmitting ? 'submitting' : ''}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PoliceOfficerDashboard;

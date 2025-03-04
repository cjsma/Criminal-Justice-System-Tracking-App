import React, { useEffect, useState } from 'react';
import './CorrectionalService.css';

const CorrectionalService = () => {
  const [services, setServices] = useState([]);

  const correctionalServices = {
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

  useEffect(() => {
    const provinceSelect = document.getElementById('province');
    provinceSelect.addEventListener('change', function () {
      const province = this.value;
      const serviceNameSelect = document.getElementById('serviceName');
      serviceNameSelect.innerHTML =
        '<option value="" disabled selected>Select correctional service</option>';
      if (correctionalServices[province]) {
        correctionalServices[province].forEach((service) => {
          const option = document.createElement('option');
          option.value = service;
          option.textContent = service;
          serviceNameSelect.appendChild(option);
        });
      }
    });

    const form = document.getElementById('correctionalServiceForm');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      alert('Form submitted!');
    });
  }, []);

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
        <form id="correctionalServiceForm">
          <label htmlFor="province">Province</label>
          <select id="province" name="province" required>
            <option value="" disabled selected>
              Select province
            </option>
            <option value="Gauteng">Gauteng</option>
            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            <option value="Western Cape">Western Cape</option>
            <option value="Eastern Cape">Eastern Cape</option>
            <option value="Free State">Free State</option>
            <option value="Limpopo">Limpopo</option>
            <option value="Mpumalanga">Mpumalanga</option>
            <option value="Northern Cape">Northern Cape</option>
            <option value="North West">North West</option>
          </select>

          <label htmlFor="serviceName">Correctional Service Name</label>
          <select id="serviceName" name="serviceName" required>
            <option value="" disabled selected>
              Select correctional service
            </option>
          </select>

          <label htmlFor="officerName">Officer's Full Name</label>
          <input
            type="text"
            id="officerName"
            name="officerName"
            placeholder="Enter officer's full name"
            required
          />

          <label htmlFor="employeeNumber">Employee Number</label>
          <input
            type="text"
            id="employeeNumber"
            name="employeeNumber"
            placeholder="Enter employee number"
            required
            minLength="6"
            maxLength="10"
          />

          <label htmlFor="ranking">Ranking</label>
          <select id="ranking" name="ranking" required>
            <option value="" disabled selected>
              Select rank
            </option>
            {/* Management and Risk */}
            <option value="National Commissioner">National Commissioner</option>
            <option value="Regional Commissioner">Regional Commissioner</option>
            <option value="Director">Director</option>
            <option value="Deputy Director">Deputy Director</option>
            <option value="Assistant Director">Assistant Director</option>
            {/* Operational */}
            <option value="Principal Correctional Officer">
              Principal Correctional Officer
            </option>
            <option value="Warrant Officer">Warrant Officer</option>
            <option value="Senior Correctional Officer">
              Senior Correctional Officer
            </option>
            <option value="Correctional Officer">Correctional Officer</option>
            {/* Support */}
            <option value="Administrative Support">
              Administrative Support
            </option>
            <option value="Technical Support">Technical Support</option>
            <option value="Psychological Support">Psychological Support</option>
            <option value="Health and Medical Support">
              Health and Medical Support
            </option>
            <option value="Support Services Officer">
              Support Services Officer
            </option>
          </select>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CorrectionalService;

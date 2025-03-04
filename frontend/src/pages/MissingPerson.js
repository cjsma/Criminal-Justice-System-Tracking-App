import React, { useState } from 'react';
import './MissingPerson.css';

const MissingPerson = () => {
  const [image, setImage] = useState(null);
  const [isPhotoOption, setIsPhotoOption] = useState(false); // Track if the user clicked "Upload a Photo"

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    // This will trigger the device camera
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();

        const capturePhoto = () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          setImage(dataUrl);
          stream.getTracks().forEach((track) => track.stop()); // Stop the camera stream
          video.pause();
        };

        video.onloadeddata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          capturePhoto();
        };
      })
      .catch((error) => console.error('Error accessing the camera: ', error));
  };

  const handleCancelPhotoOption = () => {
    setIsPhotoOption(false); // Reset the photo option
    setImage(null); // Remove the selected image
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Missing person report submitted successfully!');
    event.target.reset();
    setImage(null); // Clear the image after submission
  };

  return (
    <div>
      {/* Logo */}
      <div className="logo">
        <img
          src="https://i.postimg.cc/FH0rkXfF/IMG-20241205-WA0007.png"
          alt="App Logo"
        />
        <h2>Report a Missing Person</h2>
      </div>

      {/* Form Container */}
      <div className="container">
        {/* Image Upload Section */}
        <div className="image-upload">
          <div
            className="image-box"
            style={{ backgroundImage: image ? `url(${image})` : 'none' }}
          >
            {!image && 'Upload Image'}
          </div>

          {!isPhotoOption ? (
            <button className="btn" onClick={() => setIsPhotoOption(true)}>
              Upload Photo
            </button>
          ) : (
            <div>
              <button className="btn" onClick={handleTakePhoto}>
                Take a Photo
              </button>
              <input
                type="file"
                id="uploadBtn"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'block', marginTop: '10px' }}
              />
              <button
                className="btn"
                style={{ background: 'red' }}
                onClick={handleCancelPhotoOption}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>Full Name:</label>
            <input type="text" required />

            <label>Age:</label>
            <input type="number" required />

            <label>Gender:</label>
            <input type="text" required />

            <label>Eye Color:</label>
            <input type="text" required />

            <label>Hair Color:</label>
            <input type="text" required />

            <label>Height (e.g., 1.75m):</label>
            <input type="text" required />

            <label>Weight (kg):</label>
            <input type="text" required />

            <label>Last Seen Location:</label>
            <input type="text" required />

            <label>Date Missing:</label>
            <input type="date" required />

            <label>Description:</label>
            <textarea rows="4" required></textarea>

            <label>Contact Number:</label>
            <input type="text" required />

            <button type="submit" className="btn">
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MissingPerson;

// pages/AnonymousTip.js
import React, { useState, useRef } from 'react';
import { storage, db, functions, submitAnonymousTip } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { v4 as uuidv4 } from 'uuid';
import '../styles/AnonymousTip.css';
import tipImage from '../assets/tip-hero.png'; // Make sure to add this image to your assets

const AnonymousTip = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    dateTime: '',
    category: 'general',
    contactAllowed: false,
    contactMethod: ''
  });
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Security config
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(`File type not allowed: ${file.name}`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large (max 50MB): ${file.name}`);
        return false;
      }
      return true;
    });
    setFiles([...files, ...validFiles]);
    setError(null);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const scanFileForThreats = async (file) => {
    try {
      const scanFile = httpsCallable(functions, 'scanFileForThreats');
      const result = await scanFile({
        filename: file.name,
        fileType: file.type,
        buffer: await file.arrayBuffer()
      });
      return result.data.clean;
    } catch (error) {
      console.error('Scan error:', error);
      return false;
    }
  };

  const uploadFile = async (file) => {
    const fileId = uuidv4();
    const fileExt = file.name.split('.').pop();
    const storageRef = ref(storage, `anonymous_tips/${fileId}.${fileExt}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        },
        (error) => reject(error),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              url,
              scanned: true
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.description && files.length === 0) {
        throw new Error('Please provide either a description or file evidence');
      }

      // Scan files
      const scanResults = await Promise.all(files.map(file => scanFileForThreats(file)));
      if (scanResults.includes(false)) {
        throw new Error('One or more files were detected as malicious');
      }

      // Upload files
      const uploadedFiles = await Promise.all(files.map(file => uploadFile(file)));

      // Submit tip
      const tipId = await submitAnonymousTip({
        ...formData,
        files: uploadedFiles,
        metadata: {
          origin: window.location.origin,
          secureConnection: window.isSecureContext
        }
      });

      setSubmissionId(tipId);
      setFiles([]);
      setFormData({
        description: '',
        location: '',
        dateTime: '',
        category: 'general',
        contactAllowed: false,
        contactMethod: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="anonymous-tip-container">
      <header className="tip-header">
        <h1>Submit an Anonymous Tip</h1>
        <p className="subtitle">Help make your community safer while maintaining your privacy</p>
      </header>

      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2>Your Information Can Make a Difference</h2>
            <p>
              By submitting what you know, you might help prevent crimes or solve important cases.
              Our system ensures complete anonymity - we don't track your identity, location, or device information.
            </p>
            <ul className="hero-features">
              <li>100% Anonymous Submission</li>
              <li>Secure File Uploads</li>
              <li>No Tracking or Logging</li>
              <li>End-to-End Encryption</li>
            </ul>
          </div>
          <div className="hero-image">
            <img src={tipImage} alt="Anonymous tip submission illustration" />
          </div>
        </div>
      </div>
      
      {submissionId ? (
        <div className="submission-success">
          <div className="success-icon">✓</div>
          <h3>Thank You for Your Submission</h3>
          <p>Your reference ID: <strong>{submissionId}</strong></p>
          <p className="disclaimer">This is not a tracking number and cannot be used to identify you.</p>
          <p>If you provided contact information, investigators may reach out through your chosen method while maintaining your anonymity.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="tip-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-section">
            <h3>Tip Information</h3>
            
            <div className="form-group">
              <label>Tip Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                placeholder="Please provide as much detail as possible..."
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Location (if known)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Address, intersection, or landmark"
                />
              </div>
              
              <div className="form-group">
                <label>Date/Time of Incident</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="general">General Tip</option>
                <option value="suspicious_activity">Suspicious Activity</option>
                <option value="drug_activity">Drug Activity</option>
                <option value="theft">Theft/Burglary</option>
                <option value="vandalism">Vandalism</option>
                <option value="violent_crime">Violent Crime</option>
                <option value="cyber_crime">Cyber Crime</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Evidence Upload</h3>
            <div className="form-group file-upload">
              <div className="upload-area" onClick={() => fileInputRef.current.click()}>
                <div className="upload-icon">+</div>
                <p>Click to upload files or drag and drop</p>
                <small>Max 50MB per file. Allowed types: JPG, PNG, GIF, MP4, MOV, PDF, DOC/DOCX</small>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept={ALLOWED_FILE_TYPES.join(',')}
                style={{ display: 'none' }}
              />
              
              {files.length > 0 && (
                <div className="file-preview">
                  <h4>Files to upload:</h4>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{Math.round(file.size/1024)} KB</span>
                          {uploadProgress[file.name] ? (
                            <div className="progress-container">
                              <progress value={uploadProgress[file.name]} max="100" />
                              <span>{Math.round(uploadProgress[file.name])}%</span>
                            </div>
                          ) : (
                            <button 
                              type="button" 
                              className="remove-btn"
                              onClick={() => removeFile(index)}
                              disabled={isSubmitting}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Contact Preferences</h3>
            <div className="form-group contact-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="contactAllowed"
                  checked={formData.contactAllowed}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <span className="checkmark"></span>
                Allow investigators to contact me (still anonymous)
              </label>
              
              {formData.contactAllowed && (
                <div className="contact-method">
                  <label>Preferred Contact Method</label>
                  <select
                    name="contactMethod"
                    value={formData.contactMethod}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select...</option>
                    <option value="secure_message">Secure Message Portal</option>
                    <option value="burner_email">Temporary Email</option>
                    <option value="encrypted_chat">Encrypted Chat</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <div className="security-notice">
            <h4>Your Security & Privacy</h4>
            <div className="security-grid">
              <div className="security-item">
                <div className="security-icon">🔒</div>
                <p>All submissions are completely anonymous</p>
              </div>
              <div className="security-item">
                <div className="security-icon">🛡️</div>
                <p>Files are scanned for viruses before upload</p>
              </div>
              <div className="security-item">
                <div className="security-icon">🌐</div>
                <p>No IP addresses or device identifiers are stored</p>
              </div>
              <div className="security-item">
                <div className="security-icon">🔑</div>
                <p>All data is encrypted in transit and at rest</p>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : 'Submit Tip Anonymously'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AnonymousTip;
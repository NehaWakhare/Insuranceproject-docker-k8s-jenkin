import { useEffect, useState } from 'react';
import './ProfileInfo.css';
import {
  fetchUserProfileApi,
  saveUserProfileApi,
  updateUserProfileApi,
} from '../../../api/user/profileApi';

import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaBirthdayCake, FaTransgender,
  FaHome, FaBriefcase, FaTint, FaIdCard, FaHeart, FaAddressCard
} from 'react-icons/fa';

export default function ProfileInfo() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    correspondenceAddress: '',
    permanentAddress: '',
    maritalStatus: '',
    occupation: '',
    bloodGroup: '',
    emergencyContact: '',
    aadhaarNumber: '',
  });

  const [isEditing, setIsEditing] = useState(true);
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [sameAddress, setSameAddress] = useState(false);

  const genderOptions = ["Male", "Female", "Other"];
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const authData = JSON.parse(sessionStorage.getItem('authData') || '{}');
    if (!authData.userId || !authData.token) {
      alert('Session expired. Please login again.');
      return;
    }
    setUserId(authData.userId);
    fetchUserProfile(authData.userId, authData.token);
  }, []);

  const fetchUserProfile = async (userId, token) => {
    try {
      const data = await fetchUserProfileApi(userId, token);
      if (data) {
        setFormData(data);
        setIsEditing(false);
        sessionStorage.setItem('userProfileId', data.id);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      alert('Could not fetch profile. Please re-login.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };
  const handleSameAddressChange = () => {
  setSameAddress(!sameAddress);
  if (!sameAddress) {
    setFormData((prev) => ({
      ...prev,
      permanentAddress: prev.correspondenceAddress,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      permanentAddress: '',
    }));
  }
};


  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const aadhaarRegex = /^\d{12}$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid 10-digit phone';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Select gender';
    if (!formData.correspondenceAddress) newErrors.correspondenceAddress = 'Required';
    if (!formData.permanentAddress) newErrors.permanentAddress = 'Required';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Select marital status';
    if (!formData.occupation) newErrors.occupation = 'Required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Select blood group';
    if (!phoneRegex.test(formData.emergencyContact)) newErrors.emergencyContact = 'Invalid 10-digit number';
    if (!aadhaarRegex.test(formData.aadhaarNumber)) newErrors.aadhaarNumber = 'Invalid 12-digit Aadhaar';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const authData = JSON.parse(sessionStorage.getItem('authData') || '{}');
    if (!userId || !authData.token) {
      alert('Session expired. Please login again.');
      return;
    }

    try {
      if (formData.id) {
        await updateUserProfileApi(formData.id, formData, authData.token);
        alert('Profile updated successfully!');
        } else {
  const created = await saveUserProfileApi(userId, formData, authData.token);

  //  Save profileId in sessionStorage
  if (created?.id) {
    sessionStorage.setItem("userProfileId", created.id);
  }

  alert('Profile created successfully!');
}

      // } else {
      //   await saveUserProfileApi(userId, formData, authData.token);
      //   alert('Profile created successfully!');
      // }
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile.');
    }
  };

  const icons = {
    name: <FaUser />,
    email: <FaEnvelope />,
    password: <FaLock />,
    phone: <FaPhone />,
    dob: <FaBirthdayCake />,
    gender: <FaTransgender />,
    correspondenceAddress: <FaHome />,
    permanentAddress: <FaAddressCard />,
    maritalStatus: <FaHeart />,
    occupation: <FaBriefcase />,
    bloodGroup: <FaTint />,
    emergencyContact: <FaPhone />,
    aadhaarNumber: <FaIdCard />,
  };

  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  const getInputType = (key) => {
    if (key === 'dob') return 'date';
    if (key === 'email') return 'email';
    if (key === 'password') return 'password';
    if (key === 'phone' || key === 'emergencyContact' || key === 'aadhaarNumber')
      return 'tel';
    return 'text';
  };

  return (
  <div className="profile-container">
    <h2>{isEditing ? 'Complete/Edit Your Profile' : 'Your Profile'}</h2>
    {isEditing ? (
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {Object.entries(formData).map(([key, value]) => {
            if (key === 'id' || key === 'user') return null;

            if (key === 'correspondenceAddress') {
              return (
                <div key={key}>
                  <div className="form-group">
                    <label>{formatLabel(key)}</label>
                    <div className="input-with-icon">
                      <span className="icon">{icons[key]}</span>
                      <textarea
                        name={key}
                        value={value || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {errors[key] && <p className="error-text">{errors[key]}</p>}
                  </div>

                  {/* Checkbox */}
                  <div className="form-group checkbox-container">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      checked={sameAddress}
                      onChange={handleSameAddressChange}
                    />
                    <label htmlFor="sameAddress">Same as correspondence address</label>
                  </div>
                </div>
              );
            }

            // Permanent address field with disabled when checkbox is checked
            if (key === 'permanentAddress') {
              return (
                <div className="form-group" key={key}>
                  <label>{formatLabel(key)}</label>
                  <div className="input-with-icon">
                    <span className="icon">{icons[key]}</span>
                    <textarea
                      name={key}
                      value={value || ''}
                      onChange={handleChange}
                      disabled={sameAddress}
                      required
                    />
                  </div>
                  {errors[key] && <p className="error-text">{errors[key]}</p>}
                </div>
              );
            }

            
            return (
              <div className="form-group" key={key}>
                <label>{formatLabel(key)}</label>
                <div className="input-with-icon">
                  <span className="icon">{icons[key]}</span>
                  {key === 'gender' ? (
                    <select name={key} value={value || ''} onChange={handleChange} required>
                      <option value="">Select Gender</option>
                      {genderOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : key === 'maritalStatus' ? (
                    <select name={key} value={value || ''} onChange={handleChange} required>
                      <option value="">Select Marital Status</option>
                      {maritalStatusOptions.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  ) : key === 'bloodGroup' ? (
                    <select name={key} value={value || ''} onChange={handleChange} required>
                      <option value="">Select Blood Group</option>
                      {bloodGroupOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  ) : (key === 'phone' || key === 'emergencyContact') ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          padding: "10px",
                          background: "#eee",
                          borderRadius: "6px 0 0 6px",
                          border: "1px solid #ccc",
                        }}
                      >
                        +91
                      </span>
                      <input
                        type="tel"
                        name={key}
                        value={value || ""}
                        onChange={handleChange}
                        maxLength="10"
                        style={{
                          borderRadius: "0 6px 6px 0",
                          borderLeft: "none",
                          flex: 1,
                        }}
                        required
                      />
                    </div>
                  ) : (
                    <input
                      type={getInputType(key)}
                      name={key}
                      value={value || ''}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>
                {errors[key] && <p className="error-text">{errors[key]}</p>}
              </div>
            );
          })}
        </div>

        <button type="submit" className="submit-btn">
          Save Profile
        </button>
      </form>
    ) : (
      <div className="profile-view">
        <table>
          <tbody>
            {Object.entries(formData).map(([key, value]) =>
              key !== 'id' && key !== 'user' ? (
                <tr key={key}>
                  <td className="profile-label">{icons[key]} {formatLabel(key)}</td>
                  <td>{value}</td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
        <button onClick={() => setIsEditing(true)} className="submit-btn">
          Edit Profile
        </button>
      </div>
    )}
  </div>
);

    
}

import { useEffect, useState } from 'react';
import './ProfileInfo.css';
import {
  fetchUserProfileApi,
  saveUserProfileApi,
  updateUserProfileApi,
} from '../../../api/user/profileApi';

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

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    if (!userId || !authData.token) {
      alert('Session expired. Please login again.');
      return;
    }

    try {
      if (formData.id) {
        await updateUserProfileApi(formData.id, formData, authData.token);
        alert('Profile updated successfully!');
      } else {
        await saveUserProfileApi(userId, formData, authData.token);
        alert('Profile created successfully!');
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile.');
    }
  };

  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  const getInputType = (key) => {
    if (key === 'dob') return 'date';
    if (key === 'email') return 'email';
    if (key === 'password') return 'password';
    if (key === 'phone' || key === 'emergencyContact') return 'tel';
    return 'text';
  };

  return (
    <div className="profile-container">
      <h2>{isEditing ? 'Complete/Edit Your Profile' : 'Your Profile'}</h2>
      {isEditing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {Object.entries(formData).map(([key, value]) =>
              key !== 'id' && key !== 'user' ? (
                <div className="form-group" key={key}>
                  <label>{formatLabel(key)}</label>
                  <input
                    type={getInputType(key)}
                    name={key}
                    value={value || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              ) : null
            )}
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
                    <td className="profile-label">{formatLabel(key)}</td>
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

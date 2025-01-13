import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./profile.css";
import { API_BASE_URL } from "../../config";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phone2, setPhone2] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
          lang: 'en',
        };

        const response = await axios.get(`${API_BASE_URL}/api/v1/profile`, { headers });

        setUserData(response.data.data);
        setPhone2(response.data.data.phone2?.number || ""); 
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
        console.error('Error fetching user data:', error.response?.data?.error || error.message);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
        lang: 'en',
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/profile/update`,
        { phone2 },
        { headers }
      );

      alert("Phone number updated successfully!");
    } catch (error) {
      console.error('Error updating data:', error.response?.data?.error || error.message);
      alert("Failed to update phone number.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching user data: {error.message}</div>;
  }

  return (
    <div className="profile">
      <div className="profile-background"></div>
      <div className="profile-data">
        <div className="item-profile">
          <h5>الاسم</h5>
          <p>{userData.name}</p>
        </div>
        <div className="item-profile">
          <h5>البريد الالكتروني</h5>
          <p>{userData.email_verified_at}</p>
        </div>
        <div className="item-profile">
          <h5>رقم الهاتف</h5>
          <p>{userData.phone1?.number}</p>
        </div>
        <div className="item-profile">
          <input
            type="text"
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
            placeholder=" رقم هاتف آخر"
          />
        </div>
      </div>
      <button className="save-button" onClick={handleSave}>
        حفظ التعديلات
      </button>

      <div className="image-profile">
        <img src={userData.image} alt="User profile" />
      </div>
    </div>
  );
};

export default Profile;

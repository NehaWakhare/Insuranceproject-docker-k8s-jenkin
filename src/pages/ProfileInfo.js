import React, { useEffect,useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function ProfileInfo() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profile/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) return <p>Please login to view your profile.</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-info">
      <h2>Profile Information</h2>
      <p><b>Name:</b> {profile.name}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Phone:</b> {profile.phone}</p>
    </div>
  );
}

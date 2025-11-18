import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CONFIG from '../config/config';  // import config
import './ViewPolicies.css';

const API_BASE_URL = `${CONFIG.BASE_URL}/admin/policy-plans`;  // use const

export default function ViewPolicies() {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    axios.get(API_BASE_URL)  // use API_BASE_URL
      .then(response => {
        console.log('Policy response:', response.data);
        setPolicies(response.data);
      })
      .catch(error => console.error('Error fetching policies:', error));
  }, []);

  return (
    <div className="view-policies">
      <h2>All Policies</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Coverage</th>
            <th>Premium</th>
            <th>Duration (Years)</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy, index) => (
            <tr key={index}>
              <td>{policy.planName}</td>
              <td>{policy.coverageAmount}</td>
              <td>{policy.premium}</td>
              <td>{policy.durationInYears}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

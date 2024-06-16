// src/components/Dashboard/Dashboard.js
import React from 'react';
import { useAuth } from '../../hooks/userAuth';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;

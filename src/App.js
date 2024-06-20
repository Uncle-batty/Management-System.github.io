// src/App.js
import React, { useState } from 'react';
import './App.css';
import { useAuth } from './hooks/userAuth';
import NavBar from './Components/navbar/Navbar';
import { Login } from './Components/Login/Login';
import Recipe from './Components/Recipe/Recipe';
import Notes from './Components/NOTES/notes';
import { Dashboard }  from './Components/Dashboard/Dashboard';
import Budget from './Components/Budget/Budget';

function App() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('Dashboard');

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'Recipe':
        return <Recipe />;
      case 'Notes':
        return <Notes />;
      case 'Budget':
        return <Budget />;
      case 'Dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <NavBar setCurrentPage={setCurrentPage} />
      <div >
        {renderPage()}
      </div>
    </div>
  );
}

export default App;

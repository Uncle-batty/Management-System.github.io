// src/Components/NavBar/NavBar.js
import React from 'react';
import { supabase } from '../../Services/supabase';
import './NavBar.css';

const NavBar = ({ setCurrentPage }) => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <nav className="navbar">
            <button onClick={() => setCurrentPage('Dashboard')}>Dashboard</button>
            <button onClick={() => setCurrentPage('Recipe')}>Recipe</button>
            <button onClick={() => setCurrentPage('Notes')}>Notes</button>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default NavBar;

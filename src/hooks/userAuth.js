// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { supabase } from '../Services/supabase';

export const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Function to fetch the current user session
        const getUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error fetching session:', error.message);
                return;
            }
            setUser(session?.user ?? null);
        };

        // Immediately fetch user on component mount
        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Clean up function to unsubscribe
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return { user };
};

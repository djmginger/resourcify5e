import {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to check token validity
        const validateToken = async () => {
            try {
                const response = await axios.get('http://localhost:9000/login/validate-token', { withCredentials: true });
                if (response.data.valid) {
                    setIsUserLoggedIn(true);
                }
            } catch (error) {
                setIsUserLoggedIn(false);
            } finally {
                setLoading(false); // Set loading to false once the check is done
            }
        };

        validateToken();
    }, []);

    // Only render children once we know if the user is authenticated or not
    if (loading) return null;

    const value = {
        isUserLoggedIn,
        setIsUserLoggedIn
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
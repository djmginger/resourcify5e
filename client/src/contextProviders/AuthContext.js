import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

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
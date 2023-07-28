import { useAuth } from '../contextProviders/AuthContext';
import { Navigate } from "react-router-dom";

//Using this component, if a user tries to access a route wrapped within it, and they are not logged in, then they will be redirected to the login page
function Protected({ children }) {
    const { isUserLoggedIn } = useAuth();

    if (!isUserLoggedIn) {
        return <Navigate to="/login" replace />
    }
    return children;
}

export default Protected
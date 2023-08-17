import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Characters from "./pages/Characters";
import CharacterDisplay from "./pages/CharacterDisplay";
import Protected from "./components/Protected";
import WithTracker from "./components/WithTracker";
import Profile from "./pages/Profile";

const RouteSwitch = () => {
    const TrackedLogin = WithTracker(Login);
    const TrackedRegister = WithTracker(Register);
    const TrackedCharacters = WithTracker(Characters);
    const TrackedCharacterDisplay = WithTracker(CharacterDisplay);
    const TrackedProfile = WithTracker(Profile);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TrackedLogin />} />
                <Route path="/register" element={<TrackedRegister />} />
                <Route path="/login" element={<TrackedLogin />} />
                <Route path="/characters" element={
                    <Protected>
                        {<TrackedCharacters />}
                    </Protected>
                } />
                <Route path="/characters/:character" element={
                    <Protected>
                        {<TrackedCharacterDisplay />}
                    </Protected>
                } />
                <Route path="/profile" element={
                    <Protected>
                        {<TrackedProfile />}
                    </Protected>
                } />
            </Routes>
        </BrowserRouter>
    );
};

export default RouteSwitch;
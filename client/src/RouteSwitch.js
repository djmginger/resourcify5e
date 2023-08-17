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

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={WithTracker(Login)} />
                <Route path="/register" element={WithTracker(Register)} />
                <Route path="/login" element={WithTracker(Login)} />
                <Route path="/characters" element={
                    <Protected>
                        {WithTracker(Characters)}
                    </Protected>
                } />
                <Route path="/characters/:character" element={
                    <Protected>
                        {WithTracker(CharacterDisplay)}
                    </Protected>
                } />
                <Route path="/profile" element={
                    <Protected>
                        {WithTracker(Profile)}
                    </Protected>
                } />
            </Routes>
        </BrowserRouter>
    );
};

export default RouteSwitch;
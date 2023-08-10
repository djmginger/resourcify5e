import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Characters from "./pages/Characters";
import CharacterDisplay from "./pages/CharacterDisplay";
import Protected from "./components/Protected";
import Profile from "./pages/Profile";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/characters" element={
                    <Protected>
                        <Characters />
                    </Protected>
                } />
                <Route path="/characters/:character" element={
                    <Protected>
                        <CharacterDisplay />
                    </Protected>
                } />
                <Route path="/profile" element={
                    <Protected>
                        <Profile />
                    </Protected>
                } />
            </Routes>
        </BrowserRouter>
    );
};

export default RouteSwitch;
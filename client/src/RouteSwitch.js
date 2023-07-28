import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Characters from "./pages/Characters";
import CharacterDisplay from "./pages/CharacterDisplay";
import Protected from "./components/Protected";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
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
            </Routes>
        </BrowserRouter>
    );
};

export default RouteSwitch;
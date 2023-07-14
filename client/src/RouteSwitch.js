import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Characters from "./pages/Characters";
import CharacterDisplay from "./pages/CharacterDisplay";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/characters" element={<Characters />} />
                <Route path="/characters/:character" element={<CharacterDisplay />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RouteSwitch;
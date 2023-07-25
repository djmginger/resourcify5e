import React, {useEffect, useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import { Nav } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../logo.svg";
import "../css/SiteNavbar.css";
import axios from "axios";

function SiteNavbar({ email }) {
    const isUserLoggedIn = email || false;

    return (
        <div>
            {isUserLoggedIn ? (
                <UserNavbar email={email} />
            ) : (
                <NoUserNavbar />
            )}
        </div>
    );
}

function UserNavbar({ email }){
    const navigate = useNavigate();
    const [characterArray, setCharacterArray] = useState([]);

    const location = useLocation();
    console.log(location.pathname);

    const getCharacters = function(email) {
        axios.get('http://localhost:9000/characters', {
            params: { email: email }
        }).then((res) => {
            const userCharacters = res.data.map((character) => ({
                characterName: character.characterName,
            }));
            setCharacterArray(userCharacters);
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        getCharacters(email);
    }, []);

    const characterListNavigate = () => {
        navigate("/characters", { state: { email: email } })
    }

    const characterNavigate = (characterName) => {
        console.log("Clicked character name: " + characterName);
        navigate(`/characters/${characterName}`, {
            state:
                {
                    email: email,
                    characterName: characterName
                }
        });
    };

    return (
        <div>
            <Navbar className="fixed-top" style={{ backgroundColor: "#333333" }} >
                <Navbar.Brand style={{ color: "#F5F1E3", padding: 0 }} href="#home">
                    <img
                        alt="logo"
                        src={logo}
                        width="64"
                        height="64"
                        className="d-inline-block"
                    />
                    {" Resourceify 5e"}
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="ml-auto nav-options">
                        <Nav.Link style={{ color: "#F5F1E3" }} onClick={characterListNavigate}>Character List</Nav.Link>
                        {characterArray && characterArray.length > 0 && (
                            <NavDropdown
                                title="View Character"
                                id="basic-nav-dropdown"
                                className="custom-dropdown"
                                align="end"
                            >

                                {characterArray ? ( // If the characterArray isn't empty, then iterate and add all characters to the dropdown
                                    characterArray.map((character, index) => (
                                        <React.Fragment key={character.characterName}>

                                            {index > 0 && <NavDropdown.Divider />} {/* If there's more than one character, add a dividing line */}

                                            <NavDropdown.Item onClick={() => characterNavigate(character.characterName)}>
                                                {character.characterName}
                                            </NavDropdown.Item>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <NavDropdown.Item>
                                        You have no characters yet!
                                    </NavDropdown.Item>
                                )}
                            </NavDropdown>
                        )}
                        <NavDropdown
                            title={"Profile"}
                            id="basic-nav-dropdown"
                            className="custom-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item href="#csvUpload">
                                Settings
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#inputFormPrefilled">
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

function NoUserNavbar(){
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    const navigate = useNavigate();

    const loginNavigate = () => {
        navigate("/login");
    }

    const registerNavigate = () => {
        navigate("/register");
    }

    return (
        <div>
            <Navbar className="fixed-top" style={{ backgroundColor: "#333333" }} >
                <Navbar.Brand style={{ color: "#F5F1E3", padding: 0 }} href="#home">
                    <img
                        alt="logo"
                        src={logo}
                        width="64"
                        height="64"
                        className="d-inline-block"
                    />
                    {" Resourceify 5e"}
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="ml-auto nav-options">
                        <Nav.Link hidden={isLoginPage} style={{ color: "#F5F1E3" }} onClick={loginNavigate}>Login</Nav.Link>
                        <Nav.Link hidden={!isLoginPage} style={{ color: "#F5F1E3" }} onClick={registerNavigate} className="register-button">Register</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default SiteNavbar;
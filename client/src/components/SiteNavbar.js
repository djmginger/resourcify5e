import React, {useEffect, useRef, useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import { Nav } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png";
import "../css/SiteNavbar.css";
import axios from "axios";
import { useCharacters } from '../contextProviders/CharacterContext';
import { useAuth } from "../contextProviders/AuthContext";

function SiteNavbar() {

    const { isUserLoggedIn } = useAuth();
    const [expanded, setExpanded] = useState(false); // Add expanded state
    const navbarRef = useRef(null);

    // Check if the user clicked on a component outside the expanded navbar. If so, collapse the navbar
    const handleOutsideClick = (e) => {
        if (expanded && navbarRef.current && !navbarRef.current.contains(e.target)) {
            setExpanded(false);
        }
    };

    // Add the above function to the entire document, in order to check each click.
    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [expanded]);

    return (
        <div>
            {isUserLoggedIn ? (
                <UserNavbar navbarRef={navbarRef} expanded={expanded} setExpanded={setExpanded} />
            ) : (
                <NoUserNavbar />
            )}
        </div>
    );
}

function UserNavbar({ navbarRef, expanded, setExpanded }){
    const apiUrl = process.env.REACT_APP_API_URL;

    const { setIsUserLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { characterArray } = useCharacters();
    const location = useLocation();
    const isListPage = location.pathname === "/characters";

    const logOut = function () {
        axios.post(`${apiUrl}/login/logout`,
            {},
            {withCredentials: true}
        ).then(res => {
            setIsUserLoggedIn(false);
            navigate("/login", { replace: true });
        })
        .catch((error) => {
            console.log("Error logging out", error);
        });
    }

    const characterListNavigate = () => {
        navigate("/characters")
    }

    const profileNavigate = () => {
        navigate("/profile")
    }

    const characterNavigate = (characterName) => {
        setExpanded(false);
        navigate(`/characters/${characterName}`, {
            state: { characterName: characterName }
        });
    };

    return (
        <div ref={navbarRef}>
            <Navbar className="fixed-top site-nav" style={{ }} expand="md" variant="dark">
                <Navbar.Brand className="site-nav-brand">
                    <img
                        alt="logo"
                        src={logo}
                        width="64"
                        height="64"
                        className="d-inline-block"
                        style={{ marginRight: "10px" }}
                    />
                    {"Resourcify 5e"}
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    className="custom-navbar-toggle"
                    onClick={() => {
                        setExpanded(!expanded)
                    }} // Toggle the expanded state on click
                    bg="light" // Change the color of the hamburger menu (use "light" or "dark")
                />
                <Navbar.Collapse className="justify-content-end" style={{ marginTop: "10px"}} in={expanded}>
                    <Nav className="ml-auto nav-options">
                        <Nav.Link hidden={isListPage} onClick={characterListNavigate}>
                            Character List
                        </Nav.Link>
                        {characterArray && characterArray.length > 0 && (
                            <NavDropdown
                                title="Character"
                                id="basic-nav-dropdown"
                                className="custom-dropdown"
                                align="end"
                            >

                                {characterArray ? ( // If the characterArray isn't empty, then iterate and add all characters to the dropdown
                                    characterArray.map((character, index) => (
                                        <React.Fragment key={character.characterName}>

                                            {index > 0 && <NavDropdown.Divider className="custom-divider" />} {/* If there's more than one character, add a dividing line */}

                                            <NavDropdown.Item className="custom-dropdown-item" onClick={() => characterNavigate(character.characterName)}>
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
                            <NavDropdown.Item className="custom-dropdown-item" onClick={profileNavigate}>
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider className="custom-divider" />
                            <NavDropdown.Item className="custom-dropdown-item" onClick={logOut}>
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
    const isLoginPage = location.pathname === "/login" || location.pathname === "/";

    const navigate = useNavigate();

    const loginNavigate = () => {
        navigate("/login");
    }

    const registerNavigate = () => {
        navigate("/register");
    }

    return (
        <div>
            <Navbar className="fixed-top site-nav">
                <Navbar.Brand className="site-nav-brand">
                    <img
                        alt="logo"
                        src={logo}
                        width="64"
                        height="64"
                        className="d-inline-block"
                        style={{ marginRight: "10px"}}
                    />
                    {" Resourcify 5e"}
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="ml-auto nav-options">
                        <Nav.Link hidden={isLoginPage} onClick={loginNavigate}>Login</Nav.Link>
                        <Nav.Link hidden={!isLoginPage} onClick={registerNavigate} className="register-button">Register</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default SiteNavbar;
import axios from 'axios';
import {useEffect, useState} from "react";
import Alert from 'react-bootstrap/Alert';
import LoginForm from "../components/LoginForm"
import SiteNavbar from "../components/SiteNavbar";
import { useNavigate } from "react-router-dom";
import "../css/Register.css"
import {Col, Container, Row} from "react-bootstrap";
import { useAuth } from "../contextProviders/AuthContext";
import {useCharacters} from "../contextProviders/CharacterContext";
import Copyright from "../components/Copyright";

function Register() {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [registeredDuringSession, setRegisteredDuringSession] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { getCharacters } = useCharacters();
    const { isUserLoggedIn, setIsUserLoggedIn } = useAuth();

    //If the user is already logged in, redirect them to the character list page
    useEffect(() => {
        if (isUserLoggedIn) navigate("/characters");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "") {
            setErrorMessage('Please provide a valid email');
        } else if (!/(?=.*\d)(?=.*[A-Z]).{8,}/.test(pass)){
            setErrorMessage('Please make sure your password meets all requirements');
        } else if (!registeredDuringSession && !(pass === confirmPass)){
            setErrorMessage('Passwords do not match! Please try again!');
        } else {
            //If a user hasn't registered their email during this session, prompt them to register. Once registration is complete & successful, prompt them to re-enter credentials and treat it as a login attempt.
            if (!registeredDuringSession) {
                axios.post('http://localhost:9000/register',
                    {email: email, password: pass},
                    { withCredentials: true}
                ).then(function (res) {
                    setRegisteredDuringSession(true)
                    setErrorMessage("");
                    setEmail("");
                    setPass("");
                    setConfirmPass("");
                }).catch(function (error) {
                    if (error.response.status === 409){
                        setErrorMessage("Email is already registered!");
                    } else {
                        console.log(error);
                    }
                });
            } else {
                axios.post('http://localhost:9000/login',
                    {email: email, password: pass},
                    { withCredentials: true}
                ).then(function (res) {
                    //post successful, set global loggedIn context to true
                    setIsUserLoggedIn(true);
                    getCharacters();
                    navigate("/characters")
                }).catch(function (error) {
                    if (error.response.status === 404){
                        setErrorMessage("Email is incorrect or not registered")
                    } else if (error.response.status === 401){
                        setErrorMessage("Password is incorrect")
                    } else {
                        console.log(error);
                    }
                });
            }
        }
    }

    return (
        <div className="register-body">
            <SiteNavbar />
            <div className="register-content">
                <Container>
                    <Row className="justify-content-center">
                        <Col sm={8} md={6} lg={5}>
                            {registeredDuringSession && <Alert variant={"success"}>Registration successful! Please re-enter credentials and log in.</Alert> }
                            {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert> }
                        </Col>
                    </Row>
                </Container>
                <LoginForm
                    email={email}
                    setEmail={setEmail}
                    pass={pass}
                    setPass={setPass}
                    confirmPass={confirmPass}
                    setConfirmPass={setConfirmPass}
                    registered={registeredDuringSession}
                    onSubmit={handleSubmit}
                />
            </div>
            <Copyright/>
        </div>
    );
}

export default Register;
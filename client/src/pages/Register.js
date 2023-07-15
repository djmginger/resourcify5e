import axios from 'axios';
import {useState} from "react";
import Alert from 'react-bootstrap/Alert';
import LoginForm from "../components/loginForm"
import { useNavigate } from "react-router-dom";

function Register() {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [registeredDuringSession, setRegisteredDuringSession] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "") {
            setErrorMessage('Please provide a valid email');
        } else if (!/(?=.*\d)(?=.*[A-Z]).{8,}/.test(pass)){
            setErrorMessage('Please make sure your password meets all requirements');
        } else {

            //If a user hasn't registered their email during this session, prompt them to register. Once registration is complete & successful, prompt them to re-enter credentials and treat it as a login attempt.
            if (!registeredDuringSession) {
                axios.post('http://localhost:9000/register', {
                    email: email,
                    password: pass,
                }).then(function (res) {
                    setRegisteredDuringSession(true)
                    setErrorMessage("");
                    setEmail("");
                    setPass("");
                }).catch(function (error) {
                    if (error.response.status === 409){
                        setErrorMessage("Email is already registered!");
                    } else {
                        console.log(error);
                    }
                });
            } else {
                axios.post('http://localhost:9000/login', {
                    email: email,
                    password: pass,
                }).then(function (res) {
                    //post successful, go to characters page and pass user email for data-loading purposes
                    navigate("/characters", {state: {email: email}})
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
        <div>
            {registeredDuringSession && <Alert variant={"success"}>Registration successful! Please re-enter credentials and log in.</Alert> }
            {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert> }
        <LoginForm
            email={email}
            setEmail={setEmail}
            pass={pass}
            setPass={setPass}
            registered={registeredDuringSession}
            onSubmit={handleSubmit}
        />
        </div>
    );
}

export default Register;
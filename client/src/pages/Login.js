import axios from 'axios';
import {useState} from "react";
import Alert from 'react-bootstrap/Alert';
import LoginForm from "../components/LoginForm"
import SiteNavbar from "../components/SiteNavbar";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"

function Login() {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "") {
            setErrorMessage('Please provide a valid email');
        } else {
            axios.post('http://localhost:9000/login', {
                email: email,
                password: pass,
            }).then((res) => {
                //post successful, go to characters page and pass user email for data-loading purposes
                console.log('Redirecting to Characters page');
                navigate("/characters", { state: { email: email } })
            }).catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    if (error.response.status === 404) {
                        setErrorMessage("Email is incorrect or not registered");
                    } else if (error.response.status === 401) {
                        setErrorMessage("Password is incorrect");
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
        }
    }

    return (
        <div className="login-body">
            <SiteNavbar />
            <div className="login-content">
                {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert> }
                <LoginForm

                    setEmail={setEmail}
                    pass={pass}
                    setPass={setPass}
                    registered={true}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}

export default Login;
import axios from 'axios';
import {useState} from "react";
import Alert from 'react-bootstrap/Alert';
import Login from "../components/login"
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "") {
            // Display error message to the user for empty fields
            setErrorMessage('Please provide a valid email');
        } else if (!/(?=.*\d)(?=.*[A-Z]).{8,}/.test(pass)){
            setErrorMessage('Please make sure your password meets all requirements');
        } else {
            axios.post('http://localhost:9000/login', {
                email: email,
                password: pass,
            }).then((res) => {
                if (res.status === 404){
                    setErrorMessage("Email is incorrect or not registered")
                } else if (res.status === 401){
                    setErrorMessage("Password is incorrect")
                } else {
                    navigate("/characters")
                    //post successful, go to characters.js
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    return (
        <div>
            {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert> }
            <Login
                email={email}
                setEmail={setEmail}
                pass={pass}
                setPass={setPass}
                registered={true}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default Login;
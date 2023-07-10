import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {useState} from "react";

function Register() {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [registered, setRegistered] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!registered) {
            axios.post('http://localhost:9000/register', {
                email: email,
                password: pass,
            }).then(function() {
                setRegistered(true)
                setEmail("");
                setPass("");
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            axios.post('/login', {
                email: email,
                password: pass,
            }).then((res) => {
                setRegistered(true)
            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email"
                              placeholder="Enter email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)} />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password"
                              placeholder="Password"
                              value={pass}
                              onChange={(e) => setPass(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default Register;
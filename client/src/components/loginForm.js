import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./loginForm.css";

function LoginForm({email, setEmail, pass, setPass, registered, onSubmit}) {
    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)} />

                {!registered && (
                    <Form.Text className="text-secondary">
                        <p className="password-requirements-title">Your password must include the following:</p>
                        <ul>
                            <li>At least one uppercase character</li>
                            <li>At least one number</li>
                            <li>At least 8 characters long</li>
                        </ul>
                    </Form.Text>
                )}
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default LoginForm;
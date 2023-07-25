import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/LoginForm.css";
import {Col, Container, Row} from "react-bootstrap";

function LoginForm({email, setEmail, pass, setPass, registered, onSubmit}) {
    return (
        <Form onSubmit={onSubmit}>
            <Container fluid>
                <Row className="justify-content-center">
                    <Col sm={8} md={6} lg={5}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="login-label">Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col sm={8} md={6} lg={5}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="login-label">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                className="login-input" />

                            {!registered && (
                                <Form.Text className="password-details">
                                    <p className="password-requirements-title">Your password must include the following:</p>
                                    <ul>
                                        <li>At least one uppercase character</li>
                                        <li>At least one number</li>
                                        <li>At least 8 characters long</li>
                                    </ul>
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col sm={8} md={6} lg={5} className="login-button">
                        <Button variant="primary" type="submit">
                            {!registered ? (
                                <>Register</>
                            ) : (
                                <>Login</>
                            )}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Form>
    );
}

export default LoginForm;
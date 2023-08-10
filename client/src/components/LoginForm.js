import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/LoginForm.css";
import {Col, Container, Row} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";

function LoginForm({email, setEmail, pass, setPass, confirmPass = "", setConfirmPass = () => {}, registered, onSubmit}) {
    const navigate = useNavigate();
    const registerNavigate = () => navigate("/register");

    const location = useLocation();
    const isLoginPage = location.pathname === "/login" || location.pathname === "/";

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
                        </Form.Group>
                    </Col>
                </Row>

                {!registered && (
                    <Row className="justify-content-center">
                        <Col sm={8} md={6} lg={5}>
                            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                                <Form.Label className="login-label">Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    className="login-input" />

                                <Form.Text className="password-details">
                                    <p className="password-requirements-title">Your password must include the following:</p>
                                    <ul>
                                        <li>At least one uppercase character</li>
                                        <li>At least one number</li>
                                        <li>At least 8 characters long</li>
                                    </ul>
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                )}
                <Row className="justify-content-center">
                    {isLoginPage && (
                        <Col className="sign-up-text" xs={6} sm={5} md={4} lg={3}><p>Don't have an account? <a onClick={registerNavigate} className="sign-up-link" >Sign up!</a></p></Col>
                        )}

                    <Col className="login-button" {...(isLoginPage ? {xs:6, sm:3, md:2, lg:2} : {sm:8, md:6, lg:5})}>
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
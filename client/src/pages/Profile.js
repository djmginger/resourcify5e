import SiteNavbar from "../components/SiteNavbar";
import {Col, Container, Modal, Row} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import Form from "react-bootstrap/Form";
import Group from "react-bootstrap/FormGroup";
import axios from "axios";
import {useAuth} from "../contextProviders/AuthContext";
import {useNavigate} from "react-router-dom";
import "../css/Profile.css"
import {DeleteConfirmation} from "../components/DeleteConfirmation";

function Profile() {
    const { setIsUserLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [showPassChange, setShowPassChange] = useState(false);
    const [showDelConfirm, setShowDelConfirm] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const resetForm = () => {
        setCurrentPass("");
        setNewPass("");
        setConfirmNewPass("");
        setErrorMessage("");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!/(?=.*\d)(?=.*[A-Z]).{8,}/.test(newPass)) {
            setErrorMessage('Please make sure your new password meets all requirements');
        } else if (!(newPass === confirmNewPass)) {
            setErrorMessage('New passwords do not match! Please try again!');
        } else {
            axios.put('http://localhost:9000/profile/updatePass',
                {oldPassword: currentPass, newPassword: newPass},
                {withCredentials: true}
            ).then(function (res) {
                resetForm();
                setShowPassChange(false);
                setSuccessMessage("Your password was successfully changed!")
            }).catch(function (error) {
                if (error.response.status === 401) {
                    setErrorMessage("Current password is incorrect");
                } else {
                    console.log(error);
                }
            });
        }
    }

    const handleDelete = () => {
        axios.delete('http://localhost:9000/profile',
            {withCredentials: true}
        ).then(function (res) {
            resetForm();
            setIsUserLoggedIn(false);
            navigate("/login", { replace: true });
        }).catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div className="profile-body">
            <SiteNavbar />
            <div className="profile-content">
                <Container>
                    <Row className="justify-content-center align-items-center"><h2 className="text-center profile-title">Profile</h2></Row>

                    <Row className="justify-content-center align-items-center text-center" >
                        <Col xs={8} md={6} lg={5}>
                            {successMessage && <Alert variant={"success"}>{successMessage}</Alert> }
                        </Col>
                    </Row>

                    <Row className="justify-content-center align-items-center profile-button-row">
                        <Col xs={6} md={4} lg={3}>
                            <Button className="profile-button" onClick={() => {
                                setSuccessMessage("");
                                setShowPassChange(true);
                            }}>
                                Change Password
                            </Button>
                        </Col>
                    </Row>

                    <Row className="justify-content-center align-items-center profile-button-row">
                        <Col xs={6} md={4} lg={3}>
                            <Button className="profile-button" onClick={() => {
                                setSuccessMessage("");
                                setShowDelConfirm(true);
                            }}>
                                Delete Account
                            </Button>
                        </Col>
                    </Row>
                </Container>

                <PassChangeModal
                    show={showPassChange}
                    onHide={() => {
                        setShowPassChange(false);
                        resetForm();
                    }}
                    currentPass={currentPass}
                    setCurrentPass={setCurrentPass}
                    newPass={newPass}
                    setNewPass={setNewPass}
                    confirmNewPass={confirmNewPass}
                    setConfirmNewPass={setConfirmNewPass}
                    onSubmit={handleSubmit}
                    errorMessage={errorMessage}
                />

                <DeleteConfirmation
                    show={showDelConfirm}
                    onHide={() => {setShowDelConfirm(false)}}
                    handleDelete={handleDelete}
                    isProfileDelete={true}
                />
            </div>
        </div>
    );
}

function PassChangeModal({ show, onHide, currentPass, setCurrentPass, newPass, setNewPass, confirmNewPass, setConfirmNewPass, onSubmit, errorMessage }) {

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="change-modal" closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Change Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="change-modal">
                {errorMessage && <Alert variant={"danger"} className="profile-alert">{errorMessage}</Alert>}
                <Group >
                    <Form.Label className="form-label">Current Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Current Password"
                    />

                    <Form.Label className="form-label change-label">New Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="New Password"
                    />
                    <Form.Label className="form-label change-label">Confirm New Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmNewPass}
                        onChange={(e) => setConfirmNewPass(e.target.value)}
                        placeholder="Confirm New Password"
                    />

                    <Form.Text className="password-details">
                        <p className="password-requirements-title">Your password must include the following:</p>
                        <ul>
                            <li>At least one uppercase character</li>
                            <li>At least one number</li>
                            <li>At least 8 characters long</li>
                        </ul>
                    </Form.Text>

                </Group>
            </Modal.Body>
            <Modal.Footer className="change-modal">
                <Button type="submit" onClick={onSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Profile;
import {Col, Modal} from "react-bootstrap";
import Group from "react-bootstrap/FormGroup";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../css/AddResourceModal.css";

function AddResourceModal(props) {
    const {
        show,
        onHide,
        handleAddResource,
        newResourceName,
        setNewResourceName,
        newResourceMax,
        setNewResourceMax,
        newResourceResetLong,
        setNewResourceResetLong,
        newResourceResetShort,
        setNewResourceResetShort,
        nameErrorMessage,
        resourceMaxErrorMessage
    } = props;

    return (
        <Modal
            show={show}
            onHide={onHide}

            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="resource-modal" closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add new resource
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="resource-modal">
                <Group>
                    <Form.Label className="form-label">Resource Name:</Form.Label>
                    <Form.Control
                        type="text"
                        value={newResourceName}
                        onChange={(e) => setNewResourceName(e.target.value)}
                        placeholder="Resource Name"
                    />

                    {nameErrorMessage &&
                        <Alert variant={"danger"} className="add-alert">Length of resource name must be between 1 and 50, and must include no
                            special characters</Alert>}

                            <Form.Label className="form-label max-uses-label">Maximum Number of Uses:</Form.Label>
                            <Form.Control
                                style={{width: "5rem"}}
                                inputMode={"numeric"}
                                type="number"
                                value={newResourceMax}
                                onChange={(e) => {
                                    // Allow empty input for user to clear the field
                                    if (e.target.value === "") {
                                        setNewResourceMax("");
                                        return;
                                    }
                                    // Ensure input is 1 or 2 digits and non-negative
                                    if (e.target.value.length <= 2 && e.target.value >= 0) {
                                        const value = parseInt(e.target.value);
                                        setNewResourceMax(value);
                                    }
                                }}
                            />

                    {resourceMaxErrorMessage && <Alert variant={"danger"} className="add-alert">Number must be between 1-99 and be made up of only digits</Alert>}

                    <Row className="rest-check-row">
                        <Group as={Col}>
                            <Form.Check
                                type="checkbox"
                                label="Reset on Long Rest"
                                checked={newResourceResetLong}
                                onChange={() => setNewResourceResetLong(prevState => !prevState)}
                                className="check reset-check"
                            />
                        </Group>

                        <Group as={Col}>
                            <Form.Check
                                type="checkbox"
                                label="Reset on Short Rest"
                                checked={newResourceResetShort}
                                onChange={() => setNewResourceResetShort(prevState => !prevState)}
                                className="check reset-check"
                            />
                        </Group>
                    </Row>
                </Group>

            </Modal.Body>
            <Modal.Footer className="character-modal">
                <Button type="submit" onClick={handleAddResource}>
                    Add Resource
                </Button>
            </Modal.Footer>
        </Modal>
    );

}

export default AddResourceModal;
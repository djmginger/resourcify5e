import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";

export function DeleteConfirmation({show, onHide, handleDelete, itemToDelete = "", confirmationType}) {
    const isProfileDelete = confirmationType === "profile";
    const isResourceDelete = confirmationType === "resource";

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h6>
                    {isProfileDelete ? "Are you sure you want to delete your account?"
                        : isResourceDelete ? "Are you sure you want to delete this resource?"
                            : "Are you sure you want to delete this character?"}
                </h6>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button variant="danger"
                        className="btn-sm mr-2"
                        onClick={isProfileDelete ? () => handleDelete()
                            : () => handleDelete(itemToDelete)
                        }
                >
                    {isProfileDelete ? "Yes, delete account"
                        : isResourceDelete ? "Yes, delete resource"
                            : "Yes, delete character"}
                </Button>
                <Button variant="secondary" className="btn-sm" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
}
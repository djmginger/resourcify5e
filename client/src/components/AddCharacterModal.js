import {Col, Dropdown, Modal} from "react-bootstrap";
import Group from "react-bootstrap/FormGroup";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../css/AddCharacterModal.css";

function AddCharacterModal(props) {
    const {
        show,
        onHide,
        isUpdateMode,
        classArray,
        characterName,
        setCharacterName,
        useSpellpoints,
        setUseSpellpoints,
        showMaximums,
        setShowMaximums,
        handleAddCharacter,
        classSelection,
        handleClassChange,
        classLevel,
        setClassLevel,
        nameErrorMessage,
        showDupeCharacterMessage,
        levelErrorMessage,
        subclass,
        availableSubclasses,
        minLevelForSubclass,
        handleSubclassChange,
        classErrorMessage,
        subclassErrorMessage,
        statsErrorMessage,
        str,
        dex,
        con,
        int,
        wis,
        cha,
        setStr,
        setDex,
        setCon,
        setInt,
        setWis,
        setCha
    } = props;

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="character-modal" closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {isUpdateMode ? 'Update Character' : 'Add New Character'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="character-modal">
                <Group >
                    <Form.Label className="form-label">Name:</Form.Label>
                    <Form.Control
                        type="text"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        placeholder="Character Name"
                    />

                    {showDupeCharacterMessage &&
                        <Alert variant={"danger"} className="add-alert">There is already a character with this name! Please use a different
                            name for your character.</Alert>}
                    {nameErrorMessage &&
                        <Alert variant={"danger"} className="add-alert">Length of character name must be between 1 and 50, and must include no
                            special characters</Alert>}

                    {/* Class and subclass dropdowns sit next to each other, with subclass hidden until a class reaches a level that has access to them */}
                    <Row className="class-container">
                        <Group as={Col} className="class-dropdown">
                            <Form.Label className="form-label">Class:</Form.Label>
                            <Dropdown onSelect={handleClassChange}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {classSelection || 'Select'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {classArray.map((classValue, index) => {
                                        return (
                                            <Dropdown.Item eventKey={classValue} key={`class-${index}`}>
                                                {classValue}
                                            </Dropdown.Item>
                                        );
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Group>

                        <Group as={Col}>
                            <Form.Label className="form-label">Class level:</Form.Label>
                            <Form.Control
                                style={{width: "5rem"}}
                                inputMode={"numeric"}
                                type="number"
                                value={classLevel}
                                onChange={(e) => {
                                    // Allow empty input for user to clear the field
                                    if (e.target.value === "") {
                                        setClassLevel("");
                                        return;
                                    }
                                    // Ensure input is 1 or 2 digits and non-negative
                                    if (e.target.value.length <= 2 && e.target.value >= 0) {
                                        const value = parseInt(e.target.value);
                                        setClassLevel(value);
                                    }
                                }}
                            />
                        </Group>
                    </Row>

                    {classErrorMessage && <Alert variant={"danger"} className="add-alert">Please select a class</Alert>}
                    {levelErrorMessage && <Alert variant={"danger"} className="add-alert">Class level must be between 1-20 and be made up of only digits</Alert>}

                    {classSelection && minLevelForSubclass <= classLevel && (
                        <div className="subclass-container">
                            <Form.Label className="form-label">Subclass:</Form.Label>
                            <Dropdown onSelect={handleSubclassChange}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {subclass || 'Select'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {availableSubclasses.map((subclassValue, index) => {
                                        return (
                                            <Dropdown.Item eventKey={subclassValue} key={`class-${index}`}>
                                                {subclassValue}
                                            </Dropdown.Item>
                                        );
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    )}

                    {subclassErrorMessage && <Alert variant={"danger"} className="add-alert">Please select a subclass</Alert>}

                    {/* Two rows of 3 number inputs for stat collection */}
                    <Row className="stat-input-row-first">
                        <Group as={Col}>
                            <Form.Label className="form-label">STR</Form.Label>
                            <Form.Control
                                type="number"
                                // You'll need to handle the state for each stat value
                                value={str}
                                onChange={(e) => {
                                    // Allow empty input for user to clear the field
                                    if (e.target.value === "") {
                                        setStr("");
                                        return;
                                    }
                                    // Ensure input is 1 or 2 digits and non-negative
                                    if (e.target.value.length <= 2 && e.target.value >= 0) {
                                        const value = parseInt(e.target.value);
                                        setStr(value);
                                    }
                                }}
                            />
                        </Group>

                        <Group as={Col}>
                            <Form.Label className="form-label">DEX</Form.Label>
                            <Form.Control
                                type="number"
                                value={dex}
                                onChange={(e) => {
                                    // Allow empty input for user to clear the field
                                    if (e.target.value === "") {
                                        setDex("");
                                        return;
                                    }
                                    // Ensure input is 1 or 2 digits and non-negative
                                    if (e.target.value.length <= 2 && e.target.value >= 0) {
                                        const value = parseInt(e.target.value);
                                        setDex(value);
                                    }
                                }}
                            />
                        </Group>

                        <Group as={Col}>
                            <Form.Label className="form-label">CON</Form.Label>
                            <Form.Control
                                type="number"
                                value={con}
                                onChange={(e) => {
                                    // Allow empty input for user to clear the field
                                    if (e.target.value === "") {
                                        setCon("");
                                        return;
                                    }
                                    // Ensure input is 1 or 2 digits and non-negative
                                    if (e.target.value.length <= 2 && e.target.value >= 0) {
                                        const value = parseInt(e.target.value);
                                        setCon(value);
                                    }
                                }}
                            />
                        </Group>
                    </Row>

                    <Row className="stat-input-row-second">
                        <Group as={Col}>
                            <Form.Label className="form-label">INT</Form.Label>
                            <Form.Control
                                type="number"
                                value={int}
                                onChange={(e) => {
                                    // Allow empty input for user to clear the field
                                    if (e.target.value === "") {
                                        setInt("");
                                        return;
                                    }
                                    // Ensure input is 1 or 2 digits and non-negative
                                    if (e.target.value.length <= 2 && e.target.value >= 0) {
                                        const value = parseInt(e.target.value);
                                        setInt(value);
                                    }
                                }}
                            />
                        </Group>

                        <Group as={Col}>
                            <Form.Label className="form-label">WIS</Form.Label>
                            <Form.Control
                                type="number"
                                value={wis}
                                onChange={(e) => {
                                    // Allow empty input for user to clear the field
                                    if (e.target.value === "") {
                                        setWis("");
                                        return;
                                    }
                                    // Ensure input is 1 or 2 digits and non-negative
                                    if (e.target.value.length <= 2 && e.target.value >= 0) {
                                        const value = parseInt(e.target.value);
                                        setWis(value);
                                    }
                                }}
                            />
                        </Group>

                        <Group as={Col}>
                            <Form.Label className="form-label">CHA</Form.Label>
                            <Form.Control
                                type="number"
                                value={cha}
                                onChange={(e) => {
                                    // Allow empty input for user to clear the field
                                    if (e.target.value === "") {
                                        setCha("");
                                        return;
                                    }
                                    // Ensure input is 1 or 2 digits and non-negative
                                    if (e.target.value.length <= 2 && e.target.value >= 0) {
                                        const value = parseInt(e.target.value);
                                        setCha(value);
                                    }
                                }}
                            />
                        </Group>
                    </Row>

                    {statsErrorMessage &&
                        <Alert variant={"danger"} className="add-alert">All stats must be greater than 0</Alert>}

                    <Row>
                        <Form.Check
                            type="switch"
                            label="Use Variant Spell Point Rules"
                            checked={useSpellpoints}
                            onChange={() => setUseSpellpoints(prevState => !prevState)}
                            className="switch variant-spellpoint"
                        />
                        <p className="disclaimer">Changing this setting will reset all spell resources to their max values. </p>
                        <p className="disclaimer">It is recommended you do this only after a long rest. </p>
                    </Row>

                    <Row>
                        <Form.Check
                            type="switch"
                            label="Show Maximum Values for Resources"
                            checked={showMaximums}
                            onChange={() => setShowMaximums(prevState => !prevState)}
                            className="switch max-values"
                        />
                    </Row>
                </Group>

            </Modal.Body>
            <Modal.Footer className="character-modal">
                <Button type="submit" onClick={handleAddCharacter}>
                    {isUpdateMode ? 'Update' : 'Add Character'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddCharacterModal;
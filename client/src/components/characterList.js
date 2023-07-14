import Button from "react-bootstrap/Button";
import {Dropdown, ListGroup, Modal, Col} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Group from "react-bootstrap/FormGroup";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import Alert from "react-bootstrap/Alert";
import axios from "axios";

function CharacterList({email, characters, addCharacter}) {

    const [characterArray, setCharacterArray] = useState([]);
    const [showNewCharacter, setShowNewCharacter] = useState(false);
    const [showMaxCharacterMessage, setShowMaxCharacterMessage] = useState(false);
    const [characterName, setCharacterName] = useState("");
    const [classSelection, setClassSelection] = useState();
    const [classLevel, setClassLevel] = useState(1);
    const [availableSubclasses, setAvailableSubclasses] = useState([]);
    const [subclass, setSubclass] = useState();
    const [minLevelForSubclass, setMinLevelForSubclass] = useState(1);
    const [str, setStr] = useState(10);
    const [dex, setDex] = useState(10);
    const [con, setCon] = useState(10);
    const [int, setInt] = useState(10);
    const [wis, setWis] = useState(10);
    const [cha, setCha] = useState(10);
    const [nameErrorMessage, setNameErrorMessage] = useState(false);
    const [levelErrorMessage, setLevelErrorMessage] = useState(false);
    const [classErrorMessage, setClassErrorMessage] = useState(false);
    const [subclassErrorMessage, setSubclassErrorMessage] = useState(false);
    const [showDupeCharacterMessage, setShowDupeCharacterMessage] = useState(false);

    const navigate = useNavigate();
    const classArray = ['Artificer', 'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

    //Subclass array value definitions
    const artificerSubclasses = ["Alchemist", "Armorer", "Artillerist", "Battle Smith"];
    const barbarianSubclasses = ["Ancestral Guardian", "Battlerager", "Beast", "Berserker", "Storm Herald", "Totem Warrior", "Wild Magic", "Zealot"];
    const bardSubclasses = ["Creation", "Eloquence", "Glamour", "Lore", "Spirits", "Swords", "Valor", "Whispers"];
    const clericSubclasses = ["Arcana", "Death", "Forge", "Grave", "Knowledge", "Life", "Light", "Nature", "Order", "Peace", "Tempest", "Trickery", "Twilight", "War"];
    const druidSubclasses = ["Dreams", "Land", "Moon", "Shepherd", "Spores", "Stars", "Wildfire"];
    const fighterSubclasses = ["Arcane Archer", "Banneret", "Battle Master", "Cavalier", "Champion", "Echo Knight", "Eldritch Knight", "Psi Warrior", "Rune Knight", "Samurai"]
    const monkSubclasses = ["Astral Self", "Ascendant Dragon", "Drunken Master", "Four Elements", "Kensei", "Long Death", "Mercy", "Open Hand", "Shadow", "Sun Soul"]
    const paladinSubclasses = ["Ancients", "Conquest", "Crown", "Devotion", "Glory", "Redemption", "Vengeance", "Watchers", "Oathbreaker"]
    const rangerSubclasses = ["Beast Master", "Fey Wanderer", "Gloom Stalker", "Horizon Walker", "Hunter", "Monster Slayer", "Swarmkeeper", "Drakewarden"]
    const rogueSubclasses = ["Arcane Trickster", "Assassin", "Inquisitive", "Mastermind", "Phantom", "Scout", "Soulknife", "Swashbuckler", "Thief"]
    const sorcererSubclasses = ["Aberrant Mind", "Clockwork Soul", "Draconic Bloodline", "Divine Soul", "Lunar", "Shadow Magic", "Storm", "Wild Magic"]
    const warlockSubclasses = ["Archfey", "Celestial", "Fathomless", "Fiend", "Genie", "Great Old One", "Hexblade", "Undead", "Undying"]
    const wizardSubclasses = ["Abjuration", "Bladesinging", "Chronurgy", "Conjuration", "Divination", "Enchantment", "Evocation", "Graviturgy", "Illusion", "Necromancy", "Order of Scribes", "Transmutation", "War Magic"]
    const subclassArray = [artificerSubclasses, barbarianSubclasses, bardSubclasses,
        clericSubclasses, druidSubclasses, fighterSubclasses, monkSubclasses, paladinSubclasses,
        rangerSubclasses, rogueSubclasses, sorcererSubclasses, warlockSubclasses, wizardSubclasses];

    useEffect(() => {
        if (classLevel < minLevelForSubclass) {
            setSubclass(undefined); // Resets the subclass
        }
    }, [classLevel, minLevelForSubclass]);

    useEffect(() => {
        // New useEffect to initialize characterArray based on characters prop
        setCharacterArray(characters);
    }, [characters]);

    const characterSelection = (email, characterName) => {
        navigate(`/characters/${characterName}`, {
            state:
                {
                    email: email,
                    characterName: characterName
                }
        });
    };

    //Check if user has less than 5 characters. If so, allow addition, otherwise alert
    function checkTotalCharacters() {
        if (characterArray.length < 5) setShowNewCharacter(true);
        else setShowMaxCharacterMessage(true);
    }

    const handleClassChange = (option) => {
        setClassSelection(option);

        // Get the index of the selected class in the class array
        const classIndex = classArray.indexOf(option);

        // Get the corresponding subclasses array based on the class index
        const selectedSubclasses = subclassArray[classIndex] || [];

        // Clear any current subclass selection and update the available subclasses
        setSubclass(undefined);
        setAvailableSubclasses(selectedSubclasses);

        // Set the minimum level for subclass based on the class selection
        if (option === "Cleric" || option === "Sorcerer" || option === "Warlock") {
            setMinLevelForSubclass(1);
            console.log("Cleric or Sorc or Warlock chosen")
        } else if (option === "Druid" || option === "Wizard") {
            setMinLevelForSubclass(2);
            console.log("Druid or Wizard chosen")
        } else {
            setMinLevelForSubclass(3);
            console.log("Other class chosen")
        }
    };

    const handleSubclassChange = (option) => {
        setSubclass(option);
    };

    //Called when a user closes the Add Character form before submitting
    const resetForm = () => {
        setCharacterName("");
        setClassSelection(undefined);
        setClassLevel(1);
        setSubclass(undefined);
        setAvailableSubclasses([]);
        setStr(10);
        setDex(10);
        setCon(10);
        setInt(10);
        setWis(10);
        setCha(10);
        setNameErrorMessage(false);
        setLevelErrorMessage(false);
        setClassErrorMessage(false);
        setSubclassErrorMessage(false);
    }

    const handleAddCharacter = () => {
        setNameErrorMessage(false);
        setLevelErrorMessage(false);
        setClassErrorMessage(false);
        setSubclassErrorMessage(false);

        const stats = {str, dex, con, int, wis, cha}

        if (characterName === "" || !/^[\w\s]{1,50}$/.test(characterName) || characterName === undefined){
            // Check that the length of the name is 50 or less, and has no special characters
            setNameErrorMessage(true);
        } else if (!/^(1\d|20|\d)$/.test(classLevel.toString())){
            // Check that the class level is a value between 1 and 20 (inclusive)
            setLevelErrorMessage(true);
        } else if (classSelection === undefined){
            // Check that a class has been selected
            setClassErrorMessage(true);
        } else if (classSelection && minLevelForSubclass <= classLevel && subclass === undefined){
            // Check that a subclass has been selected (only if the character has access to them)
            setSubclassErrorMessage(true);
        } else{
            //api call to add character to use
            axios.post('http://localhost:9000/characters', {
                email: email,
                character: {
                    name: characterName,
                    className: classSelection,
                    classLevel: classLevel,
                    subclass: subclass,
                    stats: stats
                }
            }).then((res) => {
                addCharacter();
                setShowNewCharacter(false);
            }).catch(function (error) {
                if (error.status === 409) {
                    setShowDupeCharacterMessage(true);
                } else {
                    console.log('Error', error.message);
                }
            });
        }
    };

    return (
        <div>
            <ListGroup>
                {characterArray.map((character) => (
                    <ListGroup.Item
                        action
                        onClick={() => characterSelection(email, character.characterName)}>
                        {character.characterName}
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Button variant="primary" onClick={() => checkTotalCharacters()}>
                Add a new Character
            </Button>

            {showMaxCharacterMessage && <Alert variant={"danger"}>User limit of 5 characters reached. Please delete a character before adding a new one!</Alert> }
            {showDupeCharacterMessage && <Alert variant={"danger"}>There is already a character with this name! Please use a different name for your character.</Alert> }

            <AddCharacterModal
                show={showNewCharacter}
                onHide={() => {
                    setShowNewCharacter(false);
                    resetForm();
                }}
                classArray={classArray}
                characterName={characterName}
                setCharacterName={setCharacterName}
                handleAddCharacter={handleAddCharacter}
                classSelection={classSelection}
                handleClassChange={handleClassChange}
                classLevel={classLevel}
                setClassLevel={setClassLevel}
                nameErrorMessage={nameErrorMessage}
                levelErrorMessage={levelErrorMessage}
                subclass={subclass}
                availableSubclasses={availableSubclasses}
                minLevelForSubclass={minLevelForSubclass}
                str={str}
                dex={dex}
                con={con}
                int={int}
                wis={wis}
                cha={cha}
                setStr={setStr}
                setDex={setDex}
                setCon={setCon}
                setInt={setInt}
                setWis={setWis}
                setCha={setCha}
                handleSubclassChange={handleSubclassChange}
                classErrorMessage={classErrorMessage}
                subclassErrorMessage={subclassErrorMessage}
            />
        </div>
    );
}

function AddCharacterModal(props) {
    const { show, onHide, classArray, characterName, setCharacterName, handleAddCharacter, classSelection, handleClassChange, classLevel, setClassLevel, nameErrorMessage, levelErrorMessage, subclass, availableSubclasses, minLevelForSubclass, handleSubclassChange, classErrorMessage, subclassErrorMessage, str, dex, con, int, wis, cha, setStr, setDex, setCon, setInt, setWis, setCha } = props;
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add New Character
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Group>
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        type="text"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        placeholder="Character Name"
                    />

                    {nameErrorMessage && <Alert variant={"danger"}>Length of character name must be between 1 and 50, and must include no special characters</Alert> }

                    {/* Class and subclass dropdowns sit next to each other, with subclass hidden until a class reaches a level that has access to them */}
                    <Row>
                        <Group as={Col}>
                            <Form.Label>Select a class:</Form.Label>
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

                        {classSelection && minLevelForSubclass <= classLevel && (
                            <Group as={Col}>
                                <Form.Label>Select a subclass:</Form.Label>
                                <Dropdown onSelect={handleSubclassChange}>
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                        {subclass || 'Select'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {availableSubclasses.map((subclassValue, index) => {
                                            console.log('classSelection:', classSelection);
                                            console.log('minLevelForSubclass:', minLevelForSubclass);
                                            console.log('classLevel:', classLevel);
                                            return (
                                                <Dropdown.Item eventKey={subclassValue} key={`class-${index}`}>
                                                    {subclassValue}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Group>
                        )}
                    </Row>

                    {classErrorMessage && <Alert variant={"danger"}>Please select a class</Alert> }
                    {subclassErrorMessage && <Alert variant={"danger"}>Please select a subclass</Alert> }

                    <Form.Label>Class level:</Form.Label>
                    <Form.Control
                        type="number"
                        value={classLevel}
                        min={1}
                        max={20}
                        //Allows the user to only input numerical digits or deletion keys
                        onKeyDown={(e) => {
                            if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                e.preventDefault();
                            }
                        }}
                        //Allows the user to only input values between 1 and 20
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 1 && value <= 20) {
                                setClassLevel(value);
                            }
                        }}
                    />

                    {levelErrorMessage && <Alert variant={"danger"}>Class level must be between 1-20 and be made up of only digits</Alert> }

                    {/* Two rows of 3 number inputs for stat collection */}
                    <Row>
                        <Group as={Col}>
                            <Form.Label>STR</Form.Label>
                            <Form.Control
                                type="number"
                                // You'll need to handle the state for each stat value
                                value={str}
                                min={1}
                                max={30}
                                //Allows the user to only input numerical digits or deletion keys
                                onKeyDown={(e) => {
                                    if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                        e.preventDefault();
                                    }
                                }}
                                //Allows the user to only input values between 1 and 30
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= 30) {
                                        setStr(value);
                                    }
                                }}
                            />
                        </Group>

                        <Group as={Col}>
                            <Form.Label>DEX</Form.Label>
                            <Form.Control
                                type="number"
                                value={dex}
                                min={1}
                                max={30}
                                //Allows the user to only input numerical digits or deletion keys
                                onKeyDown={(e) => {
                                    if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                        e.preventDefault();
                                    }
                                }}
                                //Allows the user to only input values between 1 and 30
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= 30) {
                                        setDex(value);
                                    }
                                }}
                            />
                        </Group>

                        <Group as={Col}>
                            <Form.Label>CON</Form.Label>
                            <Form.Control
                                type="number"
                                value={con}
                                min={1}
                                max={30}
                                //Allows the user to only input numerical digits or deletion keys
                                onKeyDown={(e) => {
                                    if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                        e.preventDefault();
                                    }
                                }}
                                //Allows the user to only input values between 1 and 30
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= 30) {
                                        setCon(value);
                                    }
                                }}
                            />
                        </Group>
                    </Row>

                    <Row>
                        <Group as={Col}>
                            <Form.Label>INT</Form.Label>
                            <Form.Control
                                type="number"
                                value={int}
                                min={1}
                                max={30}
                                //Allows the user to only input numerical digits or deletion keys
                                onKeyDown={(e) => {
                                    if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                        e.preventDefault();
                                    }
                                }}
                                //Allows the user to only input values between 1 and 30
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= 30) {
                                        setInt(value);
                                    }
                                }}
                            />
                        </Group>

                        <Group as={Col}>
                            <Form.Label>WIS</Form.Label>
                            <Form.Control
                                type="number"
                                value={wis}
                                min={1}
                                max={30}
                                //Allows the user to only input numerical digits or deletion keys
                                onKeyDown={(e) => {
                                    if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                        e.preventDefault();
                                    }
                                }}
                                //Allows the user to only input values between 1 and 30
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= 30) {
                                        setWis(value);
                                    }
                                }}
                            />
                        </Group>

                        <Group as={Col}>
                            <Form.Label>CHA</Form.Label>
                            <Form.Control
                                type="number"
                                value={cha}
                                min={1}
                                max={30}
                                //Allows the user to only input numerical digits or deletion keys
                                onKeyDown={(e) => {
                                    if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                        e.preventDefault();
                                    }
                                }}
                                //Allows the user to only input values between 1 and 30
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= 30) {
                                        setCha(value);
                                    }
                                }}
                            />
                        </Group>
                    </Row>
                </Group>

            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" onClick={handleAddCharacter}>
                    Add Character
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CharacterList;
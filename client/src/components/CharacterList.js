import Button from "react-bootstrap/Button";
import {Col, Container, ListGroup, Modal, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import AddCharacterModal from "./AddCharacterModal";
import "../css/CharacterList.css";

function CharacterList({email, characters, reloadCharacters}) {

    const [characterArray, setCharacterArray] = useState([]);
    const [showNewCharacter, setShowNewCharacter] = useState(false);
    const [showMaxCharacterMessage, setShowMaxCharacterMessage] = useState(false);
    const [characterName, setCharacterName] = useState("");
    const [useSpellpoints, setUseSpellpoints] = useState(false);
    const [showMaximums, setShowMaximums] = useState(true);
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
    const [characterDataLoaded, setCharacterDataLoaded] = useState(false);
    const [characterToDelete, setCharacterToDelete] = useState(false);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);

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
            // Resets the subclass when a user changes class
            setSubclass(undefined);
        }
    }, [classLevel, minLevelForSubclass]);

    useEffect(() => {
        // Initialize characterArray based on characters prop
        setCharacterArray(characters);
        setCharacterDataLoaded(true)
    }, [characters]);

    //Navigate to the page for the chosen character
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
        } else if (option === "Druid" || option === "Wizard") {
            setMinLevelForSubclass(2);
        } else {
            setMinLevelForSubclass(3);
        }
    };

    const handleSubclassChange = (option) => {
        setSubclass(option);
    };

    //Clears all form values and error messages within the modal form
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
        setUseSpellpoints(false);
        setShowMaximums(true);
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
                    stats: stats,
                    settings: {
                        showSpellpoints: useSpellpoints
                    }
                }
            }).then((res) => {
                resetForm();
                reloadCharacters(email);
                setShowNewCharacter(false);
            }).catch(function (error) {
                if (error.response.status === 409) {

                    setShowDupeCharacterMessage(true);
                } else {
                    console.log('Error', error.message);
                }
            });
        }
    };

    const handleDeleteCharacter = (characterName) => {
        axios.delete('http://localhost:9000/characters', {
            params: {
                email: email,
                characterName: characterName
            }
        })
            .then((res) => {
                setDeleteConfirmShow(false);
                setCharacterToDelete(undefined);
                reloadCharacters(email);
            })
            .catch((error) => {
                // Handle error
                console.error('Error deleting character', error);
            });
    }

    return (
        <div className="character-list-container">
            <Container fluid>
                <Row className="justify-content-center">
                    <Col sm={{ span: 8 }} md={{ span: 6 }}>
                        <ListGroup>
                            {characterArray.map((character) => (
                                <ListGroup.Item
                                    action
                                    onClick={() => characterSelection(email, character.characterName)}
                                    className="d-flex justify-content-between align-items-center character-item"

                                >
                                    {character.characterName}
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent parent component onClick from triggering
                                            setCharacterToDelete(character.characterName)
                                            setDeleteConfirmShow(true);
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} className="delete-icon" />
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>

            {characterDataLoaded && (
                <Button variant="primary" className="add-character-button" onClick={() => checkTotalCharacters()}>
                    Add a new Character
                </Button>
            )}

            {showMaxCharacterMessage && <Alert variant={"danger"}>User limit of 5 characters reached. Please delete a character before adding a new one!</Alert> }

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
                useSpellpoints={useSpellpoints}
                setUseSpellpoints={setUseSpellpoints}
                showMaximums={showMaximums}
                setShowMaximums={setShowMaximums}
                classSelection={classSelection}
                handleClassChange={handleClassChange}
                classLevel={classLevel}
                setClassLevel={setClassLevel}
                nameErrorMessage={nameErrorMessage}
                showDupeCharacterMessage={showDupeCharacterMessage}
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

            <DeleteConfirmation
                show={deleteConfirmShow}
                onHide={() => {
                    setDeleteConfirmShow(false);
                    setCharacterToDelete(undefined);
                }}
                handleDeleteCharacter={handleDeleteCharacter}
                characterToDelete={characterToDelete}
            />
            </Container>
        </div>
    );
}

function DeleteConfirmation({ show, onHide, handleDeleteCharacter, characterToDelete }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h8>Are you sure you want to delete this character?</h8>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button variant="danger"
                        className="btn-sm mr-2"
                        onClick={() => handleDeleteCharacter(characterToDelete)}
                >
                    Yes, delete character
                </Button>
                <Button variant="secondary" className="btn-sm" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CharacterList;
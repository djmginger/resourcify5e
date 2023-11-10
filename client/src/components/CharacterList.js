import Button from "react-bootstrap/Button";
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faTrashCan} from '@fortawesome/free-solid-svg-icons'
import Alert from "react-bootstrap/Alert";
import AddCharacterModal from "./AddCharacterModal";
import "../css/CharacterList.css";
import axios from "axios";
import {useCharacters} from '../contextProviders/CharacterContext';
import {DeleteConfirmation} from "./DeleteConfirmation";

function CharacterList({reloadCharacters}) {
    const apiUrl = process.env.REACT_APP_API_URL;

    const { characterArray, setCharacterArray } = useCharacters();
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
    const [statsErrorMessage, setStatsErrorMessage] = useState(false);
    const [showDupeCharacterMessage, setShowDupeCharacterMessage] = useState(false);
    const [characterDataLoaded, setCharacterDataLoaded] = useState(false);
    const [characterToDelete, setCharacterToDelete] = useState(false);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [prevCharName, setPrevCharName] = useState();

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
        setCharacterArray(characterArray);
        setCharacterDataLoaded(true)
    }, [characterArray]);

    //Navigate to the page for the chosen character
    const characterSelection = (characterName) => {
        navigate(`/characters/${characterName}`, {
            state: { characterName: characterName }
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
        setStatsErrorMessage(false);
        setUseSpellpoints(false);
        setShowMaximums(true);
        setPrevCharName(undefined);
    }

    const handleAddCharacter = () => {
        setNameErrorMessage(false);
        setLevelErrorMessage(false);
        setClassErrorMessage(false);
        setSubclassErrorMessage(false);
        setStatsErrorMessage(false);

        const stats = {str, dex, con, int, wis, cha}
        const areStatsValid = Object.values(stats).every(value => value >= 1);

        if (characterName === "" || !/^[\w\s]{1,50}$/.test(characterName) || characterName === undefined) {
            // Check that the length of the name is 50 or less, and has no special characters
            setNameErrorMessage(true);
        } else if (!/^(1\d|20|\d)$/.test(classLevel.toString())) {
            // Check that the class level is a value between 1 and 20 (inclusive)
            setLevelErrorMessage(true);
        } else if (classSelection === undefined) {
            // Check that a class has been selected
            setClassErrorMessage(true);
        } else if (classSelection && minLevelForSubclass <= classLevel && subclass === undefined) {
            // Check that a subclass has been selected (only if the character has access to them)
            setSubclassErrorMessage(true);
        } else if(!areStatsValid){
            // Check that all stat values are greater than 0
            setStatsErrorMessage(true);
        } else if (isUpdateMode) {
            // If this function was reached by clicking on the update button, make an API call to update existing character
            axios.put(`${apiUrl}/characters`, {
                character: {
                    name: characterName,
                    className: classSelection,
                    classLevel: classLevel,
                    subclass: subclass,
                    stats: stats,
                    settings: {
                        showSpellpoints: useSpellpoints,
                        showMaxValues: showMaximums,
                    }
                },
                prevCharName: prevCharName
            }, { withCredentials: true })
                .then((res) => {
                    setTimeout(() => {
                        resetForm();
                        setIsUpdateMode(false);
                    }, 150)
                    reloadCharacters();
                    setShowNewCharacter(false);
                }).catch((error) => {
                console.log('Error', error.message);
            });
        } else {
            // API call to add a new character
            axios.post(`${apiUrl}/characters`, {
                    character: {
                        name: characterName,
                        className: classSelection,
                        classLevel: classLevel,
                        subclass: subclass,
                        stats: stats,
                        settings: {
                            showSpellpoints: useSpellpoints,
                            showMaxValues: showMaximums,
                        }
                    },
                }, {withCredentials: true}
            ).then((res) => {
                setTimeout(() => {
                    resetForm();
                }, 150)
                reloadCharacters();
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
        axios.delete(`${apiUrl}/characters`, {
            params: { characterName: characterName },
            withCredentials: true
        })
            .then((res) => {
                setDeleteConfirmShow(false);
                setCharacterToDelete(undefined);
                reloadCharacters();
            })
            .catch((error) => {
                // Handle error
                console.error('Error deleting character', error);
            });
    }

    const showUpdateCharacter = async (existingCharacter) => {

        const getCharacter = async function (characterName) {
            try {
                const res = await axios.get(`${apiUrl}/characterDisplay`, {
                    params: {characterName: characterName},
                    withCredentials: true
                });
                return res.data.character;
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    if (error.response.error === 'User not found') {
                        console.log(error.response.error);
                        // Handle user not found
                    } else if (error.response.error === 'Character not found') {
                        console.log(error.response.error);
                        // Handle character not found
                    }
                } else {
                    console.log(error);
                }
                return null; // Return null in case of an error
            }
        }

        //Set the state with the original character so that you can update it if the name is changed.
        setPrevCharName(existingCharacter.characterName);

        //Get the full character object from the characterName, then set all states equal to their existing values and show the modal.
        const character = await getCharacter(existingCharacter.characterName);

        setCharacterName(character.characterName);
        handleClassChange(character.classes[0].className);
        setClassLevel(character.classes[0].classLevel);
        if (character.classes[0].subclass) {
            setSubclass(character.classes[0].subclass);
        }
        setStr(character.stats.str);
        setDex(character.stats.dex);
        setCon(character.stats.con);
        setInt(character.stats.int);
        setWis(character.stats.wis);
        setCha(character.stats.cha);
        setUseSpellpoints(character.settings.showSpellpoints);
        setShowMaximums(character.settings.showMaxValues);

        setIsUpdateMode(true);
        setShowNewCharacter(true);
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
                                    onClick={() => characterSelection(character.characterName)}
                                    className="d-flex justify-content-between align-items-center character-item"
                                >
                                    {character.characterName}
                                    <div className="icon-wrapper">

                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent parent listgroup.item onClick from triggering
                                                showUpdateCharacter(character);
                                            }}
                                            className="icon-action update-action"
                                        >
                                            <FontAwesomeIcon icon={faGear} className="update-icon" />
                                        </div>

                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent parent component onClick from triggering
                                                setCharacterToDelete(character.characterName)
                                                setDeleteConfirmShow(true);
                                            }}
                                            className="icon-action delete-action"
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} className="delete-icon" />
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>

            {characterDataLoaded && (
                <Button className="add-character-button" onClick={() => checkTotalCharacters()}>
                    Add a new Character
                </Button>
            )}

            {showMaxCharacterMessage && <Alert variant={"danger"}>User limit of 5 characters reached. Please delete a character before adding a new one!</Alert> }

            <AddCharacterModal
                show={showNewCharacter}
                onHide={() => {
                    setShowNewCharacter(false);
                    setTimeout(() => {
                        resetForm();
                        setIsUpdateMode(false);
                    }, 150)
                }}
                isUpdateMode={isUpdateMode}
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
                handleSubclassChange={handleSubclassChange}
                classErrorMessage={classErrorMessage}
                subclassErrorMessage={subclassErrorMessage}
                statsErrorMessage={statsErrorMessage}
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
            />

            <DeleteConfirmation
                show={deleteConfirmShow}
                onHide={() => {
                    setDeleteConfirmShow(false);
                    setCharacterToDelete(undefined);
                }}
                handleDelete={handleDeleteCharacter}
                characterToDelete={characterToDelete}
                isProfileDelete={false}
            />
            </Container>
        </div>
    );
}

export default CharacterList;
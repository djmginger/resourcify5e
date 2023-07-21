import axios from 'axios';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ResourceDisplay from '../components/ResourceDisplay';
import SiteNavbar from "../components/SiteNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSquareMinus, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import "../css/CharacterDisplay.css"
import {Card, Col, Container, Row, Button} from "react-bootstrap";


function CharacterDisplay() {
    const { state } = useLocation();
    const email = state.email;
    const characterName = state.characterName;

    const [character, setCharacter] = useState()
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [editEnabled, setEditEnabled] = useState(false);
    const [fullResourceArray, setFullResourceArray] = useState([]);
    const [resourceArray, setResourceArray] = useState([]);
    const [spellpointArray, setSpellpointArray] = useState([]);
    const [userSettings, setUserSettings] = useState()

    //Make an api call to get the specific character object given an email & characterName
    const getCharacter = function(email, characterName) {
        axios.get('http://localhost:9000/characterDisplay', {
            params: {
                email: email,
                characterName: characterName
            }
        }).then((res) => {
            setCharacter(res.data.character);
            setUserSettings(res.data.settings);
            setFullResourceArray(res.data.character.resources);
        }).catch((error) => {
            if (error.response.status === 404) {
                if (error.response.error === 'User not found') {
                    // Handle user not found
                } else if (error.response.error === 'Character not found') {
                    // Handle character not found
                }
            } else console.log(error);
        });
    }

    // Initial load of character
    useEffect(() => {
        getCharacter(email, characterName);
    }, [email, characterName]);

    useEffect(() => {
        // If it's the first load, split the resources.
        if (isFirstLoad && character?.resources) {
            if (character.settings.showSpellpoints) {
                const spellpoints = character.resources.filter(item => item.extras && item.extras.pointValue);
                const otherResources = character.resources.filter(item => !(item.extras && item.extras.pointValue));

                setSpellpointArray(spellpoints);
                setResourceArray(otherResources);
            } else {
                setResourceArray(character.resources);
                setSpellpointArray([]); // Reset spellpoints
            }

            setIsFirstLoad(false); // Reset the flag after the initial logic is complete
        }
    }, [character, isFirstLoad]);

    // Save character upon a change
    useEffect(() => {
        if (!isFirstLoad) {
            saveCharacter(email, character);
        }
    }, [character, isFirstLoad]);

    const saveCharacter = (email, character) =>{
        //reject initial onLoad call from connected useEffect Hook
        if (!character) return;

        axios.post('http://localhost:9000/characterDisplay', {
            email: email,
            character: character,
        }).then((res) => {
            // Handle success
        }).catch((error) => {
            // Handle error
        });
    }

    const decreaseResourceValue = (selectedResource) => {
        // Modify the resource value based on the selectedResource
        const updatedResources = fullResourceArray.map((resource) => {
            if (resource === selectedResource) {
                // Decrease the resourceCurrent value by 1
                return {
                    ...resource,
                    resourceCurrent: resource.resourceCurrent - 1,
                };
            }
            return resource;
        });

        // Update the character's resources with the adjusted values
        setCharacter(prevCharacter => ({
            ...prevCharacter,
            resources: updatedResources
        }));

        // Repopulate the split arrays based on the updated fullResourceArray
        if (character.settings.showSpellpoints) {
            const spellpoints = updatedResources.filter(item => item.extras && item.extras.pointValue);
            const otherResources = updatedResources.filter(item => !(item.extras && item.extras.pointValue));
            setSpellpointArray(spellpoints);
            setResourceArray(otherResources);
        } else {
            setResourceArray(updatedResources);
        }
    };

    const increaseResourceValue = (selectedResource) => {
        // Modify the resource value based on the selectedResource
        const updatedResources = fullResourceArray.map((resource) => {
            if (resource === selectedResource) {
                // Increase the resourceCurrent value by 1
                return {
                    ...resource,
                    resourceCurrent: resource.resourceCurrent + 1,
                };
            }
            return resource;
        });

        // Update the character's resources with the adjusted values
        setCharacter(prevCharacter => ({
            ...prevCharacter,
            resources: updatedResources
        }));

        // Repopulate the split arrays based on the updated fullResourceArray
        if (character.settings.showSpellpoints) {
            const spellpoints = updatedResources.filter(item => item.extras && item.extras.pointValue);
            const otherResources = updatedResources.filter(item => !(item.extras && item.extras.pointValue));
            setSpellpointArray(spellpoints);
            setResourceArray(otherResources);
        } else {
            setResourceArray(updatedResources);
        }
    };

    const decreaseCurrentSpellpoints = (spellpointValue) => {
        const updatedSpellpoints = character.spellpoints;

        console.log(updatedSpellpoints);

        //If a 6th level spell or higher was cast, set the value of the corr. spell to false, thereby disabling the corr. button
        switch(spellpointValue){
            case 9:
                updatedSpellpoints.powerSpells["6th Level Spells"] = false;
                break;
            case 10:
                updatedSpellpoints.powerSpells["7th Level Spells"] = false;
                break;
            case 11:
                updatedSpellpoints.powerSpells["8th Level Spells"] = false;
                break;
            case 13:
                updatedSpellpoints.powerSpells["9th Level Spells"] = false;
                break;
        }

        updatedSpellpoints.current -= spellpointValue;

        setCharacter(prevCharacter => ({
            ...prevCharacter,
            spellpoints: updatedSpellpoints
        }));
    };

    const increaseCurrentSpellpoints = (spellpointValue) => {
        const updatedSpellpoints = character.spellpoints;

        updatedSpellpoints.current += spellpointValue;

        setCharacter(prevCharacter => ({
            ...prevCharacter,
            spellpoints: updatedSpellpoints
        }));
    };

    const rest = (restType) => {
        if (restType === 'long') {
            const updatedResources = fullResourceArray.map((resource) => {
                if (resource.resetOnLong) {
                    // Reset resourceCurrent to resourceMax
                    return {
                        ...resource,
                        resourceCurrent: resource.resourceMax,
                    };
                }
                return resource;
            });

            const updatedSpellpoints = character.spellpoints;
            updatedSpellpoints.current = updatedSpellpoints.max;

            //Go through the powerSpells object within spellpoints, and if the values are not undefined, set them to true, enabling the corresponding buttons for those spells
            Object.keys(updatedSpellpoints.powerSpells).forEach(key => {
                if (updatedSpellpoints.powerSpells[key] !== undefined) {
                    updatedSpellpoints.powerSpells[key] = true;
                }
            });

            // Update the state with the modified resource array
            setCharacter((prevCharacter) => ({
                ...prevCharacter,
                resources: updatedResources,
            }));
        } else if (restType === 'short') {
            const updatedResources = fullResourceArray.map((resource) => {
                if (resource.resetOnShort) {
                    // Reset resourceCurrent to resourceMax
                    return {
                        ...resource,
                        resourceCurrent: resource.resourceMax,
                    };
                }
                return resource;
            });

            // Update the state with the modified resource array
            setCharacter((prevCharacter) => ({
                ...prevCharacter,
                resources: updatedResources,
            }));
        }
    };

    const editValueToggle = () => {
        setEditEnabled(prevEditEnabled => !prevEditEnabled);
    }

    return (
        <div className="character-display-body">
            <SiteNavbar email={email} />
            {character?.resources?.length > 0 ? (
                <>
                    <div className="header">
                        <div className="spacer"/>
                        <div className="title">
                            <h1>{character.characterName}</h1>
                            {character.classes && character.classes.length > 0 && (
                                <h5>
                                    Level {character.classes[0].classLevel} {character.classes[0].className} ({character.classes[0].subclass})
                                </h5>
                            )}
                        </div>
                        <div className="actions">
                            <FontAwesomeIcon size={"2x"} icon={faPenToSquare} onClick={() => editValueToggle()} className="edit-icon"/>
                        </div>
                    </div>
                    <div className="button-container">
                        <Button onClick={() => rest('long')} className="btn-sm rest">Long Rest</Button>
                        <Button onClick={() => rest('short')} className="btn-sm rest">Short Rest</Button>
                    </div>
                    {character?.settings.showSpellpoints && spellpointArray.length > 0 && ( //Only show the spellpoint container if the user has spellpoints enabled for this character, and the character has spell resources
                        <div className="spellpoint-container">
                            <SpellpointDisplay
                                spellpointArray={spellpointArray}
                                decreaseSpellpointValue={decreaseCurrentSpellpoints}
                                increaseSpellpointValue={increaseCurrentSpellpoints}
                                editEnabled={editEnabled}
                                spellpointObject={character.spellpoints}
                            />
                        </div>
                    )}
                    <div className="resource-card-container">
                        {resourceArray.map((resource, index) => (
                            <div key={index}>
                                <ResourceDisplay
                                    resource={resource}
                                    onDecreaseResource={decreaseResourceValue}
                                    onIncreaseResource={increaseResourceValue}
                                    editEnabled={editEnabled}
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <h1 className={"no-resources"}>There are no resources to track! Lucky you!</h1>
            )}
        </div>
    );
}

function SpellpointDisplay({ spellpointObject, spellpointArray, decreaseSpellpointValue, increaseSpellpointValue, editEnabled }) {
    const pairedResources = [];

    for (let i = 0; i < spellpointArray.length; i += 2) {
        pairedResources.push(spellpointArray.slice(i, i + 2));
    }

    return (
        <>
            <Card
                style={{
                    marginBottom: ".5rem",
                    backgroundColor: "#141414",
                    borderColor: "#333333"
                }}
                className="align-items-center"
            >
                <Card.Title
                    style={{
                        fontSize: "1.5rem",
                        paddingTop: ".5rem",
                        paddingBottom: ".3rem",
                        backgroundColor: "#333333",
                        width: "100%",
                        textAlign: "center",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        color: "#F5F1E3"
                    }}
                >
                    Spellpoints
                </Card.Title>
                <Card.Body style={{ width: "100%" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        {editEnabled && (
                            <div>
                                <FontAwesomeIcon
                                    size={"2x"}
                                    icon={faSquareMinus}
                                    onClick={() => decreaseSpellpointValue(1)}
                                    className={"edit minus"}
                                />
                            </div>
                        )}
                            <div style={{ width: "8rem", height: "8rem" }}>
                                <CircularProgressbar
                                    value={spellpointObject.current / spellpointObject.max}
                                    maxValue={1}
                                    backgroundPadding={6}
                                    counterClockwise={true}
                                    text={`${spellpointObject.current}/${spellpointObject.max}`}
                                    styles={buildStyles({
                                        strokeLinecap: "butt",
                                        textAlign: "",
                                        backgroundColor: "#8BB5E5",
                                        textColor: "#8BB5E5",
                                        pathColor: "#8BB5E5"
                                    })}
                                />
                            </div>

                        {editEnabled && (
                            <div>
                                <FontAwesomeIcon
                                    size={"2x"}
                                    icon={faSquarePlus}
                                    onClick={() => increaseSpellpointValue(1)}
                                    className={"edit plus"}
                                />
                            </div>
                        )}

                    </div>
                    <div>
                        <Container fluid style={{ margin: "0", padding: "0" }}>

                            {pairedResources.map((chunk, rowIndex) => (
                                <Row
                                    key={rowIndex}
                                    className="h-100"
                                    style={{ marginTop: rowIndex === 0 ? "1.5rem" : "1.3rem" }}
                                >
                                    {chunk.map((resource, colIndex) => {
                                        const isSingleResource = chunk.length === 1;

                                        // Check if the spell should be disabled due to already having been cast (6th level spells and above can only be cast once per long rest)
                                        const isDisabled = spellpointObject.powerSpells[resource.resourceName] === false;

                                        return (
                                            <Col
                                                key={resource.resourceName}
                                                md={{ span: 2, offset: isSingleResource ? 5 : colIndex === 1 ? 2 : 3 }}
                                                style={{ padding: "0" }}
                                            >
                                                <Button className="p-0 custom-button" onClick={() => decreaseSpellpointValue(resource.extras.pointValue / resource.resourceMax)} disabled={isDisabled}>
                                                    {resource.resourceName}
                                                </Button>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            ))}
                        </Container>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default CharacterDisplay;
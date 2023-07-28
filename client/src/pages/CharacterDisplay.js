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
    const characterName = state.characterName;

    const [character, setCharacter] = useState()
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [editEnabled, setEditEnabled] = useState(false);
    const [resourceArray, setResourceArray] = useState([]);
    const [spellpointArray, setSpellpointArray] = useState([]);
    const [userSettings, setUserSettings] = useState()

    //Make an api call to get the specific character object given a characterName
    const getCharacter = function(characterName) {
        axios.get('http://localhost:9000/characterDisplay',{
            params: {characterName: characterName},
            withCredentials: true
        }).then((res) => {
            setCharacter(res.data.character);
            setUserSettings(res.data.settings);
            //setFullResourceArray(res.data.character.resources);
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
        getCharacter(characterName);
        setIsFirstLoad(false);
    }, [characterName]);

    useEffect(() => {
        //If the character exists, take its resources and assign them to the state values that the display components use (splitting them up if the user has spellpoints enabled)
        if (character?.resources) {
            if (character.settings.showSpellpoints) {
                const spellpoints = character.resources.filter(item => item.extras && item.extras.pointValue);
                const otherResources = character.resources.filter(item => !(item.extras && item.extras.pointValue));

                setSpellpointArray(spellpoints);
                setResourceArray(otherResources);
            } else {
                setSpellpointArray([]);
                setResourceArray(character.resources);
            }
        }
    }, [character]);

    // Save character upon a change
    useEffect(() => {
        if (!isFirstLoad) {
            saveCharacter(character);
        }
    }, [character, isFirstLoad]);

    const saveCharacter = (character) =>{
        //reject initial onLoad call from connected useEffect Hook
        if (!character) return;

        axios.post('http://localhost:9000/characterDisplay', {
            character: character,
        }, {withCredentials: true}
        ).then((res) => {
            // Handle success
        }).catch((error) => {
            // Handle error
        });
    }

    const decreaseResourceValue = (selectedResource) => {
        // Modify the resource value based on the selectedResource
        const updatedResources = character.resources.map((resource) => {
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
        const updatedResources = character.resources.map((resource) => {
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
        const updatedSpellpoints = { ...character.spellpoints, powerSpells: { ...character.spellpoints.powerSpells } };



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
        const updatedSpellpoints = { ...character.spellpoints };

        updatedSpellpoints.current += spellpointValue;

        setCharacter(prevCharacter => ({
            ...prevCharacter,
            spellpoints: updatedSpellpoints
        }));
    };

    const rest = (restType) => {
        const updatedResources = character.resources.map(resource => {
            const shouldReset = (restType === 'long' && resource.resetOnLong) ||
                                (restType === 'short' && resource.resetOnShort);
            return shouldReset ? { ...resource, resourceCurrent: resource.resourceMax } : resource;
        });

        let updatedSpellpoints;

        if (restType === 'long' && character.spellpoints) {
            updatedSpellpoints = { ...character.spellpoints };
            updatedSpellpoints.current = updatedSpellpoints.max;
            if (character.spellpoints.powerSpells) {
                Object.keys(updatedSpellpoints.powerSpells).forEach(key => {
                    if (updatedSpellpoints.powerSpells[key] !== undefined) {
                        updatedSpellpoints.powerSpells[key] = true;
                    }
                });
            }
        }

        // Update the state with the modified resource array
        setCharacter(prevCharacter => ({
            ...prevCharacter,
            resources: updatedResources,
            spellpoints: restType === 'long' ? updatedSpellpoints : prevCharacter.spellpoints
        }));
    };

    const editValueToggle = () => {
        setEditEnabled(prevEditEnabled => !prevEditEnabled);
    }

    return (
        <div className="character-display-body">
            <SiteNavbar />
            <div className="content-container">
            {character?.resources?.length > 0 ? (
                <>
                    <div className="header">
                        <div className="spacer"/>
                        <div className="title">
                            <h1>{character.characterName}</h1>
                            {character.classes && character.classes.length > 0 && (
                                <h5>
                                    Level {character.classes[0].classLevel} {character.classes[0].subclass} {character.classes[0].className}
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
                        <div className="spellpoint-container row justify-content-md-center" >
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
                        {resourceArray.map((resource, index) => {
                            if (index % 2 === 0) {
                                // It's the first resource of the pair
                                return (
                                    <div className="row justify-content-md-center" key={index}>
                                        <div className="col-2 resource-card">
                                            <ResourceDisplay
                                                resource={resource}
                                                onDecreaseResource={decreaseResourceValue}
                                                onIncreaseResource={increaseResourceValue}
                                                editEnabled={editEnabled}
                                            />
                                        </div>
                                        {resourceArray[index + 1] && ( // Check if the second resource exists
                                            <div className="col-2 offset-1 resource-card">
                                                <ResourceDisplay
                                                    resource={resourceArray[index + 1]}
                                                    onDecreaseResource={decreaseResourceValue}
                                                    onIncreaseResource={increaseResourceValue}
                                                    editEnabled={editEnabled}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return null; // Return null for odd indices, as they are handled by even indices
                        })}
                    </div>
                </>
            ) : (
                <h1 className={"no-resources"}>There are no resources to track! Lucky you!</h1>
            )}
            </div>
        </div>
    );
}

function SpellpointDisplay({ spellpointObject, spellpointArray, decreaseSpellpointValue, increaseSpellpointValue, editEnabled }) {
    const pairedResources = [];

    for (let i = 0; i < spellpointArray.length; i += 2) {
        pairedResources.push(spellpointArray.slice(i, i + 2));
    }

    return (
        <div className="col-4">
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
                                                md={{ span: 4, offset: isSingleResource ? 4 : colIndex === 0 ? 1 : 2 }}
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
        </div>
    )
}

export default CharacterDisplay;
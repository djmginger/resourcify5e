import axios from 'axios';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import 'react-circular-progressbar/dist/styles.css';
import ResourceDisplay from '../components/ResourceDisplay';
import SiteNavbar from "../components/SiteNavbar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from '@fortawesome/free-regular-svg-icons';
import "../css/CharacterDisplay.css"
import {Button} from "react-bootstrap";
import SpellpointDisplay from "../components/SpellpointDisplay";
import Copyright from "../components/Copyright";
import AddResourceModal from "../components/AddResourceModal";
import {DeleteConfirmation} from "../components/DeleteConfirmation";

function CharacterDisplay() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const { state } = useLocation();
    const characterName = state.characterName;

    const [character, setCharacter] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [editEnabled, setEditEnabled] = useState(false);
    const [resourceArray, setResourceArray] = useState([]);
    const [spellpointArray, setSpellpointArray] = useState([]);
    const [initialCharacter, setInitialCharacter] = useState();
    const [showNewResourceModal, setShowNewResourceModal] = useState(false);
    const [newResourceName, setNewResourceName] = useState("");
    const [newResourceMax, setNewResourceMax] = useState(1);
    const [newResourceResetLong, setNewResourceResetLong] = useState(false);
    const [newResourceResetShort, setNewResourceResetShort] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState(false);
    const [resourceMaxErrorMessage, setResourceMaxErrorMessage] = useState(false);
    const [duplicateErrorMessage, setDuplicateErrorMessage] = useState(false);
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState();

    //Make an api call to get the specific character object given a characterName
    const getCharacter = function(characterName) {
        setIsLoading(true);
        axios.get(`${apiUrl}/characterDisplay`,{
            params: {characterName: characterName},
            withCredentials: true
        }).then((res) => {
            console.log(res.data.character);
            setCharacter(res.data.character);
            setIsLoading(false);
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
    }, [characterName]);

    // Save character upon a change
    useEffect(() => {
        if (character && initialCharacter && JSON.stringify(character) !== JSON.stringify(initialCharacter)) {
            saveCharacter(character);
        }
    }, [character, initialCharacter]);

    useEffect(() => {
        //Only trigger once the first useEffect has successfully called getCharacter
        if (character) {
            //
            setInitialCharacter(character);
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
        }
    }, [character]);

    const saveCharacter = (character) =>{
        //reject initial onLoad call from connected useEffect Hook
        if (!character) return;

        axios.post(`${apiUrl}/characterDisplay`, {
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
        console.log("Spellpoints before:")
        console.log(updatedSpellpoints)
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
        if (updatedSpellpoints.current < 0) updatedSpellpoints.current = 0;

        console.log("Spellpoints after:")
        console.log(updatedSpellpoints)
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

    const handleAddResource = () => {
        setNameErrorMessage(false);
        setResourceMaxErrorMessage(false);
        setDuplicateErrorMessage(false);

        if(newResourceName === "" || !/^[\w\s]{1,50}$/.test(newResourceName ) || newResourceName === undefined){
            setNameErrorMessage(true);
        } else if (newResourceMax <= 0) {
            setResourceMaxErrorMessage(true);
        } else if (character.resources && character.resources && character.resources.some(resource => resource.resourceName === newResourceName)){
            //Make sure that there are no other existing resources with the provided name
            setDuplicateErrorMessage(true);
        } else {
            axios.post(`${apiUrl}/characters/newResource`, {
                resource: {
                    resourceName: newResourceName,
                    resourceMax: newResourceMax,
                    resourceCurrent: newResourceMax,
                    resetOnLong: newResourceResetLong,
                    resetOnShort: newResourceResetShort,
                    extras: { isCustomResource: true }
                },
                characterName: characterName
            }, { withCredentials: true})
                .then((res) => {
                    resetForm();
                    setShowNewResourceModal(false);
                    getCharacter(characterName);
                }).catch((error) => {
                console.log('Error', error.message);
                });
        }
    }

    const handleDeleteResource = (resourceName) => {
        axios.delete(`${apiUrl}/characters/newResource`, {
            params: {
                resourceName: resourceName,
                characterName: characterName
            },
            withCredentials: true
        })
            .then((res) => {
                setDeleteConfirmShow(false);
                setResourceToDelete(undefined);
                getCharacter(characterName);
            }).catch((error) => {
            console.log('Error', error.message);
        });
    }

    const resetForm = () => {
        setNewResourceName("");
        setNewResourceMax(1);
        setNewResourceResetLong(false);
        setNewResourceResetShort(false);
        setNameErrorMessage(false);
        setResourceMaxErrorMessage(false);
        setDuplicateErrorMessage(false);
    }

    return (
        <div className="character-display-body">
            <SiteNavbar />
            {isLoading ? null : (
                <div className="character-display-content">
                {character?.resources?.length > 0 ? (
                    <>
                        <div className="header">
                            <div className="spacer"/>
                            <div className="title">
                                <h1>{character.characterName}</h1>
                                {character.classes && character.classes.length > 0 && (
                                    <h4>
                                        Level {character.classes[0].classLevel} {character.classes[0].subclass} {character.classes[0].className}
                                    </h4>
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
                            <div className="spellpoint-container" >
                                <div className="row justify-content-center" >
                                    <SpellpointDisplay
                                        spellpointArray={spellpointArray}
                                        decreaseSpellpointValue={decreaseCurrentSpellpoints}
                                        increaseSpellpointValue={increaseCurrentSpellpoints}
                                        editEnabled={editEnabled}
                                        spellpointObject={character.spellpoints}
                                        maxEnabled={character.settings.showMaxValues}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="resource-card-container">
                            {resourceArray.map((resource, index) => {
                                if (index % 2 === 0) {
                                    // It's the first resource of the pair
                                    return (
                                        <div className="row justify-content-center" key={index}>
                                            <div className="col-6 col-sm-5 col-md-3 col-xl-2 resource-card">
                                                <ResourceDisplay
                                                    resource={resource}
                                                    onDecreaseResource={decreaseResourceValue}
                                                    onIncreaseResource={increaseResourceValue}
                                                    editEnabled={editEnabled}
                                                    maxEnabled={character.settings.showMaxValues}
                                                    setResourceToDelete={setResourceToDelete}
                                                    setDeleteConfirmShow={setDeleteConfirmShow}
                                                />
                                            </div>
                                            {resourceArray[index + 1] && ( // Check if the second resource exists
                                                <div className="col-6 col-sm-5 col-md-3 col-xl-2 offset-sm-1 resource-card">
                                                    <ResourceDisplay
                                                        resource={resourceArray[index + 1]}
                                                        onDecreaseResource={decreaseResourceValue}
                                                        onIncreaseResource={increaseResourceValue}
                                                        editEnabled={editEnabled}
                                                        maxEnabled={character.settings.showMaxValues}
                                                        setResourceToDelete={setResourceToDelete}
                                                        setDeleteConfirmShow={setDeleteConfirmShow}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null; // Return null for odd indices, as they are handled by even indices
                            })}
                        </div>
                        {editEnabled && (
                            <div className="add-resource-container">
                                <Button className="add-resource-button" onClick={() => setShowNewResourceModal(true)}>
                                    Add a resource
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <h1 className={"no-resources"}>There are no resources to track! Lucky you!</h1>
                )}
                </div>
            )}

            <AddResourceModal
                show={showNewResourceModal}
                onHide={() => {
                    setShowNewResourceModal(false);
                    resetForm();
                }}
                handleAddResource={handleAddResource}
                newResourceName={newResourceName}
                setNewResourceName={setNewResourceName}
                newResourceMax={newResourceMax}
                setNewResourceMax={setNewResourceMax}
                newResourceResetLong={newResourceResetLong}
                setNewResourceResetLong={setNewResourceResetLong}
                newResourceResetShort={newResourceResetShort}
                setNewResourceResetShort={setNewResourceResetShort}
                nameErrorMessage={nameErrorMessage}
                resourceMaxErrorMessage={resourceMaxErrorMessage}
                duplicateErrorMessage={duplicateErrorMessage}
            />

            <DeleteConfirmation
                show={deleteConfirmShow}
                onHide={() => {
                    setDeleteConfirmShow(false);
                    setResourceToDelete(undefined);
                }}
                handleDelete={handleDeleteResource}
                itemToDelete={resourceToDelete}
                confirmationType={"resource"}
            />

            <Copyright/>
        </div>
    );
}

export default CharacterDisplay;
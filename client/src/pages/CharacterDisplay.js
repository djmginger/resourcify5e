import axios from 'axios';
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Button from "react-bootstrap/Button";
import ResourceDisplay from '../components/ResourceDisplay';
import SiteNavbar from "../components/SiteNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import "../css/CharacterDisplay.css"


function CharacterDisplay() {
    const { state } = useLocation();
    const email = state.email;
    const characterName = state.characterName;

    const [character, setCharacter] = useState()
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [editEnabled, setEditEnabled] = useState(false);

    //Make an api call to get the specific character object given an email & characterName
    const getCharacter = function(email, characterName) {
        axios.get('http://localhost:9000/characterDisplay', {
            params: {
                email: email,
                characterName: characterName
            }
        }).then((res) => {
            if (res.status === 404){
                if (res.data.error === 'User not found'){
                    // Handle user not found
                } else if (res.data.error === 'Character not found'){
                    // Handle character not found
                }
            } else{
                setCharacter(res.data);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    // Initial load of character
    useEffect(() => {
        getCharacter(email, characterName);
    }, [email, characterName]);

    // Save character upon a change
    useEffect(() => {
        if (isFirstLoad) {
            setIsFirstLoad(false);
        } else {
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

    const resourceArray = character?.resources || [];

    const decreaseResourceValue = (selectedResource) => {
        // Modify the resource value based on the selectedResource
        const updatedResources = resourceArray.map((resource) => {
            if (resource === selectedResource) {
                // Decrease the resourceCurrent value by 1
                return {
                    ...resource,
                    resourceCurrent: resource.resourceCurrent - 1,
                };
            }
            return resource;
        });

        // Update the state with the modified resource array
        setCharacter((prevCharacter) => ({
            ...prevCharacter,
            resources: updatedResources,
        }));
    };

    const increaseResourceValue = (selectedResource) => {
        // Modify the resource value based on the selectedResource
        const updatedResources = resourceArray.map((resource) => {
            if (resource === selectedResource) {
                // Decrease the resourceCurrent value by 1
                return {
                    ...resource,
                    resourceCurrent: resource.resourceCurrent + 1,
                };
            }
            return resource;
        });

        // Update the state with the modified resource array
        setCharacter((prevCharacter) => ({
            ...prevCharacter,
            resources: updatedResources,
        }));
    };

    const rest = (restType) => {
        if (restType === 'long') {
            const updatedResources = resourceArray.map((resource) => {
                if (resource.resetOnLong) {
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
        } else if (restType === 'short') {
            const updatedResources = resourceArray.map((resource) => {
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
        if(editEnabled) setEditEnabled(false);
        else setEditEnabled(true);
    }

    return (
        <div className="character-display-body">
            <SiteNavbar email={email} />
            {character ? (
                <>
                    <div className={"header"}>
                        <div className={"spacer"}/>
                        <div className={"title"}>
                            <h1>{character.characterName}</h1>
                            {character.classes && character.classes.length > 0 && (
                                <h5>
                                    Level {character.classes[0].classLevel} {character.classes[0].className} ({character.classes[0].subclass})
                                </h5>
                            )}
                        </div>
                        <div className={"actions"}>
                            <FontAwesomeIcon size={"2x"} icon={faPenToSquare} onClick={() => editValueToggle()} className={"edit-icon"}/>
                        </div>
                    </div>
                    <div className={"button-container"}>
                        <Button onClick={() => rest('long')} className={"btn-sm rest"}>Long Rest</Button>
                        <Button onClick={() => rest('short')} className={"btn-sm rest"}>Short Rest</Button>
                    </div>
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

export default CharacterDisplay;
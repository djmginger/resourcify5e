import React from 'react';
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import RadialSeparators from "./RadialSeparators";
import {Card} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus, faSquarePlus} from '@fortawesome/free-regular-svg-icons';
import "../css/ResourceDisplay.css"

function ResourceDisplay({ resource, onDecreaseResource, onIncreaseResource, editEnabled }) {

    const currentVal = resource.resourceCurrent;
    const maxVal = resource.resourceMax;

    const decreaseResourceValue = () => {
        onDecreaseResource(resource); // Invoke the function defined in CharacterDisplay to decrease the current value of the resource
    };

    const increaseResourceValue = () => {
        if(resource.resourceCurrent < resource.resourceMax) onIncreaseResource(resource); // Invoke the function defined in CharacterDisplay to increase the current value of the resource (ONLY if the current value is less than the max)
    };

    return (
        <div>
            <Card style={{ marginBottom:".5rem", backgroundColor:"#141414", borderColor:"#333333"}} className="align-items-center">
                <Card.Title style={{fontSize: "0.7rem", paddingTop:".5rem", paddingBottom:".3rem", backgroundColor:"#333333", width:"100%", textAlign:"center", borderTopLeftRadius:"4px", borderTopRightRadius:"4px", color:"#F5F1E3"}}>{resource.resourceName}</Card.Title>
                <Card.Body>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {editEnabled && (
                            <div>
                                <FontAwesomeIcon size={"lg"} icon={faSquareMinus} onClick={decreaseResourceValue} className={"edit-icon minus"}/>
                            </div>
                        )}

                        <Button onClick={decreaseResourceValue}
                                disabled={currentVal === 0}
                                style={{ width: "5rem", height: "5rem", borderRadius: "50%", padding: "0", backgroundColor:"transparent", border:"none"}}>
                            <CircularProgressbarWithChildren
                                value={currentVal / maxVal}
                                maxValue={1}
                                background
                                backgroundPadding={6}
                                counterClockwise={true}
                                text={`${currentVal}/${maxVal}`}
                                styles={buildStyles({strokeLinecap: "butt", backgroundColor: "#8BB5E5", textColor: "#F5F1E3", pathColor: "#F5F1E3"})}
                            >
                                <RadialSeparators
                                    count={maxVal}
                                    style={{
                                        background: "#8BB5E5",
                                        width: "2px",
                                        // This needs to be equal to props.strokeWidth
                                        height: `${10}%`
                                    }}
                                />
                            </CircularProgressbarWithChildren>
                        </Button>

                        {editEnabled && (
                            <div>
                                <FontAwesomeIcon size={"lg"} icon={faSquarePlus} onClick={increaseResourceValue} className={"edit-icon plus"}/>
                            </div>
                        )}

                    </div>
                </Card.Body>

            </Card>
        </div>
    );
}
export default ResourceDisplay;
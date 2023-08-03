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
        console.log("click!")
        onDecreaseResource(resource); // Invoke the function defined in CharacterDisplay to decrease the current value of the resource
    };

    const increaseResourceValue = () => {
        if(resource.resourceCurrent < resource.resourceMax) onIncreaseResource(resource); // Invoke the function defined in CharacterDisplay to increase the current value of the resource (ONLY if the current value is less than the max)
    };

    return (
        <div>
            <Card className="align-items-center resource-card">
                <Card.Title className="resource-card-title">{resource.resourceName}</Card.Title>
                <Card.Body className="d-flex justify-content-center align-items-center">
                    <div className="resource-card-content col-10 col-sm-12">
                        {editEnabled && (
                            <div>
                                <FontAwesomeIcon size={"lg"} icon={faSquareMinus} onClick={decreaseResourceValue} className={"edit-icon minus"}/>
                            </div>
                        )}
                        <div className="resource-button-container">
                            <Button onClick={decreaseResourceValue}
                                    disabled={currentVal === 0}
                                    className="circular-button">
                                <CircularProgressbarWithChildren
                                    value={currentVal / maxVal}
                                    maxValue={1}
                                    background
                                    backgroundPadding={6}
                                    counterClockwise={true}
                                    text={`${currentVal}/${maxVal}`}
                                    styles={buildStyles({strokeLinecap: "butt", backgroundColor: "#8BB5E5", textColor: "#F5F1E3", pathColor: "#F5F1E3", trailColor:"#707070"})}
                                >
                                    <RadialSeparators className="radial-separator" count={maxVal} style={{
                                        background: "#8BB5E5",
                                        width: "2px",
                                        // This needs to be equal to props.strokeWidth
                                        height: `${10}%`}}
                                    />
                                </CircularProgressbarWithChildren>


                            </Button>
                        </div>
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
import React from 'react';
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import RadialSeparators from "./RadialSeparators";
import {Card} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus, faSquarePlus} from '@fortawesome/free-regular-svg-icons';
import "../css/ResourceDisplay.css"

function ResourceDisplay({ resource, onDecreaseResource, onIncreaseResource, editEnabled, maxEnabled }) {

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
            <Card className="align-items-center resource-card">
                <Card.Title className="resource-card-title">{resource.resourceName}</Card.Title>
                <Card.Body className="d-flex justify-content-center align-items-center">
                    <div className="resource-card-content col-10 col-sm-12">
                        {editEnabled && (
                            <div>
                                <FontAwesomeIcon
                                    size={"lg"}
                                    icon={faSquareMinus}
                                    onClick={() => {
                                        if (resource.resourceCurrent > 0) {
                                            decreaseResourceValue();
                                        }
                                    }}
                                    className={"edit-icon minus"}/>
                            </div>
                        )}
                        <div className="resource-button-container">
                            <Button onClick={decreaseResourceValue}
                                    // 9999999999 is the placeholder used to represent an infinite resource
                                    disabled={currentVal === 0 || currentVal === 9999999999}
                                    className="circular-button">
                                <CircularProgressbarWithChildren
                                    value={maxVal === 9999999999 ? 1 : currentVal / maxVal}
                                    maxValue={1}
                                    background
                                    backgroundPadding={6}
                                    counterClockwise={true}
                                    text={maxVal === 9999999999 ? '∞' : maxEnabled ? `${resource.resourceCurrent}/${resource.resourceMax}` : `${resource.resourceCurrent}`}
                                    styles={buildStyles({strokeLinecap: "butt", backgroundColor: "#8BB5E5", textColor: "#F5F1E3", pathColor: "#F5F1E3", trailColor:"#707070"})}
                                >
                                    <RadialSeparators className="radial-separator" count={maxVal === 9999999999 ? 0 : maxVal} style={{
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
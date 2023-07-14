import React from 'react';
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import RadialSeparators from "./radialSeparators";
import {Card, ListGroup, Button} from "react-bootstrap";

function ResourceDisplay({ resource, onDecreaseResource }) {

    const currentVal = resource.resourceCurrent;
    const maxVal = resource.resourceMax;

    const decreaseResourceValue = () => {
        onDecreaseResource(resource); // Invoke the callback function and pass the resource
    };

    return (
        <div>
            <Card style={{ width: "10rem" }} className="align-items-center">
                <Card.Body >
                    <div style={{ width: "5rem" }}>
                        <CircularProgressbarWithChildren
                            value={currentVal / maxVal}
                            maxValue={1}
                            counterClockwise={true}
                            text={`${currentVal}/${maxVal}`}
                            styles={buildStyles({strokeLinecap: "butt"})}
                        >
                            <RadialSeparators
                                count={maxVal}
                                style={{
                                    background: "#fff",
                                    width: "2px",
                                    // This needs to be equal to props.strokeWidth
                                    height: `${10}%`
                                }}
                            />
                        </CircularProgressbarWithChildren>
                    </div>
                </Card.Body>
                <ListGroup className="list-group-flush" style={{ width: '100%' }}>
                    <ListGroup.Item className="text-center">
                        <Button
                            variant={currentVal === 0 ? 'secondary' : 'primary'}
                            onClick={decreaseResourceValue}
                            disabled={currentVal === 0}
                        >
                            {resource.resourceName}
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </div>
    );
}

export default ResourceDisplay;
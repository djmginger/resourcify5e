import {Button, Card} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquareMinus, faSquarePlus} from "@fortawesome/free-regular-svg-icons";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import "../css/SpellpointDisplay.css"

function SpellpointDisplay(
    {spellpointObject,
        spellpointArray,
        decreaseSpellpointValue,
        increaseSpellpointValue,
        editEnabled
    })
{
    const pairedResources = [];

    for (let i = 0; i < spellpointArray.length; i += 2) {
        pairedResources.push(spellpointArray.slice(i, i + 2));
    }

    return (
        <div className="col-10 col-sm-8 col-md-6 col-lg-4">
            <Card className="align-items-center spellpoint-card">
                <Card.Title
                    className="spellpoint-title"
                >
                    Spellpoints
                </Card.Title>
                <Card.Body className="spellpoint-card-body">
                    <div className="spellpoint-card-body-content">

                        {editEnabled && (
                            <div>
                                <FontAwesomeIcon
                                    size={"2x"}
                                    icon={faSquareMinus}
                                    onClick={() => decreaseSpellpointValue(1)}
                                    className="edit minus"
                                />
                            </div>
                        )}
                        <div style={{width: "8rem", height: "8rem"}}>
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
                                    className="edit plus"
                                />
                            </div>
                        )}

                    </div>
                    <div className="row no-pad-no-marg">
                        {pairedResources.map((chunk, rowIndex) => (
                            <div key={rowIndex} className="center-flex no-pad-no-marg" style={{ marginTop: rowIndex === 0 ? "1.5rem" : "1.3rem" }}>
                                {chunk.map((resource, resourceIndex) => {
                                    const isDisabled = spellpointObject.powerSpells[resource.resourceName] === false;
                                    let colClasses = "spellpoint-button col-5 col-md-4 col-lg-3 ";
                                    if (resourceIndex % 2 !== 0) {
                                        colClasses += "ms-4"; // Add offsets for every second item
                                    }
                                    return (
                                        <div key={resource.resourceName} className={`${colClasses}`}>
                                            <Button
                                                className="custom-button"
                                                onClick={() => decreaseSpellpointValue(resource.extras.pointValue / resource.resourceMax)}
                                                disabled={isDisabled}>
                                                {resource.resourceName}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default SpellpointDisplay;
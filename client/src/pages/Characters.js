import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from 'axios';
import CharacterList from "../components/CharacterList";
import SiteNavbar from "../components/SiteNavbar";
import "../css/Characters.css"

function Characters() {
    const { state } = useLocation();
    const email = state.email;
    const [characterArray, setCharacterArray] = useState([]);

    //Make an api call to get the list of characters given an email, and add them to the characterArray state value
    const getCharacters = function(userEmail) {
        axios.get('http://localhost:9000/characters', {
            params: { email: userEmail }
        }).then((res) => {
            const userCharacters = res.data.map((character) => ({
                characterName: character.characterName,
            }));
            setCharacterArray(userCharacters);
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        getCharacters(email);
    }, []);

    return (
        <div className="character-list-body">
            <SiteNavbar email={email} />
            <div className="character-list-content">
                <h4 className="character-list-title">Character List</h4>
                <CharacterList
                    email={email}
                    characters={characterArray}
                    reloadCharacters={getCharacters}
                />
            </div>
        </div>
    )
}

export default Characters;
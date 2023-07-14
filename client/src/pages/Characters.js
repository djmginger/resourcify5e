import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from 'axios';
import CharacterList from "../components/characterList";

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
    }

    useEffect(() => {
        getCharacters(email);
    }, []);

    const addCharacter = () => {
        getCharacters(email);
    }

    return (
        <div>
            <CharacterList
                email={email}
                characters={characterArray}
                addCharacter={addCharacter}
            />
        </div>
    )
}

export default Characters;
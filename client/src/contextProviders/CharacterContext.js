import { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";

const CharacterContext = createContext();

export const useCharacters = () => {
    return useContext(CharacterContext);
};

export const CharacterProvider = ({ children }) => {
    const [characterArray, setCharacterArray] = useState([]);

    //Make an api call to get the list of characters given an email, and add them to the characterArray state value
    const getCharacters = function() {
        axios.get('http://localhost:9000/characters',
            { withCredentials: true}
        ).then((res) => {
            const userCharacters = res.data.map((character) => ({
                characterName: character.characterName,
            }));
            setCharacterArray(userCharacters);
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        getCharacters();
    }, []);

    return (
        <CharacterContext.Provider value={{ characterArray, setCharacterArray, getCharacters }}>
            {children}
        </CharacterContext.Provider>
    );
};
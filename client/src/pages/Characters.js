import CharacterList from "../components/CharacterList";
import SiteNavbar from "../components/SiteNavbar";
import "../css/Characters.css"
import { useCharacters } from '../contextProviders/CharacterContext';

function Characters() {
    return (
        <div className="character-list-body">
            <SiteNavbar />
            <div className="character-list-content">
                <h2 className="character-list-title">Character List</h2>
                <CharacterListComponent />
            </div>
        </div>
    )
}

function CharacterListComponent() {
    const { characterArray, getCharacters } = useCharacters();
    return (
        <CharacterList
            characters={characterArray}
            reloadCharacters={getCharacters}
        />
    )
}

export default Characters;
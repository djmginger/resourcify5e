import CharacterList from "../components/CharacterList";
import SiteNavbar from "../components/SiteNavbar";
import "../css/Characters.css"
import { useCharacters } from '../contextProviders/CharacterContext';
import Copyright from "../components/Copyright";

function Characters() {
    return (
        <div className="character-list-body">
            <SiteNavbar />
            <div className="character-list-content">
                <h2 className="character-list-title">Character List</h2>
                <CharacterListComponent />
            </div>
            <Copyright/>
        </div>
    )
}

function CharacterListComponent() {
    const { getCharacters } = useCharacters();
    return (
        <CharacterList
            reloadCharacters={getCharacters}
        />
    )
}

export default Characters;
import {Link} from "react-router-dom"

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Etusivu</Link>
                </li>
                <li>
                    <Link to="/suunnittele-reitti">Suunnittele reittisi</Link>
                </li>
                <li>
                    <Link to="/ohjeet">Käyttöohjeet</Link>
                </li>
                <li>
                    <Link to="/tuki">Tuki</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation
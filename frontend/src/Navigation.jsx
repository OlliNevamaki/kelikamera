import {Link} from "react-router-dom"

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Etusivu</Link>
                </li>
                <li>
                    <Link to="/Reitinvalinta">Reitinvalinta</Link>
                </li>
                <li>
                    <Link to="/Ohjeet">Ohjeet</Link>
                </li>
                <li>
                    <Link to="/Tuki">Tuki</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation
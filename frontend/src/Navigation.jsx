import { Link } from "react-router-dom";
import logo from "./Logo.png";

const Navigation = () => {
  return (
    <nav>
      <div className="logo">
        <img src={logo} alt="Kelikamera logo" />
      </div>
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
  );
};

export default Navigation;

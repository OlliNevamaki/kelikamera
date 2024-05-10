import { Link } from "react-router-dom";
import logo from "./Logo.png";
/**The navigation bar component for the app, the function provides a logo image and links for the page views */
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
          <Link to="/tallennetut-reitit">Tallennetut reitit</Link>
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

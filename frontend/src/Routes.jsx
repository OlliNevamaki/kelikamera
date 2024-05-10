import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Maps from "./Maps";
import Instructions from "./Instructions";
import Help from "./Help";
import SavedRoutes from "./SavedRoutes";
/**This function includes the page routes that each one of them have their specific path that refers to a specific component */
function PageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="tallennetut-reitit" element={<SavedRoutes />} />
      <Route path="suunnittele-reitti" element={<Maps />} />
      <Route path="ohjeet" element={<Instructions />} />
      <Route path="tuki" element={<Help />} />
    </Routes>
  );
}

export default PageRoutes;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const SavedRoutes = () => {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRoutesFromStorage =
      JSON.parse(localStorage.getItem("savedRoutes")) || [];
    setSavedRoutes(savedRoutesFromStorage);
  }, []);

  const deleteRoute = (index) => {
    const updatedRoutes = [...savedRoutes];
    updatedRoutes.splice(index, 1);
    setSavedRoutes(updatedRoutes);
    localStorage.setItem("savedRoutes", JSON.stringify(updatedRoutes));
  };

  const openSavedRoute = (route) => {
    navigate("/suunnittele-reitti", {
      state: { origin: route.origin, destination: route.destination },
    });
  };

  const openMapView = () => {
    navigate("/suunnittele-reitti");
  };

  return (
    <>
      <div>
        <h2>Tallennetut reitit</h2>
        <ul>
          {savedRoutes.map((route, index) => (
            <li key={index}>
              <p>Lähtöpaikka: {route.origin}</p>
              <p>Määränpää: {route.destination}</p>
              <button onClick={() => deleteRoute(index)}>Poista</button>
              <button onClick={() => openSavedRoute(route)}>Avaa reitti</button>
            </li>
          ))}
        </ul>
        <button onClick={openMapView}>Suunnittele reitti</button>
        <Footer />
      </div>
    </>
  );
};

export default SavedRoutes;

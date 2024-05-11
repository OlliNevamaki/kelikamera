import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import './App.css';

/**Function for a page view that displays the saved routes from Maps view and also has options to delete them or review them */
const SavedRoutes = () => {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const navigate = useNavigate();

  /**Getting the saved routes from the localStorage */
  useEffect(() => {
    const savedRoutesFromStorage =
      JSON.parse(localStorage.getItem("savedRoutes")) || [];
    setSavedRoutes(savedRoutesFromStorage);
  }, []);

  /**Function for deleting a saved route according to the saved items index and updating the list after */
  const deleteRoute = (index) => {
    const updatedRoutes = [...savedRoutes];
    updatedRoutes.splice(index, 1);
    setSavedRoutes(updatedRoutes);
    localStorage.setItem("savedRoutes", JSON.stringify(updatedRoutes));
  };

  /**Function for the button to store the origin and destination values in state object so they can be referred in Maps component when it's opened */
  const openSavedRoute = (route) => {
    navigate("/suunnittele-reitti", {
      state: { origin: route.origin, destination: route.destination },
    });
  };

  /**Function to open the Maps view */
  const openMapView = () => {
    navigate("/suunnittele-reitti");
  };

  return (
    <>
      <div>
        <button className="plan-button" onClick={openMapView}>Suunnittele reitti</button>
        <h2>Tallennetut reitit</h2>
        <ul className="location-list">
          {savedRoutes.map((route, index) => (
            <li key={index} className="location-item">
              <p className="from-button">Lähtöpaikka: {route.origin}</p>
              <p className="to-button">Määränpää: {route.destination}</p>
              <button className="delete-button" onClick={() => deleteRoute(index)}>Poista</button>
              <button className="open-button" onClick={() => openSavedRoute(route)}>Avaa reitti</button>
            </li>
          ))}
        </ul>
        <Footer />
      </div>
    </>
  );
};

export default SavedRoutes;



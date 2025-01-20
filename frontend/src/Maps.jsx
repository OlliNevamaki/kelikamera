"use client";
import Footer from "./Footer";
import { useRef, useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import cameraMarker from "./camera.png";
import { useLocation } from "react-router-dom";
const libraries = ["places"];
/**Maps function provides functions for the usage of Google maps based map view and consist mainly of features for searching a route,
 * deleting the created route and on the created route showing markers that are used to display either route from place A to place B or the
 * markers are used as clickable items and locators for weather cameras that all display an InfoWindow component that displays data from
 * digitraffic weather sensors and camera pictures. The function also has a feature to save a route in localStorage so it can be displayed in
 * mapped list provided by SavedRoutes.jsx
 */
function Maps() {
  /** location and its state for using the predetermined route that is selected from savedRoutes.*/
  const location = useLocation();
  const { origin, destination } = location.state || {};
  /**starting position when loading the map and its coordinates, and a loader for libraries that provide place information and the API key for Google Maps */
  const startPos = { lat: 62.24147, lng: 25.72088 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "", // if the app is not running as it should, make sure the Api key is changed to your own key or a key that is currently active.
    libraries: libraries,
  });
  /**States for different data handled in the application and also refs for the origin and destination of the searchable route */
  const [map, setMap] = useState({});
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const origRef = useRef(null);
  const destinationRef = useRef(null);
  const [cameraData, setCameraData] = useState([]);
  const [cameraInfoWindow, setCameraInfoWindow] = useState(null);
  const [clickedMarkerIndex, setClickedMarkerIndex] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [cameraImg, setCameraImg] = useState({});
  const [temperature, setTemperature] = useState([]);
  const [wind, setWind] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [roadTmp, setRoadTmp] = useState([]);
  const [rainType, setRainType] = useState([]);
  const [blackIce, setBlackIce] = useState([]);
  const [currentMapCenter, setCurrentMapCenter] = useState(startPos);
  const [savedRoutes, setSavedRoutes] = useState([]);
  /**useEffect for running the fetchCameraData() function */
  useEffect(() => {
    fetchCameraData();
  }, []);
  /**function for a button used to save routes, saves origin and destination values and stores them in an array of savedRoutes that is stored in localStorage */
  const saveRoutes = () => {
    const routeData = {
      origin: origRef.current.value,
      destination: destinationRef.current.value,
    };
    const existingRoutes =
      JSON.parse(localStorage.getItem("savedRoutes")) || [];
    const updateRoutes = [...existingRoutes, routeData];
    setSavedRoutes(updateRoutes);
    localStorage.setItem("savedRoutes", JSON.stringify(updateRoutes));
  };
  /** Function to handle the features of the weather camera markers, handles markers by index and fetches an image corresponding to
   * the cameras id, determines the nearest weather station for the camera location and fetches data from the weather station, then searches
   * filtered data from the information provided by the weather sensors and uses state variables to display those values.
   */
  const handleMarkerClick = async (index) => {
    setClickedMarkerIndex(index);
    try {
      const camera = cameraData[index];
      if (!camera || !camera.id) {
        throw new Error("Invalid camera data or missing ID");
      }
      const cameraId = camera.id;
      const imageUrl = `https://tie.digitraffic.fi/api/weathercam/v1/stations/${cameraId}`;
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error("Error fetching the image data");
      }
      const imageData = await imageResponse.json();
      const cameraImage = imageData.properties.presets[0].imageUrl;
      const weatherStationId = imageData.properties.nearestWeatherStationId;
      const weatherUrl = `https://tie.digitraffic.fi/api/weather/v1/stations/${weatherStationId}/data`;
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error("Error fetching weather data");
      }
      const weatherData = await weatherResponse.json();
      const filterTmp = weatherData.sensorValues.filter(
        (sensor) => sensor.id === 1
      );
      const temperature = filterTmp.length > 0 ? filterTmp[0].value : null;
      const filterWind = weatherData.sensorValues.find(
        (sensor) => sensor.name === "KESKITUULI"
      );
      const wind = filterWind ? filterWind.value : null;
      const filterHumidity = weatherData.sensorValues.find(
        (sensor) => sensor.name === "ILMAN_KOSTEUS"
      );
      const humidity = filterHumidity ? filterHumidity.value : null;
      const filterRoadTmp = weatherData.sensorValues.find(
        (sensor) => sensor.name === "TIE_1"
      );
      const roadTmp = filterRoadTmp ? filterRoadTmp.value : null;
      const filterRainType = weatherData.sensorValues.find(
        (sensor) => sensor.name === "SATEEN_OLOMUOTO_PWDXX"
      );
      const rainType = filterRainType
        ? filterRainType.sensorValueDescriptionFi
        : null;
      const filterBlackIce = weatherData.sensorValues.find(
        (sensor) => sensor.name === "JÄÄN_MÄÄRÄ1"
      );
      const blackIce = filterBlackIce ? filterBlackIce.value : null;
      setBlackIce(blackIce);
      setRainType(rainType);
      setRoadTmp(roadTmp);
      setHumidity(humidity);
      setWind(wind);
      setTemperature(temperature);
      setCameraImg(cameraImage);
    } catch (error) {
      console.error("Error while fetching image", error);
      setCameraImg(null);
    }
  };
  /**Fetching data for camera stations, used to fetch coordinates and id for cameras*/
  async function fetchCameraData() {
    try {
      const response = await fetch(
        "https://tie.digitraffic.fi/api/weathercam/v1/stations"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch camera data");
      }
      const data = await response.json();
      if (Array.isArray(data.features)) {
        const cameraCoordinates = data.features
          .map((feature) => {
            if (
              feature.geometry &&
              Array.isArray(feature.geometry.coordinates)
            ) {
              const id = feature.id;
              const lng = feature.geometry.coordinates[0];
              const lat = feature.geometry.coordinates[1];
              return { id, lat, lng };
            }
            return null;
          })
          .filter((coordinate) => coordinate !== null);
        setCameraData(cameraCoordinates);
      } else {
        throw new Error("Camera data is not in the expected format");
      }
    } catch (error) {
      console.error("Error while fetching data", error);
    }
  }
  /**If map is not loaded, returns null */
  if (!isLoaded) {
    return null;
  }
  /**Calculates the route if both of the origin and destination values exist, uses the DirectionsService provided by Google,
   * clears previous route so only one route can be viewed at a time, also sets distance and duration for the created route.
   */
  async function calculateRoute() {
    if (!origRef.current || !destinationRef.current) return;
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    clearRoute();
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    setShowMarkers(true);
  }
  /**Clears the created route by setting the directionsResponse null and also setting other values to their original state. */
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setShowMarkers(false);
    setBlackIce(null);
  }

  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <div
          position={"absolute"}
          height={"100%"}
          width={"100%"}
          style={{ background: "white", padding: "20px 20px 20px 20px" }}
        >
          <div>
            {" "}
            {/**Input fields for origin and destination that both use Autocomplete feature provided by Google to help setting the end points for a route, also the buttons for
             * using calculateRoute, clearRoute and saveRoutes functions. Displays a warning for black ice when the api provides values over 0.0mm
             */}
            <Autocomplete>
              <input
                type="text"
                placeholder="Lähtöpaikka"
                ref={origRef}
                className="departure-holder"
              ></input>
            </Autocomplete>
            <Autocomplete>
              <input
                type="text"
                placeholder="Määränpää"
                ref={destinationRef}
                className="destination-holder"
              ></input>
            </Autocomplete>
            <button
              onClick={calculateRoute}
              className="calculateroute-button"
              type="submit"
            >
              Hae reitti
            </button>
            <button onClick={clearRoute} className="clearroute-button">
              Poista reitti
            </button>
            <button onClick={saveRoutes} className="saveroute-button">
              Tallenna reitti
            </button>
            <p style={{ color: "black" }}>
              Matka: {distance} &nbsp;&nbsp;&nbsp; Kesto: {duration}
            </p>
            {blackIce > 0 && (
              <div className="alert_ice">
                <p>⚠️Varoitus! Alueella saattaa olla mustaa jäätä!</p>
              </div>
            )}
          </div>
        </div>
        {/**GoogleMap component for displaying the map view, includes zooming, centering, style and control options and
         * some handling for loading the map and if the inputs use data from savedRoutes or whether they are to be used for creating new route.
         */}
        <GoogleMap
          zoom={7}
          center={
            mapLoaded
              ? clickedMarkerIndex !== null
                ? {
                    lat: cameraData[clickedMarkerIndex].lat,
                    lng: cameraData[clickedMarkerIndex].lng,
                  }
                : cameraInfoWindow
                  ? {
                      lat: cameraInfoWindow.lat,
                      lng: cameraInfoWindow.lng,
                    }
                  : currentMapCenter
              : startPos
          }
          mapId={"39f7e81720cbd140"}
          mapContainerStyle={{
            width: "75%",
            height: "75%",
            margin: "0 auto",
          }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            draggable: true,
          }}
          onLoad={(map) => {
            setMap(map);
            setMapLoaded(true);
            setCurrentMapCenter(startPos);
            if (
              origRef.current !== null &&
              destinationRef.current !== null &&
              origin &&
              destination
            ) {
              origRef.current.value = origin;
              destinationRef.current.value = destination;
              calculateRoute();
            }
          }}
          onClick={() => {
            setClickedMarkerIndex(null);
            setCameraInfoWindow(null);
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {/**Showing the markers for weather cameras according to the route and using distanceTreshold to determine the area on which the existing camera locations
           * are displayed on the map view. If the cameras are near the route it displays them with their own corresponding index value and position values, each marker
           * has handling for onClick which calls a function for handling the click and displaying InfoWindow components that display data provided by their own APIs.
           */}
          {showMarkers &&
            cameraData.map((camera, index) => {
              if (camera && camera.lat && camera.lng) {
                if (directionsResponse) {
                  const routePath = directionsResponse.routes[0].overview_path;
                  const distanceTreshold = 150;
                  const cameraPosition = new google.maps.LatLng(
                    camera.lat,
                    camera.lng
                  );
                  const nearRoute = routePath.some((routePoint) => {
                    const distance =
                      google.maps.geometry.spherical.computeDistanceBetween(
                        routePoint,
                        cameraPosition
                      );
                    return distance <= distanceTreshold;
                  });
                  if (nearRoute) {
                    return (
                      <Marker
                        key={index}
                        position={{ lat: camera.lat, lng: camera.lng }}
                        onClick={() => {
                          handleMarkerClick(index);
                        }}
                        options={{ icon: cameraMarker }}
                      ></Marker>
                    );
                  }
                }
              }
              return null;
            })}
          {clickedMarkerIndex !== null && (
            <InfoWindow
              position={{
                lat: cameraData[clickedMarkerIndex].lat,
                lng: cameraData[clickedMarkerIndex].lng,
              }}
              onCloseClick={(event) => {
                setCurrentMapCenter({
                  lat: cameraData[clickedMarkerIndex].lat,
                  lng: cameraData[clickedMarkerIndex].lng,
                });
                if (event) {
                  event.preventDefault();
                  event.stopPropagation();
                }
                setClickedMarkerIndex(null);
              }}
            >
              <div className="camera-info">
                <p>Kelikameran tiedot</p>
                {cameraImg && (
                  <img
                    src={cameraImg}
                    alt="Camera"
                    style={{ maxWidth: "600px" }}
                  ></img>
                )}
                {temperature && (
                  <p className="temperature">
                    <i className="fas fa-thermometer-half"></i>
                    Lämpötila:&nbsp;{temperature} °C
                  </p>
                )}
                {roadTmp && (
                  <p className="road-temperature">
                    <i className="fas fa-road"></i>
                    Tien lämpötila:&nbsp;{roadTmp} °C
                  </p>
                )}
                {wind && (
                  <p className="wind">
                    <i className="fas fa-wind"></i>
                    Keskituuli:&nbsp;{wind} m/s
                  </p>
                )}
                {humidity && (
                  <p className="humidity">
                    <i className="fas fa-tint"></i>
                    Ilmankosteus:&nbsp;{humidity} %
                  </p>
                )}
                {rainType && (
                  <p className="rain-type">
                    <i className="fas fa-cloud"></i>
                    Sateen tyyppi:&nbsp;{rainType}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        <Footer />
      </div>
    </>
  );
}

export default Maps;

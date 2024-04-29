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
const libraries = ["places"];

function Maps() {
  const startPos = { lat: 62.24147, lng: 25.72088 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCDnJR-bIPumZ0-YnP0atN5C8J-qxiuHPI",
    libraries: libraries,
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
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

  useEffect(() => {
    fetchCameraData();
  }, []);

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
      setTemperature(temperature);
      setCameraImg(cameraImage);
    } catch (error) {
      console.error("Error while fetching image", error);
      setCameraImg(null);
    }
  };

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

  if (!isLoaded) {
    return null;
  }

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

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setShowMarkers(false);
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
            <p style={{ color: "black" }}>
              Matka: {distance} &nbsp;&nbsp;&nbsp; Kesto: {duration}
            </p>
          </div>
        </div>
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
                  : startPos
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
          }}
          onClick={() => {
            setClickedMarkerIndex(null);
            setCameraInfoWindow(null);
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
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
              onCloseClick={() => setClickedMarkerIndex(null)}
            >
              <div>
                <p>Kelikameran tiedot</p>
                {cameraImg && (
                  <img
                    src={cameraImg}
                    alt="Camera"
                    style={{ maxWidth: "600px" }}
                  ></img>
                )}
                {temperature && <p>Lämpötila:&nbsp;{temperature} °C</p>}
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

"use client"

import {useRef, useState} from "react"
import {useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer,} from '@react-google-maps/api'
import {AdvancedMarker} from "@vis.gl/react-google-maps"
const libraries = ["places"]

function Maps() {
        const startPos = {lat: 62.24147, lng:25.72088}
        const {isLoaded} = useJsApiLoader({
            googleMapsApiKey:"AIzaSyCDnJR-bIPumZ0-YnP0atN5C8J-qxiuHPI",
            libraries: libraries,
        })

        const [map, setMap] = useState(/** @type google.maps.Map */(null))
        const [directionsResponse, setDirectionsResponse] = useState(null)
        const [distance, setDistance] = useState("")
        const [duration, setDuration] = useState("")
        const origRef = useRef(null)
        const destinationRef = useRef(null)


        if(!isLoaded) {
            return null
        }

        async function calculateRoute() {
            if(!origRef.current || !destinationRef.current) return
            const directionsService = new google.maps.DirectionsService()
            const results = await directionsService.route({
                origin: origRef.current.value,
                destination: destinationRef.current.value,
                travelMode: google.maps.TravelMode.DRIVING
            })
            clearRoute()
            setDirectionsResponse(results)
            setDistance(results.routes[0].legs[0].distance.text)
            setDuration(results.routes[0].legs[0].duration.text)

        }

        function clearRoute() {
            setDirectionsResponse(null)
            setDistance("")
            setDuration("")
        }

    return (
        <>
            <div style={{height: "100vh", width: "100%"}}>
                <div position={"absolute"} height={"100%"} width={"100%"} style={{background:"white", padding:"20px 20px 20px 20px"}}>
                    <div>
                        <Autocomplete>
                            <input type="text" placeholder="Lähtöpaikka" ref={origRef} style={{ marginRight:"20px", borderRadius:"20px", outline:"none", border:"1px solid black", background:"white", color:"black"}}></input>
                        </Autocomplete>
                        <Autocomplete>
                            <input type="text" placeholder="Määränpää" ref={destinationRef} style={{marginRight:"20px", borderRadius:"20px", outline:"none", border:"1px solid black", background:"white", color:"black"}}></input>
                        </Autocomplete>
                        <button onClick={calculateRoute} style={{background:"blue", borderRadius: "20px", border:"1px solid grey"}} type="submit">Hae reitti</button>
                        <button onClick={clearRoute} style={{background:"blue", borderRadius: "20px", border:"1px solid grey"}}>Poista reitti</button>
                        <p style={{color:"black"}}>Matka: {distance} </p>
                        <p style={{color:"black"}}>Kesto: {duration} </p>
                    </div>
                </div>
                <GoogleMap zoom={7} center={startPos} mapId={"39f7e81720cbd140"} mapContainerStyle={{ width: "100%", height: "100%" }} onLoad={map => setMap(map)}>
                    {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                </GoogleMap>
            </div>
        </>
    )
}

export default Maps
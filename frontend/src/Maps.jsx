"use client"

import {useState} from "react"
import {useJsApiLoader, GoogleMap, Marker, Autocomplete} from '@react-google-maps/api'

function Maps() {
        const startPos = {lat: 62.24147, lng:25.72088}
        const {isLoaded} = useJsApiLoader({
            googleMapsApiKey:"AIzaSyCDnJR-bIPumZ0-YnP0atN5C8J-qxiuHPI",
            libraries:["places"],
        })

        const [map, setMap] = useState((null))

        if(!isLoaded) {
            return null
        }

    return (
        <>
            <div style={{height: "100vh", width: "100%"}}>
                <div position={"absolute"} height={"100%"} width={"100%"} style={{background:"white", padding:"20px 20px 20px 20px"}}>
                    <div>
                        <Autocomplete>
                            <input type="text" placeholder="Lähtöpaikka" style={{ marginRight:"20px", borderRadius:"20px", outline:"none", border:"1px solid black", background:"white", color:"black"}}></input>
                        </Autocomplete>
                        <Autocomplete>
                            <input type="text" placeholder="Määränpää" style={{marginRight:"20px", borderRadius:"20px", outline:"none", border:"1px solid black", background:"white", color:"black"}}></input>
                        </Autocomplete>
                        <button color="blue" type="submit">Hae reitti</button>
                    </div>
                </div>
                <GoogleMap zoom={7} center={startPos} mapId={"39f7e81720cbd140"} mapContainerStyle={{width:"100%", height: "100%"}} onLoad={map => setMap(map)}>
                </GoogleMap>
            </div>
        </>
    )
}

export default Maps
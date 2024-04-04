import {Route, Routes} from "react-router-dom"
import Etusivu from "./Etusivu"
import Reitinvalinta from "./Reitinvalinta"
import Ohjeet from "./Ohjeet"
import Tuki from "./Tuki"

function PageRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Etusivu/>} />
            <Route path="Reitinvalinta" element={<Reitinvalinta/>} />
            <Route path="Ohjeet" element={<Ohjeet/>} />
            <Route path="Tuki" element={<Tuki/>} />
        </Routes>
    )
}

export default PageRoutes
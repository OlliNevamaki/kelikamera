import './App.css'
import Navigation from "./Navigation"
import PageRoutes from "./Routes"
import {BrowserRouter} from "react-router-dom"

function App() {
  return (
    <>
      <BrowserRouter>
        <Navigation/>
        <PageRoutes/>
      </BrowserRouter>
    </>
  )
}

export default App

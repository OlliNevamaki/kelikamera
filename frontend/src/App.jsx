import "./App.css";
import Navigation from "./Navigation";
import PageRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
/**Component that runs the routes and a navigation made for them in the app. */
function App() {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <PageRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;

import NavBar from "./NavBar";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Body from "./Body";
import Login from "./Login";
import Profile from "./Profile";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body/>}> {/* This is Parent Route */}
            <Route path="/login" element = {<Login/>}/>
            <Route path="/profile" element = {<Profile/>}/> {/* These are Child Routes and should be rendered with help of <Outlet/> */}
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;

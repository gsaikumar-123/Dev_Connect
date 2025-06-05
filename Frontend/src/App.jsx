import NavBar from "./components/NavBar";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import {Provider} from "react-redux"
import appStore from "./utils/appStore";

function App() {
  return (
    <>
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body/>}> {/* This is Parent Route */}
            <Route path="/user/feed" element = {<Feed/>}/>
            <Route path="/login" element = {<Login/>}/>
            <Route path="/profile" element = {<Profile/>}/> {/* These are Child Routes and should be rendered with help of <Outlet/> */}
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
    </>
  )
}

export default App;

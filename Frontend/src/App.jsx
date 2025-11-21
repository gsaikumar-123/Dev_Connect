import NavBar from "./components/NavBar";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import UserProfilePage from "./components/UserProfilePage";
import Feed from "./components/Feed";
import {Provider} from "react-redux";
import appStore from "./utils/appStore";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import SearchResults from "./components/SearchResults";
import ChatPage from "./components/ChatPage";
import Landing from "./components/Landing";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function ThemeProvider({ children }) {
  const themeMode = useSelector(store => store.theme.mode);

  useEffect(() => {
    // Ensure theme class & persistence
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (themeMode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', themeMode);
    }
  }, [themeMode]);

  return children;
}

function App() {
  return (
    <>
    <Provider store={appStore}>
      <ThemeProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/" element={<Body/>}> 
              <Route path="/user/feed" element = {<Feed/>}/>
              <Route path="/login" element = {<Login/>}/>
              <Route path="/profile" element = {<Profile/>}/>
              <Route path="/user/profile" element={<UserProfilePage/>}/>
              <Route path="/connections" element = {<Connections/>}/>
              <Route path="/requests" element = {<Requests/>}/>
              <Route path="/search/:query" element = {<SearchResults/>}/>
              <Route path="/chat" element={<ChatPage/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
    </>
  )
}

export default App;

import "./App.css";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import EmptyChat from "./components/EmptyChat";
import { useStateValue } from "./StateProvider";
import { useEffect } from "react";
import { auth } from "./config/firebase";
import { actionTypes } from "./reducer";

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: actionTypes.SET_USER,
          user: user,
        });
      }
    });
  }, []);

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div className="app_body">
          <Router>
            <Sidebar />
            <Switch>
              <Route path="/rooms/:roomId" exact>
                <Chat />
              </Route>
              <Route path="/" exact>
                <Chat />
              </Route>
              {/* <Route path="/profile" exact>

              </Route> */}
              <Route path="/emptyChat" exact>
                <EmptyChat />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;

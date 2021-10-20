import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Welcome from "./components/Welcome/Welcome";
import GameScreenList from "./components/GameScreenList/GameScreenList";
import GameScreenForm from "./components/GameScreenForm/GameScreenForm";
import Navbar from "./components/Navbar/Navbar";
import AdminProvider from "../src/context/Context";

function App() {
  return (
    <AdminProvider>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/">
              <Navbar />
              <Welcome />
            </Route>
            <Route exact path="/:id">
              <Navbar />
              <GameScreenForm />
            </Route>
            <Route exact path="/game/:id">
              <GameScreenList />
            </Route>
          </Switch>
        </Router>
      </div>
    </AdminProvider>
  );
}

export default App;

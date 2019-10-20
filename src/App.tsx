import React from "react";
import "./App.less";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Panel } from "./ManagerPanel/Panel";

const App = () => {
  return (
    <Router>
      <Panel />
    </Router>
  );
};

export default App;

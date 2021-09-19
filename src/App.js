//import Editor from "./components/Editor";
import React from "react";
import allReducers from "./redux/reducers";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import HomePage from "./components/HomePage";
import CollabEditorParamChecker from "./components/CollabEditorParamChecker";

function App() {
  console.error = () => {};
  return (
    <Provider store={createStore(allReducers)}>
      <Router>
        <Switch>
          <Route path="/editor">
            <CollabEditorParamChecker />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;

//import Editor from "./components/Editor";
import CollabEditor from "./components/CollabEditor";
import allReducers from "./redux/reducers";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import HomePage from "./components/HomePage";

function App() {
  console.error = () => {};
  return (
    <Provider store={createStore(allReducers)}>
      <Router>
        <Switch>
          <Route path="/editor">
            <CollabEditor />
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

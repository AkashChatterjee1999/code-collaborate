//import Editor from "./components/Editor";
import CollabEditor from "./components/CollabEditor";
import allReducers from "./redux/reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";

function App() {
  console.error = () => {};
  return (
    <Provider store={createStore(allReducers)}>
      <CollabEditor />
    </Provider>
  );
}

export default App;

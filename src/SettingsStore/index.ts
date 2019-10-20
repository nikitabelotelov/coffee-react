import { createStore } from "redux";
import rootReducer from "../reducers/index";
import { init } from "../actions/websockets";
const store = createStore(rootReducer);
init(store);
export default store;
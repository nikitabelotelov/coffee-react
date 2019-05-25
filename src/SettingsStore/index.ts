import { createStore } from "redux";
import settingsReducer from "../reducers/index";
const store = createStore(settingsReducer);
export default store;
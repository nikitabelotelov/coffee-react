import {connect} from "react-redux";
import ProfileView from "./ProfileView";
import { IAppState } from "../reducers";

const mapStateToProps = (state:IAppState) => {
    return {...state};
}

const Profile = connect(mapStateToProps)(ProfileView);

export default Profile;
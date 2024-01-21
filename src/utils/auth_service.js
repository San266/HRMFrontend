import Cookies from 'js-cookie'
import configData from './../config/constant.json'
import secureLocalStorage from "react-secure-storage";
// import { Navigation } from '@coreui/coreui';

let logoutUser = () => {
    console.log("logoutUser");
    Cookies.remove('jwt', { path: '/', domain: configData.DOMAIN })
    secureLocalStorage.clear();
    // Navigation.navigate('/auth/login');
}

let isAuthenticated = () => {
    let userRoles = secureLocalStorage.getItem("userRoles");
    let token = secureLocalStorage.getItem("token");

    console.log("userRoles", userRoles);
    console.log("token", token);

    if (userRoles) {
        return true;
    }

    logoutUser();

    return false;
}



export { isAuthenticated, logoutUser };
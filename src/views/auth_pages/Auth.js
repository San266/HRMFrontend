import { BrowserRouter as Router, Route, Switch,Redirect } from "react-router-dom";
import Login from "./login/Login";
import Register from "./register/Register";
import Page404 from "../pages/page404/Page404";
import { isAuthenticated } from "src/utils/auth_service";
const AuthIndex = () => {
    console.log("isAuthenticated",isAuthenticated());
    if(isAuthenticated()){
        // redirect to dasbboard path : pages/Dashboard/dashboard
        return <Redirect to='/pages/' />
    } else {
        return (
       
                <Route
                        path="/auth"
                        render={({ match: { url } }) =>
                        (
                            <Switch>
                                <Route path={`${url}/`} component={Login} exact />
                                <Route path={`${url}/login`} component={Login} exact />
                                <Route path={`${url}/register`} component={Register} />
                                <Route path={`${url}/*`} component={Page404} />
                            </Switch>
                        )
                        }
                    />
 
        );
    }
    
}

export default AuthIndex;
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Page404 from "../page404/Page404";
import dashboard from "../Dashboard/dashboard";

const analytics_routes = () => {
    const { url } = useRouteMatch();
    console.log("url", url);
    return (
        <>
            <Switch>
                <Route path={`${url}/`} exact component={dashboard} />
                {/* <Route path={`${url}/`} exact component={Analytics} />
                <Route path={`${url}/insitute`} component={Institute} />
                <Route path={`${url}/course`} component={Course} />
                <Route path={`${url}/batch`} component={Batch} />
                <Route path={`${url}/users`} component={Users} />
                <Route path={`${url}/user_analytics`} component={UserAnalytics} />
                <Route path={`${url}/revenue`} component={Revenue} />
                <Route path={`${url}/referedBy`} component={ReferedBy} /> */}
                <Route path={`${url}/*`} exact component={Page404} />
            </Switch>
        </>

    );
}

export default analytics_routes;
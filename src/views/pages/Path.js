import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Page404 from "./page404/Page404";
import { AppSidebar, AppHeader, AppFooter } from "src/components";
import { isAuthenticated } from '../../utils/auth_service'
import hrmRoutes from "./HRMroutes/routesPages";
import secureLocalStorage from "react-secure-storage";
import employee from "./Employee/employee";
import department from "./Department/department";
import branch from "./Branch/branch";
import designation from "./Designation/designation";
import employeeProfile from "./Staff/employeeProfile";
import employeeDetail from "./Staff/employeeDetails";
import meeting from "./Meeting/meeting";
import companyPolicy from "./CompanyPolicy/companyPolicy";
import awardType from "./AwardType/awardType";
import awards from "./Awards/awards";
import timesheet from "./TimeSheet/timesheet";
import leave from "./Leave/leave";
import leaveType from "./LeaveType/leaveType";


const PagesIndex = () => {
    let userRoles = secureLocalStorage.getItem("userRoles");

    console.log("Is Authenticated", isAuthenticated());

    if (isAuthenticated()) {
        return (
            <div>
                <AppSidebar />
                <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                    <AppHeader />
                    <div className="body flex-grow-1 px-3">
                        <Route
                            path="/pages"
                            render={({ match: { url } }) =>
                            (
                                <Switch>
                                    <Route path={`${url}/`} component={hrmRoutes} exact />
                                    <Route path={`${url}/employee`} component={employee} />
                                    <Route path={`${url}/department`} component={department} />
                                    <Route path={`${url}/branch`} component={branch} />
                                    <Route path={`${url}/designation`} component={designation} />
                                    <Route path={`${url}/employeeProfile`} component={employeeProfile} />
                                    <Route path={`${url}/employeeDetail`} component={employeeDetail} />
                                    <Route path={`${url}/meeting`} component={meeting} />
                                    <Route path={`${url}/companyPolicy`} component={companyPolicy} />
                                    <Route path={`${url}/awardType`} component={awardType} />
                                    <Route path={`${url}/awards`} component={awards} />
                                    <Route path={`${url}/timesheet`} component={timesheet} />
                                    <Route path={`${url}/leave`} component={leave} />
                                    <Route path={`${url}/leaveType`} component={leaveType} />

                                </Switch>
                            )
                            }
                        />
                    </div>
                    <AppFooter />
                </div>
            </div>
        )
    } else {
        return (
            <Router>
                <Switch>
                    <Route path="/pages" component={Page404} />
                    <Redirect from="/" to="/auth/login" />
                </Switch>
            </Router>
        )
    }
}

export default PagesIndex;
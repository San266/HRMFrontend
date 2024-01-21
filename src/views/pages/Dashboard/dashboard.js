import { CButton, CCard, CCardBody, CCardTitle } from '@coreui/react'
import React from 'react'
import Toaster from 'src/views/shared/Toaster';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import LoadingScreen from 'src/views/shared/Loading';
import { logoutUser } from 'src/utils/auth_service';
import { Button } from '@coreui/coreui';

export default function dashboard() {

  const [toast, addToast] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [attendanceData, setAttendanceData] = React.useState([]);
  const [meetings, setMeetings] = React.useState([]);
  const [role, setRole] = React.useState(secureLocalStorage.getItem("userRoles"));
  const [attendance, setAttendance] = React.useState(false);

  // Function to Add Toaster
  let addToaster = (toast) => {
    addToast(toast)
    setTimeout(() => {
      addToast(false)
    }, 3000)
  }

  React.useEffect(async () => {
    try {
      const token = secureLocalStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/v1/employee/getClockInOutForToday`, { withCredentials: true },)

      if (response.data.status == false) {
        throw Error(response.data.message);
      }
      setAttendanceData(response.data.data)
      getAttendance();
      setLoading(false)


    } catch (error) {
      console.log(`Error : ${error}`);
      if (error.response.data.status === 401 || error.response.data.status === 500) {
        // redirect to login page if user is not authenticated or token expired
        logoutUser();
      } else {
        // Handle other errors
        let toast = {
          status: false,
          body: "An error occurred while fetching attendance data",
          message: "Failed",
        };
        addToaster(toast);
      }
    }
  }, []);

  const getAttendance = async () => {
    try {
      const token = secureLocalStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/v1/user/allUsersattendance`, { withCredentials: true },
        {
          headers: { Authorization: `Bearer ${token}` }
        });

      if (response.data.status == false) {
        throw Error(response.data.message);
      }
      console.log("Attendance Data --->", response.data.data);
      setAttendance(response.data.data)
      setLoading(false)

    } catch (error) {
      console.log(`Error : ${error}`);
      if (error.response.data.status === 401 || error.response.data.status === 500) {
        // redirect to login page if user is not authenticated or token expired
        logoutUser();
      } else {
        // Handle other errors
        let toast = {
          status: false,
          body: "An error occurred while fetching attendance data",
          message: "Failed",
        };
        addToaster(toast);
      }
    }
  }


  const getMeetings = async () => {
    try {
      const token = secureLocalStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/v1/meeting/getAllMeetings`, { withCredentials: true },
        {
          headers: { Authorization: `Bearer ${token}` }
        })

      if (response.data.status == false) {
        throw Error(response.data.message);
      }
      setMeetings(response.data.data)
      setLoading(false)

    } catch (error) {
      console.log(`Error : ${error}`);
      if (error.response.data.status === 401 || error.response.data.status === 500) {
        // redirect to login page if user is not authenticated or token expired
        logoutUser();
      } else {
        // Handle other errors
        let toast = {
          status: false,
          body: "An error occurred while fetching meeting data",
          message: "Failed",
        };
        addToaster(toast);
      }
    }
  }


  const handleClockIn = async () => {
    try {
      const token = secureLocalStorage.getItem("token");
      const response = await axios.post(`http://localhost:5000/api/v1/employee/clockIn`, { withCredentials: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

      console.log("response", response);
      if (response.data.status == false) {
        throw Error(response.data.message);
      }
      console.log("Data --->", response.data.data);
      setAttendanceData({
        ...attendanceData,
        alreadyClockedIn: response.data.data
      });
      setLoading(false)

      let toast = {
        "status": true,
        "body": "Attendance Marked Successfully",
        "message": "Success"
      }
      addToaster(toast)

    } catch (error) {
      console.log(`Error : ${error.response.data.status}`);

      // Check if the error is due to already clocked in
      if (error.response.data.status === 403) {
        let toast = {
          status: false,
          body: error.response.data.message,
          message: "Failed",
        };
        addToaster(toast);
      } else {
        // Handle other errors
        let toast = {
          status: false,
          body: "An error occurred while marking attendance",
          message: "Failed",
        };
        addToaster(toast);
      }
    }
  }

  const handleClockOut = async () => {
    try {
      const token = secureLocalStorage.getItem("token");
      const response = await axios.post(`http://localhost:5000/api/v1/employee/clockOut`, { withCredentials: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

      if (response.data.status == false) {
        throw Error(response.data.message);
      }

      setAttendanceData({
        ...attendanceData,
        alreadyClockedIn: response.data.data
      });
      setLoading(false)

      let toast = {
        "status": true,
        "body": "Attendance Marked Successfully",
        "message": "Success"
      }
      addToaster(toast)

    } catch (error) {
      console.log(`Error : ${error.response.data.status}`);

      // Check if the error is due to already clocked in
      if (error.response.data.status === 403) {
        let toast = {
          status: false,
          body: error.response.data.message,
          message: "Failed",
        };
        addToaster(toast);
      } else {
        // Handle other errors
        let toast = {
          status: false,
          body: "An error occurred while marking attendance",
          message: "Failed",
        };
        addToaster(toast);
      }
    }
  }


  return (
    <div >
      {
        loading && <LoadingScreen></LoadingScreen>
      }

      <div className="col-lg-6">
        <CCard>
          <div className="card-header">
            <CCardTitle>
              <h4>Mark Attendance</h4>
            </CCardTitle>
          </div>
          <CCardBody className="dash-card-body">
            <p className="text-muted pb-0-5">
              My Office Time: 10:00 AM - 05:00 PM
            </p>
            <center>
              <div className="row">
                <div className="float-right border-right">
                  <form action="attendanceemployee/attendance" method="post">

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <CButton color='primary' variant="outline"
                        onClick={handleClockIn}
                      >
                        CLOCK IN
                      </CButton>

                      <CButton color='primary' variant="outline"
                        onClick={handleClockOut} >
                        Clock Out
                      </CButton>
                    </div>
                  </form>
                </div>
              </div>
            </center>
          </CCardBody>
        </CCard>


      </div>
      {

        role === "ADMIN" &&


        // Create a Small Table to Show if the absent employee is on leave or not
        <div className="col-lg-6" style={{ marginTop: '20px' }}>
        <CCard>
          <div className="card-header">
            <CCardTitle>
              <h4>Attendance</h4>
            </CCardTitle>
          </div>
          <CCardBody className="dash-card-body">
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}> {/* Set max height and overflowY for scrollability */}
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Employee Name</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance &&
                    attendance.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{data.name}</td>
                          <td>
                            <span
                              style={{
                                backgroundColor: 'red',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              {data.attendance}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CCardBody>
        </CCard>
      </div>
      
      }

      {
        toast && <Toaster message={toast.message} status={toast.status} body={toast.body} ></Toaster>
      }
    </div>
  )
}

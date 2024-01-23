import { CCardBody, CModalHeader, CModal, CModalTitle, CModalBody, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CInputGroup, CCol, CCard, CButton, CModalFooter, CCardTitle, CFormCheck, CFormSelect, CCardHeader } from '@coreui/react'
import React from 'react'
import Toaster from 'src/views/shared/Toaster';
import LoadingScreen from 'src/views/shared/Loading';
import { Formik } from "formik";
import * as yup from 'yup';
import configData from "../../../config/constant.json";
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { logoutUser } from 'src/utils/auth_service';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import moment from 'moment/moment';

const meeting = () => {

    const [meetingData, setMeetingData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [meetingAddModal, setMeetingAddModal] = React.useState(false);
    const [meetingEditModal, setMeetingEditModal] = React.useState(false);
    const [editMeetingData, setEditMeetingData] = React.useState({});
    const [branch, setBranch] = React.useState([]);
    const [department, setDepartment] = React.useState([]);
    const [employee, setEmployee] = React.useState([]);
    const [addToast, setAddToast] = React.useState(false);


    // Function to Add Toaster
    let addToaster = (toast) => {
        setAddToast(toast);
        setTimeout(() => {
            setAddToast(false)
        }, 3000)
    }

    // Function to get all meetings
    const getAllMeetings = async () => {
        try {
            const response = await axios.get(`${configData.SERVER_URL}/meeting/getAllMeetings`, { withCredentials: true },)
            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            console.log("meeting data", response.data.data);
            setMeetingData(response.data.data)
            setLoading(false)
        } catch (error) {
            console.log(`Error : ${error}`);
            if (error.response.data.status === 401) {
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

    // Function to get all branches
    const getAllBranches = async () => {
        try {
            const response = await axios.get(`${configData.SERVER_URL}/branch/getAllBranches`, { withCredentials: true },)
            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            setBranch(response.data.data)
            setLoading(false)
        } catch (error) {
            console.log(`Error : ${error}`);
            if (error.response.data.status === 401 || error.response.data.status === 500) {
                // redirect to login page if user is not authenticated or token expired
                // logoutUser();
            } else {
                // Handle other errors
                let toast = {
                    status: false,
                    body: "An error occurred while fetching branch data",
                    message: "Failed",
                };
                addToaster(toast);
            }
        }
    }

    const handleFetchDepatmentByBranchId = async (branchId) => {
        try {

            let token = secureLocalStorage.getItem("token");

            let response = await axios.get(`${configData.SERVER_URL}/department/getAllDepartmentsByBranchId/${branchId}`, { withCredentials: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            console.log("response", response.data.data);
            setDepartment(response.data.data);


        } catch (error) {
            console.log("error", error);
        }
    }

    const handleEmployeesByBranchAndDepartmentId = async (branchIdsArray, departmentsArray) => {
        try {
            console.log("branchIdsArray", branchIdsArray, "departmentsArray", departmentsArray);
            let token = secureLocalStorage.getItem("token");

            let response = await axios.get(`${configData.SERVER_URL}/employee/getEmployeeByBranchIdsAndDepartmentIds?branchIds=${branchIdsArray}&departmentIds=${departmentsArray}`, { withCredentials: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            console.log("response", response.data.data);
            setEmployee(response.data.data);

        } catch (error) {
            console.log("error", error);
        }
    }

    React.useEffect(() => {
        getAllMeetings();
        getAllBranches();
    }, []);

    // Function to delete meeting
    const handleDeleteMeeting = async (meetingId) => {
        try {
            const response = await axios.post(`${configData.SERVER_URL}/meeting/deleteMeeting/${meetingId}`, { withCredentials: true },)

            setMeetingData(meetingData.filter((item) => item.id !== meetingId))
            setLoading(false)
            let toast = {
                status: true,
                body: response.data.message,
                message: "Success",
            };
            addToaster(toast);
        } catch (error) {
            console.log(`Error : ${error}`);
            if (error.response.data.status === 401 || error.response.data.status === 500) {
                // redirect to login page if user is not authenticated or token expired
                // logoutUser();
            } else {
                // Handle other errors
                let toast = {
                    status: false,
                    body: "An error occurred while deleting meeting data",
                    message: "Failed",
                };
                addToaster(toast);
            }
        }
    }

    return (
        <div>
            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Employee</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    <CButton color="primary" style={{ float: "right" }} onClick={() => {
                                        setMeetingAddModal(true);
                                        console.log("meeting data", meetingData);
                                    }}>Add Meeting</CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Show table for meetings */}
            {
                loading ? <LoadingScreen /> :

                    <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                        <CCardBody>
                            <table className="table table-hover table-outline mb-0 d-none d-sm-table table-bordered text-center" >
                                <thead className="table1header">
                                    <tr>
                                        <th scope="col">Meeting Name</th>
                                        <th scope="col">Meeting Date</th>
                                        <th scope="col">Meeting Time</th>
                                        <th scope="col">Meeting Description</th>
                                        <th scope="col">Meeting Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {meetingData.map((item, i) => {
                                        const meetingDateTime = new Date(item.meetingDate); // Just using the meetingDate as it includes both date and time
                                        meetingDateTime.setHours(
                                            parseInt(item.meetingTime.split(":")[0]), // Extracting hours from meetingTime
                                            parseInt(item.meetingTime.split(":")[1]), // Extracting minutes from meetingTime
                                            parseInt(item.meetingTime.split(":")[2]) || 0 // Extracting seconds from meetingTime (if available)
                                        );

                                        const currentDateTime = new Date();

                                        const isMeetingUpcoming = meetingDateTime > currentDateTime;
                                        const color = isMeetingUpcoming ? "green" : "red";

                                        return (
                                            <tr key={i}>
                                                <td>{item.meetingName}</td>
                                                <td>{moment(item.meetingDate).format("DD-MM-YYYY")}</td>
                                                <td>{moment(item.meetingTime, "HH:mm:ss").format("hh:mm A")}</td>
                                                <td>{item.meetingDescription}</td>
                                                <td style={{ color }}>
                                                    {isMeetingUpcoming ? "Upcoming" : "Completed"}
                                                </td>
                                                <td>
                                                    <CButton color="primary" onClick={() => {
                                                        setMeetingEditModal(true);
                                                        setEditMeetingData(item);
                                                    }}>Edit</CButton>
                                                    <CButton color="danger" style={{ marginLeft: "10px" }} onClick={() => {
                                                        handleDeleteMeeting(item.id);
                                                    }}>Delete</CButton>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                            </table>
                        </CCardBody>
                    </CCard>

            }
            {/* Add Meeting Modal */}
            <CModal
                visible={meetingAddModal}
                onClose={() => setMeetingAddModal(false)}
                color="primary"
                size="lg"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Add Meeting</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik
                        initialValues={{
                            branchId: "",
                            departmentId: "",
                            employeeId: "",
                            meetingName: "",
                            meetingDate: "",
                            meetingTime: "",
                            meetingDescription: ""
                        }}
                        onSubmit={async (values) => {
                            try {

                                setLoading(true)
                                const response = await axios.post(`${configData.SERVER_URL}/meeting/addMeeting`, values, { withCredentials: true },)
                                if (response.data.status == false) {
                                    throw Error(response.data.message);
                                }
                                console.log("meeting data", response.data.data);
                                setMeetingData([...meetingData, response.data.data])
                                setLoading(false)
                                setMeetingAddModal(false);
                                let toast = {
                                    status: true,
                                    body: response.data.message,
                                    message: "Success",
                                };
                                addToaster(toast);
                            } catch (error) {
                                console.log(`Error : ${error}`);
                                // Handle other errors
                                let toast = {
                                    status: false,
                                    body: "An error occurred while adding meeting data",
                                    message: "Failed",
                                };
                                addToaster(toast);

                            }
                        }}
                        validationSchema={yup.object().shape({
                            branchId: yup.string().required("Branch is Required"),
                            departmentId: yup.string().required("Department is Required"),
                            employeeId: yup.string().required("Employee is Required"),
                            meetingName: yup.string().required("Meeting Name is Required"),
                            meetingDate: yup.string().required("Meeting Date is Required"),
                            meetingTime: yup.string().required("Meeting Time is Required"),
                            meetingDescription: yup.string().required("Meeting Description is Required"),
                        })}
                    >
                        {(props) => (
                            <CForm onSubmit={props.handleSubmit}>

                                <CRow>
                                    <CCol sm="6">
                                        <CFormLabel>Branch</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormSelect
                                                type="text"
                                                placeholder="Branch"
                                                name="branchId"
                                                onChange={(e) => {
                                                    console.log("e.target.value", e.target.value);
                                                    const value = e.target.value;
                                                    if (value === "all") {
                                                        props.setFieldValue("branchId", value);
                                                        return;
                                                    } else {
                                                        props.setFieldValue("branchId", value);
                                                        handleFetchDepatmentByBranchId(value);
                                                    }
                                                }}
                                                onBlur={props.handleBlur}
                                                value={
                                                    // If all branches are selected, set value to "all", otherwise set it to props.values.branchIds
                                                    props.values.branchId.length === branch.length ? "all" : props.values.branchId
                                                }
                                            >
                                                <option value="">Select Branch</option>
                                                <option value="all">All Branches</option>

                                                {branch.map((item, i) => {
                                                    return (

                                                        <option key={i} value={item.id}>{item.branchName}</option>

                                                    )
                                                })}
                                            </CFormSelect>
                                        </CInputGroup>
                                        {props.touched.branchId && props.errors.branchId && (
                                            <div className="errorMsg" style={{
                                                color: "red", fontSize: "12px", marginTop: "5px", textAlign: "left"
                                            }} >{props.errors.branchId}</div>
                                        )}
                                    </CCol>
                                    <CCol sm="6">
                                        <CFormLabel>Department</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            {/* If branches is selected as "All Branches", then all departments will be selected by default and user will not be able to change it. */}

                                            <CFormSelect
                                                type="text"
                                                placeholder="Department"
                                                name="departmentId"
                                                onChange={(e) => {
                                                    console.log("e.target.value", e.target.value);
                                                    const value = e.target.value;
                                                    if (value === "all") {
                                                        props.setFieldValue("departmentId", value);
                                                        return;
                                                    } else {
                                                        props.setFieldValue("departmentId", value);
                                                        handleFetchDepatmentByBranchId(value);
                                                    }
                                                }}
                                                onBlur={props.handleBlur}
                                                value={
                                                    // If all branches are selected, set value to "all", otherwise set it to props.values.branchIds
                                                    props.values.departmentId === "all" ? "all" : props.values.departmentId
                                                }
                                                disabled={
                                                    // If no branch is selected, disable the department dropdown
                                                    props.values.branchId.length === 0
                                                }
                                            >
                                                <option value="">Select Department</option>
                                                <option value="all">All Departments</option>

                                                {department.map((item, i) => {
                                                    return (

                                                        <option key={i} value={item.id}>{item.departmentName}</option>

                                                    )
                                                })}
                                            </CFormSelect>
                                        </CInputGroup>
                                        {props.touched.departmentId && props.errors.departmentId && (
                                            <div className="errorMsg" style={{
                                                color: "red", fontSize: "12px", marginTop: "5px", textAlign: "left"
                                            }}>{props.errors.departmentId}</div>
                                        )}

                                    </CCol>
                                </CRow>

                                <CRow>
                                    <CCol sm="6">
                                        <CFormLabel>Employee</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormSelect
                                                type="text"
                                                placeholder="Employee"
                                                name="employeeId"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === "all") {
                                                        props.setFieldValue("employeeId", value);
                                                        return;
                                                    } else {
                                                        props.setFieldValue("employeeId", value);
                                                    }
                                                }}
                                                onBlur={props.handleBlur}
                                                value={props.values.employeeId === "all" ? "all" : props.values.employeeId}
                                                disabled={
                                                    // if no branch and department is selected, disable the employee dropdown
                                                    props.values.branchId.length === 0 || props.values.departmentId.length === 0
                                                }
                                            >
                                                <option value="">Select Employee</option>
                                                <option value="all">All Employees</option>
                                                {
                                                    employee.map((item, i) => {

                                                        return (

                                                            <option key={i} value={item.id}>{item.name}</option>

                                                        )
                                                    })}
                                            </CFormSelect>

                                        </CInputGroup>
                                        {props.touched.employeeId && props.errors.employeeId && (
                                            <div className="errorMsg">{props.errors.employeeId}</div>
                                        )}
                                    </CCol>
                                    <CCol sm="6">
                                        <CFormLabel>Meeting Name</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="Meeting Name"
                                                name="meetingName"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.meetingName}
                                            />

                                        </CInputGroup>
                                        {props.touched.meetingName && props.errors.meetingName && (
                                            <div className="errorMsg">{props.errors.meetingName}</div>
                                        )}
                                    </CCol>
                                </CRow>

                                <CRow>

                                    <CCol sm="6">
                                        <CFormLabel>Meeting Date</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="date"
                                                placeholder="Meeting Date"
                                                name="meetingDate"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.meetingDate}
                                                min={moment().format("YYYY-MM-DD")}
                                                max={moment().add(1, "year").format("YYYY-MM-DD")}
                                            />
                                        </CInputGroup>
                                        {props.touched.meetingDate && props.errors.meetingDate && (
                                            <div className="errorMsg">{props.errors.meetingDate}</div>
                                        )}
                                    </CCol>


                                    <CCol sm="6">
                                        <CFormLabel>Meeting Time</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="time"
                                                placeholder="Meeting Time"
                                                name="meetingTime"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.meetingTime}
                                            />
                                        </CInputGroup>
                                        {props.touched.meetingTime && props.errors.meetingTime && (
                                            <div className="errorMsg">{props.errors.meetingTime}</div>
                                        )}
                                    </CCol>

                                </CRow>

                                <CRow>
                                    <CCol sm="12">
                                        <CFormLabel>Meeting Description</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormTextarea
                                                type="text"
                                                placeholder="Meeting Description"
                                                name="meetingDescription"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.meetingDescription}
                                                rows="5"
                                            />
                                        </CInputGroup>
                                        {props.touched.meetingDescription && props.errors.meetingDescription && (
                                            <div className="errorMsg" style={{
                                                color: "red",
                                                fontSize: "12px",
                                                marginTop: "5px",
                                                textAlign: "left"
                                            }} >{props.errors.meetingDescription}</div>
                                        )}
                                    </CCol>
                                </CRow>



                                {/* // footer of modal */}
                                <CModalFooter>
                                    <CButton color="primary" type="submit">Add Meeting</CButton>{' '}
                                    <CButton color="secondary" onClick={() => setMeetingAddModal(false)}>Cancel</CButton>
                                </CModalFooter>
                            </CForm>
                        )}
                    </Formik>
                </CModalBody>
            </CModal>

            {/* Edit Meeting Modal */}
            <CModal
                visible={meetingEditModal}
                onClose={() => setMeetingEditModal(false)}
                color="primary"
                size="lg"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Edit Meeting</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik
                        initialValues={{
                            branchId: editMeetingData.branchId,
                            departmentId: editMeetingData.departmentId,
                            employeeId: editMeetingData.employeeId,
                            meetingName: editMeetingData.meetingName,
                            meetingDate: editMeetingData.meetingDate,
                            meetingTime: editMeetingData.meetingTime,
                            meetingDescription: editMeetingData.meetingDescription
                        }}
                        onSubmit={async (values) => {
                            try {

                                setLoading(true)
                                const response = await axios.post(`${configData.SERVER_URL}/meeting/updateMeeting/${editMeetingData.id}`, values, { withCredentials: true },)
                                if (response.data.status == false) {
                                    throw Error(response.data.message);
                                }
                                console.log("meeting data", response.data.data);
                                setMeetingData([...meetingData, response.data.data])
                                setLoading(false)
                                setMeetingEditModal(false);
                                let toast = {
                                    status: true,
                                    body: response.data.message,
                                    message: "Success",
                                };
                                addToaster(toast);
                            } catch (error) {
                                console.log(`Error : ${error}`);
                                // Handle other errors
                                let toast = {
                                    status: false,
                                    body: "An error occurred while updating meeting data",
                                    message: "Failed",
                                };
                                addToaster(toast);

                            }
                        }}
                        validationSchema={yup.object().shape({
                            branchId: yup.string().required("Branch is Required"),
                            departmentId: yup.string().required("Department is Required"),
                            employeeId: yup.string().required("Employee is Required"),
                            meetingName: yup.string().required("Meeting Name is Required"),
                            meetingDate: yup.string().required("Meeting Date is Required"),
                            meetingTime: yup.string().required("Meeting Time is Required"),
                            meetingDescription: yup.string().required("Meeting Description is Required"),
                        })}
                    >
                        {(props) => (
                            <CForm onSubmit={props.handleSubmit}>

                                <CRow>
                                    <CCol sm="6">
                                        <CFormLabel>Branch</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormSelect
                                                type="text"
                                                placeholder="Branch"
                                                name="branchId"
                                                onChange={(e) => {
                                                    console.log("e.target.value", e.target.value);
                                                    const value = e.target.value;
                                                    if (value === "all") {
                                                        props.setFieldValue("branchId", value);
                                                        return;
                                                    } else {
                                                        props.setFieldValue("branchId", value);
                                                        handleFetchDepatmentByBranchId(value);
                                                    }
                                                }}
                                                onBlur={props.handleBlur}
                                                value={
                                                    props.values.branchId === "all" ? "all" : props.values.branchId
                                                }
                                            >
                                                <option value="">Select Branch</option>
                                                <option value="all">All Branches</option>

                                                {branch.map((item, i) => {
                                                    return (

                                                        <option key={i} value={item.id}>{item.branchName}</option>

                                                    )
                                                })}
                                            </CFormSelect>
                                        </CInputGroup>
                                        {props.touched.branchId && props.errors.branchId && (
                                            <div className="errorMsg" style={{
                                                color: "red", fontSize: "12px", marginTop: "5px", textAlign: "left"
                                            }} >{props.errors.branchId}</div>
                                        )}
                                    </CCol>
                                    <CCol sm="6">
                                        <CFormLabel>Department</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            {/* If branches is selected as "All Branches", then all departments will be selected by default and user will not be able to change it. */}

                                            <CFormSelect
                                                type="text"
                                                placeholder="Department"
                                                name="departmentId"
                                                onChange={(e) => {
                                                    console.log("e.target.value", e.target.value);
                                                    const value = e.target.value;
                                                    if (value === "all") {
                                                        props.setFieldValue("departmentId", value);
                                                        return;
                                                    } else {
                                                        props.setFieldValue("departmentId", value);
                                                        handleFetchDepatmentByBranchId(value
                                                        );
                                                    }
                                                }
                                                }
                                                onBlur={props.handleBlur}
                                                value={
                                                    // If all branches are selected, set value to "all", otherwise set it to props.values.branchIds
                                                    props.values.departmentId === "all" ? "all" : props.values.departmentId
                                                }
                                                disabled={
                                                    // If no branch is selected, disable the department dropdown
                                                    props.values.branchId.length === 0
                                                }
                                            >
                                                <option value="">Select Department</option>
                                                <option value="all">All Departments</option>

                                                {department.map((item, i) => {
                                                    return (

                                                        <option key={i} value={item.id}>{item.departmentName}</option>

                                                    )
                                                }
                                                )}
                                            </CFormSelect>
                                        </CInputGroup>
                                        {props.touched.departmentId && props.errors.departmentId && (
                                            <div className="errorMsg" style={{
                                                color: "red", fontSize: "12px", marginTop: "5px", textAlign: "left"
                                            }}>{props.errors.departmentId}</div>
                                        )}

                                    </CCol>
                                </CRow>

                                <CRow>
                                    <CCol sm="6">
                                        <CFormLabel>Employee</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormSelect
                                                type="text"
                                                placeholder="Employee"
                                                name="employeeId"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === "all") {
                                                        props.setFieldValue("employeeId", value);
                                                        return;
                                                    } else {
                                                        props.setFieldValue("employeeId", value);
                                                    }
                                                }}
                                                onBlur={props.handleBlur}
                                                value={props.values.employeeId === "all" ? "all" : props.values.employeeId}
                                                disabled={
                                                    // if no branch and department is selected, disable the employee dropdown
                                                    props.values.branchId.length === 0 || props.values.departmentId.length === 0
                                                }
                                            >
                                                <option value="">Select Employee</option>
                                                <option value="all">All Employees</option>
                                                {
                                                    employee.map((item, i) => {

                                                        return (

                                                            <option key={i} value={item.id}>{item.name}</option>

                                                        )
                                                    })}
                                            </CFormSelect>

                                        </CInputGroup>
                                        {props.touched.employeeId && props.errors.employeeId && (
                                            <div className="errorMsg">{props.errors.employeeId}</div>
                                        )}
                                    </CCol>
                                    <CCol sm="6">
                                        <CFormLabel>Meeting Name</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="Meeting Name"
                                                name="meetingName"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.meetingName}
                                            />

                                        </CInputGroup>
                                        {props.touched.meetingName && props.errors.meetingName && (
                                            <div className="errorMsg">{props.errors.meetingName}</div>
                                        )}
                                    </CCol>
                                </CRow>

                                <CRow>

                                    <CCol sm="6">
                                        <CFormLabel>Meeting Date</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="date"
                                                placeholder="Meeting Date"
                                                name="meetingDate"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.meetingDate}
                                                min={moment().format("YYYY-MM-DD")}
                                                max={moment().add(1, "year").format("YYYY-MM-DD")}
                                            />
                                        </CInputGroup>
                                        {props.touched.meetingDate && props.errors.meetingDate && (
                                            <div className="errorMsg">{props.errors.meetingDate}</div>
                                        )}
                                    </CCol>


                                    <CCol sm="6">
                                        <CFormLabel>Meeting Time</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="time"
                                                placeholder="Meeting Time"
                                                name="meetingTime"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.meetingTime}
                                            />
                                        </CInputGroup>
                                        {props.touched.meetingTime && props.errors.meetingTime && (
                                            <div className="errorMsg">{props.errors.meetingTime}</div>
                                        )}
                                    </CCol>

                                </CRow>

                                <CRow>
                                    <CCol sm="12">
                                        <CFormLabel>Meeting Description</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormTextarea
                                                type="text"
                                                placeholder="Meeting Description"
                                                name="meetingDescription"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.meetingDescription}
                                                rows="5"
                                            />
                                        </CInputGroup>
                                        {props.touched.meetingDescription && props.errors.meetingDescription && (
                                            <div className="errorMsg" style={{
                                                color: "red",
                                                fontSize: "12px",
                                                marginTop: "5px",
                                                textAlign: "left"
                                            }} >{props.errors.meetingDescription}</div>
                                        )}
                                    </CCol>
                                </CRow>

                                <CModalFooter>
                                    <CButton color="primary" type="submit">Edit Meeting</CButton>{' '}
                                    <CButton color="secondary" onClick={() => setMeetingEditModal(false)}>Cancel</CButton>
                                </CModalFooter>

                            </CForm>
                        )}
                    </Formik>
                </CModalBody>
            </CModal>

            {/* Toaster */}
            {
                addToast && <Toaster body={addToast.body} message={addToast.message} status={addToast.status} />
            }


        </div>

    );
}

export default meeting; <></>
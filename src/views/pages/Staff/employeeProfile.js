import { CCardBody, CModalHeader, CModal, CModalTitle, CModalBody, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CInputGroup, CCol, CCard, CButton, CModalFooter, CCardTitle, CFormCheck, CFormSelect, CCardHeader, CDropdownMenu, CDropdownItem, CDropdownToggle, CDropdown, CCardText, CCardImage } from '@coreui/react'
import React from 'react'
import Toaster from 'src/views/shared/Toaster';
import LoadingScreen from 'src/views/shared/Loading';
import { Formik } from "formik";
import * as yup from 'yup';
import configData from "../../../config/constant.json";
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { logoutUser } from 'src/utils/auth_service';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardHeader from '@mui/material/CardHeader';
import { Link } from 'react-router-dom';
import Fade from '@mui/material/Fade';

const employeeProfile = () => {

    const [toast, addToast] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [employeeData, setEmployeeData] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [openIndex, setOpenIndex] = React.useState(-1);



    const handleClick = (index) => (event) => {
        setAnchorEl(event.currentTarget);
        setOpenIndex(index); // set current menu index to open
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    // Function to Add Toaster
    let addToaster = (toast) => {
        addToast(toast)
        setTimeout(() => {
            addToast(false)
        }, 3000)
    }

    React.useEffect(async () => {
        try {
            const response = await axios.get(`${configData.SERVER_URL}/employee/getAllEmployees`, { withCredentials: true },)

            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            setEmployeeData(response.data.data)
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
                    body: "An error occurred while fetching employee data",
                    message: "Failed",
                };
                addToaster(toast);
                setLoading(false)
            }
        }
    }, [])


    return (
        <>
            {toast && <Toaster {...toast} />}


            {/* Design Profile cards here with 3 dot menu on top right corner of each card to edit and delete the card  */}

            {/* // Banner titled as "Employee Profile" with a button to add new employee */}
            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Employee Profile</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    <Link to="/pages/employee"> <CButton color="primary" style={{ float: "right" }}>Add Employee</CButton></Link>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {loading && <LoadingScreen />}

            <div className="row" style={{ marginTop: "3%" }}>
                <div className="col-md-12">
                    {
                        !loading && employeeData.length > 0 &&
                        employeeData.map((user, index) => {
                            return (
                                <CCol key={index} style={{ display: "inline-block", margin: "1%" }}>
                                    <CCard key={index} style={{ margin: 0, padding: 0, width: 300, }}>
                                        <CardHeader
                                            style={{ margin: 0, padding: 0 }}
                                            avatar={
                                                <div style={{ display: 'flex', margin: 0, padding: 0, }}>

                                                    <CCardImage 
                                                    // src="https://picsum.photos/200/100" 
                                                    src={user.photo}
                                                    alt="Card image cap" style={{ width: 290, height: 150, margin: 0, padding: 0, }} />
                                                    <IconButton style={{
                                                        borderWidth: 1, color: 'white', borderRadius: 1, position: 'absolute',
                                                        top: "8px",
                                                        right: "16px",
                                                        margin: 0, padding: 0,
                                                    }} aria-label="settings" onClick={handleClick(index)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </div>
                                            }
                                        />
                                        <Menu
                                            id="fade-menu"
                                            anchorEl={anchorEl}
                                            open={open && index === openIndex}
                                            onClose={handleClose}
                                            TransitionComponent={Fade}
                                        >
                                            <MenuItem onClick={() => {
                                                setUserData(user);
                                                setopenEditModal(true);
                                                handleClose();
                                            }}>Edit</MenuItem>

                                            <MenuItem onClick={() => {
                                                setUser_id(user._id);
                                                setChangePassword(true);
                                                handleClose();
                                            }}>Change Password</MenuItem>

                                            <MenuItem onClick={() => {
                                                setUser_id(user._id);
                                                setOpenDeleteModal(true);
                                                handleClose();
                                            }}>Delete</MenuItem>
                                        </Menu>
                                        <CCardBody style={{ justifyContent: "center", alignItems: "center" }}>
                                            <CCardTitle style={{ textAlign: "center" }}
                                            >{user.name}</CCardTitle>
                                            <CCardText style={{ textAlign: "center" }}>
                                                {user.designationName}
                                            </CCardText>
                                            <CCardText style={{ textAlign: "center" }}>
                                                {/* // button here to view employee id and redirect to pofile page for that employee */}
                                                <Link to={{
                                                    pathname: '/pages/employeeDetail',
                                                    state: { id: user.id } // your data array of objects
                                                }}>
                                                    <CButton color="primary">
                                                        EMPID-{user.id}
                                                    </CButton>
                                                </Link>

                                            </CCardText>

                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            )
                        })
                    }
                </div>
            </div>


        </>
    );
}

export default employeeProfile;

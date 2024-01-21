import { CCardBody, CModalHeader, CModal, CModalTitle, CModalBody, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CInputGroup, CCol, CCard, CButton, CModalFooter, CCardTitle, CFormCheck, CFormSelect } from '@coreui/react'
import React from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import LoadingScreen from 'src/views/shared/Loading';
import Toaster from 'src/views/shared/Toaster';
import configData from "../../../config/constant.json";
import moment from 'moment';

export default function leaveType() {

    const [loading, setLoading] = React.useState(true);
    const [addLeaevTypeModal, setAddLeaevTypeModal] = React.useState(false);
    const [leaveTypeData, setLeaveTypeData] = React.useState([]);
    const [role, setRole] = React.useState(secureLocalStorage.getItem("userRoles"));
    const [token, setToken] = React.useState(secureLocalStorage.getItem("token"));
    const [addToast, setAddToast] = React.useState(false);
    const [edirLeaevTypeModal, setEditLeaevTypeModal] = React.useState(false);
    const [editData, setEditData] = React.useState({});


    // Function to Add Toaster
    let addToaster = (toast) => {
        setAddToast(toast)
        setTimeout(() => {
            setAddToast(false)
        }, 3000)
    }

    const getAllLeaveTypes = () => {

        axios.get(`${configData.SERVER_URL}/leaveType/getAllLeaveTypes`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }, { withCredentials: true })
            .then(function (response) {
                console.log("getAllLeaveTypes response", response.data.data);
                setLeaveTypeData(response.data.data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });
    }

    React.useEffect(() => {
        getAllLeaveTypes();
    }, []);


    return (
        <div>
            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>LeaveType</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    <CButton color="primary" style={{ float: "right" }} onClick={() => setAddLeaevTypeModal(true)}>Add LeaveType</CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CRow>
                <CCol sm={12}>
                    <CCard>
                        <CCardBody>
                            <table className="table table-hover table-outline mb-0 d-none d-sm-table ">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Sr No.</th>
                                        <th>LeaveType</th>
                                        <th>Days/Year</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveTypeData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.leaveType}</td>
                                            <td>{item.noOfDays}</td>
                                            <td>
                                                <CButton color="info" className="ml-1" onClick={() => { setEditData(item); setEditLeaevTypeModal(true) }}>Edit</CButton>
                                                <CButton color="danger" className="ml-1" onClick={() => { }}>Delete</CButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Add LeaveType Modal */}
            <CModal
                visible={addLeaevTypeModal}
                onClose={() => setAddLeaevTypeModal(false)}
                color="primary"
                size="lg"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Add LeaveType</CModalTitle>
                </CModalHeader>
                <Formik
                    initialValues={{
                        leaveType: '',
                        noOfDays: '',
                    }}
                    onSubmit={async (values) => {
                        console.log("values", values);
                        setLoading(true);
                        axios.post(`${configData.SERVER_URL}/leaveType/addLeaveType`, values, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        }, { withCredentials: true })
                            .then(function (response) {
                                console.log("add LeaveType response", response.data);
                                if (response.data.status == 201) {
                                    let toast = {
                                        body: "Successfully Added",
                                        message: response.data.message,
                                        status: true
                                    }
                                    addToaster(toast);
                                    setAddLeaevTypeModal(false);
                                    setLeaveTypeData([...leaveTypeData, response.data.data]);
                                }
                                else {
                                    let toast = {
                                        body: "Error",
                                        message: response.data.message,
                                        status: "error"
                                    }
                                    addToaster(toast);
                                }
                                setLoading(false);
                            })
                            .catch(function (error) {
                                console.log(error);
                                setLoading(false);
                            });
                    }}
                    validationSchema={Yup.object().shape({
                        leaveType: Yup.string().required("Required"),
                        noOfDays: Yup.string().required("Required"),
                    })}
                >
                    {(props) => (
                        <CForm onSubmit={props.handleSubmit}>
                            <CModalBody>
                                <CRow>
                                    <CCol sm="6">
                                        <CFormLabel>LeaveType</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="LeaveType"
                                                autoComplete="LeaveType"
                                                name="leaveType"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.leaveType}
                                                isInvalid={props.errors.leaveType && props.touched.leaveType}
                                            />
                                            {
                                                props.errors.leaveType && props.touched.leaveType && (
                                                    <div className="invalid-feedback">{props.errors.leaveType}</div>
                                                )
                                            }
                                        </CInputGroup>
                                    </CCol>
                                    <CCol sm="6">
                                        <CFormLabel>Days/Year</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="Days/Year"
                                                autoComplete="Days/Year"
                                                name="noOfDays"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.noOfDays}
                                                isInvalid={props.errors.noOfDays && props.touched.noOfDays}
                                            />
                                            {
                                                props.errors.noOfDays && props.touched.noOfDays && (
                                                    <div className="invalid-feedback">{props.errors.noOfDays}</div>
                                                )
                                            }
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="secondary" onClick={() => setAddLeaevTypeModal(false)}>Cancel</CButton>
                                <CButton color="success" type="submit" disabled={loading}>Add</CButton>
                            </CModalFooter>
                        </CForm>
                    )}
                </Formik>

            </CModal>

            {/* Edit LeaveType Modal */}
            <CModal
                visible={edirLeaevTypeModal}
                onClose={() => setEditLeaevTypeModal(false)}
                color="primary"
                size="lg"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Edit LeaveType</CModalTitle>
                </CModalHeader>
                <Formik
                    initialValues={{
                        leaveType: editData.leaveType,
                        noOfDays: editData.noOfDays,
                    }}
                    onSubmit={async (values) => {
                        console.log("values", values);
                        setLoading(true);
                        let data = {
                            ...values,
                            id: editData.id
                        }

                        axios.post(`${configData.SERVER_URL}/leaveType/updateLeaveType`, data, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        }, { withCredentials: true })
                            .then(function (response) {
                                console.log("update LeaveType response", response.data);
                                if (response.data.status == 200) {
                                    let toast = {
                                        body: "Successfully Updated",
                                        message: response.data.message,
                                        status: true
                                    }
                                    addToaster(toast);
                                    setEditLeaevTypeModal(false);
                                }
                                else {
                                    let toast = {
                                        body: "Error",
                                        message: response.data.message,
                                        status: "error"
                                    }
                                    addToaster(toast);

                                }
                                setLoading(false);
                            })
                            .catch(function (error) {
                                console.log(error);
                                setLoading(false);
                            });
                    }}
                    validationSchema={Yup.object().shape({
                        leaveType: Yup.string().required("Required"),
                        noOfDays: Yup.string().required("Required"),
                    })}
                >
                    {(props) => (
                        <CForm onSubmit={props.handleSubmit}>
                            <CModalBody>
                                <CRow>
                                    <CCol sm="6">
                                        <CFormLabel>LeaveType</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="LeaveType"
                                                autoComplete="LeaveType"
                                                name="leaveType"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.leaveType}
                                                isInvalid={props.errors.leaveType && props.touched.leaveType}
                                            />
                                            {
                                                props.errors.leaveType && props.touched.leaveType && (
                                                    <div className="invalid-feedback">{props.errors.leaveType}</div>
                                                )
                                            }
                                        </CInputGroup>
                                    </CCol>
                                    <CCol sm="6">
                                        <CFormLabel>Days/Year</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="Days/Year"
                                                autoComplete="Days/Year"
                                                name="noOfDays"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.noOfDays}
                                                isInvalid={props.errors.noOfDays && props.touched.noOfDays}
                                            />
                                            {
                                                props.errors.noOfDays && props.touched.noOfDays && (
                                                    <div className="invalid-feedback">{props.errors.noOfDays}</div>
                                                )
                                            }
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="secondary" onClick={() => setEditLeaevTypeModal(false)}>Cancel</CButton>
                                <CButton color="success" type="submit" disabled={loading}>Update</CButton>
                            </CModalFooter>
                        </CForm>
                    )}
                </Formik>

            </CModal>

            {
                addToast && <Toaster body={addToast.body} message={addToast.message} status={addToast.status} />
            }
        </div>
    )
}

import { CCardBody, CModalHeader, CModal, CModalTitle, CModalBody, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CInputGroup, CCol, CCard, CButton, CModalFooter, CCardTitle, CFormCheck, CFormSelect } from '@coreui/react'
import React from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import LoadingScreen from 'src/views/shared/Loading';
import Toaster from 'src/views/shared/Toaster';
import configData from "../../../config/constant.json";
import CIcon from '@coreui/icons-react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';


export default function designation() {

    const [designation, setDesignation] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [designationModal, setDesignationModal] = React.useState(false);
    const [errorModal, setErrorModal] = React.useState(false);
    const [toast, addToast] = React.useState(false);
    const [departmentData, setDepartmentData] = React.useState([]);
    const [designationUpdateModal, setDesignationUpdateModal] = React.useState(false);
    const [designationUpdateData, setDesignationUpdateData] = React.useState({});
    const [role, setRole] = React.useState(false);


    // Function to Add Toaster
    let addToaster = (toast) => {
        addToast(toast)
        setTimeout(() => {
            addToast(false)
        }, 3000)
    }

    React.useEffect(async () => {
        try {
            let token = secureLocalStorage.getItem("token");

            const response = await axios.get(`${configData.SERVER_URL}/designation/getAllDesignations`, { headers: { 'Authorization': token } });

            if (response.data.status == false) {
                throw Error(response.data.message);
            }

            setDesignation(response.data.data);
            setLoading(false);

        } catch (error) {
            setLoading(false)
            let toast = {
                "status": false,
                "body": error.message,
                "message": "Failed"
            }
            addToaster(toast)
        }
    }, []);

   
    React.useEffect(async () => {
        try {
            let token = secureLocalStorage.getItem("token");

            const response = await axios.get(`http://localhost:5000/api/v1/department/getAllDepartments`, { withCredentials: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            console.log("response", response);
            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            setDepartmentData(response.data.data)
            setLoading(false)

        } catch (error) {
            setLoading(false)
            let toast = {
                "status": false,
                "body": error.message,
                "message": "Failed"
            }
            addToaster(toast)
        }
        React.useEffect(() => {
            let userRoles = secureLocalStorage.getItem("userRoles");
            setRole(userRoles);
            console.log("roledesc:", userRoles)
        }, []);
    
    }, 
    []);

    const handleAddDesignation = async (values) => {
        try {
            let token = secureLocalStorage.getItem("token");

            const response = await axios.post(`${configData.SERVER_URL}/designation/addDesignation`, values, { withCredentials: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("response", response.data.data);

            let toast = {
                "status": true,
                "body": response.data.message,
                "message": "Success"
            }
            addToaster(toast)
            setDesignationModal(false)
            setLoading(false)
            setDesignation([...designation, response.data.data])


        } catch (error) {
            console.log("error", error);
            setLoading(false)
            let toast = {
                "status": false,
                "body": error.message,
                "message": "Failed"
            }
            addToaster(toast)
        }
    }

    const handleUpdateDesignation = async (values) => {
        try {
            let token = secureLocalStorage.getItem("token");

            values.id = designationUpdateData.id;

            const response = await axios.post(`${configData.SERVER_URL}/designation/updateDesignation`, values, { withCredentials: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("response", response.data.data);

            let toast = {
                "status": true,
                "body": response.data.message,
                "message": "Success"
            }
            addToaster(toast)
            setDesignationModal(false);
            setDesignationUpdateModal(false);
            setLoading(false)
            setDesignation(
                designation.map((data) => {
                    if (data.id == designationUpdateData.id) {
                        data.designationName = response.data.data.designationName;
                        data.departmentName = response.data.data.departmentName;
                    }
                    return data;
                })
            )

        } catch (error) {
            setLoading(false);
            let toast = {
                "status": false,
                "body": error.message,
                "message": "Failed"
            }
            addToaster(toast)
        }
    };

    const handleDeleteDesignation = async (id) => {
        try {
            const token = secureLocalStorage.getItem("token");

            const response = await axios.post(`${configData.SERVER_URL}/designation/deleteDesignation/${id}`, { headers: { 'Authorization': token } });

            if (response.data.status == false) {
                throw Error(response.data.message);
            }

            let toast = { "status": true, "body": response.data.message, "message": "Success" }
            addToaster(toast)
            setLoading(false)
            setDesignation(designation.filter((data) => data.id !== id))


        } catch (error) {
            setLoading(false);
            let toast = {
                "status": false,
                "body": error.message,
                "message": "Failed"
            }
            addToaster(toast)

        }
    };

    // Pagination logic
    const itemsPerPage = 10;
    const [currentItems, setCurrentItems] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [itemOffset, setItemOffset] = React.useState(0);
    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(designation.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(designation.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, designation]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % designation.length;
        setItemOffset(newOffset);
    };

    return (
        <div>
            {/* Designation Table */}
            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Designations</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    {role === 'ADMIN' || role === 'HR' ? (
                                        <CButton color="primary" style={{ float: "right" }} onClick={() => setDesignationModal(!designationModal)}
                                        >Add Designation</CButton>
                                    ) : null}
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {/* Designation Table */}
            {
                loading ?
                    <LoadingScreen />
                    :
                    <CRow>
                        <CCol>
                            <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                                <CCardBody>
                                    <CRow>
                                        <CCol>
                                            <CCardTitle style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Designation Details</CCardTitle>
                                        </CCol>
                                        <CCol xs="auto">
                                            <CFormInput
                                                placeholder="Search"
                                                autoComplete="Search"
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </CCol>
                                    </CRow>
                                    <table className="table table-hover table-outline mb-0 d-none d-sm-table table-bordered" style={{
                                        marginTop: '20px',
                                    }}>
                                        <thead className="thead-light">
                                            <tr>
                                                <th className="text-center">Sr No.</th>
                                                <th>Designation</th>
                                                <th>Department</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                loading && <LoadingScreen /> ||

                                                    search == '' ?
                                                    currentItems.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="text-center">
                                                                    <div>{index + 1}</div>
                                                                </td>
                                                                <td>
                                                                    <div>{data.designationName}</div>
                                                                </td>
                                                                <td>{data.departmentName}</td>
                                                                <td className="text-center">
                                                                    <CButton color="primary" onClick={() => {
                                                                        setDesignationUpdateModal(true)
                                                                        setDesignationUpdateData(data)
                                                                        console.log("data", data);
                                                                    }
                                                                    }>Edit</CButton> &nbsp;
                                                                    <CButton color="danger" className="ml-3" onClick={() => handleDeleteDesignation(data.id)}>Delete</CButton>
                                                                </td>
                                                            </tr>
                                                        ) || <LoadingScreen />
                                                    })
                                                    : designation
                                                        .filter((val) => {
                                                            const searchLower = search.toLowerCase();
                                                            return (
                                                                val.designationName.toLowerCase().includes(searchLower) ||
                                                                val.departmentName.toLowerCase().includes(searchLower)

                                                            );
                                                        })
                                                        .map((data, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center">{data.id}</td>
                                                                    <td className="text-center">{data.designationName}</td>
                                                                    <td className="text-center">{data.departmentName}</td>
                                                                    <td className="text-center">
                                                                        <Link to={{ pathname: "/pages/designation", state: { data: data } }}>
                                                                            {/* <CButton color="primary">View</CButton> */}
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                            }
                                        </tbody>
                                    </table>
                                </CCardBody>
                                <ReactPaginate
                                    previousLabel={"previous"}
                                    nextLabel={"next"}
                                    breakLabel={"..."}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={3}
                                    onPageChange={handlePageClick}
                                    containerClassName={"pagination justify-content-center"}
                                    pageClassName={"page-item"}
                                    pageLinkClassName={"page-link"}
                                    previousClassName={"page-item"}
                                    previousLinkClassName={"page-link"}
                                    nextClassName={"page-item"}
                                    nextLinkClassName={"page-link"}
                                    breakClassName={"page-item"}
                                    breakLinkClassName={"page-link"}
                                    activeClassName={"active"}
                                />
                            </CCard>
                        </CCol>
                    </CRow>
            }

            {/* Designation Modal */}
            <CModal
                visible={designationModal}
                onClose={() => setDesignationModal(false)}
            >
                <CModalHeader onClose={() => setDesignationModal(false)}>
                    <CModalTitle>Add Designation</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik
                        initialValues={{
                            designation: '',
                            department: '',
                        }}
                        onSubmit={(values) => handleAddDesignation(values)}
                        validationSchema={Yup.object().shape({
                            designation: Yup.string().required("Designation is Required"),
                            department: Yup.string().required("Department is Required"),
                        })}
                    >
                        {(props) => (
                            <CForm onSubmit={props.handleSubmit}>
                                <CRow>
                                    <CCol>
                                        <CFormLabel>Designation</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="Designation"
                                                name="designation"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.designation}
                                            />
                                        </CInputGroup>
                                        {props.touched.designation && props.errors.designation ? (
                                            <div className="error-message">{props.errors.designation}</div>
                                        ) : null}
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <CFormLabel>Department</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormSelect
                                                name="department"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.department}
                                            >
                                                <option value="">Select Department</option>
                                                {
                                                    departmentData.map((data, index) => (
                                                        <option key={index} value={data.id}>{data.departmentName}</option>
                                                    ))
                                                }
                                            </CFormSelect>
                                        </CInputGroup>
                                        {props.touched.department && props.errors.department ? (
                                            <div className="error-message">{props.errors.department}</div>
                                        ) : null}
                                    </CCol>
                                </CRow>
                                <CModalFooter>
                                    <CButton color="secondary" onClick={() => setDesignationModal(false)}>Cancel</CButton>
                                    <CButton color="primary" type="submit">Add Designation</CButton>
                                </CModalFooter>
                            </CForm>
                        )}
                    </Formik>
                </CModalBody>
            </CModal>

            {/* Designation Update Modal */}
            <CModal
                visible={designationUpdateModal}
                onClose={() => setDesignationUpdateModal(false)}
            >
                <CModalHeader onClose={() => setDesignationUpdateModal(false)}>
                    <CModalTitle>Update Designation</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik initialValues={{ designation: designationUpdateData.designationName, department: designationUpdateData.departmentName }}
                        onSubmit={(values) => handleUpdateDesignation(values)}
                        validationSchema={Yup.object().shape({
                            designation: Yup.string().required("Designation is Required"),
                            department: Yup.string().required("Department is Required"),
                        })}
                    >
                        {(props) => (
                            <CForm onSubmit={props.handleSubmit}>
                                <CRow>
                                    <CCol>
                                        <CFormLabel>Designation</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="Designation"
                                                name="designation"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.designation}
                                            />
                                        </CInputGroup>
                                        {props.touched.designation && props.errors.designation ? (
                                            <div className="error-message">{props.errors.designation}</div>
                                        ) : null}
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <CFormLabel>Department</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormSelect
                                                name="department"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.department}
                                            >
                                                <option value={designationUpdateData.departmentId}>{designationUpdateData.departmentName}</option>
                                                {
                                                    departmentData.map((data, index) => (
                                                        <option key={index} value={data.id}>{data.departmentName}</option>
                                                    ))
                                                }
                                            </CFormSelect>
                                        </CInputGroup>
                                        {props.touched.department && props.errors.department ? (
                                            <div className="error-message">{props.errors.department}</div>
                                        ) : null}
                                    </CCol>
                                </CRow>
                                <CModalFooter>
                                    <CButton color="secondary" onClick={() => setDesignationUpdateModal(false)}>Cancel</CButton>
                                    <CButton color="primary" type="submit">Update Designation</CButton>
                                </CModalFooter>
                            </CForm>
                        )}
                    </Formik>
                </CModalBody>
            </CModal>



            {/* Toaster */}
            {
                toast && <Toaster
                    position="top-right"
                    body={toast.body}
                    status={toast.status}
                    message={toast.message}
                />
            }
        </div>
    )
}

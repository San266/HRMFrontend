import React, { useState, useEffect } from 'react'
import { CCardBody, CModalHeader, CModal, CModalTitle, CModalBody, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CInputGroup, CCol, CCard, CButton, CModalFooter, CCardTitle, CFormCheck, CFormSelect } from '@coreui/react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import LoadingScreen from 'src/views/shared/Loading';
import Toaster from 'src/views/shared/Toaster';
import configData from "../../../config/constant.json";
import moment from 'moment';

export default function awards() {

    const [loading, setLoading] = useState(false);
    const [awards, setAwards] = useState([]);
    const [awardAddModal, setAwardAddModal] = useState(false);
    const [awardEditModal, setAwardEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [addToast, setAddToast] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [awardType, setAwardType] = useState([]);


    let addToaster = (toast) => {
        setAddToast(toast)
        setTimeout(() => {
            setAddToast(false)
        }, 3000)
    }

    const getAllEmployees = async () => {
        try {
            const response = await axios.get(`${configData.SERVER_URL}/employee/getAllEmployees`, {
                withCredentials: true,
            });

            if (response.data.status == 200) {
                setEmployee(response.data.data);
            }

        } catch (error) {
            console.log(`Err while fetching all employees ${error}`);
        }
    }

    const getAllAwardType = async () => {
        try {
            const response = await axios.get(`${configData.SERVER_URL}/awardType/getAllAwardTypes`, {
                withCredentials: true,
            });

            if (response.data.status == 200) {
                setAwardType(response.data.data);
            }

        } catch (error) {
            console.log(`Err while fetching all award type ${error}`);
        }
    }


    useEffect(() => {
        const getAwards = async () => {
            try {
                const response = await axios.get(`${configData.SERVER_URL}/award/getAllAwards`, {
                    withCredentials: true,
                });

                if (response.data.status == 200) {
                    console.log("response.data.data", response.data.data);
                    setAwards(response.data.data);
                    setLoading(false);

                }

            } catch (error) {
                console.log("error", error);
                setLoading(false);
            }
        }
        getAwards();
        getAllEmployees();
        getAllAwardType();
    }, [])


    const handleAddAward = async (values) => {
        console.log("values", values);
        setLoading(true);
        axios.post(`${configData.SERVER_URL}/award/addAward`, values, {
            withCredentials: true,
        }).then((response) => {
            if (response.data.status == 200) {
                setLoading(false);

                console.log("response.data.data", response.data.data);

                setAwardAddModal(false);
                setAwards([...awards, response.data.data]);

                let toast = {
                    "status": true,
                    "body": response.data.message,
                    "message": "Success"
                }
                addToaster(toast);
            }
        }).catch((error) => {
            console.log("error", error);
            setLoading(false);
            setAwardAddModal(false);
            let toast = {
                "status": false,
                "body": error.response.data.message,
                "message": "Error"
            }
            addToaster(toast);
        })
    }

    const handleUpdateAward = async (values) => {
        try {
            let data = {
                ...values,
                id: editData.id
            }
            const response = await axios.post(`${configData.SERVER_URL}/award/updateAward`, data, { withCredentials: true });
            if (response.data.status == 200) {
                console.log("Response --->", response.data.data);
                setAwardEditModal(false);
            }
            
        } catch (error) {
            setAwardEditModal(false);
            console.log(`Err while updating award ${error}`);
            let toast = {
                "status": false,
                "body": error.response.data.message,
                "message": "Error"
            }
            addToaster(toast);
        }
    }

    const handleDeleteAward = async (id) => {
        try {

            let response = await axios.post(`${configData.SERVER_URL}/award/deleteAward/${id}`, { withCredentials: true });
            if (response.data.status == 200) {
                
                setAwards(awards.filter((award) => award.id != id));
                let toast = {
                    "status": true,
                    "body": response.data.message,
                    "message": "Success"
                }
                addToaster(toast);
            }
            
        } catch (error) {
            console.log(`Err while deleting award ${error}`);
            let toast = {
                "status": false,
                "body": error.response.data.message,
                "message": "Error"
            }
            addToaster(toast);
        }
    }

    return (
        <div>
            {/* // Banner */}
            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Awards</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    <CButton color="primary" style={{ float: "right" }} onClick={() => setAwardAddModal(true)}>Add Award</CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* // Table */}
            {
                !loading ?
                    <CRow>
                        <CCol sm={12}>
                            <CCard>
                                <CCardBody>
                                    <table className="table table-hover table-outline mb-0 d-none d-sm-table ">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Sr No.</th>
                                                <th>Employee Name</th>
                                                <th>Award Type</th>
                                                <th>Date</th>
                                                <th>Gift</th>
                                                <th>Description</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                awards.map((award, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div>{index + 1}</div>
                                                        </td>

                                                        <td>
                                                            <div>{award.name}</div>

                                                        </td>
                                                        <td>
                                                            <div>{award.awardType}</div>
                                                        </td>
                                                        <td>
                                                            <div>{moment(award.date).format("DD-MM-YYYY")}</div>
                                                        </td>
                                                        <td>
                                                            <div>{award.gift}</div>
                                                        </td>
                                                        <td>
                                                            <div>{award.description}</div>
                                                        </td>
                                                        <td>
                                                            <CButton color="primary" onClick={() => { setAwardEditModal(true); setEditData(award) }}>Edit</CButton> &nbsp;
                                                            <CButton color="danger" onClick={() => handleDeleteAward(award.id)}>Delete</CButton>
                                                        </td>
                                                    </tr>

                                                ))}

                                        </tbody>
                                    </table>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    :
                    <LoadingScreen />

            }

            {/* // Add Modal */}
            <CModal
                visible={awardAddModal}
                onClose={() => setAwardAddModal(false)}
                color="primary"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Add Award</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik
                        initialValues={{ employeeId: "", awardTypeId: "", date: "", gift: "", description: "" }}
                        onSubmit={(values) => handleAddAward(values)}
                        validationSchema={Yup.object().shape({
                            employeeId: Yup.string().required("Employee Name is Required"),
                            awardTypeId: Yup.string().required("Award Type is Required"),
                            date: Yup.string().required("Date is Required"),
                            gift: Yup.string().required("Gift is Required"),
                            description: Yup.string().required("Description is Required"),
                        })}
                    >
                        {(props) => {
                            const {
                                values,
                                touched,
                                errors,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue,
                            } = props;
                            return (
                                <CForm onSubmit={handleSubmit}>
                                    <CRow>
                                        <CCol sm={12}>
                                            <CFormLabel>Employee Name</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormSelect
                                                    type="text"
                                                    placeholder="Employee Name"
                                                    autoComplete="off"
                                                    name="employeeId"
                                                    value={values.employeeId}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.employeeId && touched.employeeId}
                                                >
                                                    <option value="">Select Employee</option>

                                                    {
                                                        employee.map((employee, index) => (
                                                            <option key={index} value={employee.id}>{employee.name}</option>
                                                        ))
                                                    }
                                                </CFormSelect>
                                                {
                                                    errors.employeeId && touched.employeeId && (
                                                        <div className="invalid-feedback">{errors.employeeId}</div>
                                                    )

                                                }
                                            </CInputGroup>
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Award Type</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormSelect
                                                    type="text"
                                                    placeholder="Award Type"
                                                    autoComplete="off"
                                                    name="awardTypeId"
                                                    value={values.awardTypeId}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.awardTypeId && touched.awardTypeId}
                                                >
                                                    <option value="">Select Award Type</option>
                                                    {
                                                        awardType.map((awardType, index) => (
                                                            <option key={index} value={awardType.id}>{awardType.awardType}</option>
                                                        ))

                                                    }
                                                </CFormSelect>
                                                {
                                                    errors.awardTypeId && touched.awardTypeId && (
                                                        <div className="invalid-feedback">{errors.awardTypeId}</div>
                                                    )
                                                }
                                            </CInputGroup>
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Date</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormInput
                                                    type="date"
                                                    placeholder="Date"
                                                    autoComplete="off"
                                                    name="date"
                                                    value={values.date}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.date && touched.date}
                                                />
                                                {
                                                    errors.date && touched.date && (
                                                        <div className="invalid-feedback">{errors.date}</div>
                                                    )
                                                }
                                            </CInputGroup>
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Gift</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormInput
                                                    type="text"
                                                    placeholder="Gift"
                                                    autoComplete="off"
                                                    name="gift"
                                                    value={values.gift}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.gift && touched.gift}
                                                />
                                                {
                                                    errors.gift && touched.gift && (
                                                        <div className="invalid-feedback">{errors.gift}</div>
                                                    )
                                                }
                                            </CInputGroup>
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Description</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormTextarea
                                                    type="text"
                                                    placeholder="Description"
                                                    autoComplete="off"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.description && touched.description}
                                                />
                                                {
                                                    errors.description && touched.description && (
                                                        <div className="invalid-feedback">{errors.description}</div>
                                                    )
                                                }
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
                                    <CModalFooter>
                                        <CButton type="submit" color="primary" > Submit
                                        </CButton>
                                        <CButton color="secondary" onClick={() => setAwardAddModal(false)}>Cancel</CButton>
                                    </CModalFooter>
                                </CForm>
                            );
                        }}
                    </Formik>
                </CModalBody>
            </CModal>

            {/* // Edit Modal */}
            <CModal
                visible={awardEditModal}
                onClose={() => setAwardEditModal(false)}
                color="primary"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Edit Award</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik
                        initialValues={{ employeeId: editData.employeeId, awardTypeId: editData.awardTypeId, date: editData.date, gift: editData.gift, description: editData.description }}
                        onSubmit={(values) => handleUpdateAward(values)}
                        validationSchema={Yup.object().shape({
                            employeeId: Yup.string().required("Employee Name is Required"),
                            awardTypeId: Yup.string().required("Award Type is Required"),
                            date: Yup.string().required("Date is Required"),
                            gift: Yup.string().required("Gift is Required"),
                            description: Yup.string().required("Description is Required"),
                        })}
                    >
                        {(props) => {
                            const {
                                values,
                                touched,
                                errors,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue,
                            } = props;
                            return (
                                <CForm onSubmit={handleSubmit}>
                                    <CRow>
                                        <CCol sm={12}>
                                            <CFormLabel>Employee Name</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormSelect
                                                    type="text"
                                                    placeholder="Employee Name"
                                                    autoComplete="off"
                                                    name="employeeId"
                                                    value={values.employeeId}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.employeeId && touched.employeeId}
                                                >
                                                    <option value="">Select Employee</option>

                                                    {
                                                        employee.map((employee, index) => (
                                                            <option key={index} value={employee.id}>{employee.name}</option>
                                                        ))
                                                    }
                                                </CFormSelect>
                                                {
                                                    errors.employeeId && touched.employeeId && (
                                                        <div className="invalid-feedback">{errors.employeeId}</div>
                                                    )

                                                }
                                            </CInputGroup>
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Award Type</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormSelect
                                                    type="text"
                                                    placeholder="Award Type"
                                                    autoComplete="off"
                                                    name="awardTypeId"
                                                    value={values.awardTypeId}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.awardTypeId && touched.awardTypeId}
                                                >
                                                    <option value
                                                        ="">Select Award Type</option>
                                                    {
                                                        awardType.map((awardType, index) => (
                                                            <option key={index} value={awardType.id}>{awardType.awardType}</option>
                                                        ))

                                                    }
                                                </CFormSelect>
                                                {
                                                    errors.awardTypeId && touched.awardTypeId && (
                                                        <div className="invalid-feedback">{errors.awardTypeId}</div>
                                                    )
                                                }
                                            </CInputGroup>
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Date</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormInput
                                                    type="date"
                                                    placeholder="Date"
                                                    name="date"
                                                    value={ moment(values.date).format("YYYY-MM-DD")}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.date && touched.date}
                                                />
                                                {
                                                    errors.date && touched.date && (
                                                        <div className="invalid-feedback">{errors.date}</div>
                                                    )
                                                }
                                            </CInputGroup>
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Gift</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormInput
                                                    type="text"
                                                    placeholder="Gift"
                                                    autoComplete="off"
                                                    name="gift"
                                                    value={values.gift}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.gift && touched.gift}
                                                />
                                                {
                                                    errors.gift && touched.gift && (
                                                        <div className="invalid-feedback">{errors.gift}</div>
                                                    )
                                                }
                                            </CInputGroup>
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Description</CFormLabel>
                                            <CInputGroup className="mb-3">
                                                <CFormTextarea
                                                    type="text"
                                                    placeholder="Description"
                                                    autoComplete="off"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={errors.description && touched.description}
                                                />
                                                {
                                                    errors.description && touched.description && (
                                                        <div className="invalid-feedback">{errors.description}</div>
                                                    )
                                                }
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
                                    <CModalFooter>
                                        <CButton type="submit" color="primary" > Submit
                                        </CButton>
                                        <CButton color="secondary" onClick={() => setAwardEditModal(false)}>Cancel</CButton>
                                    </CModalFooter>
                                </CForm>
                            );
                        }
                        }
                    </Formik>
                </CModalBody>
            </CModal>

            {
                addToast && <Toaster body={addToast.body} message={addToast.message} status={addToast.status} />
            }

        </div>
    )
}

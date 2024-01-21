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

export default function timesheet() {

    const [toast, addToast] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [timesheet, setTimesheet] = React.useState([]);
    const [editModal, setEditModal] = React.useState(false);
    const [editData, setEditData] = React.useState({});
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [addTimesheetModal, setAddTimesheetModal] = React.useState(false);
    const [role, setRole] = React.useState(false);
    const [employee, setEmployee] = React.useState([]);
    const [viewData, setViewData] = React.useState({});
    const [viewModal, setViewModal] = React.useState(false);


    let addToaster = (toast) => {
        addToast(toast)
        setTimeout(() => {
            addToast(false)
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

    const getTimesheetsData = async () => {
        try {
            let token = secureLocalStorage.getItem("token");
            console.log("token", token);
            const response = await axios.get(`${configData.SERVER_URL}/timesheet/getTimesheetsByRole`, {
                withCredentials: true,
                },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
               });
            
            if (response.data.status == 200) {
                setTimesheet(response.data.data);
                setLoading(false);
            }


        } catch (error) {
            setLoading(false);
            console.log(`Error while fetching timesheet ${error}`);
        }
    };

    React.useEffect(() => {
        let userRoles = secureLocalStorage.getItem("userRoles");
        setRole(userRoles);
        getAllEmployees();
        getTimesheetsData();
    }, [])

    const handleAddTimesheet = async (values) => {
        try {
            const response = await axios.post(`${configData.SERVER_URL}/timesheet/addTimesheet`, values, {
                withCredentials: true,
            });

            if (response.data.status == 200) {
                addToaster("Timesheet Added Successfully");
                setAddTimesheetModal(false);
                setTimesheet([...timesheet, response.data.data]);
                setLoading(false);
            }

        } catch (error) {
            console.log(`Error while adding timesheet ${error}`);
        }
    }

    const handleDeleteTimesheet = async (id) => {
        try {
            console.log("id", id);
            const response = await axios.post(`${configData.SERVER_URL}/timesheet/deleteTimesheet?id=${id}`, {}, {
                withCredentials: true,
            });

            if (response.data.status == 200) {
                const updatedData = timesheet.filter((data) => data.id != id);
                setTimesheet(updatedData);

            }

        } catch (error) {
            console.log(`Error while deleting timesheet ${error}`);
        }
    }



    return (
        <div>
            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Timesheet</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    <CButton color="primary" style={{ float: "right" }} onClick={() => setAddTimesheetModal(true)}>Add Timesheet</CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {
                loading ?
                    <LoadingScreen />
                    :
                    <CRow>
                        <CCol sm={12}>
                            <CCard>
                                <CCardBody>
                                    <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                        <thead className="thead-light">
                                            <tr>
                                                {
                                                    role == "ADMIN" &&
                                                    <th className="text-center">Employee</th>
                                                }
                                                <th className="text-center">Date</th>
                                                <th className="text-center">Hours</th>
                                                <th className="text-center">Remarks</th>

                                                <th className="text-center">Action</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                timesheet.map((data, index) => (
                                                    <tr key={index}
                                                        // onClick={() => {
                                                        //     setViewData(data);
                                                        //     setViewModal(true);
                                                        // }}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {
                                                            role == "ADMIN" &&
                                                            <td className="text-center">{data.name}</td>
                                                        }
                                                        <td className="text-center">{moment(data.date).format('DD/MM/YYYY')}</td>
                                                        <td className="text-center">{data.hours}</td>
                                                        <td className="text-center">{
                                                            data.remarks.length > 10 ?
                                                                data.remarks.substring(0, 10) + "..."
                                                                :
                                                                data.remarks
                                                        }</td>

                                                        <td className="text-center">
                                                            <CButton color="info" onClick={() => {
                                                                setViewModal(false)
                                                                setEditData(data);
                                                                setEditModal(true);
                                                            }}>Edit</CButton>
                                                            <CButton color="danger" onClick={() => handleDeleteTimesheet(data.id)}>Delete</CButton>
                                                        </td>

                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
            }

            {
                editData &&
                <CModal
                    visible={editModal}
                    onClose={() => setEditModal(false)}
                    color="info"
                >
                    <CModalHeader closeButton>
                        <CModalTitle>Edit Timesheet</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <Formik
                            initialValues={{
                                employeeId: editData.employeeId,
                                date: moment(editData.date).format('YYYY-MM-DD'),
                                hours: editData.hours,
                                remarks: editData.remarks,
                            }}
                            validationSchema={
                                Yup.object().shape({
                                    // if role is admin then employeeId is required else not
                                    employeeId: Yup.string().when("role", {
                                        is: "admin",
                                        then: Yup.string().required("Employee is required"),
                                    }),
                                    date: Yup.string().required("Date is required"),
                                    hours: Yup.string().required("Hours is required"),
                                    remarks: Yup.string().required("Remarks is required"),
                                })
                            }
                            onSubmit={async (values) => {

                                const data = {
                                    ...values,
                                    id: editData.id,
                                }
                                const response = await axios.post(`${configData.SERVER_URL}/timesheet/updateTimesheet`, data, {
                                    withCredentials: true,
                                }).then((response) => {

                                    if (response.data.status == 200) {
                                        const updatedData = timesheet.map((data) => {
                                            if (data.id == editData.id) {
                                                return response.data.data;
                                            }
                                            return data;
                                        }
                                        );
                                        setTimesheet(updatedData);
                                        setEditModal(false);
                                    }
                                }).catch((error) => {
                                    console.log(`Error while updating timesheet ${error}`);
                                });

                            }}
                        >
                            {(props) => (
                                <CForm onSubmit={props.handleSubmit}>
                                    <CRow>
                                        {
                                            role == "ADMIN" &&
                                            <CCol sm={12}>
                                                <CFormLabel>Employee</CFormLabel>
                                                <CFormSelect
                                                    name="employeeId"
                                                    onChange={(e) => {
                                                        props.setFieldValue("employeeId", e.target.value);
                                                    }
                                                    }
                                                    onBlur={props.handleBlur}
                                                    value={props.values.employeeId}
                                                    className={
                                                        props.errors.employeeId && props.touched.employeeId
                                                            ? "is-invalid"
                                                            : null
                                                    }
                                                >
                                                    <option value="">Select Employee</option>
                                                    {employee.map((data) => (
                                                        <option value={data.id}>{data.name}</option>
                                                    ))}
                                                </CFormSelect>
                                                {props.errors.employeeId && props.touched.employeeId && (
                                                    <div className="invalid-feedback">
                                                        {props.errors.employeeId}
                                                    </div>
                                                )}
                                            </CCol>
                                        }
                                        <CCol sm={12}>
                                            <CFormLabel>Date</CFormLabel>
                                            <CFormInput
                                                type="date"
                                                name="date"
                                                onChange={(e) => {
                                                    props.setFieldValue("date", e.target.value);
                                                }}
                                                onBlur={props.handleBlur}
                                                value={props.values.date}
                                                className={
                                                    props.errors.date && props.touched.date
                                                        ? "is-invalid"
                                                        : null
                                                }
                                            />
                                            {props.errors.date && props.touched.date && (
                                                <div className="invalid-feedback">
                                                    {props.errors.date}
                                                </div>
                                            )}
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Hours</CFormLabel>
                                            <CFormInput
                                                type='text'
                                                name="hours"
                                                onChange={(e) => {
                                                    props.setFieldValue("hours", e.target.value);
                                                }}
                                                onBlur={props.handleBlur}
                                                value={props.values.hours}
                                                className={
                                                    props.errors.hours && props.touched.hours
                                                        ? "is-invalid"
                                                        : null
                                                }
                                            />

                                            {props.errors.hours && props.touched.hours && (
                                                <div className="invalid-feedback">
                                                    {props.errors.hours}
                                                </div>
                                            )}
                                        </CCol>
                                        <CCol sm={12}>
                                            <CFormLabel>Remarks</CFormLabel>
                                            <CFormTextarea
                                                name="remarks"
                                                onChange={(e) => {
                                                    props.setFieldValue("remarks", e.target.value);
                                                }}
                                                onBlur={props.handleBlur}
                                                value={props.values.remarks}
                                                className={
                                                    props.errors.remarks && props.touched.remarks
                                                        ? "is-invalid"
                                                        : null
                                                }
                                                rows={5}
                                            />
                                            {props.errors.remarks && props.touched.remarks && (
                                                <div className="invalid-feedback">
                                                    {props.errors.remarks}
                                                </div>
                                            )}
                                        </CCol>
                                    </CRow>
                                    <CModalFooter>
                                        <CButton color="secondary" onClick={() => setEditModal(false)}>
                                            Cancel
                                        </CButton>
                                        <CButton color="info" type="submit">
                                            Update
                                        </CButton>
                                    </CModalFooter>
                                </CForm>
                            )}

                        </Formik>
                    </CModalBody>

                </CModal>

            }




            {
                viewModal &&
                <CModal
                    visible={viewModal}
                    onClose={() => setViewModal(false)}
                    color="info"
                >
                    <CModalHeader closeButton>
                        <CModalTitle>View Timesheet</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CRow>
                            {
                                role == "ADMIN" &&
                                <CCol sm={12}>
                                    <CFormLabel>Employee</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        name="employeeId"
                                        value={viewData.name}
                                        readOnly
                                    />
                                </CCol>
                            }
                            <CCol sm={12}>
                                <CFormLabel>Date</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="date"
                                    value={moment(viewData.date).format('DD/MM/YYYY')}
                                    readOnly
                                />
                            </CCol>
                            <CCol sm={12}>
                                <CFormLabel>Hours</CFormLabel>
                                <CFormInput
                                    type='text'
                                    name="hours"
                                    value={viewData.hours}
                                    readOnly
                                />
                            </CCol>
                            <CCol sm={12}>
                                <CFormLabel>Remarks</CFormLabel>
                                <CFormTextarea
                                    name="remarks"
                                    value={viewData.remarks}
                                    readOnly
                                    rows={5}
                                />
                            </CCol>
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setViewModal(false)}>
                            Cancel
                        </CButton>
                    </CModalFooter>
                </CModal>

            }


            <CModal
                visible={addTimesheetModal}
                onClose={() => setAddTimesheetModal(false)}
                color="info"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Add Timesheet</CModalTitle>
                </CModalHeader>
                <Formik
                    initialValues={{
                        employeeId: "",
                        date: "",
                        hours: "",
                        remarks: "",
                    }}
                    validationSchema={
                        Yup.object().shape({
                            // if role is admin then employeeId is required else not
                            employeeId: Yup.string().when("role", {
                                is: "admin",
                                then: Yup.string().required("Employee is required"),
                            }),
                            date: Yup.string().required("Date is required"),
                            hours: Yup.string().required("Hours is required"),
                            remarks: Yup.string().required("Remarks is required"),
                        })
                    }
                    onSubmit={(values) => {
                        handleAddTimesheet(values)
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        /* and other goodies */
                    }) => (
                        <CForm onSubmit={handleSubmit}>
                            <CModalBody>
                                <CRow>
                                    {
                                        role == "ADMIN" &&
                                        <CCol sm={12}>
                                            <CFormLabel>Employee</CFormLabel>
                                            <CFormSelect
                                                name="employeeId"
                                                onChange={(e) => {
                                                    setFieldValue("employeeId", e.target.value);
                                                }}
                                                onBlur={handleBlur}
                                                value={values.employeeId}
                                                className={
                                                    errors.employeeId && touched.employeeId
                                                        ? "is-invalid"
                                                        : null
                                                }
                                            >
                                                <option value="">Select Employee</option>
                                                {employee.map((data) => (
                                                    <option value={data.id}>{data.name}</option>
                                                ))}
                                            </CFormSelect>
                                            {errors.employeeId && touched.employeeId && (
                                                <div className="invalid-feedback">
                                                    {errors.employeeId}
                                                </div>
                                            )}
                                        </CCol>
                                    }
                                    <CCol sm={12}>
                                        <CFormLabel>Date</CFormLabel>
                                        <CFormInput
                                            type="date"
                                            name="date"
                                            onChange={(e) => {
                                                setFieldValue("date", e.target.value);
                                            }}
                                            onBlur={handleBlur}
                                            value={values.date}
                                            className={
                                                errors.date && touched.date
                                                    ? "is-invalid"
                                                    : null
                                            }
                                        />
                                        {errors.date && touched.date && (
                                            <div className="invalid-feedback">
                                                {errors.date}
                                            </div>
                                        )}
                                    </CCol>
                                    <CCol sm={12}>
                                        <CFormLabel>Hours</CFormLabel>
                                        <CFormInput
                                            type='text'
                                            name="hours"
                                            onChange={(e) => {
                                                setFieldValue("hours", e.target.value);
                                            }
                                            }
                                            onBlur={handleBlur}
                                            value={values.hours}
                                            className={
                                                errors.hours && touched.hours
                                                    ? "is-invalid"
                                                    : null
                                            }
                                        />

                                        {errors.hours && touched.hours && (
                                            <div className="invalid-feedback">
                                                {errors.hours}
                                            </div>
                                        )}
                                    </CCol>
                                    <CCol sm={12}>
                                        <CFormLabel>Remarks</CFormLabel>
                                        <CFormTextarea
                                            name="remarks"
                                            onChange={(e) => {
                                                setFieldValue("remarks", e.target.value);
                                            }}
                                            onBlur={handleBlur}
                                            value={values.remarks}
                                            className={
                                                errors.remarks && touched.remarks
                                                    ? "is-invalid"
                                                    : null
                                            }
                                            rows={5}
                                        />
                                        {errors.remarks && touched.remarks && (
                                            <div className="invalid-feedback">
                                                {errors.remarks}
                                            </div>
                                        )}
                                    </CCol>
                                </CRow>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="secondary" onClick={() => setAddTimesheetModal(false)}>
                                    Cancel
                                </CButton>
                                <CButton color="info" type="submit">
                                    Add
                                </CButton>
                            </CModalFooter>
                        </CForm>

                    )}


                </Formik>
            </CModal>

        </div>
    )
}

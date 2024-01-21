import { CCardBody, CModalHeader, CModal, CModalTitle, CModalBody, CForm, CFormInput, CFormLabel, CRow, CInputGroup, CCol, CCard, CButton, CModalFooter, CCardTitle } from '@coreui/react'
import React from 'react'
import Toaster from 'src/views/shared/Toaster';
import LoadingScreen from 'src/views/shared/Loading';
import { Formik } from "formik";
import * as yup from 'yup';
import configData from "../../../config/constant.json";
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";

const awardType = () => {

    const [awardType, setAwardType] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [addAwardTypeModal, setAddAwardTypeModal] = React.useState(false);
    const [selectedEditAwardType, setSelectedEditAwardType] = React.useState({});
    const [editAwardTypeModal, setEditAwardTypeModal] = React.useState(false);
    const [addToast, setAddToast] = React.useState(false);
    const [role, setRole] = React.useState(false);


    // Function to Add Toaster
    let addToaster = (toast) => {
        setAddToast(toast);
        setTimeout(() => {
            setAddToast(false)
        }, 3000)
    }

    React.useEffect(async () => {
        try {
            const response = await axios.get(`${configData.SERVER_URL}/awardType/getAllAwardTypes`, { withCredentials: true });
            if (response.data.status === 200) {
                setAwardType(response.data.data);
                setLoading(false);
            }
        } catch (error) {
            setError(error);
            setLoading(false);
            let toast = {
                message: "Something went wrong",
                body: error.message,
                status: "error",
            };
            addToaster(toast);
        }
    }, []);

    React.useEffect(() => {
        let userRoles = secureLocalStorage.getItem("userRoles");
        setRole(userRoles);
        console.log("roledesc:", userRoles)
    }, []);

    const handleDeleteAwardType = async (id) => {
        try {
            const response = await axios.post(`${configData.SERVER_URL}/awardType/deleteAwardType/${id}`, { withCredentials: true });

            if (response.data.status == 200) {
                let toast = {
                    message: "Award Type Deleted Successfully",
                    body: response.data.message,
                    status: true,
                };
                addToaster(toast);
                let updatedAwardType = awardType.filter((awardType) => {
                    if (awardType.id != id) {
                        return awardType;
                    }
                });
                setAwardType(updatedAwardType);
            }

        } catch (error) {
            console.log(`Error deleting award type ${id}`, error);
            let toast = {
                message: "Something went wrong",
                body: error.message,
                status: "error",
            };
            addToaster(toast);
        }
    };

    return (
        <>
            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Award Types</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    {role === 'ADMIN' || role === 'HR' ? (
                                        <CButton color="primary" style={{ float: "right" }} onClick={() => {
                                            setAddAwardTypeModal(true);
                                        }}>Add Award Type</CButton>
                                    ) : null}


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
                            <CRow>
                                <CCol sm={12}>
                                    <table className="table table-hover table-outline mb-0 d-none d-sm-table table-bordered">
                                        <thead className="thead-light">
                                            <tr>
                                                <th className="text-center">Award Type</th>
                                                <th className="text-center">Status</th>
                                                {role === 'ADMIN' || role === 'HR' ? (
                                                    <th className="text-center">Action</th>
                                                ) : null}
                                                {/* <th className="text-center">Action</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                loading ? <LoadingScreen /> :
                                                    awardType.map((awardType, index) => (
                                                        <tr key={index}>

                                                            <td className="text-center">
                                                                <div>{awardType.awardType}</div>

                                                            </td>
                                                            <td className="text-center">
                                                                <h6 style={{ color: "green" }}>
                                                                    Active
                                                                </h6>
                                                            </td>

                                                            {role === 'ADMIN' || role === 'HR' ? (
                                                                <td className="text-center">
                                                                    <CButton color="primary" className="mr-2" onClick={() => {
                                                                        setEditAwardTypeModal(true);
                                                                        setSelectedEditAwardType(awardType);
                                                                    }}>Edit</CButton> &nbsp;
                                                                    <CButton color="danger" onClick={() =>
                                                                        handleDeleteAwardType(awardType.id)
                                                                    }>Delete</CButton>
                                                                </td>
                                                            ) : null}
                                                        </tr>
                                                    ))
                                            }
                                        </tbody>
                                    </table>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Add Award Type Modal */}
            <CModal
                visible={addAwardTypeModal}
                onClose={() => setAddAwardTypeModal(false)}
                color="primary"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Add Award Type</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik
                        initialValues={{
                            awardTypeName: ""
                        }}
                        onSubmit={async (values) => {
                            console.log("values", values);
                            try {
                                const response = await axios.post(`${configData.SERVER_URL}/awardType/addAwardType`, values, { withCredentials: true });
                                console.log("response", response);
                                if (response.data.status == 200) {
                                    let toast = {
                                        message: "Award Type Added Successfully",
                                        body: response.data.message,
                                        status: true
                                    };
                                    addToaster(toast);
                                    setAwardType([...awardType, response.data.data]);
                                    setAddAwardTypeModal(false);

                                }
                            } catch (error) {
                                console.log("error", error);
                                let toast = {
                                    message: "Something went wrong",
                                    body: error.message,
                                    status: "error",
                                };
                                addToaster(toast);
                            }
                        }}
                        validationSchema={yup.object().shape({
                            awardTypeName: yup.string().required("Award Type is required"),
                        })}
                    >
                        {(props) => (
                            <>
                                <CForm onSubmit={props.handleSubmit}>
                                    <CFormLabel>Award Type</CFormLabel>
                                    <CInputGroup className="mb-3">
                                        <CFormInput
                                            type="text"
                                            placeholder="Enter Award Type"
                                            name="awardTypeName"
                                            value={props.values.awardTypeName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </CInputGroup>
                                    <CButton color="primary" type="submit">Add Award Type</CButton>
                                </CForm>

                            </>
                        )}
                    </Formik>
                </CModalBody>
            </CModal>

            {/* Edit Award Type Modal */}
            <CModal
                visible={editAwardTypeModal}
                onClose={() => setEditAwardTypeModal(false)}
                color="primary"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Edit Award Type</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik
                        initialValues={{
                            awardTypeName: selectedEditAwardType.awardType
                        }}
                        onSubmit={async (values) => {
                            console.log("values", values);
                            try {
                                let data = {
                                    awardId: selectedEditAwardType.id,
                                    awardType: values.awardTypeName
                                }
                                const response = await axios.post(`${configData.SERVER_URL}/awardType/updateAwardType`, data, { withCredentials: true });
                                console.log("response", response);
                                if (response.data.status == 200) {
                                    let toast = {
                                        message: "Award Type Updated Successfully",
                                        body: response.data.message,
                                        status: true,
                                    };
                                    addToaster(toast);
                                    let updatedAwardType = awardType.map((awardType) => {
                                        if (awardType.id == selectedEditAwardType.id) {
                                            awardType.awardType = values.awardTypeName;
                                        }
                                        return awardType;
                                    });
                                    setAwardType(updatedAwardType);

                                    setEditAwardTypeModal(false);

                                }
                            } catch (error) {
                                // if status code is 422 that means validation error
                                if (error.response.status == 422) {
                                    let toast = {
                                        message: "Validation Error",
                                        body: error.response.data.message,
                                        status: "error",
                                    };
                                    addToaster(toast);
                                } else {
                                    let toast = {
                                        message: "Something went wrong",
                                        body: error.message,
                                        status: "error",
                                    };
                                    addToaster(toast);
                                }
                            }
                        }}
                        validationSchema={yup.object().shape({
                            awardTypeName: yup.string().required("Award Type is required"),
                        })}
                    >
                        {(props) => (
                            <>
                                <CForm onSubmit={props.handleSubmit}>
                                    <CFormLabel>Award Type</CFormLabel>
                                    <CInputGroup className="mb-3">
                                        <CFormInput
                                            type="text"
                                            placeholder="Enter Award Type"
                                            name="awardTypeName"
                                            value={props.values.awardTypeName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </CInputGroup>
                                    <CButton color="primary" type="submit">Update Award Type</CButton>
                                </CForm>

                            </>
                        )}
                    </Formik>
                </CModalBody>
            </CModal>






            {/* Toaster */}
            {
                addToast &&



                <Toaster body={addToast.body} message={addToast.message} status={addToast.status} />
            }

        </>
    );
}

export default awardType;
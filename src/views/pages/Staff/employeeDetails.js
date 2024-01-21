import { CCardBody, CRow, CCol, CCard, CCardTitle } from '@coreui/react'
import React from 'react'
import Toaster from 'src/views/shared/Toaster';
import LoadingScreen from 'src/views/shared/Loading';
import configData from "../../../config/constant.json";
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { logoutUser } from 'src/utils/auth_service';
import { Link } from 'react-router-dom';

const employeeDetail = (props) => {

    const [toast, addToast] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [employeeData, setEmployeeData] = React.useState([]);

    // Function to Add Toaster
    let addToaster = (toast) => {
        addToast(toast)
        setTimeout(() => {
            addToast(false)
        }, 3000)
    }

    const labelStyle = {
        fontWeight: 'bold',
        marginBottom: '5px',
    };

    React.useEffect(async () => {
        try {

            const id = props.location.state.id;
            const response = await axios.get(`${configData.SERVER_URL}/employee/getEmployeeById/${id}`, { withCredentials: true },)

            console.log("response", response.data.data);
            setEmployeeData(response.data.data)
            setLoading(false)

        } catch (error) {
            console.log(`😱 Axios request failed: ${error}`);

            let toast = {
                message: error.message || "Something Went Wrong",
                heading: 'Error',
                type: 'error'
            }
            addToaster(toast)

        }

    }, []);

    return (
        <div >
            {

                toast && <Toaster message={toast.message} status={toast.status} body={toast.body} ></Toaster>
            }
            <CRow style={{ margin: '20px' }}>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Employee Details</CCardTitle></CCol>
                                <CCol sm={5}></CCol>

                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {
                loading ? <LoadingScreen /> : employeeData &&

                    <>
                        <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                            <CCardBody>
                                <CCardTitle style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Personal Details</CCardTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <p style={labelStyle}>Employee Id:</p>
                                        <p>{employeeData.id}</p>

                                        <p style={labelStyle}>Email:</p>
                                        <p>{employeeData.email}</p>

                                        <p style={labelStyle}>Phone:</p>
                                        <p>{employeeData.phone}</p>

                                        <p style={labelStyle}>Basic Salary:</p>
                                        <p>{employeeData.basicSalary}</p>
                                    </div>
                                    <div>
                                        <p style={labelStyle}>Name:</p>
                                        <p>{employeeData.name}</p>

                                        <p style={labelStyle}>Date of Birth:</p>
                                        <p>{employeeData.dob}</p>

                                        <p style={labelStyle}>Address:</p>
                                        <p>{employeeData.address}</p>

                                        <p style={labelStyle}>Salary Type:</p>
                                        <p>{employeeData.salaryType}</p>
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>
                        <CCard style={{ margin: '20px', padding: '20px', flex: '1' }}>
                            <CCardBody>
                                <CCardTitle style={{ marginBottom: '20px' }}>Company Details</CCardTitle>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <p style={labelStyle}>Branch:</p>
                                            <p>{employeeData.branchName}</p>

                                            <p style={labelStyle}>Department:</p>
                                            <p>{employeeData.departmentName}</p>


                                        </div>
                                        <div>
                                            <p style={labelStyle}>Designation:</p>
                                            <p>{employeeData.designationName}</p>

                                            <p style={labelStyle}>Date of Joining:</p>
                                            <p>{employeeData.doj}</p>


                                        </div>
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>
                        <CCard style={{ margin: '20px', padding: '20px', flex: '1' }}>
                            <CCardBody>
                                <CCardTitle>Document Details</CCardTitle>
                                {/* Pancard and aadharcard downloadable link here  */}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <p style={labelStyle}>PHOTO:</p>
                                            {employeeData.photo ? (
                                                <a 
                                                // href='http://localhost:5000/uploads/a1a6f64a8adb1502e05595684d295835.pdf' 
                                                href={employeeData.photo}
                                                target="_blank" rel="noopener noreferrer" download>
                                                    Download
                                                </a>
                                            ) : (
                                                <p>Not Uploaded</p>
                                            )}
                                        </div>
                                        <div>
                                            <p style={labelStyle}>Resume:</p>
                                            {employeeData.resume ? (
                                                <a href={employeeData.resume} target="_blank" rel="noopener noreferrer" download>
                                                    Download
                                                </a>
                                            ) : (
                                                <p>Not Uploaded</p>
                                            )}

                                        </div>
                                    </div>
                                </div>

                            </CCardBody>
                        </CCard>
                        <CCard style={{ margin: '20px', padding: '20px', flex: '1' }}>
                            <CCardBody>
                                <CCardTitle>Bank Details</CCardTitle>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <p style={labelStyle}>Account Holder Name:</p>
                                            <p>{employeeData.accountHolderName}</p>

                                            <p style={labelStyle}>Bank Name:</p>
                                            <p>{employeeData.bankName}</p>

                                            <p style={labelStyle}>Account Number:</p>
                                            <p>{employeeData.accountNumber}</p>
                                        </div>
                                        <div>
                                            <p style={labelStyle}>Bank Identifier Code:</p>
                                            <p>{employeeData.bankIdentifierCode}</p>
                                            <p style={labelStyle}>Bank Identifier Code:</p>
                                            <p>{employeeData.bankIdentifierCode}</p>

                                            <p style={labelStyle}>Branch Location:</p>
                                            <p>{employeeData.branchLocation}</p>
                                        </div>
                                    </div>
                                </div>

                            </CCardBody>
                        </CCard>
                    </>
            }
        </div>);
}

export default employeeDetail;
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

export default function employee(props) {

    const [toast, addToast] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [employeeData, setEmployeeData] = React.useState([]);
    const [addEmpModal, setAddEmpModal] = React.useState(false);
    const [branch, setBranch] = React.useState([]);
    const [department, setDepartment] = React.useState([]);
    const [designation, setDesignation] = React.useState([]);
    const [role, setRole] = React.useState(secureLocalStorage.getItem("userRoles"));
    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);
    const [employeeId, setEmployeeId] = React.useState(null);
    const [editModal, setEditModal] = React.useState(false);
    const [editData, setEditData] = React.useState(null);

    // Function to Add Toaster
    let addToaster = (toast) => {
        addToast(toast)
        setTimeout(() => {
            addToast(false)
        }, 3000)
    }

    React.useEffect(() => {
        try {
            const token = secureLocalStorage.getItem("token");
            const fetchData = async () => {
                let response = await axios.get(`${configData.SERVER_URL}/employee/getAllEmployees`, { withCredentials: true },
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
                setEmployeeData(response.data.data);
                setLoading(false);
            }
            fetchData();

        } catch (error) {
            if (error.response.data.status === 401 || error.response.data.status === 500) {
                // redirect to login page if user is not authenticated or token expired
                logoutUser();
            } else {
                console.log(`Error in fetching employee data : ${error}`);
                let toast = {
                    status: false,
                    body: "An error occurred while fetching employee data",
                    message: "Failed",
                };
                addToaster(toast);
                setLoading(false);
            }
        }
    }, [])

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = secureLocalStorage.getItem("token");
                let response = await axios.get(`${configData.SERVER_URL}/branch/getAllBranches`, { withCredentials: true },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    })
                if (response.data.status == false) {
                    throw Error(response.data.message);
                }
                setBranch(response.data.data);
            } catch (error) {
                // setError(true);
            }
        }
        fetchData();

    }, []);

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
            console.log("response", response);
            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            console.log("response", response.data.data);
            setDepartment(response.data.data);


        } catch (error) {
            console.log("error", error);
        }
    }

    const handleFetchDesignationByDepartmentId = async (departmentId) => {
        try {
            let token = secureLocalStorage.getItem("token");

            let response = await axios.get(`${configData.SERVER_URL}/designation/getAllDesignationsByDepartmentId/${departmentId}`, { withCredentials: true },
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
            console.log("response", response.data.data);
            setDesignation(response.data.data);
        } catch (error) {
            console.log("error", error);
        }
    }

    const initialsValues = {
        name: "",
        phone: "",
        dob: "",
        gender: "",
        email: "",
        password: "",
        branch: "",
        department: "",
        designation: "",
        doj: "",
        photo: "",
        resume: "",
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        bankIdentifierCode: "",
        branchLocation: "",
    }

    const validationSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        phone: yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .min(10, "Must be exactly 10 digits")
            .max(10, "Must be exactly 10 digits")
            .required("Phone is required"),
        dob: yup.date()
            // .max(new Date(), "Birthdate cannot be in the future")
            // .test(
            //     "age",
            //     "You must be at least 18 years old",
            //     function (value) {
            //         const today = new Date();
            //         const eighteenYearsAgo = new Date();
            //         eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
            //         return value <= eighteenYearsAgo;
            //     }
            .required("Date of Birth is required"),
        gender: yup.string()
            // .oneOf(["MALE", "FEMALE", "TRANSGENDER"], "Invalid gender")
            .required("Gender is required"),
        email: yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        branch: yup.string().required("Branch is required"),
        department: yup.string().required("Department is required"),
        designation: yup.string().required("Designation is required"),
        doj: yup.date()
            .required("Date of Joining is required"),
        photo: yup.string().required("photo is required"),
        resume: yup.string().required("RESUME is required"),
        accountHolderName: yup.string().required("Account Holder Name is required"),
        accountNumber: yup.number().required("Account Number is required"),
        bankName: yup.string().required("Bank Name is required"),
        bankIdentifierCode: yup.string().required("Bank Identifier Code is required"),
        branchLocation: yup.string().required("Branch Location is required"),
    });

    const handleAddEmployee = async () => {
        setAddEmpModal(true);
    }

    const labelStyle = {
        fontWeight: 'bold',
        marginBottom: '5px',
    };

    const handleSaveEmployee = async (data) => {
        try {
            const token = secureLocalStorage.getItem("token");

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("phone", data.phone);
            formData.append("dob", data.dob);
            formData.append('gender', data.gender);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('branch', data.branch);
            formData.append('department', data.department);
            formData.append('designation', data.designation);
            formData.append('doj', data.doj);
            formData.append('photo', data.photo);
            formData.append('resume', data.resume);
            formData.append('accountHolderName', data.accountHolderName);
            formData.append('accountNumber', data.accountNumber);
            formData.append('bankName', data.bankName);
            formData.append('bankIdentifierCode', data.bankIdentifierCode);
            formData.append('branchLocation', data.branchLocation);

            const response = await axios.post(`${configData.SERVER_URL}/employee/addEmployee`, formData
                , { withCredentials: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })

            if (response.data.status == false) {
                throw Error(response.data.message);
            }

            let toast = {
                status: true,
                body: "Employee Added Successfully",
                message: "Success",
            };

            addToaster(toast);
            setAddEmpModal(false);
            console.log("response", response.data.data);
            setEmployeeData([...employeeData, response.data.data.employeeData]);

        } catch (error) {
            console.log("error", error);
            let toast = {
                status: false,
                body: "An error occurred while adding employee",
                message: "Failed",
            };
            addToaster(toast);
            setAddEmpModal(false);
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
        setCurrentItems(employeeData.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(employeeData.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, employeeData]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % employeeData.length;
        setItemOffset(newOffset);
    };

    const confirmationModal = (id) => {
        setShowConfirmationModal(true);
        setEmployeeId(id);
    }

    return (
        <div >

            {/* if role === ADMIN */}
            {/* Add Employee Button to the right */}
            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Employee</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    <CButton color="primary" style={{ float: "right" }} onClick={handleAddEmployee}>Add Employee</CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* role === EMPLOYEE */}
            {
                role === 'EMPLOYEE' &&
                <div >
                    <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                        <CCardBody>
                            <CCardTitle style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Personal Details</CCardTitle>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <p style={labelStyle}>Employee Id:</p>
                                    <p>123</p>

                                    <p style={labelStyle}>Email:</p>
                                    <p>johndoe@example.com</p>

                                    <p style={labelStyle}>Phone:</p>
                                    <p>(123) 456-7890</p>

                                    <p style={labelStyle}>Basic Salary:</p>
                                    <p>$60,000</p>
                                </div>
                                <div>
                                    <p style={labelStyle}>Name:</p>
                                    <p>John Doe</p>

                                    <p style={labelStyle}>Date of Birth:</p>
                                    <p>01/01/1990</p>

                                    <p style={labelStyle}>Address:</p>
                                    <p>123 Main St, City</p>

                                    <p style={labelStyle}>Salary Type:</p>
                                    <p>Monthly</p>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                    {/* Company Details Card */}
                    <CCard style={{ margin: '20px', padding: '20px', flex: '1' }}>
                        <CCardBody>
                            <CCardTitle style={{ marginBottom: '20px' }}>Company Details</CCardTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <p style={labelStyle}>Branch:</p>
                                        <p>Canada</p>

                                        <p style={labelStyle}>Department:</p>
                                        <p>Tech</p>


                                    </div>
                                    <div>
                                        <p style={labelStyle}>Designation:</p>
                                        <p>Senior</p>

                                        <p style={labelStyle}>Date of Joining:</p>
                                        <p>01/01/1990</p>


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
                                        <a href="https://www.w3schools.com">Download</a>
                                    </div>
                                    <div>
                                        <p style={labelStyle}>ADHAR CARD:</p>
                                        <a href="https://www.w3schools.com">Download</a>

                                    </div>
                                </div>
                            </div>

                        </CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>
                            <CCardTitle>Bank Account Details</CCardTitle>
                            <CButton color="primary">In Process</CButton>
                        </CCardBody>
                    </CCard>
                </div>
            }
            {
                role === 'ADMIN' &&
                <div>
                    <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                        <CCardBody>
                        <CRow>
                                <CCol>
                                    <CCardTitle style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Employee Details</CCardTitle>
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
                                        <th className="text-center">Employee Id</th>
                                        <th className="text-center">Name</th>
                                        <th className="text-center">Email</th>
                                        <th className="text-center">Phone</th>
                                        <th className="text-center">Branch</th>
                                        <th className="text-center">Department</th>
                                        <th className="text-center">Designation</th>
                                        <th className="text-center">Date of Joining</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading && <LoadingScreen /> ||

                                            search == '' ?
                                            currentItems.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="text-center">{item.id}</td>
                                                        <td className="text-center">{item.name}</td>
                                                        <td className="text-center">{item.email}</td>
                                                        <td className="text-center">{item.phone}</td>
                                                        <td className="text-center">{item.branchName}</td>
                                                        <td className="text-center">{item.departmentName}</td>
                                                        <td className="text-center">{item.designationName}</td>
                                                        <td className="text-center">{item.doj}</td>
                                                        <td className="text-center">

                                                            <CButton color="primary" onClick={() => {
                                                                console.log("item", item);
                                                                setEditModal(true);
                                                                setEditData(item);
                                                                console.log("editData", item);
                                                            }} >Edit</CButton> &nbsp;
                                                            <CButton color="danger" onClick={() => {
                                                                confirmationModal(item.id)
                                                            }} >Delete</CButton>
                                                        </td>
                                                    </tr>
                                                ) || <LoadingScreen />
                                            })
                                            : employeeData
                                                .filter((val) => {
                                                    const searchLower = search.toLowerCase();
                                                    return (
                                                        val.name.toLowerCase().includes(searchLower) ||
                                                        val.email.toLowerCase().includes(searchLower) ||
                                                        val.phone.toLowerCase().includes(searchLower) ||
                                                        val.branchName.toLowerCase().includes(searchLower) ||
                                                        val.departmentName.toLowerCase().includes(searchLower) ||
                                                        val.designationName.toLowerCase().includes(searchLower)
                                                    );
                                                })
                                                .map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="text-center">{item.id}</td>
                                                            <td className="text-center">{item.name}</td>
                                                            <td className="text-center">{item.email}</td>
                                                            <td className="text-center">{item.phone}</td>
                                                            <td className="text-center">{item.branchName}</td>
                                                            <td className="text-center">{item.departmentName}</td>
                                                            <td className="text-center">{item.designationName}</td>
                                                            <td className="text-center">{item.doj}</td>
                                                            <td className="text-center">
                                                                <Link to={{ pathname: "/pages/employeeDetail", state: { data: item } }}>
                                                                    <CButton color="primary">View</CButton>
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

                    {/* Confirmation Modal */}
                    {
                        <CModal
                            keyboard
                            visible={showConfirmationModal}
                            alignment="top"
                            onClose={() => setShowConfirmationModal(false)}
                            backdrop='static'
                            scrollable
                            size='lg'
                        >
                            <CModalHeader closeButton>
                                <CModalTitle>Confirmation</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <p>Are you sure you want to delete this employee?</p>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="danger" onClick={() => setShowConfirmationModal(false)}>Cancel</CButton>
                                <CButton color="primary" onClick={() => { }}>Delete</CButton>
                            </CModalFooter>
                        </CModal>
                    }
                </div>
            }

            {/* Add Employee Modal */}
            {
                <CModal
                    keyboard
                    visible={addEmpModal}
                    alignment="center"
                    onClose={() => setAddEmpModal(false)}
                    backdrop='static'
                    scrollable
                    size='xl'
                >
                    <Formik
                        initialValues={initialsValues}
                        onSubmit={(values) => {
                            console.log("values", values);
                            handleSaveEmployee(values)
                        }}
                        validationSchema={validationSchema}
                    >
                        {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue, }) => (
                            <>
                                <CModalHeader onClose={() => setAddEmpModal(false)}>
                                    <CModalTitle>ADD EMPLOYEE</CModalTitle>
                                </CModalHeader><CModalBody>

                                    <CForm onSubmit={handleSubmit}>
                                        {/* Personal Details Card */}
                                        <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                                            <CCardTitle style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Personal Details</CCardTitle>
                                            <CCardBody>
                                                <CRow>
                                                    <CCol>
                                                        <CFormLabel style={labelStyle}>Name</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="text"
                                                                name="name"
                                                                placeholder="Enter Name"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.name}
                                                                valid={touched.name && !errors.name}
                                                                invalid={touched.name && errors.name} />

                                                        </CInputGroup>
                                                        {errors.name && touched.name && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.name}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Phone</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="number"
                                                                name="phone"
                                                                placeholder="Enter Phone"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.phone}
                                                                valid={touched.phone && !errors.phone}
                                                                invalid={touched.phone && errors.phone} />
                                                        </CInputGroup>
                                                        {errors.phone && touched.phone && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.phone}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Date of Birth</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="date"
                                                                name="dob"
                                                                placeholder="Enter Date of Birth"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.dob}
                                                                valid={touched.dob && !errors.dob}
                                                                invalid={touched.dob && errors.dob} />
                                                        </CInputGroup>
                                                        {errors.dob && touched.dob && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.dob}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Gender</CFormLabel>
                                                        <CInputGroup className="mb-3" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>

                                                            {['MALE', 'FEMALE', 'TRANSGENDER'].map((gender) => (
                                                                <CFormCheck
                                                                    key={gender}
                                                                    type="radio"
                                                                    id={`${gender.toLowerCase()}Radio`}
                                                                    name="gender"
                                                                    label={gender}
                                                                    value={gender.toLowerCase()}
                                                                    onChange={handleChange} />
                                                            ))}
                                                        </CInputGroup>
                                                        {errors.gender && touched.gender && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.gender}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Email</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="text"
                                                                name="email"
                                                                placeholder="Enter Email"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.email}
                                                                valid={touched.email && !errors.email}
                                                                invalid={touched.email && errors.email} />
                                                        </CInputGroup>

                                                        {errors.email && touched.email && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.email}</div>
                                                        )}
                                                        <CFormLabel style={labelStyle}>Password</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="password"
                                                                name="password"
                                                                placeholder="Enter Password"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.password}
                                                                valid={touched.password && !errors.password}
                                                                invalid={touched.password && errors.password} />
                                                        </CInputGroup>

                                                        {errors.password && touched.password && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.password}</div>
                                                        )}

                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        {/* Company Details Card */}
                                        <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                                            <CCardTitle style={{ marginBottom: '20px' }}>Company Details</CCardTitle>
                                            <CCardBody>
                                                <CRow>
                                                    <CCol>
                                                        <CFormLabel style={labelStyle}>Branch</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormSelect
                                                                name="branch"
                                                                placeholder="Enter Branch"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    handleFetchDepatmentByBranchId(e.target.value);
                                                                }}
                                                                onBlur={handleBlur}
                                                                value={values.branch}
                                                                valid={touched.branch && !errors.branch}
                                                                invalid={touched.branch && errors.branch}
                                                            >
                                                                <option value="">Select Branch</option>
                                                                {branch.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item.id}>{item.branchName}</option>
                                                                    );
                                                                })}
                                                            </CFormSelect>
                                                        </CInputGroup>
                                                        {errors.branch && touched.branch && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.branch}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Department</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormSelect
                                                                name="department"
                                                                placeholder="Enter Department"
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    handleFetchDesignationByDepartmentId(e.target.value);
                                                                }}
                                                                onBlur={handleBlur}
                                                                value={values.department}
                                                                valid={touched.department && !errors.department}
                                                                invalid={touched.department && errors.department}
                                                            >
                                                                <option value="">Select Department</option>
                                                                {department.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item.id}>{item.departmentName}</option>
                                                                    );
                                                                })}
                                                            </CFormSelect>
                                                        </CInputGroup>
                                                        {errors.department && touched.department && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.department}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Designation</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormSelect
                                                                name="designation"
                                                                placeholder="Enter Designation"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.designation}
                                                                valid={touched.designation && !errors.designation}
                                                                invalid={touched.designation && errors.designation}
                                                            >
                                                                <option value="">Select Designation</option>
                                                                {designation.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item.id}>{item.designationName}</option>
                                                                    );
                                                                })}
                                                            </CFormSelect>

                                                        </CInputGroup>
                                                        {errors.designation && touched.designation && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.designation}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Date of Joining</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="date"
                                                                name="doj"
                                                                placeholder="Enter Date of Joining"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.doj}
                                                                valid={touched.doj && !errors.doj}
                                                                invalid={touched.doj && errors.doj} />
                                                        </CInputGroup>
                                                        {errors.doj && touched.doj && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.doj}</div>
                                                        )}


                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        {/* Document Details Card */}
                                        <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                                            <CCardTitle style={{ marginBottom: '20px' }}>Document Details</CCardTitle>
                                            <CCardBody>
                                                <CRow>
                                                    <CCol>
                                                        <CFormLabel style={labelStyle}>PHOTO</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            {/* // file upload here  */}
                                                            <CFormInput
                                                                type='file'
                                                                name="photo"
                                                                accept='image/*'
                                                                placeholder="Enter PHOTO"
                                                                // set the value of file to formik
                                                                onChange={(e) => { setFieldValue("photo", e.target.files[0]) }}
                                                                onBlur={handleBlur}
                                                                // value={values.panCard}
                                                                valid={touched.photo && !errors.photo}
                                                                invalid={touched.photo && errors.photo} />
                                                        </CInputGroup>
                                                        {values.photo && values.photo.name && (
                                                            <div>{values.photo.name}</div>
                                                        )}
                                                        {errors.photo && touched.photo && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.photo}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>RESUME</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="file"
                                                                name="resume"
                                                                placeholder="Enter RESUME"
                                                                onChange={(e) => { setFieldValue("resume", e.target.files[0]) }}
                                                                onBlur={handleBlur}
                                                                // value={values.resume}
                                                                valid={touched.resume && !errors.resume}
                                                                invalid={touched.resume && errors.resume} />
                                                        </CInputGroup>
                                                        {
                                                            values.resume && values.resume.name && (
                                                                <div>{values.resume.name}</div>
                                                            )
                                                        }
                                                        {errors.resume && touched.resume && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.resume}</div>
                                                        )}

                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        {/* Bank Details Card */}
                                        <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                                            <CCardTitle style={{ marginBottom: '20px' }}>Bank Details</CCardTitle>
                                            <CCardBody>
                                                <CRow>
                                                    <CCol>
                                                        <CFormLabel style={labelStyle}>Account Holder Name</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="text"
                                                                name="accountHolderName"
                                                                placeholder="Enter Account Holder Name"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.accountHolderName}
                                                                valid={touched.accountHolderName && !errors.accountHolderName}
                                                                invalid={touched.accountHolderName && errors.accountHolderName} />
                                                        </CInputGroup>
                                                        {errors.accountHolderName && touched.accountHolderName && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.accountHolderName}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Account Number</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="text"
                                                                name="accountNumber"
                                                                placeholder="Enter Account Number"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.accountNumber}
                                                                valid={touched.accountNumber && !errors.accountNumber}
                                                                invalid={touched.accountNumber && errors.accountNumber} />

                                                        </CInputGroup>
                                                        {errors.accountNumber && touched.accountNumber && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.accountNumber}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Bank Name</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="text"
                                                                name="bankName"
                                                                placeholder="Enter Bank Name"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.bankName}
                                                                valid={touched.bankName && !errors.bankName}
                                                                invalid={touched.bankName && errors.bankName} />
                                                        </CInputGroup>
                                                        {errors.bankName && touched.bankName && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.bankName}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Bank Identifier Code</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="text"
                                                                name="bankIdentifierCode"
                                                                placeholder="Enter Bank Identifier Code"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.bankIdentifierCode}
                                                                valid={touched.bankIdentifierCode && !errors.bankIdentifierCode}
                                                                invalid={touched.bankIdentifierCode && errors.bankIdentifierCode} />

                                                        </CInputGroup>
                                                        {errors.bankIdentifierCode && touched.bankIdentifierCode && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.bankIdentifierCode}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Branch Location</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="text"
                                                                name="branchLocation"
                                                                placeholder="Enter Branch Location"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.branchLocation}
                                                                valid={touched.branchLocation && !errors.branchLocation}
                                                                invalid={touched.branchLocation && errors.branchLocation} />
                                                        </CInputGroup>

                                                        {errors.branchLocation && touched.branchLocation && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.branchLocation}</div>
                                                        )}
                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                    </CForm>


                                </CModalBody>

                                <CModalFooter>
                                    <CButton color="secondary" onClick={() => setAddEmpModal(false)}>Cancel</CButton>
                                    <CButton color="primary" onClick={handleSubmit}>Save</CButton>

                                </CModalFooter>

                            </>
                        )}
                    </Formik>

                </CModal>
            }

            {/* Edit Employee Modal */}
            
            {
                <CModal
                    keyboard
                    visible={editModal}
                    alignment="center"
                    onClose={() => setEditModal(false)}
                    backdrop='static'
                    scrollable
                    size='xl'
                >
                    {console.log("editModal data:", editModal)}
                    <Formik
                        // set the initial values to the data of the employee to be edited with spread operator to set the values for specfic fields like branch is editData.branchName
                        initialValues={{
                            name: editModal.name,
                            phone: editModal.phone,
                            dob: editModal.dob,
                            email: editModal.email,
                            branch: editModal.branch,
                            department: editModal.department,
                            designation: editModal.designation,
                            doj: editModal.doj,
                            photo: editModal.photo,
                            resume: editModal.resume,
                            accountHolderName:editModal.accountHolderName,
                            accountNumber:editModal.accountNumber,
                            bankName:editModal.bankName,
                            bankIdentifierCode:editModal.bankIdentifierCode,
                            branchLocation:editModal.branchLocation,
                        }}
                        onSubmit={(values) => {
                            console.log("values", values);
                            // handleSaveEmployee(values)
                        }}
                        validationSchema={validationSchema}
                    >
                        {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue, }) => (
                            <>
                                <CModalHeader onClose={() => setEditModal(false)}>
                                    <CModalTitle>EDIT EMPLOYEE</CModalTitle>
                                </CModalHeader><CModalBody>

                                    <CForm onSubmit={handleSubmit}>
                                        {/* Personal Details Card */}
                                        <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                                            <CCardTitle style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Personal Details</CCardTitle>
                                            <CCardBody>
                                                <CRow>
                                                    <CCol>
                                                        <CFormLabel style={labelStyle}>Name</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="text"
                                                                name="name"
                                                                placeholder="Enter Name"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.name}
                                                                valid={touched.name && !errors.name}
                                                                invalid={touched.name && errors.name} />

                                                        </CInputGroup>
                                                        {errors.name && touched.name && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.name}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Phone</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="number"
                                                                name="phone"
                                                                placeholder="Enter Phone"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.phone}
                                                                valid={touched.phone && !errors.phone}
                                                                invalid={touched.phone && errors.phone} />
                                                        </CInputGroup>
                                                        {errors.phone && touched.phone && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.phone}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Date of Birth</CFormLabel>
                                                        <CInputGroup className="mb-3">
                                                            <CFormInput
                                                                type="date"
                                                                name="dob"
                                                                placeholder="Enter Date of Birth"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.dob}
                                                                valid={touched.dob && !errors.dob}
                                                                invalid={touched.dob && errors.dob} />
                                                        </CInputGroup>
                                                        {errors.dob && touched.dob && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.dob}</div>
                                                        )}

                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        {/* Company Details Card */}
                                        <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                                            <CCardTitle style={{ marginBottom: '20px' }}>Company Details</CCardTitle>
                                            <CCardBody>

                                                <CRow>
                                                    <CCol>
                                                        <CFormLabel style={labelStyle}>Branch</CFormLabel>
                                                        <CFormSelect
                                                            type="text"
                                                            name="branch"
                                                            placeholder="Enter Branch"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.branch}
                                                            valid={touched.branch && !errors.branch}
                                                            invalid={touched.branch && errors.branch} >
                                                            <option value="">Select Branch</option>
                                                            {branch.map((item, index) => {
                                                                return (
                                                                    <option
                                                                        key={index}
                                                                        value={item.id}
                                                                        selected={item.id === editData.branchId ? true : false}
                                                                    >{item.branchName}</option>
                                                                );
                                                            })}
                                                        </CFormSelect>

                                                        {errors.branch && touched.branch && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.branch}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Department</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            name="department"
                                                            placeholder="Enter Department"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.department}
                                                            valid={touched.department && !errors.department}
                                                            invalid={touched.department && errors.department} />

                                                        {errors.department && touched.department && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.department}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Designation</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            name="designation"
                                                            placeholder="Enter Designation"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.designation}
                                                            valid={touched.designation && !errors.designation}
                                                            invalid={touched.designation && errors.designation} />

                                                        {errors.designation && touched.designation && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.designation}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Date of Joining</CFormLabel>
                                                        <CFormInput
                                                            type="date"
                                                            name="doj"
                                                            placeholder="Enter Date of Joining"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.doj}
                                                            valid={touched.doj && !errors.doj}
                                                            invalid={touched.doj && errors.doj} />

                                                        {errors.doj && touched.doj && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.doj}</div>
                                                        )}


                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        {/* Document Details Card */}
                                        <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                                            <CCardTitle style={{ marginBottom: '20px' }}>Document Details</CCardTitle>
                                            <CCardBody>
                                                <CRow>
                                                    <CCol>
                                                        <CFormLabel style={labelStyle}>Photo</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            name="photo"
                                                            placeholder="Enter Photo"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.photo}
                                                            valid={touched.photo && !errors.photo}
                                                            invalid={touched.photo && errors.photo} />

                                                        {errors.photo && touched.photo && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.photo}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>RESUME</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            name="resume"
                                                            placeholder="Enter RESUME"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.resume}
                                                            valid={touched.resume && !errors.resume}
                                                            invalid={touched.resume && errors.resume} />

                                                        {errors.resume && touched.resume && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.resume}</div>
                                                        )}

                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>

                                        {/* Bank Details Card */}


                                        <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                                            <CCardTitle style={{ marginBottom: '20px' }}>Bank Details</CCardTitle>

                                            <CCardBody>

                                                <CRow>

                                                    <CCol>

                                                        <CFormLabel style={labelStyle}>Account Holder Name</CFormLabel>

                                                        <CFormInput
                                                            type="text"
                                                            name="accountHolderName"
                                                            placeholder="Enter Account Holder Name"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.accountHolderName}
                                                            valid={touched.accountHolderName && !errors.accountHolderName}
                                                            invalid={touched.accountHolderName && errors.accountHolderName} />

                                                        {errors.accountHolderName && touched.accountHolderName && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.accountHolderName}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Account Number</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            name="accountNumber"
                                                            placeholder="Enter Account Number"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.accountNumber}
                                                            valid={touched.accountNumber && !errors.accountNumber}
                                                            invalid={touched.accountNumber && errors.accountNumber} />

                                                        {errors.accountNumber && touched.accountNumber && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.accountNumber}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Bank Name</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            name="bankName"
                                                            placeholder="Enter Bank Name"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.bankName}
                                                            valid={touched.bankName && !errors.bankName}
                                                            invalid={touched.bankName && errors.bankName} />

                                                        {errors.bankName && touched.bankName && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.bankName}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Bank Identifier Code</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            name="bankIdentifierCode"
                                                            placeholder="Enter Bank Identifier Code"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.bankIdentifierCode}
                                                            valid={touched.bankIdentifierCode && !errors.bankIdentifierCode}
                                                            invalid={touched.bankIdentifierCode && errors.bankIdentifierCode} />

                                                        {errors.bankIdentifierCode && touched.bankIdentifierCode && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.bankIdentifierCode}</div>
                                                        )}

                                                        <CFormLabel style={labelStyle}>Branch Location</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            name="branchLocation"
                                                            placeholder="Enter Branch Location"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.branchLocation}
                                                            valid={touched.branchLocation && !errors.branchLocation}
                                                            invalid={touched.branchLocation && errors.branchLocation} />

                                                        {errors.branchLocation && touched.branchLocation && (
                                                            <div style={{ color: 'red', marginTop: '3px' }}>{errors.branchLocation}</div>
                                                        )}

                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>
                                    </CForm>
                                </CModalBody>

                                <CModalFooter>
                                    <CButton color="secondary" onClick={() => setEditModal(false)}>Cancel</CButton>
                                    <CButton color="primary" onClick={handleSubmit}>Save</CButton>
                                </CModalFooter>

                            </>
                        )}
                    </Formik>

                </CModal>
            }









        </div >
    )
}

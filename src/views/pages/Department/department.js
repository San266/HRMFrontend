import { CCardBody, CModalHeader, CModal, CModalTitle, CModalBody, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CInputGroup, CCol, CCard, CButton, CModalFooter, CCardTitle, CFormCheck, CFormSelect } from '@coreui/react'
import React from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import LoadingScreen from 'src/views/shared/Loading';
import Toaster from 'src/views/shared/Toaster';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

export default function department() {

    const [toast, addToast] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [departmentData, setDepartmentData] = React.useState([]);
    const [addDepModal, setAddDepModal] = React.useState(false);
    const [branches, setBranches] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [updateDepModal, setUpdateDepModal] = React.useState(false);
    const [updateDepData, setUpdateDepData] = React.useState({});
    const [branchId, setBranchId] = React.useState(0);

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

            const response = await axios.get(`http://localhost:5000/api/v1/department/getAllDepartments`, { withCredentials: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            console.log("response", response);
            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            console.log("Data --->", response.data.data);
            setDepartmentData(response.data.data)
            setLoading(false)

        } catch (error) {
            console.log(`Error : ${error}`);
            setLoading(false)
            let toast = {
                "status": false,
                "body": error.message,
                "message": "Failed"
            }
            addToaster(toast)
        }
    }, []);

    React.useEffect(() => {

        const fetchData = async () => {
            try {
                let token = secureLocalStorage.getItem("token");
                let response = await axios.get(`http://localhost:5000/api/v1/branch/getAllBranches`, { withCredentials: true },
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
                setBranches(response.data.data);
                setLoading(false);
            } catch (error) {
                let toast = {
                    "status": false,
                    "body": error.message,
                    "message": "Failed"
                }
                addToaster(toast)
                setLoading(false);
                setError(true);
            }
        }
        fetchData();
    }, []);

    React.useEffect(() => {
        let userRoles = secureLocalStorage.getItem("userRoles");
        setRole(userRoles);
        console.log("roledesc:", userRoles)
    }, []);

    const labelStyle = {
        fontWeight: 'bold',
        marginBottom: '5px',
    };

    const handleAddDepartment = async (values) => {
        try {
            let token = secureLocalStorage.getItem("token");

            values = {
                ...values,
                branchId: parseInt(values.branch)
            }
            const response = await axios.post(`http://localhost:5000/api/v1/department/addDepartment`, values, { withCredentials: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (response.data.status == false) {
                throw Error(response.data.message);
            }

            let toast = {
                "status": true,
                "body": "Department Added Successfully",
                "message": "Success"
            }
            addToaster(toast)
            setDepartmentData([...departmentData, response.data.data]);
            setAddDepModal(false)

        } catch (error) {
            console.log(`Error : ${error}`);
            setLoading(false)
            if (error.message == 'Request failed with status code 400') {
                let toast = {
                    "status": false,
                    "body": "Department Already Exists",
                    "message": "Failed"
                }
                addToaster(toast)
            }
        }
    }

    const handleUpdateDepartment = async (values) => {
        try {
            let token = secureLocalStorage.getItem("token");

            console.log("values", values, updateDepData);
            let updateData = {
                ...values,
                branchId: updateDepData.branchId,
                id: updateDepData.id
            }

            const response = await axios.post(`http://localhost:5000/api/v1/department/updateDepartment`, updateData, { withCredentials: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (response.data.status == false) {
                throw Error(response.data.message);
            }

            let toast = {
                "status": true,
                "body": "Department Updated Successfully",
                "message": "Success"
            }
            addToaster(toast)
            setDepartmentData(
                departmentData.map((data) => {
                    if (data.id == updateDepData.id) {
                        data.departmentName = values.departmentName;
                        data.branchName = response.data.data.branchName;
                    }
                    return data;
                })
            )

            setUpdateDepModal(false)

        } catch (error) {
            console.log(`Error : ${error}`);
            setLoading(false)
            if (error.message == 'Request failed with status code 400') {
                let toast = {
                    "status": false,
                    "body": "Department Already Exists",
                    "message": "Failed"
                }
                addToaster(toast)
            }
        }

    };

    const handleDeleteDepartment = async (id) => {
        try {
            let token = secureLocalStorage.getItem("token");

            const response = await axios.post(`http://localhost:5000/api/v1/department/deleteDepartment/${id}`, {}, { withCredentials: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            console.log("response", response);
            if (response.data.status == false) {
                throw Error(response.data.message);
            }

            let toast = {
                "status": true,
                "body": "Department Deleted Successfully",
                "message": "Success"
            }
            addToaster(toast)
            const index = departmentData.findIndex(data => data.id == id);
            let temp = [...departmentData];
            temp.splice(index, 1);
            setDepartmentData(temp);

        } catch (error) {
            console.log(`Error : ${error}`);
            setLoading(false)
            if (error.message == 'Request failed with status code 400') {
                let toast = {
                    "status": false,
                    "body": "Department Already Exists",
                    "message": "Failed"
                }
                addToaster(toast)
            }
        }
    }

    // Pagination logic
    const itemsPerPage = 10;
    const [currentItems, setCurrentItems] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [itemOffset, setItemOffset] = React.useState(0);
    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(departmentData.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(departmentData.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, departmentData]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % departmentData.length;
        setItemOffset(newOffset);
    };
    const handleEditDepartmentModal = (data) => {
        setUpdateDepData(data);
        setUpdateDepModal(true);
    }


    return (


        <div >
            {/* Add Department Button to the right */}



            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Departments</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    {role === 'ADMIN' || role === 'HR' ? (
                                        <CButton color="primary" style={{ float: "right" }} onClick={() => setAddDepModal(true)}>Add Department</CButton>
                                    ) : null}</CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* // Table to show all the departments */}
            {
                loading ? <LoadingScreen /> :
                    <CRow>
                        <CCol>
                            <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>

                                <CCardBody>
                                    <CRow>
                                        <CCol>
                                            <CCardTitle style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Department Details</CCardTitle>
                                        </CCol>
                                        <CCol xs="auto">
                                            <CFormInput
                                                placeholder="Search"
                                                autoComplete="Search"
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </CCol>
                                    </CRow>
                                    <table className="table table-hover table-outline mb-0 d-none d-sm-table table-bordered text-center" style={{
                                        marginTop: '20px',
                                    }}>

                                        <thead>
                                            <tr>
                                                <th scope="col">Sr. No.</th>
                                                <th scope="col">Department Name</th>
                                                <th scope="col">Branch</th>
                                                <th scope="col" style={{ textAlign: 'center' }}
                                                >Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                loading && <LoadingScreen /> ||

                                                    search == '' ?
                                                    currentItems.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>{data.departmentName}</td>
                                                                <td>{data.branchName}</td>
                                                                <td style={{ textAlign: 'center' }}>
                                                                    <CButton color="primary" onClick={() => { handleEditDepartmentModal(data); console.log("data0", data); }}
                                                                    >Edit</CButton> &nbsp;
                                                                    <CButton color="danger" onClick={() => { handleDeleteDepartment(data.id) }}
                                                                    >Delete</CButton>
                                                                </td>
                                                            </tr>
                                                        ) || <LoadingScreen />
                                                    })
                                                    : departmentData
                                                        .filter((val) => {
                                                            const searchLower = search.toLowerCase();
                                                            return (
                                                                val.departmentName.toLowerCase().includes(searchLower) ||
                                                                val.branchName.toLowerCase().includes(searchLower)

                                                            );
                                                        })
                                                        .map((data, index) => {
                                                            return (

                                                                <tr key={index}>
                                                                    <td className="text-center">{data.id}</td>
                                                                    <td className="text-center">{data.departmentName}</td>
                                                                    <td className="text-center">{data.branchName}</td>
                                                                    {/* <td className="text-center"> */}
                                                                    {/* <Link to={{ pathname: "/pages/branch", state: { data: data } }}> */}
                                                                    {/* <CButton color="primary">View</CButton> */}
                                                                    <td className="text-center">
                                                                        <div className="d-flex align-items-center justify-content-center">
                                                                            <CButton color="primary" onClick={() => handleEditDepartmentModal(data)}>Edit</CButton> &nbsp;
                                                                            <CButton color="danger" onClick={() => handleDeleteDepartment(data.id)}>Delete</CButton>
                                                                        </div>
                                                                    </td>
                                                                    {/* </Link> */}
                                                                    {/* </td>   */   }
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

            {/* Add Department Modal */}
            <CModal visible={addDepModal} onClose={() => setAddDepModal(false)} size="lg">
                <CModalHeader closeButton>
                    <CModalTitle>Add Department</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik
                        initialValues={{
                            departmentName: '',
                            branch: '',
                        }}
                        onSubmit={(values) => handleAddDepartment(values)}
                        validationSchema={Yup.object().shape({
                            departmentName: Yup.string().required('Required'),
                            branch: Yup.string().required('Required'),
                        })}
                    >
                        {(props) => (
                            <CForm onSubmit={props.handleSubmit}>
                                <CRow>
                                    <CCol md="6">
                                        <CFormLabel style={labelStyle}>Department Name</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="Enter Department Name"
                                                name="departmentName"
                                                value={props.values.departmentName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className={
                                                    props.errors.departmentName && props.touched.departmentName
                                                        ? 'is-invalid'
                                                        : ''
                                                }
                                            />
                                            {props.errors.departmentName && props.touched.departmentName && (
                                                <div className="invalid-feedback">{props.errors.departmentName}</div>
                                            )}
                                        </CInputGroup>
                                    </CCol>
                                    <CCol md="6">
                                        <CFormLabel style={labelStyle}>Branch</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormSelect
                                                name="branch"
                                                value={props.values.branch}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className={
                                                    props.errors.branch && props.touched.branch ? 'is-invalid' : ''
                                                }
                                            >
                                                <option value="">Select Branch</option>
                                                {branches.map((data, index) => (
                                                    <option key={index} value={data.id}>
                                                        {data.branchName}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                            {props.errors.branch && props.touched.branch && (
                                                <div className="invalid-feedback">{props.errors.branch}</div>
                                            )}
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md="6">
                                        <CButton color="primary" type="submit" className="px-4">
                                            Submit
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CForm>
                        )}
                    </Formik>
                </CModalBody>
            </CModal>

            {/* Update Department Modal */}
            <CModal visible={updateDepModal} onClose={() => setUpdateDepModal(false)} size="lg">
                {console.log("updateDepModal data:", updateDepModal)}
                <CModalHeader closeButton>
                    <CModalTitle>Update Department</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Formik
                        initialValues={{
                            departmentName: updateDepData.departmentName,
                            branch: updateDepData.branchName,
                        }}
                        onSubmit={(values) => handleUpdateDepartment(values)}
                        validationSchema={Yup.object().shape({
                            departmentName: Yup.string().required('Required'),
                            branch: Yup.string().required('Required'),
                        })}
                    >
                        {(props) => (
                            <CForm onSubmit={props.handleSubmit}>
                                <CRow>
                                    <CCol md="6">
                                        <CFormLabel style={labelStyle}>Department Name</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormInput
                                                type="text"
                                                placeholder="Enter Department Name"
                                                name="departmentName"
                                                value={props.values.departmentName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className={
                                                    props.errors.departmentName && props.touched.departmentName
                                                        ? 'is-invalid'
                                                        : ''
                                                }
                                            />
                                            {props.errors.departmentName && props.touched.departmentName && (
                                                <div className="invalid-feedback">{props.errors.departmentName}</div>
                                            )}
                                        </CInputGroup>
                                    </CCol>
                                    <CCol md="6">
                                        <CFormLabel style={labelStyle}>Branch</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CFormSelect
                                                name="branch"
                                                value={props.values.branch}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className={
                                                    props.errors.branch && props.touched.branch ? 'is-invalid' : ''
                                                }
                                            >
                                                <option value={updateDepData.branchId}>{updateDepData.branchName}</option>
                                                {branches.map((data, index) => (
                                                    <option key={index} value={data.id}>
                                                        {data.branchName}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                            {props.errors.branch && props.touched.branch && (
                                                <div className="invalid-feedback">{props.errors.branch}</div>
                                            )}
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md="6">
                                        <CButton color="primary" type="submit" className="px-4">
                                            Submit
                                        </CButton>
                                    </CCol>
                                </CRow>
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

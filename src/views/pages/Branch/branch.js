import { CCardBody, CModalHeader, CModal, CModalTitle, CModalBody, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CInputGroup, CCol, CCard, CButton, CModalFooter, CCardTitle, CFormCheck } from '@coreui/react'
import React from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import LoadingScreen from 'src/views/shared/Loading';
import Toaster from 'src/views/shared/Toaster';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

export default function branch() {

    const [branchModal, setBranchModal] = React.useState(false);
    const [branches, setBranches] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [toast, addToast] = React.useState(false);
    const [updateBranchModal, setUpdateBranchModal] = React.useState(false);
    const [updateBranchData, setUpdateBranchData] = React.useState({});
    const [role, setRole] = React.useState(false);


    let addToaster = (toast) => {
        addToast(toast)
        setTimeout(() => {
            addToast(false)
        }, 3000)
    }

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
                console.log("response01", response);
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

    const handleAddBranch = () => {
        setBranchModal(true);
    }

    const handleAddBranchSubmit = async (values) => {
        try {
            console.log("values", values);
            let token = secureLocalStorage.getItem("token");

            console.log("values", values);
            let response = await axios.post(`http://localhost:5000/api/v1/branch/addBranch`, values, { withCredentials: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
            console.log("response02", response);
            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            let toast = {
                "status": true,
                "body": response.data.message,
                "message": "Success"
            }
            addToaster(toast)
            setBranchModal(false);
            setBranches([...branches, response.data.data]);

        } catch (error) {
            console.log(`Error : ${error.response.data.status}`);

            if (error.response.data.status === 422) {
                let toast = {
                    status: false,
                    body: error.response.data.message,
                    message: "Failed",
                };
                addToaster(toast);
            } else {
                let toast = {
                    "status": false,
                    "body": error.message,
                    "message": "Failed"
                }
                addToaster(toast)
            }
        }
    }

    const handleUpdateBranchModal = (data) => {
        setUpdateBranchData(data);
        setUpdateBranchModal(true);
    }

    const handleDeleteBranch = async (id) => {
        try {

            const token = secureLocalStorage.getItem("token");

            let response = await axios.post(`http://localhost:5000/api/v1/branch/deleteBranch/${id}`, { withCredentials: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
            console.log("response03", response);
            if (response.data.status == false) {
                throw Error(response.data.message);
            }
            let toast = {
                "status": true,
                "body": response.data.message,
                "message": "Success"
            }
            addToaster(toast)

            let temp = branches.filter(data => data.id != id);
            setBranches(temp);


        } catch (error) {
            if (error.response.data.status === 422) {
                let toast = {
                    status: false,
                    body: error.response.data.message,
                    message: "Failed",
                };
                addToaster(toast);
            } else {
                let toast = {
                    "status": false,
                    "body": error.message,
                    "message": "Failed"
                }
                addToaster(toast)
            }

        }
    };

    const handleUpdateBranchSubmit = async (values) => {
        try {
            let token = secureLocalStorage.getItem("token");
            values.branchId = updateBranchData.id;
            console.log("branchId", branchId)
            let response = await axios.post(`http://localhost:5000/api/v1/branch/updateBranch`, values, { withCredentials: true },
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
                "status": true,
                "body": response.data.message,
                "message": "Success"
            }
            addToaster(toast)
            setUpdateBranchModal(false);

            console.log("response001", response.data.data);
            let index = branches.findIndex(data => data.id == response.data.data.id);
            console.log("index001", index);
            let temp = [...branches];
            temp[index] = response.data.data;
            setBranches(temp);


        } catch (error) {
            console.log(`Error : ${error.response.data.status}`);

            if (error.response.data.status === 422) {
                let toast = {
                    status: false,
                    body: error.response.data.message,
                    message: "Failed",
                };
                addToaster(toast);
            } else {
                let toast = {
                    "status": false,
                    "body": error.message,
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
        setCurrentItems(branches.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(branches.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, branches]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % branches.length;
        setItemOffset(newOffset);
    };

    return (
        <div >
            {/* Add Department Button to the right */}

            <CRow>
                <CCol sm={12}>
                    <CCard style={{ background: "#3c4b64" }}>
                        <CCardBody>
                            <CRow>
                                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Branches</CCardTitle></CCol>
                                <CCol sm={5}></CCol>
                                <CCol >
                                    {role === 'ADMIN' || role === 'HR' ? (
                                        <CButton color="primary" style={{ float: "right" }} onClick={handleAddBranch}>Add Branch</CButton>
                                    ) : null}
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {loading ? (
                <LoadingScreen />
            ) : error ? (
                <div style={{ color: 'red', textAlign: 'center' }}>Something went wrong</div>
            ) : (
                <div>
                    <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                        <CCardBody>
                            <CRow>
                                <CCol>
                                    <CCardTitle style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Branch Details</CCardTitle>
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
                                        <th className="text-center">Branch Name</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {branches.map((data, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">{data.branchName}</td>
                                            <td className="text-center">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <CButton color="primary" onClick={() => handleUpdateBranchModal(data)}>Edit</CButton> &nbsp;
                                                    <CButton color="danger" onClick={() => handleDeleteBranch(data.id)} className="ml-2">Delete</CButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))} */}
                                    {

                                        loading && <LoadingScreen /> ||

                                            search == '' ?
                                            // branches
                                            currentItems.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="text-center">{index + 1}</td>
                                                        <td className="text-center">{data.branchName}</td>
                                                        <td className="text-center">
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                <CButton color="primary" onClick={() => handleUpdateBranchModal(data)}>Edit</CButton> &nbsp;
                                                                <CButton color="danger" onClick={() => handleDeleteBranch(data.id)} className="ml-2">Delete</CButton>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) || <LoadingScreen />
                                            })
                                            : branches
                                                .filter((val) => {
                                                    const searchLower = search.toLowerCase();
                                                    return (
                                                        val.branchName.toLowerCase().includes(searchLower)
                                                    );
                                                })
                                                .map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="text-center">{data.id}</td>
                                                            <td className="text-center">{data.branchName}</td>
                                                            <td className="text-center">
                                                                <Link to={{ pathname: "/pages/branch", state: { data: data } }}>
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
                </div>
            )}


            {
                toast && <Toaster body={toast.body} message={toast.message} status={toast.status} />
            }

            {/* Add Branch Modal */}
            <CModal
                visible={branchModal}
                onClose={() => setBranchModal(false)}
                size="lg"
            >
                <Formik
                    initialValues={{
                        branchName: '',
                    }}
                    onSubmit={(values) => { handleAddBranchSubmit(values) }}
                    validationSchema={Yup.object().shape({
                        branchName: Yup.string().required('Branch Name is required'),
                    })}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <>
                            <CModalHeader closeButton>
                                <CModalTitle>Add Branch</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <CForm onSubmit={handleSubmit}>
                                    <CRow>
                                        <CCol >
                                            <CFormLabel htmlFor="branchName">Branch Name</CFormLabel>
                                            <CFormInput
                                                id="branchName"
                                                placeholder="Branch Name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.branchName}
                                            />
                                            {errors.branchName && touched.branchName && (
                                                <div style={{ color: 'red', marginTop: '3px' }}>{errors.branchName}</div>
                                            )}
                                        </CCol>
                                    </CRow>

                                </CForm>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="primary" onClick={handleSubmit}>Add</CButton>
                                <CButton color="secondary" onClick={() => setBranchModal(false)}>Cancel</CButton>
                            </CModalFooter>
                        </>
                    )}
                </Formik>
            </CModal>

            {/* Update Branch Modal */}
            <CModal
                visible={updateBranchModal}
                onClose={() => setUpdateBranchModal(false)}
                size="lg"
            >
                <Formik
                    initialValues={{
                        branchName: updateBranchData.branchName,
                    }}
                    onSubmit={(values) => { handleUpdateBranchSubmit(values) }}
                    validationSchema={Yup.object().shape({
                        branchName: Yup.string().required('Branch Name is required'),
                    })}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <>
                            <CModalHeader closeButton>
                                <CModalTitle>Update Branch</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <CForm onSubmit={handleSubmit}>
                                    <CRow>
                                        <CCol >
                                            <CFormLabel htmlFor="branchName">Branch Name</CFormLabel>
                                            <CFormInput
                                                id="branchName"
                                                placeholder="Branch Name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.branchName}
                                            />
                                            {errors.branchName && touched.branchName && (
                                                <div style={{ color: 'red', marginTop: '3px' }}>{errors.branchName}</div>
                                            )}
                                        </CCol>
                                    </CRow>

                                </CForm>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="primary" onClick={handleSubmit}>Update</CButton>
                                <CButton color="secondary" onClick={() => setUpdateBranchModal(false)}>Cancel</CButton>
                            </CModalFooter>
                        </>
                    )}
                </Formik>
            </CModal>

        </div>
    )
}

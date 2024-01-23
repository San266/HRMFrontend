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
import CIcon from '@coreui/icons-react';
import moment from 'moment';

export default function leave() {

  const [loading, setLoading] = React.useState(false);
  const [addLeaveModal, setAddLeaveModal] = React.useState(false);
  const [leaveData, setLeaveData] = React.useState([]);
  const [toast, addToast] = React.useState(false);
  const [role, setRole] = React.useState(secureLocalStorage.getItem("userRoles"));
  const [employees, setEmployees] = React.useState([]);
  const [leaveTypes, setLeaveTypes] = React.useState([]);
  const [editLeaveModal, setEditLeaveModal] = React.useState(false);
  const [editData, setEditData] = React.useState({});


  // Function to Add Toaster
  let addToaster = (toast) => {
    addToast(toast)
    setTimeout(() => {
      addToast(false)
    }, 3000)
  }

  const getAllEmployees = async () => {
    try {
      const response = await axios.get(`${configData.SERVER_URL}/employee/getAllEmployees`, { withCredentials: true },)

      if (response.data.status == false) {
        throw Error(response.data.message);
      }

      console.log("response.data.data", response.data.data);
      setEmployees(response.data.data)
      setLoading(false)

    } catch (error) {
      console.log(`😱 Axios request failed: ${error}`);

      let toast = {
        message: error.message || "Something Went Wrong",
        status: false,
        body: false
      }
      addToaster(toast)

    }
  }

  const getAllLeaveTypes = async () => {
    try {
      const response = await axios.get(`${configData.SERVER_URL}/leaveType/getAllLeaveTypes`, { withCredentials: true },)

      if (response.data.status == false) {
        throw Error(response.data.message);
      }

      setLeaveTypes(response.data.data)
      setLoading(false)

    } catch (error) {
      console.log(`😱 Axios request failed: ${error}`);

      let toast = {
        message: error.message || "Something Went Wrong",
        status: false,
        body: false
      }
      addToaster(toast)

    }
  }

  const handleSearchClick = async (values) => {
    try {

      const fromDate = values.fromDate;
      const toDate = values.toDate;
      const status = values.status;
      const leaveTypeId = values.leaveTypeId;
      const employeeId = values.employeeId;

      setLoading(true)
      const response = await axios.get(`${configData.SERVER_URL}/leave/getLeaveByCategories?fromDate=${fromDate}&toDate=${toDate}&status=${status}&leaveTypeId=${leaveTypeId}&employeeId=${employeeId}`, { withCredentials: true },)

      if (response.data.status == false) {
        throw Error(response.data.message);
      }

      setLeaveData(response.data.data)
      setLoading(false)

    } catch (error) {

      console.log(`😱 Axios request failed: ${error}`);

      let toast = {
        message: "Something Went Wrong",
        status: false,
        body: false
      }
      addToaster(toast)
      setLoading(false)

    }
  }

  const handleAddLeaveClick = async (values) => {
    try {

      const response = await axios.post(`${configData.SERVER_URL}/leave/createLeave`, values, { withCredentials: true },)

      if (response.data.status == false) {
        throw Error(response.data.message);
      }

      setAddLeaveModal(false)
      setLoading(false)
      console.log("response.data.data", response.data.data);
      // set employee name and leavw type in leaveData

      const employee = await employees.filter(async (employee) => await employee.id === response.data.data.employeeId)[0];
      const leaveType = await leaveTypes.filter(async (leaveType) => leaveType.id === await response.data.data.leaveTypeId)[0];

      response.data.data.name = employee.name;
      response.data.data.leaveType = leaveType.leaveType;

      setLeaveData(
        [
          ...leaveData,
          response.data.data
        ]
      )

      let toast = {
        message: "Leave Added Successfully",
        status: true,
        body: false
      }
      addToaster(toast)



    } catch (error) {
      console.log(`😱 Axios request failed: ${error}`);

      let toast = {
        message: "Something Went Wrong",
        status: false,
        body: false
      }
      addToaster(toast)
      setLoading(false)

    }
  }

  const handleLeaveStatus = async (id, status) => {
    try {

      const response = await axios.post(`${configData.SERVER_URL}/leave/leaveStatus`, { id, status }, { withCredentials: true },)

      if (response.data.status == false) {
        throw Error(response.data.message);
      }

      setLoading(false)
      setLeaveData(
        leaveData.map((leave) => {
          if (leave.id === id) {
            leave.status = "APPROVED"
          }
          return leave
        })
      )

      let toast = {
        message: "Leave Approved Successfully",
        status: true,
        body: false
      }

      addToaster(toast)

    } catch (error) {
      console.log(`😱 Axios request failed: ${error}`);

      let toast = {
        message: "Something Went Wrong",
        status: false,
        body: false
      }
      addToaster(toast)
      setLoading(false)

    }
  }

  const handleDeleteLeave = async (id) => {
    try {

      let token = secureLocalStorage.getItem("token");
      const response = await axios.post(`${configData.SERVER_URL}/leave/deleteLeave?id=${id}`, { withCredentials: true },
        { headers: { Authorization: `Bearer ${token}` } } // for cookie purpose
      )

      if (response.data.status == false) {
        throw Error(response.data.message);
      }

      setLoading(false)
      setLeaveData(leaveData.filter((leave) => leave.id !== id))

      let toast = {
        message: "Leave Deleted Successfully",
        status: true,
        body: false
      }

      addToaster(toast)

    } catch (error) {
      console.log(`😱 Axios request failed: ${error}`);

      let toast = {
        message: "Something Went Wrong",
        status: false,
        body: false
      }
      addToaster(toast)
      setLoading(false)

    }
  }

  const handleEditClick = async (data) => {
    setEditData(data);
    setEditLeaveModal(!editLeaveModal);
  }

  React.useEffect(() => {

    getAllEmployees();
    getAllLeaveTypes();
    handleSearchClick({ employeeId: "", leaveTypeId: "", fromDate: "", toDate: "", status: "" });

  }, [])


  // Pagination logic
  const itemsPerPage = 10;
  // const [currentItems, setCurrentItems] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [itemOffset, setItemOffset] = React.useState(0);
  // const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    // setCurrentItems(leaveData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(leaveData.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, leaveData]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % leaveData.length;
    setItemOffset(newOffset);
  };



  return (
    <>

      <CRow>
        <CCol sm={12}>
          <CCard style={{ background: "#3c4b64" }}>
            <CCardBody>
              <CRow>
                <CCol sm={4}> <CCardTitle style={{ color: "white" }}>Employee</CCardTitle></CCol>
                <CCol sm={5}></CCol>
                <CCol >
                  <CButton color="primary" style={{ float: "right" }} onClick={() => setAddLeaveModal(!addLeaveModal)}>Add Leave</CButton>
                </CCol>
              </CRow>
            </CCardBody>

          </CCard>
        </CCol>
      </CRow>

      {
        role === "ADMIN" &&
        <CRow>
          <CCol sm={12}>
            <CCard style={{ background: "#3c4b64" }}>
              <CCardBody>
                <CRow>
                  <Formik initialValues={{
                    employeeId: "",
                    leaveTypeId: "",
                    fromDate: "",
                    toDate: "",
                    status: ""
                  }}
                    onSubmit={(values, { setSubmitting }) => {

                      handleSearchClick(values);
                    }}
                    validationSchema={yup.object().shape({
                      employeeId: yup.string(),
                      // .required("Employee Name is Required"),
                      leaveTypeId: yup.string(),
                      // .required("Leave Type is Required"),
                      fromDate: yup.string().
                        // from date should be less than toDate
                        test('fromDate', 'From Date should be less than To Date', function (value) {
                          const { toDate } = this.parent;
                          if (value > toDate) {
                            return false;
                          }
                          return true;
                        }),
                      // .required("From Date is Required"),
                      toDate: yup.string().
                        // to date should be greater than fromDate
                        test('toDate', 'To Date should be greater than From Date', function (value) {
                          const { fromDate } = this.parent;
                          if (value < fromDate) {
                            return false;
                          }
                          return true;
                        }),
                      // .required("To Date is Required"),
                      status: yup.string(),
                      // .required("Status is Required"),
                    })}
                  >
                    {props => {
                      const {
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        handleReset,
                      } = props;
                      return (
                        <CCol sm={12}>
                          <CRow>
                            <CCol sm={2}>
                              <CFormLabel style={{ color: "white" }}>Employee Name</CFormLabel>
                              <CFormSelect
                                name="employeeId"
                                id="employeeId"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.employeeId}
                              >
                                <option value="0">Select Employee</option>
                                {
                                  employees.map((employee) => {
                                    return (
                                      <option value={employee.id}>{employee.name}</option>
                                    )
                                  })
                                }
                              </CFormSelect>
                              {errors.employeeId && touched.employeeId && (
                                <div
                                  style={{ color: "#dc3545", fontSize: "0.8rem" }}
                                >{errors.employeeId}</div>
                              )}
                            </CCol>
                            <CCol sm={2}>
                              <CFormLabel style={{ color: "white" }}>Leave Type</CFormLabel>
                              <CFormSelect
                                name="leaveTypeId"
                                id="leaveTypeId"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.leaveTypeId}
                              >
                                <option value="0">Select Leave Type</option>
                                {
                                  leaveTypes.map((leaveType) => {
                                    return (
                                      <option value={leaveType.id}>{leaveType.leaveType}</option>
                                    )
                                  })
                                }
                              </CFormSelect>
                              {errors.leaveTypeId && touched.leaveTypeId && (
                                <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.leaveTypeId}</div>
                              )}
                            </CCol>
                            <CCol sm={2}>
                              <CFormLabel style={{ color: "white" }}>From Date</CFormLabel>
                              <CFormInput
                                type="date"
                                name="fromDate"
                                id="fromDate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.fromDate}
                              />
                              {errors.fromDate && touched.fromDate && (
                                <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.fromDate}</div>
                              )}
                            </CCol>
                            <CCol sm={2}>
                              <CFormLabel style={{ color: "white" }}>To Date</CFormLabel>
                              <CFormInput
                                type="date"
                                name="toDate"
                                id="toDate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.toDate}
                              />
                              {errors.toDate && touched.toDate && (
                                <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.toDate}</div>
                              )}
                            </CCol>
                            <CCol sm={2}>
                              <CFormLabel style={{ color: "white" }}>Status</CFormLabel>
                              <CFormSelect
                                name="status"
                                id="status"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.status}
                              >
                                <option value="0">Select Status</option>
                                {
                                  ['PENDING', 'APPROVED', 'REJECTED'].map((status) => {
                                    return (
                                      <option value={status}>{status}</option>
                                    )
                                  })
                                }
                              </CFormSelect>
                              {errors.status && touched.status && (
                                <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.status}</div>
                              )}
                            </CCol>
                            <CCol sm={2}>
                              <CButton color="primary" style={{ marginTop: "30px" }} onClick={handleSubmit}>Search</CButton>
                            </CCol>
                          </CRow>
                        </CCol>
                      );
                    }}
                  </Formik>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      }

      <CRow>
        <CCol sm={12}>
          <CCard style={{ margin: '20px', padding: '20px', backgroundColor: '#f8f9fa' }}>
            <CCardBody>
              <CRow>
                <CCol>
                  <CCardTitle style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Employee Leaves</CCardTitle>
                </CCol>

              </CRow>
              <table className="table table-hover table-outline mb-0 d-none d-sm-table table-bordered" style={{ color: "white", textAlign: "center" }}>
                <thead className="thead-light">
                  <tr>
                    <th>Sr.No</th>
                    {
                      role === "ADMIN" &&
                      <th>Employee Name</th>
                    }
                    <th>Leave Type</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Total Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>

                  {
                    leaveData.length > 0 && leaveData.map((leave, index) => {
                      return (
                        <tr>
                          <td>
                            <div>{index + 1}</div>
                          </td>

                          {
                            role === "ADMIN" &&
                            <td>
                              <div>{leave.name}</div>
                            </td>
                          }

                          <td>
                            <div>{leave.leaveType}</div>
                          </td>
                          <td>
                            <div>{moment(leave.fromDate).format("DD-MM-YYYY")}</div>
                          </td>
                          <td>
                            <div>{moment(leave.toDate).format("DD-MM-YYYY")}</div>
                          </td>
                          <th>
                            {
                              moment(leave.toDate).diff(moment(leave.fromDate), 'days') + 1
                            }
                          </th>
                          <td>
                            <div>{leave.reason}</div>
                          </td>
                          <td>
                            {/* // Create badge for status with different colors for different status */}
                            {
                              leave.status === "PENDING" && (
                                <div
                                  style={{
                                    background: "#ffc107",
                                    color: "white",
                                    padding: "5px",
                                    borderRadius: "5px",
                                    textAlign: "center",
                                    width: "100px",
                                  }}
                                >
                                  Pending
                                </div>
                              )
                            }
                            {
                              leave.status === "APPROVED" && (
                                <div
                                  style={{
                                    background: "#28a745",
                                    color: "white",
                                    padding: "5px",
                                    borderRadius: "5px",
                                    textAlign: "center",
                                    width: "100px",
                                  }}
                                >
                                  Approved
                                </div>
                              )
                            }
                            {
                              leave.status === "REJECTED" && (
                                <div
                                  style={{
                                    background: "#dc3545",
                                    color: "white",
                                    padding: "5px",
                                    borderRadius: "5px",
                                    textAlign: "center",
                                    width: "100px",
                                  }}
                                >
                                  Rejected
                                </div>
                              )
                            }

                          </td>
                          <td>
                            {/* // Approve and Reject Button */}
                            {
                              role === "ADMIN" && leave.status === "PENDING" &&
                              <CRow>
                                <CCol sm={6}>
                                  <CButton color="success" onClick={() => handleLeaveStatus(leave.id, "APPROVED")}>Approve</CButton>
                                </CCol>
                                <CCol sm={6}>
                                  <CButton color="danger" onClick={() => handleLeaveStatus(leave.id, "REJECTED")}>Reject</CButton>
                                </CCol>
                              </CRow>
                            }

                            {/* // Edit Button */}
                            {
                              role === "EMPLOYEE" && leave.status === "PENDING" &&
                              <CRow>
                                <CCol sm={6}>
                                  <CButton color="warning" onClick={() => handleEditClick(leave)}>Edit</CButton>
                                </CCol>
                                <CCol sm={6}>
                                  <CButton color="danger" onClick={() => handleDeleteLeave(leave.id)}>Delete</CButton>
                                </CCol>
                              </CRow>
                            }

                            {/* // Delete Button */}
                            {
                              role === "ADMIN" && leave.status === "APPROVED" &&
                              <CRow>
                                <CCol sm={12}>
                                  <CButton color="danger" onClick={() => handleDeleteLeave(leave.id)}>Delete</CButton>
                                </CCol>
                              </CRow>
                            }

                            {/* // Delete Button */}
                            {
                              role === "ADMIN" && leave.status === "REJECTED" &&
                              <CRow>
                                <CCol sm={12}>
                                  <CButton color="danger" onClick={() => handleDeleteLeave(leave.id)}>Delete</CButton>
                                </CCol>
                              </CRow>
                            }
                          </td>
                        </tr>
                      )
                    }
                    )
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
        </CCol >
      </CRow >


      {
        addLeaveModal &&

        <CModal
          visible={addLeaveModal}
          alignment="center"
          onDismiss={() => setAddLeaveModal(!addLeaveModal)}
        >
          <CModalHeader onDismiss={() => setAddLeaveModal(false)}>
            <CModalTitle>Add Leave</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <Formik initialValues={{
              employeeId: "",
              leaveTypeId: "",
              fromDate: "",
              toDate: "",
              reason: "",
            }}
              onSubmit={(values, { setSubmitting }) => {
                console.log("values", values);
                setSubmitting(true);
                setTimeout(() => {
                  setSubmitting(false);
                }, 5000);
                handleAddLeaveClick(values);
              }}
              validationSchema={yup.object().shape({
                // If role is ADMIN then employeeId is required else not
                employeeId: role === "ADMIN" ? yup.string().required("Employee Name is Required") : yup.string(),

                leaveTypeId: yup.string().required("Leave Type is Required"),
                fromDate: yup.string().
                  // from date should be less than toDate
                  test('fromDate', 'From Date should be less than To Date', function (value) {
                    const { toDate } = this.parent;
                    if (value > toDate) {
                      return false;
                    }
                    return true;
                  })
                  .required("From Date is Required"),
                toDate: yup.string().
                  // to date should be greater than fromDate
                  test('toDate', 'To Date should be greater than From Date', function (value) {
                    const { fromDate } = this.parent;
                    if (value < fromDate) {
                      return false;
                    }
                    return true;
                  })
                  .required("To Date is Required"),
                reason: yup.string().required("Reason is Required"),
              })}
            >
              {props => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                } = props;
                return (
                  <CForm onSubmit={handleSubmit}>
                    <CRow>
                      {
                        role === "ADMIN" &&
                        <CCol sm={12}>
                          <CFormLabel style={{ color: "black" }}>Employee Name</CFormLabel>
                          <CFormSelect
                            name="employeeId"
                            id="employeeId"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.employeeId}
                          >
                            <option value="0">Select Employee</option>
                            {
                              employees.map((employee) => {
                                return (
                                  <option value={employee.id}>{employee.name}</option>
                                )
                              })
                            }
                          </CFormSelect>
                          {errors.employeeId && touched.employeeId && (
                            <div
                              style={{ color: "#dc3545", fontSize: "0.8rem" }}
                            >{errors.employeeId}</div>
                          )}
                        </CCol>
                      }

                      <CCol sm={12}>
                        <CFormLabel style={{ color: "black" }}>Leave Type</CFormLabel>
                        <CFormSelect
                          name="leaveTypeId"
                          id="leaveTypeId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.leaveTypeId}
                        >
                          <option value="0">Select Leave Type</option>
                          {
                            leaveTypes.map((leaveType) => {
                              return (
                                <option value={leaveType.id}>{leaveType.leaveType}</option>
                              )
                            })
                          }
                        </CFormSelect>
                        {errors.leaveTypeId && touched.leaveTypeId && (
                          <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.leaveTypeId}</div>
                        )}
                      </CCol>
                      <CCol sm={12}>
                        <CFormLabel style={{ color: "black" }}>From Date</CFormLabel>
                        <CFormInput
                          type="date"
                          name="fromDate"
                          id="fromDate"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.fromDate}
                        />
                        {errors.fromDate && touched.fromDate && (
                          <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.fromDate}</div>
                        )}
                      </CCol>
                      <CCol sm={12}>
                        <CFormLabel style={{ color: "black" }}>To Date</CFormLabel>
                        <CFormInput
                          type="date"
                          name="toDate"
                          id="toDate"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.toDate}
                        />
                        {errors.toDate && touched.toDate && (
                          <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.toDate}</div>
                        )}
                      </CCol>
                      <CCol sm={12}>
                        <CFormLabel style={{ color: "black" }}>Reason</CFormLabel>
                        <CFormTextarea
                          name="reason"
                          id="reason"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.reason}
                        />
                        {errors.reason && touched.reason && (
                          <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.reason}</div>
                        )}
                      </CCol>
                    </CRow>
                    <CModalFooter>
                      <CButton color="secondary" onClick={() => setAddLeaveModal(!addLeaveModal)}>Cancel</CButton>
                      <CButton color="primary" type="submit" disabled={isSubmitting}>Add</CButton>
                    </CModalFooter>
                  </CForm>
                );
              }}
            </Formik>
          </CModalBody>
        </CModal>

      }

      {
        editLeaveModal &&

        <CModal
          visible={editLeaveModal}
          alignment="center"
          onDismiss={() => setEditLeaveModal(!editLeaveModal)}
        >
          <CModalHeader onDismiss={() => setEditLeaveModal(false)}>
            <CModalTitle>Edit Leave</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <Formik initialValues={{
              employeeId: editData.employeeId,
              leaveTypeId: editData.leaveTypeId,
              fromDate: moment(editData.fromDate).format("YYYY-MM-DD"),
              toDate: moment(editData.toDate).format("YYYY-MM-DD"),
              reason: editData.reason,
            }}
              onSubmit={(values, { setSubmitting }) => {
                console.log("values", values);
                setSubmitting(true);
                setTimeout(() => {
                  setSubmitting(false);
                }, 5000);
                handleAddLeaveClick(values);
              }}
              validationSchema={yup.object().shape({
                // If role is ADMIN then employeeId is required else not
                employeeId: role === "ADMIN" ? yup.string().required("Employee Name is Required") : yup.string(),

                leaveTypeId: yup.string().required("Leave Type is Required"),
                fromDate: yup.string().
                  // from date should be less than toDate
                  test('fromDate', 'From Date should be less than To Date', function (value) {
                    const { toDate } = this.parent;
                    if (value > toDate) {
                      return false;
                    }
                    return true;
                  })
                  .required("From Date is Required"),
                toDate: yup.string().
                  // to date should be greater than fromDate
                  test('toDate', 'To Date should be greater than From Date', function (value) {
                    const { fromDate } = this.parent;
                    if (value < fromDate) {
                      return false;
                    }
                    return true;
                  })
                  .required("To Date is Required"),
                reason: yup.string().required("Reason is Required"),
              })}
            >
              {props => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                } = props;
                return (
                  <CForm onSubmit={handleSubmit}>
                    <CRow>
                      {
                        role === "ADMIN" &&
                        <CCol sm={12}>
                          <CFormLabel style={{ color: "black" }}>Employee Name</CFormLabel>
                          <CFormSelect
                            name="employeeId"
                            id="employeeId"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.employeeId}
                          >
                            <option value="0">Select Employee</option>
                            {
                              employees.map((employee) => {
                                return (
                                  <option value={employee.id}>{employee.name}</option>
                                )
                              })
                            }
                          </CFormSelect>
                          {errors.employeeId && touched.employeeId && (
                            <div
                              style={{ color: "#dc3545", fontSize: "0.8rem" }}
                            >{errors.employeeId}</div>
                          )}
                        </CCol>
                      }

                      <CCol sm={12}>
                        <CFormLabel style={{ color: "black" }}>Leave Type</CFormLabel>
                        <CFormSelect
                          name="leaveTypeId"
                          id="leaveTypeId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.leaveTypeId}
                        >
                          <option value="0">Select Leave Type</option>
                          {
                            leaveTypes.map((leaveType) => {
                              return (
                                <option value={leaveType.id}>{leaveType.leaveType}</option>
                              )
                            })
                          }
                        </CFormSelect>
                        {errors.leaveTypeId && touched.leaveTypeId && (
                          <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.leaveTypeId}</div>
                        )}
                      </CCol>
                      <CCol sm={12}>
                        <CFormLabel style={{ color: "black" }}>From Date</CFormLabel>
                        <CFormInput
                          type="date"
                          name="fromDate"
                          id="fromDate"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.fromDate}
                        />
                        {errors.fromDate && touched.fromDate && (
                          <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.fromDate}</div>
                        )}
                      </CCol>
                      <CCol sm={12}>
                        <CFormLabel style={{ color: "black" }}>To Date</CFormLabel>
                        <CFormInput
                          type="date"
                          name="toDate"
                          id="toDate"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.toDate}
                        />
                        {errors.toDate && touched.toDate && (
                          <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.toDate}</div>
                        )}
                      </CCol>
                      <CCol sm={12}>
                        <CFormLabel style={{ color: "black" }}>Reason</CFormLabel>
                        <CFormTextarea
                          name="reason"
                          id="reason"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.reason}
                        />
                        {errors.reason && touched.reason && (
                          <div style={{ color: "#dc3545", fontSize: "0.8rem" }} >{errors.reason}</div>
                        )}
                      </CCol>
                    </CRow>
                    <CModalFooter>
                      <CButton color="secondary" onClick={() => setEditLeaveModal(!editLeaveModal)}>Cancel</CButton>
                      <CButton color="primary" type="submit" disabled={isSubmitting}>Edit</CButton>
                    </CModalFooter>
                  </CForm>
                );
              }}
            </Formik>
          </CModalBody>
        </CModal>



      }



      {
        toast && <Toaster message={toast.message} status={toast.status} body={toast.body} ></Toaster>
      }


    </>



  )
}

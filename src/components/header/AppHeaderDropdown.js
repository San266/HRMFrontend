import { CCardBody, CModalHeader, CModal, CModalTitle, CModalBody, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CInputGroup, CCol, CCard, CButton, CModalFooter, CCardTitle, CFormCheck, CFormSelect, CCardHeader } from '@coreui/react'
import React from 'react'
import Toaster from 'src/views/shared/Toaster';
import LoadingScreen from 'src/views/shared/Loading';
import { Formik } from "formik";
import * as yup from 'yup';
import configData from "../../../src/config/constant.json";
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { logoutUser } from 'src/utils/auth_service';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import moment from 'moment/moment';
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router-dom'
import avatar8 from './../../assets/images/avatars/admin.png'

const AppHeaderDropdown = () => {

  const [changePasswordModal, setChangePasswordModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [addToast, setAddToast] = React.useState(false);

  // Function to Add Toaster
  let addToaster = (toast) => {
    addToast(toast)
    setTimeout(() => {
      addToast(false)
    }, 3000)
  }


  const history = useHistory();
  const handleLogout = () => {
    logoutUser();
    history.go('/auth/login')
  }



  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CAvatar src={avatar8} size="lg" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem href="#">
            <CIcon icon={cilLockLocked} className="me-2" />
            Profile
          </CDropdownItem>
          {/* // Change Password Modal */}
          <CDropdownItem style={{ cursor: 'pointer' }} onClick={() => setChangePasswordModal(!changePasswordModal)}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Change Password
          </CDropdownItem>
          <CDropdownItem style={{ cursor: 'pointer' }} onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Log Out
          </CDropdownItem>

        </CDropdownMenu>
      </CDropdown>

      {/* // Modal here for change password */}
      <CModal
        visible={changePasswordModal}
        onClose={() => setChangePasswordModal(!changePasswordModal)}
        size="md"
      >
        <CModalHeader closeButton>
          <CModalTitle>Change Password</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setLoading(true);
            let data = {
              oldPassword: values.oldPassword,
              newPassword: values.newPassword,
              confirmPassword: values.confirmPassword,
            };
            let token = secureLocalStorage.getItem("token");
            const response = axios.post(`${configData.SERVER_URL}/user/changePassword`, data,
              {
                headers: { Authorization: `Bearer ${token}` }
              });

            if (response.status === 200) {
              let toast = {
                toastType: "success",
                toastMessage: "Password Changed Successfully",
                show: true,
              };
              addToaster(toast);
              setLoading(false);
              setChangePasswordModal(!changePasswordModal);
            }
          }}
          validationSchema={yup.object().shape({
            oldPassword: yup.string().required("Old Password is required"),
            newPassword: yup
              .string()
              .required("New Password is required")
              .min(6, "Password must be at least 6 characters"),
            confirmPassword: yup
              .string()
              .required("Confirm Password is required")
              .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
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
              setFieldValue,
            } = props;
            return (
              <CForm onSubmit={handleSubmit}>
                <CModal
                  visible={loading}
                  onClose={() => setLoading(!loading)}
                  centered
                >
                </CModal>
                <CModalBody>
                  <CRow>
                    <CCol md="12">
                      <CFormLabel>Old Password</CFormLabel>
                      <CInputGroup className="mb-3">
                        <CFormInput
                          type="password"
                          placeholder="Enter Old Password"
                          autoComplete="off"
                          name="oldPassword"
                          value={values.oldPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.oldPassword && touched.oldPassword
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {errors.oldPassword && touched.oldPassword && (
                          <div className="invalid-feedback">
                            {errors.oldPassword}
                          </div>
                        )}
                      </CInputGroup>
                    </CCol>
                    <CCol md="12">
                      <CFormLabel>New Password</CFormLabel>
                      <CInputGroup className="mb-3">
                        <CFormInput
                          type="password"
                          placeholder="Enter New Password"
                          autoComplete="off"
                          name="newPassword"
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.newPassword && touched.newPassword
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {errors.newPassword && touched.newPassword && (
                          <div className="invalid-feedback">
                            {errors.newPassword}
                          </div>
                        )}
                      </CInputGroup>
                    </CCol>
                    <CCol md="12">
                      <CFormLabel>Confirm Password</CFormLabel>
                      <CInputGroup className="mb-3">
                        <CFormInput
                          type="password"
                          placeholder="Enter Confirm Password"
                          autoComplete="off"
                          name="confirmPassword"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.confirmPassword && touched.confirmPassword
                              ? "is-invalid"
                              : ""
                          }
                        />
                        {errors.confirmPassword && touched.confirmPassword && (
                          <div className="invalid-feedback">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </CInputGroup>
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setChangePasswordModal(!changePasswordModal)}>
                    Cancel
                  </CButton>
                  {
                    loading ? <CButton color="primary" disabled>
                      <LoadingScreen />
                    </CButton> : <CButton color="primary" type="submit">
                      Submit
                    </CButton>
                  }
                </CModalFooter>
              </CForm>
            );
          }
          }
        </Formik>
      </CModal >

      {/* // Toaster */}
      {
        addToast && <Toaster body={addToast.body} message={addToast.message} status={addToast.status} />
      }

    </>
  )
}

export default AppHeaderDropdown

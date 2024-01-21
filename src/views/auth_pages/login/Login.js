import React from 'react'
import axios from 'axios';
import { Formik } from "formik";
import * as yup from 'yup';
import ConfigData from './../../../config/constant.json'
import { useHistory } from 'react-router-dom';
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import secureLocalStorage from "react-secure-storage";

const Login = () => {
  let history = useHistory();
  let [error, setError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const loginSchema = yup.object({
    email: yup.string()
      .required('Email is required')
      .email('Must be a valid email').max(255),
    password: yup.string()
      .required()
      .min(4)
  });

  // Function to handle login
  let handleLogin = async (values) => {
    try {
      setIsLoading(true)
      let response = await axios.post(`http://localhost:5000/api/v1/user/login`, { 
        email: values.email,
        password: values.password
       }, { withCredentials: true })
      if (response.data.status !== 200) {
        throw Error(response.data.message);
      }
      secureLocalStorage.setItem("token", response.data.data.token);
      secureLocalStorage.setItem("userRoles", response.data.data.userRole);
      setIsLoading(false);
      history.push('/pages');
      nav
    } catch (e) {
      setIsLoading(false)
      setError(e)
    }

  }

  React.useEffect(() => {
    // Enter Formik Form on Enter Key Press 
    document.addEventListener("keydown", keyDownHandler);

    return () => document.removeEventListener("keydown", keyDownHandler);
  }, []);

  const keyDownHandler = React.useCallback((event) => {
    if (event.key === "Enter") {
      document.getElementById("loginButton").click();
    }
  }, []);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer style={{ width: '50%' }}>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={(values, actions) => {
                      // actions.resetForm();
                      handleLogin(values);
                    }}
                  >
                    {(formikProps) => (
                      <CForm>
                        <h1>Login</h1>
                        <p className="text-medium-emphasis">Sign In to your account</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            id='email'
                            placeholder="Username"
                            autoComplete="username"
                            onChange={formikProps.handleChange('email')}
                            value={formikProps.values.email}
                          />
                        </CInputGroup>
                        <p style={{ color: 'red' }}>{formikProps.touched.email && formikProps.errors.email}</p>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            id='pass'
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            onChange={formikProps.handleChange('password')}
                            value={formikProps.values.password}
                          />
                        </CInputGroup>
                        <p style={{ color: 'red' }}>{formikProps.touched.password && formikProps.errors.password}</p>
                        <CRow>
                          <CCol xs={5}> </CCol>
                          <CCol >

                            <CButton
                              id="loginButton"
                              color="primary"
                              className="px-4"
                              type="submit"
                              disabled={isLoading}
                              onClick={formikProps.handleSubmit}
                            >
                              {isLoading ? <CSpinner color="light" size="sm" /> : "Login"}
                            </CButton>
                            
                          </CCol>
                          <CCol xs={5}> </CCol>
                          {/* <CCol xs={4}></CCol> */}
                          <CCol xs={4} className="text-right">
                            {/* <CButton color="link" className="px-0">
                              Forgot password?
                            </CButton> */}
                          </CCol>
                          {/* <CCol xs={4}></CCol> */}
                        </CRow>
                      </CForm>
                    )}
                  </Formik>
                  {error && <p style={{ color: 'red' }}>{error.message}</p>}
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

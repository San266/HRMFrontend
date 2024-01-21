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

export default function leave() {

    const [loading, setLoading] = React.useState(false);
    const [addLeaeveModal, setAddLeaeveModal] = React.useState(false);
    const [leaveData, setLeaveData] = React.useState([]);


    const getAllLeaves = () => {
        
    }
  return (
    <div>leave</div>
  )
}

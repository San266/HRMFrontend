import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios';
import {CCard, CCardBody, CCol, CRow, CCardText, CCardTitle, CCardImage} from '@coreui/react'
import { useHistory } from "react-router-dom";
import LoadingScreen from 'src/views/shared/Loading';
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ConfigData from '../../config/constant.json'


const Card = ({ cardIcon, title,routes,count,symbol,state,Id}) => {

  return (
    <CCol sm={6} md={6} xl={6} lg={6} xxl={6} id={Id}>
      <CCard style={{ cursor: 'pointer', marginBottom: 15, backgroundImage: "linear-gradient(to right, #2BC0E4, #EAECC6)", boxShadow: "10px 10px 5px lightblue" }}>
        <Link  style={{ textDecoration: "none" }} to={{ pathname: routes, state: state }}>
          <CCardBody>
            <CRow>
              <CCol sm={12} md={12} lg={12}xl={3}>
                <CCardImage src={cardIcon} style={{ width: 100, height: 100 }} orientation="top" />
              </CCol>
              <CCol  sm={12} md={7} lg={7} xl={6}>
                <CCardTitle style={{ fontSize: 30, color: "#FFFFFF", fontWeight: "bold", textShadow: "2px 2px #000000" }} >{title}</CCardTitle>
                <CCardText style={{ color: "black", fontWeight: "bold", }}> {`Numbers of ${title} :-`}
                </CCardText>

              </CCol>
              <CCol  sm={12} md={5} lg={5} xl={3} style={{ alignItems: 'center', justifyContent: 'center' }}>
                <CCardText style={{ color: "black", fontWeight: "bold", fontSize: 28 }}>{symbol +count }</CCardText>
              </CCol>
            </CRow>
          </CCardBody>
        </Link>
      </CCard>
    </CCol>

  );
}

export default Card;
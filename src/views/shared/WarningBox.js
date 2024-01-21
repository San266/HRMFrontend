import React from "react";
import { CButton, CModalHeader, CModal, CModalTitle,CModalBody , CModalFooter } from "@coreui/react";
import CIon from '@coreui/icons-react'
import { cilWarning } from "@coreui/icons";
const WarningBox = (props) => {
    const handleClose = async () => {
        props.onClose();
        props.confirmDeleteCallBack();
    }
    return (
        <>
        <CModal visible={props.visible} alignment="center" onClose={props.onClose} backdrop='static'>
            <CModalHeader onClose={props.onClose}>
                <CModalTitle><CIon icon={cilWarning} size='lg' style={{ color: 'red' }}></CIon> Warning</CModalTitle>
            </CModalHeader>
            <CModalBody>{props.description}</CModalBody>
            <CModalFooter>
                <CButton color="info" onClick={handleClose}>OK</CButton>
            </CModalFooter>
        </CModal>
        </>
    )

}
export default WarningBox;
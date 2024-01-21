import { CToast, CToastHeader, CToastBody, CToastClose, CToaster } from '@coreui/react'
import React from 'react'
const Toaster = ({ message ,status, body}) => {
    const toaster = React.useRef()
    let toasterDialogue = (
        <CToast title="HRM">
            <CToastHeader close="true">
                <svg
                    className="rounded me-2"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                >
                    <rect width="100%" height="100%" fill={status == true ? "#007aff" : "#ff0000"}></rect>
                </svg>
                <strong className="me-auto">{message}</strong>
                <small><CToastClose className="me-2 m-auto" /></small>
            </CToastHeader>
            <CToastBody>{body}</CToastBody>
        </CToast>
    )

    return (
        <CToaster ref={toaster} push={toasterDialogue} placement="top-end" />
    );
}

export default React.memo(Toaster);
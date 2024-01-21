import { CSpinner, CContainer} from '@coreui/react'

const LoadingScreen = () => {
    return (
        <CContainer style={{display:"flex", justifyContent:"center", alignItems:"center"}}> 
                <CSpinner component="span"aria-hidden="true" style={{height:"50px", marginTop: "25%", width:"50px", color:"#3c4b64"}}/>
        </CContainer>
    );
}
 
export default LoadingScreen;
import { Navigate } from 'react-router';
import { useAuth } from 'react-router-dom';
 
function RotaPrivada({ children }) {
    const { logado} = useAuth ();
    if (!logado) {
        return <Navigate to='/login' replace />
    }
    return children;
}
export default RotaPrivada;

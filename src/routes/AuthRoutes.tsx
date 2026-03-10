
import { Route, useNavigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ShipperRegister from '../pages/auth/ShipperRegister';
import OAuthSuccess from '../pages/auth/OAuthSuccess';
import OAuthRegister from '../pages/auth/OAuthRegister';

const AuthRoutes = () => {
    const navigate = useNavigate();

    return (
        <>
            <Route path="/login" element={<Login onGoToRegister={() => navigate('/register')} />} />
            <Route path="/register" element={<Register onGoToLogin={() => navigate('/login')} onGoToShipperRegister={() => navigate('/shipper-register')} />} />
            <Route path="/shipper-register" element={<ShipperRegister onBack={() => navigate('/register')} />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/oauth-register" element={<OAuthRegister onGoToLogin={() => navigate('/login')} />} />
        </>
    );
};

export default AuthRoutes;

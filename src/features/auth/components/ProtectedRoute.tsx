import React, {FC} from 'react';
import {Navigate} from 'react-router';
import {AuthService} from '../services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({children}) => {
    if (!AuthService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 
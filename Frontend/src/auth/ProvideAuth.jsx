import { useState } from 'react';

import AuthService from '.././services/auth.service';
import { authContext } from './use-auth';
// Add your Firebase credentials

function useProvideAuth() {
    const [user, setUser] = useState(AuthService.getLocalUser());
    const [rememberLogin, setRememberLogin] = useState(true);
    // Wrap any Firebase methods we want to use making sure ...
    // ... to save the user to state.

    const login = async (form) => {
        try {
            const response = await AuthService.login({
                UserName: form.UserName,
                Password: form.Password
            });
            if (response.data.accessToken) {
                AuthService.setLocalUser(response.data, form.remember);
                setRememberLogin(form.remember);
                setUser(response.data);
                return response;
            }
            return response;
        } catch (error) {
            return error;
        }
    };
    const register = async (form) => {
        try {
            const response = await AuthService.register(form);
            if (response.data.accessToken) {
                AuthService.setLocalUser(response.data, form.remember);
                setRememberLogin(form.remember);
                setUser(response.data);
                return response;
            }
            return response;
        } catch (error) {
            return error;
        }
    };
    const logout = () => {
        AuthService.logout();
        setUser(null);
    };
    const sendPasswordResetEmail = (email) => {
        // return firebase
        //     .auth()
        //     .sendPasswordResetEmail(email)
        //     .then(() => {
        //         return true;
        //     });
    };
    const confirmPasswordReset = (code, password) => {
        // return firebase
        //     .auth()
        //     .confirmPasswordReset(code, password)
        //     .then(() => {
        //         return true;
        //     });
    };

    // Return the user object and auth methods
    return {
        user,
        setUser,
        register,
        login,
        logout,
        sendPasswordResetEmail,
        confirmPasswordReset
    };
}

export default function ProvideAuth({ children }) {
    const auth = useProvideAuth();

    return <authContext.Provider value={auth}> {children} </authContext.Provider>;
}

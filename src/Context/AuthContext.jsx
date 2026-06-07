import { createContext, useContext, useState, useEffect } from "react";
<<<<<<< HEAD
=======
import { QueryClient, useQueryClient } from "@tanstack/react-query";
>>>>>>> 3b7bbfc575a473ccae7774cdf0c2d30a47c2c566
import apiClient from "../api/apiClient";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({children})=>{
    const queryClient = useQueryClient();
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if(!token) return setLoading(false);

            try {
                const response = await apiClient.get('/users/me');
                setUser(response.data.user || response.data);
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            } finally{
                setLoading(false);
            }
        };

        verifySession();
    },[])


    const handleAuthSuccess = (userData,token) =>{
        localStorage.setItem('token',token);
        setUser(userData);
<<<<<<< HEAD
        queryClient.invalidateQueries();
=======
<<<<<<< HEAD
=======
        QueryClient.invalidateQueries();
>>>>>>> 3b7bbfc575a473ccae7774cdf0c2d30a47c2c566
>>>>>>> 17de7513e2d35ecfbbcc7c4b9263423c72c4eefd
    };

    const register = async (name,email,password) => {
        const data = await authService.register({name,email,password});
        handleAuthSuccess(data.user,data.token);
    }

    const login = async (email,password) => {
        const data = await authService.login({email,password});
        handleAuthSuccess(data.user,data.token);
    };

    const googleAuth = async (googleToken) => {
        const data = await authService.googleAuth(googleToken);
        handleAuthSuccess(data.user,data.jwtToken); 
    };

    const forgotPassword = async (email)=>{
        const data = await authService.forgotPassword(email);
        return data;
    }

    const resetPassword = async (token,newPassword) =>{
        const data = await authService.resetPassword(token,newPassword);
<<<<<<< HEAD
=======
        logout();
>>>>>>> 3b7bbfc575a473ccae7774cdf0c2d30a47c2c566
        return data;
    }

    const logout = ()=>{
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        googleAuth,
        forgotPassword,
        resetPassword,
        logout
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);
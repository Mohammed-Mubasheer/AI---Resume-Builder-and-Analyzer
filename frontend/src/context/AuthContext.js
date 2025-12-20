// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    // Get tokens from localStorage, or set to null
    let [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') 
        ? JSON.parse(localStorage.getItem('authTokens')) 
        : null
    );

    // We'll also store the user info (this will come from the token later)
    let [user, setUser] = useState(() => 
        localStorage.getItem('authTokens') 
        ? "User" // We'll improve this later
        : null
    );

    const navigate = useNavigate();

    // Function to handle login
    const loginUser = async (username, password) => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            let data = await response.json();

            if (response.status === 200) {
                setAuthTokens(data);
                setUser("User"); // We'll decode the token to get the real user later
                localStorage.setItem('authTokens', JSON.stringify(data));
                navigate('/'); // Redirect to home page
            } else {
                alert('Login failed: ' + (data.detail || 'Wrong username or password.'));
            }
        } catch (error) {
            console.error("Login error:", error);
            alert('An error occurred during login.');
        }
    };

    // Function to handle registration
    const registerUser = async (username, email, password) => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            let data = await response.json();

            if (response.status === 201) {
                // Automatically log the user in after successful registration
                await loginUser(username, password);
            } else {
                // Handle errors, e.g., "username already exists"
                alert('Registration failed: ' + JSON.stringify(data));
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert('An error occurred during registration.');
        }
    };

    // Function to handle logout
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    // The values we'll share with the rest of the app
    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
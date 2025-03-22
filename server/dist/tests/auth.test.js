import axios from 'axios';
// URL of your server
const API_URL = 'http://localhost:3000';
// Test user data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
};
let authToken;
let verificationToken;
async function testSignup() {
    console.log('Testing signup...');
    try {
        const response = await axios.post(`${API_URL}/auth/signup`, testUser);
        console.log('Signup successful!');
        console.log('User:', response.data.user);
        authToken = response.data.token;
        // Extract verification token from server logs (this is for testing only)
        // In a real app, you'd check your email for the token
        console.log('Check the server console for the verification token and copy it here:');
        verificationToken = 'PASTE_TOKEN_HERE'; // Replace with actual token from logs
        return true;
    }
    catch (error) {
        console.error('Signup failed:', error.response?.data?.error || error.message);
        return false;
    }
}
async function testVerifyEmail() {
    console.log('\nTesting email verification...');
    try {
        const response = await axios.post(`${API_URL}/auth/verify-email`, {
            token: verificationToken
        });
        console.log('Email verification successful!');
        console.log('Response:', response.data);
        return true;
    }
    catch (error) {
        console.error('Email verification failed:', error.response?.data?.error || error.message);
        return false;
    }
}
async function testLogin() {
    console.log('\nTesting login...');
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('Login successful!');
        console.log('User:', response.data.user);
        authToken = response.data.token;
        return true;
    }
    catch (error) {
        console.error('Login failed:', error.response?.data?.error || error.message);
        return false;
    }
}
async function testGetMe() {
    console.log('\nTesting get current user...');
    try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        console.log('Get current user successful!');
        console.log('User:', response.data);
        return true;
    }
    catch (error) {
        console.error('Get current user failed:', error.response?.data?.error || error.message);
        return false;
    }
}
async function testResendVerification() {
    console.log('\nTesting resend verification email...');
    try {
        const response = await axios.post(`${API_URL}/auth/resend-verification`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        console.log('Resend verification email successful!');
        console.log('Response:', response.data);
        return true;
    }
    catch (error) {
        console.error('Resend verification email failed:', error.response?.data?.error || error.message);
        return false;
    }
}
async function runTests() {
    // To test signup, uncomment this line
    // await testSignup();
    // For testing verification, first signup, get the token from logs,
    // update the verificationToken variable, then run this
    // await testVerifyEmail();
    // To test login (can be done after verification)
    // await testLogin();
    // To test getting the current user
    // await testGetMe();
    // To test resending the verification email
    // await testResendVerification();
    console.log('\nTest suite completed.');
}
runTests().catch(console.error);

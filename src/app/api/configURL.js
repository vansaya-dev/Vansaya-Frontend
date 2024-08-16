import 'dotenv/config';

export const config = {
    apiIdentity: "",
    baseURL: 'https://vansaya-backend.onrender.com/',
    // baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    refreshTokenUrl: process.env.REFRESH_TOKEN_URL,
};

console.log("====configuration=========", process.env.NEXT_PUBLIC_BASE_URL);
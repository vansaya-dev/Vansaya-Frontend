import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; 
import { config } from "./configURL";
import Cookies from 'js-cookie';




const axiosHttp = axios.create({
  baseURL: `${config.baseURL}/api/v1`,
});

axiosHttp.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token} `;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    return Promise.reject(error);
  }
);

export default axiosHttp;
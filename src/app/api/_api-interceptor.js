import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; 
import { config } from "./configURL";


// Add a request interceptor

const axiosHttp = axios.create({
  baseURL: `${config.baseURL}`,
});

axiosHttp.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    const router = useRouter();

    if (error.response && error.response.status === 401 && originalRequest.url !== config.refreshTokenUrl) {
      // Handle unauthorized error
      toast.error('Unauthorized. Please login.');
      router.push('/login');
    } else if (error.response && error.response.status === 403) {
      // Handle forbidden error
      toast.error('Forbidden. You do not have permission.');
    } else {
      // Other errors
      toast.error('An error occurred.');
    }

    return Promise.reject(error);
  }
);

export default axiosHttp;
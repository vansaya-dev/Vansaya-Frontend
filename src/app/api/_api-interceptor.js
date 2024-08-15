import { config } from "./configURL";
import axios from "axios";
import { useRouter } from "next/navigation";

// Add a request interceptor

const axiosHttp = axios.create({
  baseURL: `${config.baseURL}`,
});
axiosHttp.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    // document.body.classList.add("loading-indicator");
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosHttp.interceptors.response.use(
  (response) => {
    document.body.classList.remove("loading-indicator");
    return response;
  },
  (error) => {
    document.body.classList.remove("loading-indicator");
    const originalRequest = error.config;
    if (
      error &&
      error.response &&
      error.response.status === 401 &&
      originalRequest.url === "http://127.0.0.1:3000/v1/auth/token"
    ) {
      //.push('/login')
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export { axiosHttp };

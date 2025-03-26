import axios from "axios"

import { BASE_URL } from "./apiPaths"

const axiosInstance = axios.create({
    baseURL : BASE_URL,
    timeout : 10000,
    headers : {
        "Content-Type" : "application/json",
        Accept : "application/json"
    }
})

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

// Response Interceptor
axios.interceptors.request.use(
    (response) => {
        return response;
    },
    (err) => {
        // Handle common error globally
        if(err.response){
            if(err.response.status == 401){
                // Redirect to login page

                window.location.href = "./login"
            } else if(err.response.status == 500){
                console.log("Server error. Please try again later.")
            }
        } else if(err.code == "ECONNABORTED"){
            console.log("Request timeout. Please try again.")
        }
        return Promise.reject(err)
    }
)

export default axiosInstance




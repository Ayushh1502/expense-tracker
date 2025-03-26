import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async(imageFile) => {
    const formData = new FormData()
    
    // append image file to form data
    formData.append("image",imageFile)

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE , formData , {
            headers : {
                "Content-Type" : "multipart/form-data" //set headers for file upload
            }
        })

        return response.data
    } catch (err) {
        console.log("Error Uploading the image :" , err)
        throw err // rethrow error for handling
    }
}

export default uploadImage
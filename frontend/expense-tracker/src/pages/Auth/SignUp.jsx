import react, { useContext, useState } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import { useNavigate , Link } from "react-router-dom"
import Input from "../../components/inputs/input"
import { validateEmail } from "../../Utils/helper"
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector"
import axiosInstance from "../../Utils/axiosInstance"
import { API_PATHS } from "../../Utils/apiPaths"
import { UserContext } from "../../context/userContext"
import uploadImage from "../../Utils/uploadImage"

const SignUp = () => {

    const [profilePic , setProfilePic] = useState(null)
    const [fullName , setFullName] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")

    const {updateUser} = useContext(UserContext)

    const [error , setError] = useState(null)

    const navigate = useNavigate()

    const handleSignUp = async(e) => {
        e.preventDefault()

        let profileImageUrl = ""

        if(!fullName){
            setError("Please Enter Your Name.")
            return
        }

        if(!validateEmail(email)){
            setError("Please Enter a Valid Email Address.")
            return
        }

        if(!password){
            setError("Please Enter The Password.")
            return 
        }

        setError("")

        // sign up API call

        try {
            // upload profile pic if present
            if(profilePic){
                const imgUploadRes = await uploadImage(profilePic)
                profileImageUrl =   imgUploadRes.imageUrl || ""
                console.log(profileImageUrl)
            }
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl
            })

            const {token , user} = response.data

            if(token){
                localStorage.setItem("token",token)
                updateUser(user)
                navigate("/dashboard")
            }
        } catch (err) {
            if(err.response && err.response.data.message){
                setError(err.response.data.message)
            }
            else{
                console.log(err)
                setError("Something went wrong. please try again.")
            }
        }
    }

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Create an Account</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Join us Today by Entering Your Details Below.
                </p>

                <form onSubmit={handleSignUp}>

                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/> 

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                        value={fullName}
                        onChange={({target})=> setFullName(target.value)}
                        label="Full Name"
                        placeholder="Jhon"
                        type="text"/>

                        <Input 
                        value={email}
                        onChange={({target}) => setEmail(target.value)}
                        label="Email Address" 
                        placeholder="jhon@example.com"
                        type="text"/>

                        <div className="col-span-2">
                            <Input 
                            value={password}
                            onChange={({target}) => setPassword(target.value)}
                            label="Password" 
                            placeholder="Min 8 Characters"
                            type="password"/>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button type="submit" className="btn-primary">
                        SIGN UP
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                       Already Have a Account ?{" "}
                        <Link className="font-medium text-primary underline" to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default SignUp
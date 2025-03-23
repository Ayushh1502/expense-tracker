import react, { useState } from "react"
import AuthLayout from "../../components/layouts/AuthLayout"
import { useNavigate , Link } from "react-router-dom"
import Input from "../../components/inputs/input"
import { validateEmail } from "../../Utils/helper"

const Login = () => {
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    // handle login Form Submit
    const handleLogin = async(e)=>{
        e.preventDefault()

        if(!validateEmail(email)){
            setError("Please Enter a Valid Email Address.")
            return 
        }
        if(!password){
            setError("Please Enter The Password.")
            return 
        }

        setError("")

        // Login API Call
    }

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Please Enter Your Details to Log in
                </p>

                <form onSubmit={handleLogin}>
                    <Input 
                    value={email}
                    onChange={({target}) => setEmail(target.value)}
                    label="Email Address" 
                    placeholder="jhon@example.com"
                    type="text"/>

                    <Input 
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                    label="Password" 
                    placeholder="Min 8 Characters"
                    type="password"/>

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button type="submit" className="btn-primary">
                        Login
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        Don't Have a Account ?{" "}
                        <Link className="font-medium text-primary underline" to="/signup">
                            SignUp
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default Login
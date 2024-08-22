import { useState } from "react"
import { useAuthContext } from "../context/AuthContext.js"
import toast from "react-hot-toast";

type SignupInputs = {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
    gender: string;
}

export const useSignup = () => {

    const [loading,setLoading] = useState(false)
    const { setAuthUser } = useAuthContext();

    const signup = async(Inputs: SignupInputs) => {
        
        try {
            setLoading(true)
            const res = await fetch("/api/auth/signup",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(Inputs)
            })

            const data = await res.json();

            if(!res.ok) throw new Error(data.error)
            setAuthUser(data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log("Error",error);
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }

    return {loading,signup}
}
import  { useState } from 'react'
import { useAuthContext } from '../context/AuthContext.js'
import toast from 'react-hot-toast';

export default function useLogout() {
    const [loading,setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const logout = async() => {
        setLoading(true)
        try {
            const res  = await fetch("https://private-messaging-app.vercel.app/api/auth/logout",{
                method: "POST",
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.error)
            }
            setAuthUser(null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {   
           console.log("Error",error)
           toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
    return {loading,logout};
}


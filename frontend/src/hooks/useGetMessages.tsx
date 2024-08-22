import  { useEffect, useState } from 'react'
import useConversation from '../zustand/useConversation.js'

export default function useGetMessages() {
    const [loading,setLoading] = useState(false)
    const { messages,setMessages,selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async() => {

            if(!selectedConversation) return 
            setLoading(true);
            setMessages([])

            try {
                const res = await fetch(`/api/messages/${selectedConversation.id}`);
                const data = await res.json();
                console.log("Data",data);
                if(!res.ok) throw new Error(data.error || "An error Occurred")
                setMessages(data)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error : any) {
                console.log("Error in Getting Messages",error);
                // toast.error(error.message);
            }finally{
                setLoading(false)
            }
        }
        getMessages();
    },[selectedConversation,setMessages])
    return { messages, loading }
}

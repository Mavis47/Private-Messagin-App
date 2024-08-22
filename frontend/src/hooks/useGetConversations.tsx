import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useGetConversations() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://private-messaging-app.vercel.app/messages/conversations`
        );
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data.users);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("Error", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);
  return { loading, conversations };
}

import './ChatPage.css'
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';
import axiosInstance from '../../axios/axios';
import { useClerk } from '@clerk/clerk-react';

const ChatPage = () => {

    const path = useLocation().pathname;
    const chatId = path.split("/").pop();

    const clerk = useClerk()

      const { isPending, error, data } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
          try {
            // Retrieve the token from Clerk
            const token = await clerk.session.getToken();
            
            // Set up headers with the token
            const headers = {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            };
    
            // Fetch chat data from backend
            const response = await axiosInstance.get(`/chats/${chatId}`, { headers });
            return response.data; // Return the data directly
          } catch (err) {
            console.error('Error fetching chat data:', err);
            throw err; // Propagate error for React Query to handle
          }
        }
      });

    console.log("data from useQuery ChatPage.jsx",data);

    if(error){
        console.log("error in chatpage.jsx", error)
    }

    return (
        <div className="ChatPage">
            <div className="wrapper">
                <div className="chat">
                    {isPending ? "Loading..." : error ? "Something went wrong!"
                        : data?.history?.map((message, i) => (
                            <>
                                {message.img && (
                                    <IKImage urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT} path={message.img} height="300" width="400" transformation={[{ height: 300, width: 400 }]} loading="lazy" lqip={{ active: true, quality: 20 }} />
                                )}
                                <div className={message.role == "user" ? "message user" : "message"} key={i}>
                                    <Markdown>{message.parts[0].text}</Markdown>
                                </div>
                            </>
                        ))
                    }
                    {data && <NewPrompt data={data} />}
                </div>
            </div>
        </div>
    )
}

export default ChatPage






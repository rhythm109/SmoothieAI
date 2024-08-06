import { useAuth } from '@clerk/clerk-react';
import './DashboardPage.css'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axios';

const DashboardPage = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: async (text) => {
            try {
                // Make a POST request using the axios instance
                const response = await axiosInstance.post('/chats', { text }, {
                    withCredentials: true, // Ensure cookies are sent with the request if needed
                });
                return response.data; // Return the response data
            } catch (error) {
                console.log('Error creating chat:', error);
                throw error; // Throw the error to be handled by React Query
            }
        },
        onSuccess: (data) => {
            console.log('checking data', data)
            const id = data; // Assuming response data contains an `id` field
            queryClient.invalidateQueries({ queryKey: ["userChats"] });
            navigate(`/dashboard/chats/${id}`);
        },
    });
    

    const handleSubmit = async (e)=> {
        try{
            e.preventDefault();
            const text = e.target.text.value;
            console.log("text", text)
            if(!text) return;
    
            mutation.mutate(text);

        }
        catch(err){
            console.log("error in dashboardPage",err)
        }
    };

    return (
        <div className="DashboardPage">
            <div className="texts">
                <div className="logo">
                    <img src="/logo.png" alt="" />
                    <h1>SMOOTHIE AI</h1>
                </div>
                <div className="options">
                    <div className="option">
                        <img src="/chat.png" alt="" />
                        <span>Create a New Chat</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="" />
                        <span>Analyze Images</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt="" />
                        <span>Help me with my Code</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="text" placeholder= "Ask me Anything..." />
                    <button>
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default DashboardPage
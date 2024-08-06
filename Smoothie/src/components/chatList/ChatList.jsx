import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { useClerk } from "@clerk/clerk-react";
import axiosInstance from "../../axios/axios";

const ChatList = () => {
  const clerk = useClerk();
// Custom function to get the session token
const fetchSessionToken = async () => {
  try {
      const { session } = clerk;
      const token = await session.getToken(); // Get the token
      return token;
  } catch (error) {
      console.log('Failed to get session token:', error);
      throw error;
  }
};

const { isPending, error, data } = useQuery({
      queryKey: ['userChats'],
      queryFn: async () => {
          const token = await fetchSessionToken(); // Fetch the token

          const response = await axiosInstance.get('/userchats', {
              headers: {
                  'Authorization': `Bearer ${token}`, // Include token in headers
                  'Content-Type': 'application/json',
              },
              withCredentials: true, // Ensure cookies are sent with the request if needed
          });
          return response.data; // Return the data from Axios response
      },
      // Optional: Add retry logic, stale time, etc., if needed
  });

  if(error){
    console.log("error in ChatList", error)
  }

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore Lama AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to Lama AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
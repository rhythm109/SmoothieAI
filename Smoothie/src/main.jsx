import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Homepage from './routes/homepage/Homepage';
import DashboardPage from './routes/dashboardPage/DashboardPage';
import ChatPage from './routes/chatPage/ChatPage';
import RootLayout from './layouts/rootLayout/RootLayout';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout';
import SigninPage from './routes/signinPage/SigninPage';
import SignupPage from './routes/signupPage/SignupPage';


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/sign-in/*",
        element: <SigninPage />,
      },
      {
        path: "/sign-up",
        element: <SignupPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
      // Catch-all route for redirecting to homepage
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router = {router} />
  </React.StrictMode>,
)


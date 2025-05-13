import React from 'react';
import { Home, Search, MessageSquare, Bell, Plus, User, LogOut } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar.jsx";
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import store from '../redux/store.js';
import { setAuthUser, setSuggestedUsers, setUserProfile } from '../redux/authSlice.js';
import { setPosts, setSelectedPost } from '../redux/postSlice.js';
import { useState, useEffect } from 'react';
import CreatePost from './CreatePost.jsx';

export default function LeftSidebar() {
   const {user} = useSelector(store=>store.auth);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [open, setOpen] = useState(false);
   
   const logoutHandler = async () => {
      try {
         const res = await axios.get('http://localhost:8000/api/v1/user/logout', {withCredentials:true});
         if (res.data.success) {
            dispatch(setAuthUser(res.data.user));
            dispatch(setPosts([]));
            dispatch(setSelectedPost(null));
            dispatch(setSuggestedUsers([]));
            dispatch(setUserProfile(null));
            navigate("/login")
            toast.success(res.data.message);
         }
      } catch (error) {
         toast.error(error.response.data.message)
      }
   };
   
   const sidebarHandler = (textType) => {
      if (textType==='Logout') {
         logoutHandler();
      } else if (textType==='Create') {
         setOpen(true);
      } else if (textType==='Home') {
         navigate('/');
      } else if (textType==='Search') {
         navigate('/search');
      } else if (textType==='Profile') {
         navigate(`/profile/${user?.username}`);
      }
   };
   
   const items = [
      { icon: <Home />, text: 'Home' },
      { icon: <Search />, text: 'Search' },
      { icon: <MessageSquare />, text: 'Messages' },
      { icon: <Plus />, text: 'Create' },
      { icon: <Bell />, text: 'Notifications' },
      { icon: (
         <Avatar className="rounded-full w-8 h-8">
            <AvatarImage className="w-8 h-8 rounded-full" src={user?.profilePicture || "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369989.png"} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
         </Avatar>
      ), text: 'Profile' },
      { icon: <LogOut />, text: 'Logout' },
   ];
   
   return (<div className="sm:w-fit w-[100vw] sm:pr-4 border-t sm:border-t-0 sm:border-r border-gray-500 bg-black sm:static fixed bottom-0 left-0 z-50">
      <div className="hidden sm:block sm:mt-3 sm:mx-2 sm:p-1 sm:text-2xl sm:font-bold sm:tracking-wide sm:text-center sm:bg-clip-text sm:text-transparent sm:bg-gradient-to-r sm:from-purple-400 sm:to-pink-600 shadow-md">
         InstaDebo
      </div>
      <div className="flex flex-row sm:flex-col justify-between sm:items-start items-center p-1 sm:p-3 sm:min-h-[70vh]">
         {items.map((item, index) => (
            <div onClick={()=> sidebarHandler(item.text)} key={index} className="flex items-center justify-center sm:justify-start gap-3 p-2 hover:bg-white hover:text-black cursor-pointer w-36 rounded">
               <div className="icon rounded-full sm:w-7">{item.icon}</div>
               <div className="text hidden sm:block text-sm">{item.text}</div>
            </div>
         ))}
      </div>
      <CreatePost open={open} setOpen={setOpen} />
   </div>);
};
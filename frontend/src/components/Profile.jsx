import React from "react";
import { useSelector } from "react-redux";
import useGetUserProfile from '../hooks/useGetUserProfile.jsx';
import { useParams, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Badge } from "./ui/badge.jsx";

export default function Profile() {
   const params = useParams();
   const username = params.username;
   useGetUserProfile(username);
   const { user, userProfile } = useSelector((store) => store.auth);
   
   const isFollowing = true;
   const [activeTab, setActiveTab] = useState('Posts');
   const tabChangeHandler = (tabText) => {
      setActiveTab(tabText);
   };
   const displayPost = activeTab==="Posts" ? userProfile?.posts : userProfile?.bookmarks
   
   return (
      <div className="bg-black sm:m-3 sm:p-3 h-[82vh] overflow-auto text-white flex flex-col items-center p-5">
         {/* 🔹 Profile Section */}
         <div className="w-full max-w-2xl flex items-center gap-6 mb-5">
            {/* Profile Picture */}
            <img
               src={userProfile?.profilePicture || "https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png"}
               alt="Profile"
               className="w-28 h-28 rounded-full border-4 border-gray-700 object-cover"
            />

            {/* User Details */}
            <div>
               <h2 className="text-2xl font-bold items-center flex">
                  <span>{userProfile?.fullName || "User Name"}</span> 
                  {userProfile?.gender && <Badge className="ml-2 bg-violet-700">{userProfile?.gender}</Badge>}
               </h2>
               <p className="text-gray-400">@{userProfile?.username || "username"}</p>
               <p className="text-sm text-gray-400 mt-1">{userProfile?.email}</p>
               <p className="text-sm text-gray-400 mt-1">{userProfile?.bio || "No bio yet"}</p>
            </div>
         </div>

         {/* 🔹 Stats & Edit Profile Button */}
         <div className="w-full max-w-2xl flex justify-between items-center mb-5">
            <div className="flex gap-5 text-center mx-auto sm:mx-1">
               <div>
                  <h3 className="text-lg font-semibold">{userProfile?.posts.length}</h3>
                  <p className="text-gray-400 text-sm">Posts</p>
               </div>
               <div>
                  <h3 className="text-lg font-semibold">{userProfile?.followers.length}</h3>
                  <p className="text-gray-400 text-sm">Followers</p>
               </div>
               <div>
                  <h3 className="text-lg font-semibold">{userProfile?.following.length}</h3>
                  <p className="text-gray-400 text-sm">Following</p>
               </div>
            </div>

            {/* Edit Profile Button (Only for logged-in user) */}
            {
               user?._id===userProfile?._id ? (
                  <NavLink to="/account/edit">
                     <button className="bg-gray-800 px-4 py-2 rounded-md text-white font-semibold hover:bg-gray-700">
                        Edit Profile
                     </button>
                  </NavLink>
               ) : (
                  isFollowing ? (
                     <div className="flex flex-col sm:flex-row gap-3">
                        <button className="bg-gray-800 px-4 py-2 rounded-md text-white font-semibold hover:bg-gray-700">
                           Follow
                        </button>
                        <button className="bg-blue-700 px-4 py-2 rounded-md text-white font-semibold hover:bg-blue-900">
                           Message
                        </button>
                     </div>
                  ) : (
                     <button className="bg-gray-800 px-4 py-2 rounded-md text-white font-semibold hover:bg-gray-700">
                        Unfollow
                     </button>
                  )   
               )
            }
         </div>
         
         <div className="w-full border border-gray-700"></div>
         
         <div className="flex justify-around items-center w-full">
            <span onClick={()=> tabChangeHandler("Posts")} className={`${activeTab==="Posts" ? "font-bold bg-slate-900" : "bg-slate-700"} border border-slate-400 m-1 p-2 w-[40%] flex justify-center items-center rounded-lg`}>Posts</span>
            <span onClick={()=> tabChangeHandler("Bookmarks")} className={`${activeTab==="Bookmarks" ? "font-bold bg-slate-900" : "bg-slate-700"} border border-slate-400 m-1 p-2 w-[40%] flex justify-center items-center rounded-lg bg-slate-700 hover:bg-slate-900`}>Bookmarks</span>
         </div>
         
         <div className="w-full border border-gray-700"></div>
         
         <div className="grid grid-cols-2 sm:grid-cols-3 m-1 gap-1">{
            displayPost?.map((post) => {
               return <div key={post._id}>
                  <img src={post?.image} alt="post_image" className="aspect-square object-contain bg-slate-100" />
               </div>
            })
         }</div>

         {/* 🔹 Posts Grid 
         <div className="w-full max-w-2xl grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, index) => (
               <div key={index} className="relative">
                  <img
                     src={`https://source.unsplash.com/random?sig=${index}`}
                     alt="Post"
                     className="w-full h-32 object-cover"
                  />
               </div>
            ))}
         </div>*/}
      </div>
   );
}
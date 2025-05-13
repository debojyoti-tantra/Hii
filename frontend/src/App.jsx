import { useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import MainLayout from './components/MainLayout.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import Search from './components/Search.jsx';
import EditProfile from './components/EditProfile.jsx';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

const browserRouter = createBrowserRouter([
   {
      path:'/',
      element:<MainLayout />,
      children:[
         {
            path:'/',
            element: <Home />
         },
         {
            path:'/profile/:username',
            element: <Profile />
         },
         {
            path:'/account/edit',
            element: <EditProfile />
         },
         {
            path:'/search',
            element: <Search />
         },
      ]
   },
   {
      path:'/login',
      element:<Login />
   },
   {
      path:'/signup',
      element:<Signup />
   },
])

function App() {
  const [count, setCount] = useState(0)

  return (
     <>
         <RouterProvider router={browserRouter} />
     </>
   )
}

export default App

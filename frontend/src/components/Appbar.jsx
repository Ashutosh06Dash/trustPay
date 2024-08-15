import axios from 'axios'
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import {BASE_URL} from "../helper";

export function Appbar(){
    const [user,setUser]=useState({});
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();
    useEffect(()=>{
        async function showUser() {
            try{
                const response = await axios.get(`${BASE_URL}/api/v1/user/userId`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setUser(response.data.user);
            }
            catch(err) {
                toast.error("Error while fetching the User Data")
                localStorage.removeItem('token');
                navigate('/signin');
            }
            finally {
                setLoading(false);
            }
        }
        showUser();
    },[])
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center font-bold text-4xl text-gray-900 h-full ml-4">
            trustPay 
        </div>
        <div className="flex flex-col justify-center font-bold text-2xl text-gray-900 h-full mr-4">
            Hello {loading?<CircularProgress/>:user.firstName+" "+user.lastName||""}
        </div>
        <div className="flex">
            
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-6">
                <div className="flex flex-col justify-center h-full text-xl">
                {user.firstName?user.firstName[0].toUpperCase():""}
                    
                </div>
            </div>
            <div className='flex flex-col justify-center mt-1 mr-4'><Button onClick={()=>{
                localStorage.removeItem('token')
                toast.success("LogOut Successfull")
                navigate("/signin")
            }} label={'Log Out'}></Button>
            </div>
        </div>
    </div>
}
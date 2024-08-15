import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import {BASE_URL} from "../helper";

export function Balance(){
    const [balance,setBalance]=useState(0);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();
        async function showBalance(){
            try{
                const response= await axios.get(`${BASE_URL}/api/v1/account/balance`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                })
                setBalance(response.data.balance);
            }
            catch(err){
                toast.error("Error while fetching the User Data")
                localStorage.removeItem('token');
                navigate('/signin')
            }
            finally {
                setLoading(false);
            }
            
            
        }
        showBalance();
        
    
    if(loading){
        return <CircularProgress/>
    }
    return <div className="flex">
        <div className="font-bold text-lg">
            Your Balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            
            {loading?"Loading...":balance}
        </div> 
    </div>
}
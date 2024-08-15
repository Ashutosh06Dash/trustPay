import {Heading} from "../components/Heading"
import {SubHeading} from "../components/SubHeading"
import {InputBox} from "../components/InputBox"
import {Button} from "../components/Button"
import {BottomWarning} from "../components/BottomWarning"
import { useState,useEffect} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BASE_URL} from "../helper";


export function Signup(){
    const [firstName,setFirstName]=useState("");
    const [lastName,setlastName]=useState("");
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign Up"}/>
                <SubHeading label={"Enter your Information to Create an Account"}/>
                <InputBox onChange={e=>{
                    setFirstName(e.target.value)
                }} placeholder={"Ashutosh"} label={"First Name"}/>
                <InputBox onChange={e=>{
                    setlastName(e.target.value)
                }} placeholder={"Dash"} label={"Last Name"}/>
                <InputBox onChange={e=>{
                    setUsername(e.target.value)
                }} placeholder={"ashutoshdash2613@gmail.com"} label={"Email"}/>
                <InputBox onChange={e=>{
                    setPassword(e.target.value)
                }} placeholder={"Password"} label={"Password"}/>
                <div className="pt-4">
                    <Button onClick={async()=>{
                        try{
                            const response=await axios.post(`${BASE_URL}/api/v1/user/signup`,{
                                username,
                                password,
                                firstName,
                                lastName,
                            });
                            localStorage.setItem("token",response.data.token)
                            navigate("/dashboard")
                            toast.success("Sign Up Successfull")
                        }
                        catch(err){
                            toast.error("Sign Up failed")
                        }
                        
                    }} label={"Sign Up"}/>
                </div>
                <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} toRoute={"/signin"} />
            </div>
        </div>
    </div>
}
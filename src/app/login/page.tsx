'use client'

// import Button from "@/components/Button/buttonComponent";
import TextBox from "@/components/textbox/TextBoxComponent";
import Title from "@/components/titleComponent/titleComponent";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setCookie, getCookie } from '../../utils/cookie';
import Loading from "@/components/Loading/loading";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Login(){
    const [Username, SetUsername] = useState('');
    const [Password, SetPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(()=>{
        console.log(getCookie('token'));
        
    })

    const handleLogin = async () => {
        console.log(Username);
        console.log(Password);
        setLoading(true)
        const url = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${url}/auth/login`, {
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email:Username,
                    password:Password
                })
            })

            setLoading(false)
            if(!response.ok){
                console.log(await response.json());
                
                toast("Hello coders it was easy!");
            };
            const data = await response.json()
            if(data.metadata.code == 200){
                setCookie('token', data.token, { expires: 1 })
                setCookie('logged_in', true, { expires: 1 })
                
                router.push('/dashboard'); 
            }else{
                toast("Isi username dan password dengan benar");
            }
            
        } catch (error) {
            console.log(error);
            
        }

        
    }
    return (
        <div className="w-screen min-h-screen flex justify-center items-center">
            <ToastContainer/>
            <div className="w-full px-8 sm:w-2/5 md:w-2/4 xl:w-2/5">
                <Title color="text-black" weight="font-semibold" size="text-[22px]">Login</Title>
                <Title color=" text-gray-500" weight="font-reguler" size="text-[12px]">Enter your account details</Title>
                <div className="flex justify-center">
                    <Image src="/img-login.png" // Path to your image
                    alt="Description of image"
                    width={500} // Desired width
                    height={300} // Desired height
                    />
                </div>
                <div className="mt-4">
                    <TextBox title="Email or username" change={(e:any)=>{
                        SetUsername(e.target.value)
                    }} placeholder="johndoe@gmail.com" name="username"/>
                </div>
                <div className="mt-4">
                    <TextBox title="Password" change={(e:any)=>{
                        SetPassword(e.target.value)
                    }} placeholder="password" name="password"/>
                </div>
                <div className="mt-4">
                    {isLoading ? <Button className="w-full h-[35px] bg-[#b0daff]"><Loading color="text-[#2C96F1] size-4" /></Button>
                    :
                    <Button className="w-full h-[35px] bg-[#2C96F1]" onClick={handleLogin}>Login</Button>
                    }
                    
                    <Title color=" text-gray-500" weight="font-reguler" size="text-[14px] mt-2">Dont have account ? <Link href="/register" className="text-[#2C96F1]">Sign up</Link></Title>
                </div>
            </div>
        </div>
    );
}
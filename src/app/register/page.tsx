'use client'

import Button from "@/components/Button/buttonComponent";
import TextBox from "@/components/textbox/TextBoxComponent";
import Title from "@/components/titleComponent/titleComponent";
// import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setCookie, getCookie, removeCookie } from '../../utils/cookie';


export default function Login(){
    const [Username, SetUsername] = useState('');
    const [Password, SetPassword] = useState('');

    const [formdata, setFormData] = useState({
        'full_name':'',
        'email':'',
        'username':'',
        'password':'',
    })
    const router = useRouter();

    useEffect(()=>{
        console.log(getCookie('token'));
        
    })

    const handleRegister = async () => {
        console.log(formdata);
        // console.log(Password);

        // let url = process.env.NEXT_PUBLIC_API_URL
        let url = 'http://localhost:4000'
        try {
            const response = await fetch(`${url}/auth/register`, {
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formdata)
            })
            console.log(response);
            if(!response.ok) throw new Error('Login Failed');
            let data = await response.json()
            console.log(data.metadata);
            
            if(data.metadata.code == '201'){
                alert('anda berhasil membuat akun!');
                router.push('/login'); 

            }
            // setCookie('token', data.token, { expires: 1 })
            // setCookie('logged_in', data.status, { expires: 1 })
            
            // router.push('/dashboard'); 
            
        } catch (error) {
            console.log(error);
            
        }

        
    }
    const onChangeFormRegister = (e:any)=>{
        let {name, value}=e.target;
        setFormData({
            ...formdata,
            [name]:value
        })
    }
    return (
        <div className="w-screen min-h-screen flex justify-center items-center">
            <div className="w-full px-8 sm:w-2/5 md:w-2/4 xl:w-2/5">
                <Title color="text-black" weight="font-semibold" size="text-[22px]">Register</Title>
                <Title color=" text-gray-500" weight="font-reguler" size="text-[12px]">Create your account details</Title>
                <div className="flex justify-center">
                    <Image src="/img-login.png" // Path to your image
                    alt="Description of image"
                    width={500} // Desired width
                    height={300} // Desired height
                    />
                </div>
                <div className="mt-4">
                    <TextBox title="Full Name" change={onChangeFormRegister} placeholder="Full Name" name="full_name"/>
                </div>
                <div className="mt-4">
                    <TextBox title="Email" change={onChangeFormRegister} placeholder="johndoe@gmail.com" name="email"/>
                </div>
                <div className="mt-4">
                    <TextBox title="Username" change={onChangeFormRegister} placeholder="Username" name="username"/>
                </div>
                <div className="mt-4">
                    <TextBox title="Password" change={onChangeFormRegister} placeholder="password" name="password"/>
                </div>
                <div className="mt-4">
                    <Button color="bg-[#2C96F1]" title="Register" size="w-full h-[35px]" click={handleRegister}/>
                    <Title color=" text-gray-500" weight="font-reguler" size="text-[14px] mt-2">You have account ? <Link href="" className="text-[#2C96F1]">Sign in</Link></Title>
                </div>
            </div>
        </div>
    );
}
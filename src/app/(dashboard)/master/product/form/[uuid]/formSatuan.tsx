import Title from "@/components/titleComponent/titleComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {getCookie} from "../../../../../../utils/cookie";

interface CallbackSubmit{
    SubmitForm:()=>void
}

const  FormSatuan: React.FC<CallbackSubmit> = ({SubmitForm}) =>{
    const [formSatuan, setFormSatuan] = useState({
        'name':'',
    })
const token = getCookie('token');

    async function handleFormSatuan(e:any){
        
        e.preventDefault()
        console.log(formSatuan);
        
        const response = await fetch(`http://localhost:4000/satuan`, {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
                'authorization':`Bearer ${token}`

            },
            body: JSON.stringify(formSatuan)
        })

        if(!response.ok) throw new Error('Insert Failed');
        SubmitForm();
    }
    function onchangeFormSatuan(e:any){
        const {name, value} = e.target;
        setFormSatuan({
            ...formSatuan,
            [name]:value
        })
    }
    return(
        <form onSubmit={handleFormSatuan} method="post">
            <div className="m-2">
                <Title size="text-[12] font-semibold">Satuan</Title>
                <div className="flex justify-start z-1">
                    <Input className={`w-full mr-2`} name="name" placeholder="Masukan satuan" onChange={onchangeFormSatuan}/><Button className={`z-[2]`}>Simpan</Button>
                </div>
            </div>
        </form>
    );
}
export default FormSatuan;
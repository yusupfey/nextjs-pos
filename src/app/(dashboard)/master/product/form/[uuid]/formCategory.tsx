import Title from "@/components/titleComponent/titleComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {getCookie} from "../../../../../../utils/cookie";

interface onsumbitFunction {
    FormSubmit: ()=> void;
} 
const token = getCookie('token');

const CategoryForm: React.FC<onsumbitFunction> = ({FormSubmit}) =>{
    async function handleFormCategory(e:any){
        e.preventDefault()
        console.log(formCategory);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
                'authorization':`Bearer ${token}`

            },
            body: JSON.stringify(formCategory)
        })

            if(!response.ok) console.log(response.ok);
            
            FormSubmit();
    }
    function onchangeFormCategory(e:any){
        const {name, value} = e.target;
        setFormCategory({
            ...formCategory,
            [name]:value
        })
    }
    const [formCategory, setFormCategory] = useState({
        'name':'',
    })
    
    return (
        <form onSubmit={handleFormCategory} method="post">
            <div className="m-2">
                <Title size="text-[12] font-semibold">Category</Title>
                <div className="flex justify-start z-1">
                <Input className={`w-full mr-2`} name="name" placeholder="Masukan category" onChange={onchangeFormCategory}/><Button className={`z-[2]`}>Simpan</Button>
                </div>

            </div>
        </form>
    );
}

export default CategoryForm;
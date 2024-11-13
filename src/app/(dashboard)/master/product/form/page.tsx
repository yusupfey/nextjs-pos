"use client"
import Title from "@/components/titleComponent/titleComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCookie } from "@/utils/cookie";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

// import { FaPlus } from "react-icons/fa";
import * as yup from "yup";

export default function FormProduct(){
    const [errors, setErrors] = useState<any>({});
    // const [isButtonAddCategory, setButtonAddCategory] = useState(false)
    // const [isButtonAddSatuan, setButtonAddSatuan] = useState(false)
    // const [isButtonAddProduct, setButtonAddProduct] = useState(false)

    const [formProduct, setFormProduct] = useState({
        'name':'',
        'barcode':'',
        'deskripsi':''
    })
    const token = getCookie('token')
    // const url = process.env.NEXT_PUBLIC_API_URL!;
    const simpleSchema = yup.object().shape({
        name: yup
          .string()
          .required('Username is required'),
        //   .min(3, 'Username must be at least 3 characters'),
        barcode: yup
          .string()
        //   .email('Must be a valid email')
          .required('Barcode is required'),
        deskripsi: yup
          .string()
          .required('deskripsi is required')
      });
      
    async function submitProduct(e:any){
        e.preventDefault()
        console.log(formProduct);
        try {
            await simpleSchema.validate(formProduct,  { abortEarly: false });

            sentProduct()
            // console.log('Validation succeeded:', formProduct);
          } catch (error:any) {
            const errorMessages:any = {};
            error.errors.forEach((message:any, index:any) => {
                // Assign message based on the path or index
                const path = error.inner[index]?.path || index;

                errorMessages[path] = message;
                setErrors(errorMessages);

            });

            // console.error('Validation failed:', errorMessages);
          }
        
        
        
    }
    const sentProduct = async () =>{
        const response = await fetch(`http://localhost:4000/product`, {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
                'authorization':`Bearer ${token}`
                
            },
            body: JSON.stringify(formProduct)
        })

            if(!response.ok) throw new Error('Insert Failed');
            // const data = await response.json()

            setFormProduct({
                'name':'',
                'barcode':'',
                'deskripsi':''
            })
            
            // setButtonAddProduct(false)
    }
    function onchangeFormProduct(e:any){
        const { name, value } = e.target;
        setFormProduct({
            ...formProduct,
            [name]:value
        })
        
    }
    return (
        <div className="p-2">
            <Title size="text-[30px] font-semibold">Form Product</Title>
            <Card>
                <CardContent className="p-2">
                    <Title size="text-[22px] font-semibold my-2">Product</Title>
                    <form onSubmit={submitProduct} method="post" >
                        <div className="grid grid-cols-3 items-center">
                            <div className="m-2">
                                <Title size="text-[12] font-semibold">Name</Title>
                                <Input type="text" value={formProduct.name} onChange={onchangeFormProduct} name="name" placeholder="Masukan product"/>
                                {errors.name && <div className="text-red-400 italic">{errors.name}</div>}
                            </div>
                            <div className="m-2">
                                <Title size="text-[12] font-semibold">Barcode</Title>
                                <Input type="text" value={formProduct.barcode} onChange={onchangeFormProduct} name="barcode" placeholder="Masukan barcode"/>
                                {errors.barcode && <div className="text-red-400 italic">{errors.barcode}</div>}
                            </div>
                            <div className="m-2">
                                <Title size="text-[12] font-semibold">Deskripsi</Title>
                                <textarea value={formProduct.deskripsi} onChange={onchangeFormProduct} name="deskripsi" placeholder="Masukan barcode"/>
                                {errors.deskripsi && <div className="text-red-400 italic">{errors.deskripsi}</div>}
                            </div>
                            <div className="m-2">
                                <Title size="text-[12] font-semibold">Image</Title>
                                <Input type="file" />
                            </div>
                        </div>
                        <div className="m-2 flex justify-end">
                        <Button className={`z-[2] w-72`}>Simpan</Button>
                        </div>
                        
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
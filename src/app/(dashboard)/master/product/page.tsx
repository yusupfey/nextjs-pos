"use client"
import Title from "@/components/titleComponent/titleComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import {getCookie} from "../../../../utils/cookie";
import { useRouter } from "next/navigation";

export default function Porduct(){
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const router = useRouter();
    const token = getCookie('token')
    const url = process.env.NEXT_PUBLIC_API_URL!;
    
    async function getdata(){
        console.log(token);
        console.log(url);
        
        const response = await fetch(`${url}/product`,{
            method:'GET',
            headers:{
                'authorization':`Bearer ${token}`
            }
        })
        console.log(response.status);
        if (response.status === 401) {
            // Jika menerima status 401, arahkan ke halaman login
            console.log('masuk sini');
            router.push('/login');
            return false;
        }
        
        
        if (!response.ok) {
            throw  Error(`HTTP error! status: ${response.status}`)
        }
        let result = await response.json()
        console.log(result);
        setData(result.data)
        
    }
    useEffect(()=>{
        getdata()
    },[])
    return (
        <div className="w-full">
            <Title size="text-[30px] font-semibold">Master Product</Title>
            <div className="p-2">
                <Card>
                    <CardContent>
                        <div className="flex justify-between items-center z-[1]">
                            <Input className="w-full md:w-2/12 h-10 rounded-[10px] my-6 text-[16px] text-center z-[2]" placeholder="Cari Barang"/>
                            <Link href={`/master/product/form`} className="font-semibold z-[2] ">
                            <Button variant={"outline"} className="h-10 rounded-[10px] bg-blue-400 text-white">
                                Barang<span className="ml-1"><FaPlus/></span>
                            </Button>
                            </Link>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Barcode</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Desc</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item:any)=>(
                                    <TableRow key={item.id}>
                                        <TableCell>{item.barcode}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.deskripsi}</TableCell>
                                        
                                        <TableCell><img src={item.pic} className="w-24 object-scale-down"/></TableCell>
                                        <TableCell className="text-end">
                                            <Link href={`/master/product/form/${item.uuid}`}>
                                                <Button variant={'ghost'} className="text-yellow-500">edit <span className="ml-2"><FaEdit/></span></Button>
                                            </Link>
                                            <Button variant={'ghost'} className="text-indigo-500">view <span className="ml-2"><FaEye/></span></Button>
                                            <Button variant={'ghost'} className="text-red-500">remove <span className="ml-2"><FaTrash/></span></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
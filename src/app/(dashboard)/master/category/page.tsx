'use client'
import { useEffect, useState } from "react";
import Title from "@/components/titleComponent/titleComponent";
import { Button } from "@/components/ui/button";
// import { DataTable } from "./data-table";
import { Category, columns } from "./columns";
import {DataTable} from "@/components/DataTableComponent/datatable";
import { Input } from "@/components/ui/input";;
import { Card, CardContent } from "@/components/ui/card";
import { FaPlus } from "react-icons/fa";
import { getCookie } from "@/utils/cookie";
// import { getCookie } from "@/utils/cookie";

  
export default function CategoryPage(){
  const [isOpenForm,SetisOpenForm] = useState(false);
  const [data,setData] = useState<Category[]>([]);

  function handleForm(){
    SetisOpenForm(true)
  }

  async function store(formData: FormData) {
    let api = process.env.NEXT_PUBLIC_API_URL
    // "use server"
    console.log(formData.get('name'));
    try {
        console.log(getCookie('token'));
        
        const response = await fetch(`${api}/api/createcategory`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({
                name:formData.get('name'),
                uuid_entity:'xxxxxx'
            })
        })

        if(!response.ok) alert('gagal');
        console.log(await response.json());
        // router.push('/master/satuan'); 
        fetchData()
        SetisOpenForm(false)

    } catch (error) {
        console.log(error);
        
    }
    // const data = getd
    
  }
  const fetchData =  async ()=>{
    const result: Category[] = await getCategory();
      
    
    setData(result)
  }
  useEffect(()=>{
      fetchData();
  },[])
  async function getCategory(){
    let api = process.env.NEXT_PUBLIC_API_URL

      let get = await fetch(`${api}/category`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${getCookie('token')}`,
            'ngrok-skip-browser-warning': 'true' 

        }
      })
      let category = await get.json()
      console.log(category);
    let setdata:any = [];
    category.data.forEach((val:any) => {
        setdata.push({'id':val.id,'name':val.name})
    });
    return setdata;
      
  }


    
    return (
        <div className="w-full">
            <Title size="text-[30px] font-semibold">Master Category</Title>
            <Card>
              <CardContent className="p-3">
                { isOpenForm ?
                <>
                  <Title size="text-[12px] font-light mb-1">Form Category</Title>
                  <form action={store}>
                    <div className="flex justify-end w-full md:w-2/5">
                      <Input type="text" name="name" className="mr-2" placeholder="Category"/>
                      <div className="text-end">
                          <Button variant={"outline"} className="bg-blue-600 text-white font-semibold">Simpan</Button>
                      </div>
                    </div>
                  </form>
                </>
                : 
                <div className="text-right p-2">
                    <Button variant={"outline"} className="bg-[#2C96F1] text-white" onClick={handleForm}>Category &nbsp;<FaPlus/></Button>
                </div>
                }

              </CardContent>
            </Card>
            <br />
            <Card>
              <CardContent>
                <div className="container">
                    <DataTable columns={columns} data={data} />
                </div>
              </CardContent>
            </Card>
        </div>
    );
}
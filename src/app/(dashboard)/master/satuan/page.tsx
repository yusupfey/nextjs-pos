'use client';
import Title from "@/components/titleComponent/titleComponent";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTableComponent/datatable";
import { Satuan, columns } from "./columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookie";
import { Input } from "@/components/ui/input";


  export default function SatuanPage(){
    const [isOpenForm,SetisOpenForm] = useState(false);
    const [data,setData] = useState<Satuan[]>([]);
    
    function handleForm(){
        SetisOpenForm(true)
    }
    async function store(formData: FormData) {
        let api = process.env.NEXT_PUBLIC_API_URL
        // "use server"
        console.log(formData.get('code'));
        console.log(formData.get('name'));
        // let router = useRouter();
        try {
            console.log(getCookie('token'));
            
            const response = await fetch(`${api}/api/createsatuan`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({
                    // email:formData.get('code'),
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
    }

    async function getData(): Promise<Satuan[]> {
        // Fetch data from your API here.
        return [
          {
            id: "728ed52f",
            name: "PCS",
            uuid_entity: "pending",
          },
          {
            id: "728ed52f",
            name: "Pack",
            uuid_entity: "success",
          },
          {
            id: "728ed52f",
            name: "Lusin",
            uuid_entity: "pending",
          },
          // ...
        ]
      }
      async function getSatuan(){
        let api = process.env.NEXT_PUBLIC_API_URL

          let get = await fetch(`${api}/satuan`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${getCookie('token')}`,
                'ngrok-skip-browser-warning': 'true' 

            }
          })
          let satuan = await get.json()
        //   console.log(satuan);
        let setdata:any = [];
        satuan.data.forEach((val:any) => {
            setdata.push({'id':val.id,'name':val.name})
        });
        return setdata;
          
      }
      const fetchData =  async ()=>{
          const result: Satuan[] = await getSatuan();
            console.log();
            
          
          setData(result)
        // const data = getd
          
      }
    useEffect(()=>{
        fetchData();
    },[])

    return (
        <div className="w-full z-0">
            <Title size="text-[30px] font-semibold">Master Satuan</Title>
            <Card>
              <CardContent className="p-3">
                {
                isOpenForm ?  
                <>
                <Title size="text-[12px] font-light mb-1" >Form Category</Title>
                <form action={store} className="flex justify-end w-full md:w-2/5">
                    <Input type="text" name="code" className="mr-2" placeholder="Code"/>
                    <Input type="text" name="name" className="mr-2" placeholder="Satuan"/>
                    <div className="text-end">
                        <Button variant={"outline"} className="bg-blue-600 text-white font-semibold">Simpan</Button>
                    </div>
                </form>
                </>
                : <div className="text-right p-2">
                    <Button variant={"outline"} className="bg-[#2C96F1] text-white" onClick={handleForm}><FaPlus />  Satuan</Button>
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
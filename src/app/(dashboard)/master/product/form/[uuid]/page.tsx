"use client"
import Title from "@/components/titleComponent/titleComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import CategoryForm from "./formCategory";
import FormSatuan from "./formSatuan";
import {getCookie} from "../../../../../../utils/cookie";
import {getCategories, getProducts, AddCategoryProduct, getSatuans, AddSatuanProduct, getSatuanProducts, getCategoryProducts} from "./product";
import { ToastContainer } from "react-toastify";
// import { useRouter } from "next/navigation";

export default function FormProduct(params:any){
    const [isButtonAddCategory, setButtonAddCategory] = useState(false)
    const [isButtonAddSatuan, setButtonAddSatuan] = useState(false)
    const [isButtonAddProduct, setButtonAddProduct] = useState(false)
    const [isOpenFormSatuanProduct, setOpenFormSatuanProduct] = useState(false)
    const [stockIsExist, SetStockIsExist] = useState(false);

    const [productdata, setProductData] = useState<any>();
    const [uuid, setUidProduct] = useState('');
    const [category, setCategory] = useState([]);
    const [categoryproduct, setCategoryProduct] = useState([]);
    const [satuanproduct, setSatuanProduct] = useState([]);
    const [satuan, setSatuan] = useState([]);
    
    const [selectCategory, setSelectCategory] = useState('');
    const [selectSatuan, setSelectSatuan] = useState('');
    const [konversi, setkonversi] = useState(0);
    const [formProduct, setFormProduct] = useState({
        'name':'',
        'barcode':''
    })
    const [formStockProduct, setFormStockProduct] = useState({
        'uuid_product':params.params.uuid,
        'stock':'',
        'min':'',
        'max':'',
        'harga_jual':'',
        'harga_beli':'',
    })
    // const router = useRouter();
    const url = process.env.NEXT_PUBLIC_API_URL!;
    const token = getCookie('token');

    const getCategory = async () => {
        const uid = uuid;
        console.log('uuid', uid);
        const response = await getCategories(uid);
        setCategory(response.data);
        
        

    }
    
    // const authToken = async (token:any) => {
    //     const url = process.env.NEXT_PUBLIC_API_URL!;
    
    //     try {
    //         const response = await fetch(`${url}/cek-token`,{
    //             headers:{
    //                 'Content-Type':'application/json'
    //             },
    //             method:'POST',
    //             body:JSON.stringify({'token':token})
    //         });
    //         console.log(response.status, 'auth');
            
    //         if (response.status === 401) {
    //             router.push('/login')
    //         }
    //     } catch (error) {
    //         console.log(error);
            
    
    //     }
    // }
    
    async function submitProduct(e:any){
        e.preventDefault()
        console.log(formProduct);
        
        const response = await fetch(`${url}/product`, {
            method: 'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify(formProduct)
        })

            if(!response.ok) throw new Error('Insert Failed');
            // const res = await response.json()

            setButtonAddProduct(false)
    }
    async function handleFormCategory(){
            getCategory()
            setButtonAddCategory(false)
    }
    

    const getProduct = async () => {
        
        const uid = params.params.uuid;
        const res = await getProducts(uid)
        setProductData(res.data);
        

    }
    const getProductStore = async () => {
        console.log(uuid);
        
        const uid = params.params.uuid;
        console.log('uuid', uid);
        
        const response = await fetch(`${url}/product-store/${uid}`,{
            headers:{
                'authorization':`Bearer ${token}`
            }
        });
        if(!response.ok) throw new Error('Insert Failed');

        const res = await response.json()
        const data = res.data
        
        if(data != undefined){
            SetStockIsExist(true)
            setFormStockProduct(data)

        }else{
            SetStockIsExist(false)

        }
        

        
        

    }
    
    const getSatuan = async () => {
        const res = await getSatuans()
        setSatuan(res.data);
    }

    function handleSubmitSatuan(){
        getSatuan();
        setButtonAddSatuan(false)

    }
    function onchangeFormProduct(e:any){
        const { name, value } = e.target;
        setFormProduct({
            ...formProduct,
            [name]:value
        })
        
    }

    function ChangeCategoryProduct(e:any){
        setSelectCategory(e.target.value)
    }
    async function handleAddCategoryProduct(e:any){
        e.preventDefault()
        const data = {'id_category':selectCategory,'id_product':productdata ? productdata.id:null}
        AddCategoryProduct(data);
        getCategoryProduct();
    }
    async function handleAddSatuanProduct(e:any){
        e.preventDefault()

        const data ={'id_satuan':selectSatuan,'id_product':productdata? productdata.id:null, 'konversi':konversi}
        AddSatuanProduct(data)
        setkonversi(0)
        setOpenFormSatuanProduct(false)
        getSatuanProduct()
    }



    const getCategoryProduct = async () => {
        const id = productdata? productdata.id:null
        console.log('id', id);
        
        
        const res = await getCategoryProducts(id);
        
        setCategoryProduct(res.data);
        

    }
    const getSatuanProduct = async () => {
        const id = productdata? productdata.id:null
        
        const res = await getSatuanProducts(id);
        
        setSatuanProduct(res.data);
        

    }

    useEffect(()=>{
        const uid = params.params.uuid;
        
        setUidProduct(uid)
        // authToken(token);

        getProduct();
        getProductStore();
        getCategory();
        getSatuan();

        
    },[]);
    useEffect(()=>{
            getCategoryProduct();
            getSatuanProduct();
    },[productdata])

    async function handleSaveStock(e:any){
        e.preventDefault()
        
        // add id product
        // setFormStockProduct({
        //     ...formStockProduct,
        //     'uuid_product':uuid
        // })
        const mode = e.target.getAttribute("data-mode");
        console.log(mode);

        console.log(formStockProduct);
        const store = mode == 'Edit' ? 'product-store/edit':'/product-store'
        const response = await fetch(`${url}/${store}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            },
            body:JSON.stringify(formStockProduct)
        })
        if(!response.ok) throw new Error('Insert Failed');
        alert('Berhasil Insert Data')

    }
    function changeFormStock(e:any){
        const {name, value} = e.target;
        setFormStockProduct({
            ...formStockProduct,
            [name]:value
        })

    }
    return (
        <div className="p-2">
        <ToastContainer/>

            <Title size="text-[30px] font-semibold">Detail Product</Title>
            <Card>
                <CardContent className="p-2">
                    <Title size="text-[22px] font-semibold my-2">Product</Title>
                    <div className="flex justify-start z-1">
                        <select name="" className="w-60 border-spacing-2 outline-1 outline-slate-700 mr-2" id="">
                            <option value="">Pilih</option>
                        </select>
                        <Button className="z-[2]" onClick={()=> isButtonAddProduct ? setButtonAddProduct(false):setButtonAddProduct(true)}>{isButtonAddProduct ? <FaX/>:<FaEdit/>}</Button>
                    </div>
                    <form onSubmit={submitProduct} method="post" className="grid grid-cols-3 items-center">
                        <div className="m-2">
                            <Title size="text-[12] font-semibold">UUID</Title>
                            <Input type="text" name="" value={productdata? productdata.uuid:null} placeholder="Masukan uuid"/>
                        </div>
                        <div className="m-2">
                            <Title size="text-[12] font-semibold">Name</Title>
                            <Input type="text" onChange={onchangeFormProduct} value={productdata? productdata.name:null} name="name" placeholder="Masukan product"/>
                        </div>
                        <div className="m-2">
                            <Title size="text-[12] font-semibold">Barcode</Title>
                            <Input type="text" onChange={onchangeFormProduct} name="barcode" value={productdata? productdata.barcode:null} placeholder="Masukan barcode"/>
                        </div>
                        <div className="m-2">
                            <Title size="text-[12] font-semibold">Image</Title>
                            <Input type="file" />
                        </div>
                        <div className="m-2">
                        <Title size="text-[12] font-semibold">_</Title>

                        <Button className={`z-[2] ${isButtonAddProduct ? 'block':'hidden'} w-72`}>Simpan</Button>
                        </div>
                        
                    </form>
                    <div className="flex justify-between">
                    <Card className="w-full m-2">
                        <CardContent className="p-2">
                            <Title size="text-[22px] font-semibold my-2">Category</Title>
                            <div className="flex justify-start z-1">
                                <select onChange={ChangeCategoryProduct} className="w-60 border-spacing-2 outline-1 outline-slate-700 mr-2" id="">
                                    <option value="">Pilih</option>
                                    {category.map((val:any)=>(
                                        <option value={val.id} key={val.id}>{val.name}</option>
                                    ))}
                                </select>
                                <Button className="z-[2] mx-1" onClick={handleAddCategoryProduct}><><FaPlus/></></Button>
                                <Button className="z-[2]" onClick={()=> isButtonAddCategory ? setButtonAddCategory(false):setButtonAddCategory(true)}>{isButtonAddCategory ? <FaX/>:<>Add Category &nbsp;<FaPlus/></>}</Button>
                            </div>
                            <div className={`${isButtonAddCategory ? 'block':'hidden'} shadow-lg p-2 rounded-md`}>
                                <CategoryForm FormSubmit={handleFormCategory}/>
                            </div>

                            <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* {data.map((item:any)=>( */}
                                {categoryproduct.length > 0 ? 
                                    categoryproduct.map((value:any)=>(
                                        <TableRow key={value.id}>
                                        <TableCell>{value.name}</TableCell>
                                        
                                        <TableCell className="text-end">
                                            <Button variant={'ghost'} className="text-red-500">remove <span className="ml-2"><FaTrash/></span></Button>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                :
                                    <TableRow>
                                        <TableCell>Tidak ada data</TableCell>
                                        
                                        {/* <TableCell className="text-end">
                                            <Button variant={'ghost'} className="text-yellow-500">edit <span className="ml-2"><FaEdit/></span></Button>
                                            <Button variant={'ghost'} className="text-indigo-500">view <span className="ml-2"><FaEye/></span></Button>
                                            <Button variant={'ghost'} className="text-red-500">remove <span className="ml-2"><FaTrash/></span></Button>
                                        </TableCell> */}
                                    </TableRow>
                                }
                                {/* ))
                                } */}
                            </TableBody>
                        </Table>
                        </CardContent>
                    </Card>
                    <Card className="w-full m-2">
                        <CardContent className="p-2">
                            <Title size="text-[22px] font-semibold my-2">Satuan</Title>
                            <div className="flex justify-start z-1">
                                <select onChange={(e:any)=>setSelectSatuan(e.target.value)} className="w-60 border-spacing-2 outline-1 outline-slate-700 mr-2" id="">
                                    <option value="">Pilih</option>
                                    {satuan.map((val:any)=>(
                                        <option value={val.id} key={val.id}>{val.name}</option>
                                    ))}
                                </select>
                                <Button className="z-[2] mx-1" onClick={()=>isOpenFormSatuanProduct ? setOpenFormSatuanProduct(false):setOpenFormSatuanProduct(true)}><>{isOpenFormSatuanProduct ? <FaX/>:<FaPlus/>}</></Button>
                                <Button className="z-[2]" onClick={()=> isButtonAddSatuan ? setButtonAddSatuan(false):setButtonAddSatuan(true)}>{isButtonAddSatuan ? <FaX/>:<>Add Satuan <FaPlus/></>}</Button>
                            </div>
                            <div className={`${isButtonAddSatuan ? 'block':'hidden'} p-2 shadow-md rounded-md`}>
                                    <FormSatuan SubmitForm={handleSubmitSatuan}/>
                            </div>
                            <div className={`${isOpenFormSatuanProduct ? 'block':'hidden'} p-2 shadow-md rounded-md`}>
                                    <form>
                                        <Title size="text-[12] font-semibold">Konversi ke Satuan kecil</Title>
                                        <Title size="text-[11px] font-reguler mb-2 mt-1">Satuan kecil di setting 1 (PCS), dalam satuan {konversi}</Title>
                                        <div className="flex justify-start z-1">
                                            <Input className={`w-full mr-2`} name="name" onChange={(e:any)=>setkonversi(e.target.value)} placeholder="Masukan satuan besar" /><Button onClick={handleAddSatuanProduct} className={`z-[2]`}>Simpan</Button>
                                        </div>

                                    </form>
                            </div>
                            <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Kecil</TableHead>
                                    <TableHead>Besar</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {satuanproduct.length > 0 ? 
                                    satuanproduct.map((value:any)=>(
                                        <TableRow key={value.id}>
                                        <TableCell>{value.name}</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>{value.konversi_to_small}</TableCell>
                                        
                                        <TableCell className="text-end">
                                            <Button variant={'ghost'} className="text-red-500">remove <span className="ml-2"><FaTrash/></span></Button>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                :
                                    <TableRow>
                                        <TableCell>Tidak ada data</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    </div>
                    <Card className="m-2">
                        <CardContent>
                            <Title size="text-[22px] font-semibold my-2">Stock</Title>
                            <form data-mode={productdata ? 'Edit': 'Simpan'} onSubmit={handleSaveStock}>
                                <div className="grid grid-cols-3">
                                    <div className="m-2">
                                        <Title size="text-[12] font-semibold">Stock</Title>
                                        {/* <Input type="hidden" name="mode" value={productdata ? 'Edit': 'Simpan'} placeholder="Masukan uuid"/> */}

                                        <Input onChange={changeFormStock} value={!stockIsExist ? formStockProduct.stock: formStockProduct.stock} name="stock" placeholder="Masukan Stock"/>
                                    </div>
                                    <div className="m-2">
                                        <Title size="text-[12] font-semibold">MIN</Title>
                                        <Input onChange={changeFormStock} value={!stockIsExist ? formStockProduct.min: formStockProduct.min} name="min" placeholder="Masukan min stock"/>
                                    </div>
                                    <div className="m-2">
                                        <Title size="text-[12] font-semibold">MAX</Title>
                                        <Input onChange={changeFormStock} value={!stockIsExist ? formStockProduct.max: formStockProduct.max} name="max" placeholder="Masukan max stock"/>
                                    </div>
                                    <div className="m-2">
                                        <Title size="text-[12] font-semibold">Harga Jual</Title>
                                        <Input onChange={changeFormStock} value={!stockIsExist ? formStockProduct.harga_jual: formStockProduct.harga_jual} name="harga_jual" placeholder="Masukan Harga"/>
                                    </div>
                                    <div className="m-2">
                                        <Title size="text-[12] font-semibold">Harga Beli</Title>
                                        <Input onChange={changeFormStock} value={!stockIsExist ? formStockProduct.harga_beli: formStockProduct.harga_beli} name="harga_beli" placeholder="Masukan Harga Beli"/>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <Button variant={"default"}>{productdata ? 'Edit': 'Simpan'} &nbsp; <FaSave/></Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}
"use client"
import React, { Suspense } from "react";
import Title from "@/components/titleComponent/titleComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { FaCartPlus, FaMinus, FaPlus } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { getCookie } from "@/utils/cookie";
// import { IsAuth } from "@/utils/isAuth";
// import  {getPrinterServices}  from "@/utils/bluetooth";
// import { useRouter } from "next/navigation";
import EscPosEncoder from 'esc-pos-encoder';
import { getPrinterServices } from "./setting_printer";



const page = ()=>{
    const [Products,setProduct] = useState([]);
    const [Category,setCategory] = useState([]);
    const [Total,setTotal] = useState(0);
    const [Kembalian,setKembalian] = useState(0);
    const [Bayar,setBayar] = useState(0);
    const [OpenCart,setOpenCart] = useState(false);
    const [Carts,setCart] = useState([]);
    const [CategoryActive,setCategoryActive] = useState({
        'id':''
    });


    const token = getCookie('token');
    const url = process.env.NEXT_PUBLIC_API_URL;
    // const router = useRouter();

    const formatCurrency = (amount:any) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(amount);
      };
    function handleChangeQty(item:any, value:any){
        console.log(value);
        setCart((prevCart:any)=> prevCart.map((cart:any)=>{
            if(cart.id==item.id){
                const totalPeritem = value * item.price
                const settingTotal =  (value-item.qty)*20000
                setTotal(Total+settingTotal)

                return {
                    ...cart,
                    qty:value,
                    totalItem:totalPeritem
                }
            } 
            return cart;
        }))
        
    }
    function handleMinPlus(mode:any,item:any){
        console.log('ini harusnya jalan');
        
        console.log(item);
        setCart((prevCarts:any)=> prevCarts.map((cart:any)=>{
            
            if(cart.id === item.id){
                if(mode=='plus'){
                    console.log('masuk plush');

                    const qty = item.qty+1;
                    const totalPeritem = qty*item.price;
    
                    setTotal(Total+item.price)
                    console.log({
                        ...cart,
                        qty: qty, // Meningkatkan qty
                        totalItem: totalPeritem, // Meningkatkan qty
                    });
                    
                    return {
                        ...cart,
                        qty: qty, // Meningkatkan qty
                        totalItem: totalPeritem, // Meningkatkan qty
                    };
                }else{
                    const qty = cart.qty-1;
                    const totalPeritem = qty*item.price;
                    if(qty > 0){
                        setTotal(Total-item.price)
                        return {
                            ...cart,
                            qty: qty, // Meningkatkan qty
                            totalItem: totalPeritem, // Meningkatkan qty
                        };
                    }else{
                        setTotal(Total-item.price)
                        deleteCart(item.id)
                    }
                    
                }
                
            }
            return cart; // Kembalikan pengguna tanpa perubahan

        }))
    }
    const deleteCart = (item:any)=>{
        setCart((prevCarts:any)=> prevCarts.filter((val:any)=>val.id !==item))
    }
    function  handleCart(post:any){
        console.log(Carts.length);
        const found:any = Carts.find((element:any) => element.id == post.id);
      
        
        if(found){
            setCart((prevCarts:any) =>
                
                prevCarts.map((cart:any) => {
                    console.log(prevCarts);
                    
                  if (cart.id === post.id) { // Hanya memperbarui id yang di pilih
                    const qty = cart.qty+1;
                    const totalPeritem = qty*post.harga_jual;

                    setTotal(Total+post.harga_jual)

                    return {
                      ...cart,
                      qty: qty, // Meningkatkan qty
                      totalItem: totalPeritem, // Meningkatkan qty
                    };
                  }
                  return cart; // Kembalikan pengguna tanpa perubahan
                })
              );
    
            
        }else{
                console.log('masuk sini');
                const data:any = [...Carts,{'id':post.id, qty:1, 'title':post.name, 'price':post.harga_jual, 'totalItem':post.harga_jual}];
                setCart(data)

                setTotal(Total+post.harga_jual)

        }
        
    }
    
    const fetchData = async () => {
        const response = await fetch(`${url}/product-store`,{
            headers:{
                'authorization':`Bearer ${token}`
            }
        });
        // IsAuth(response.status, function(res:any){
        //     if(res === true) router.push('/login');
        // });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setProduct(result.data)
    }
    const getCategory = async () => {
        const response = await fetch(`${url}/category`,{
            headers:{
                'authorization':`Bearer ${token}`
            }
        });
        // IsAuth(response.status, function(res:any){
        //     if(res === true) router.push('/login');
        // });
        if(!response.ok) throw new Error('Insert Failed');

        const res = await response.json()
        const data = res.data
        
        setCategory(data);
        
        console.log(res.data);
        

    }
    const changeCategory = async (e:any) =>{
        console.log(e.target.id);
        
        if(e.target.id == undefined||e.target.id == ''){
            setCategoryActive({'id':''})
            fetchData();
        }else{
            setCategoryActive({'id':e.target.id})
            const response = await fetch(`${url}/product-store/category/${e.target.id}`,{
                headers:{
                    'authorization':`Bearer ${token}`
                }
            });
            // IsAuth(response.status, function(res:any){
            //     if(res === true) router.push('/login');
            // });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            setProduct(result.data)
        }
    }
    const cariBarang = async (e:any) => {
        console.log(e.target.value);
        
            const response = await fetch(`${url}/product-store/search`,{
                headers:{
                    'Content-Type':'application/json',
                    'authorization':`Bearer ${token}`
                },
                method:'post',
                body:JSON.stringify({'search':e.target.value, 'category':CategoryActive.id})
            });
            // IsAuth(response.status, function(res:any){
            //     if(res === true) router.push('/login');
            // });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const result = await response.json()
            setProduct(result.data)
        
    }
    const handleCartBarcode = async (e:any) => {
        console.log(e.target.value);
        
        const response = await fetch(`${url}/product-store/barcode`,{
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            },
            method:'post',
            body:JSON.stringify({'barcode':e.target.value})
        });
        // IsAuth(response.status, function(res:any){
        //     if(res === true) router.push('/login');
        // });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        const data = result.data;
        console.log(data);
        
        if(data.length > 0){
            const post = data[0];
            const found:any = Carts.find((element:any) => element.id == post.id);
          
            
            if(found){
                // kosongkan textbox barcode
                e.target.value = '';

                setCart((prevCarts:any) =>
                    
                    prevCarts.map((cart:any) => {
                        console.log(prevCarts);
                        
                      if (cart.id === post.id) { // Hanya memperbarui id yang di pilih
                        const qty = cart.qty+1;
                        const totalPeritem = qty*post.harga_jual;
    
                        setTotal(Total+post.harga_jual)
    
                        return {
                          ...cart,
                          qty: qty, // Meningkatkan qty
                          totalItem: totalPeritem, // Meningkatkan qty
                        };
                      }
                      return cart; // Kembalikan pengguna tanpa perubahan
                    })
                  );
                  
                
            }else{
                    console.log('masuk sini');
                    const data:any = [...Carts,{'id':post.id, qty:1, 'title':post.name, 'price':post.harga_jual, 'totalItem':post.harga_jual}];
                    setCart(data)
    
                    setTotal(Total+post.harga_jual)
                    // kosongkan textbox barcode
                    e.target.value='';
            }

        }
        
    }
    
    const printData = async(uuid:any) =>{
        const server:any =await getPrinterServices();
        console.log(uuid);
        
        
        const service = await server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455'); // Ganti UUID
        const characteristic = await service.getCharacteristic('49535343-8841-43f4-a8d4-ecbe34729bb3'); // Ganti UUID


        
        
        const encoder = new EscPosEncoder();
        const lineLength = 32; // Ukuran untuk printer 80mm
        const itemWidth = 12; // Lebar kolom item
        const qtyWidth = 3;   // Lebar kolom qty
        const priceWidth = 13; // Lebar kolom price
        
        const detailRender:any = [];
        Carts.forEach((val:any) => {
            detailRender.push([val.title, `${val.qty}x`, `${formatCurrency(val.totalItem)}`])
        });
        console.log(detailRender);
        // const data = [
        //     [ 'Sampoerna Mild Cap Badak','2x', 'Rp50000' ],
        //     [ 'Item 2','2x', '15,00' ],
        //     [ 'Item 3','2x', '9,95' ],
        //     [ 'Item 4','2x', '4,75' ],
        //     [ 'Item 5','2x', '211,05' ],
        // ] 
        // console.log(data);
        
        const separatorLine = '_'.repeat(lineLength); // Garis sepanjang lebar kertas
        const receipt = encoder
        .initialize()
        .align('center')
        .barcode('12312343 test', 'ean13', 60)
        .align('left')
        .table(
            [
                { width: 32, align: 'center' },
            ], 
            [
                [ 'Toko Gocir\n Kp. Nyengcle selawangi-bogor'],
            ]    
        )
        .align('left')
        .text(separatorLine)
        .table(
            [
                { width: itemWidth, marginRight: 2, align: 'left' },
                { width: qtyWidth, align: 'center' },
                { width: priceWidth, align: 'left' }
            ], 
            detailRender  
        )
        .newline()
        .text(separatorLine)
        .align('left')
        .table(
            [
                { width: 15, align: 'right' },
                { width: 17, align: 'right' },
            ], 
            [
                [ 'Total', `${formatCurrency(Total)}`],
                [ 'Bayar', `${formatCurrency(Bayar)}`],
                [ 'Kembalian', `${formatCurrency(Kembalian)}`],
            ]    
        )
        .newline()
        .align('left')
        .table(
            [
                { width: 32, align: 'center' },
            ], 
            [
                [ 'Terimakasih, Sudah berbelanja di toko kami'],
            ]    
        )
        .cut()
        .encode(); 

        // const canvas = await html2canvas(receipt);
        // const dataURL = canvas.toDataURL('image/png');
        
        // const blob = await (await fetch(dataURL)).blob(); // Mengonversi data URL ke blob
        // const arrayBuffer = await blob.arrayBuffer(); // Mengonversi blob ke array buffer
        // const data = new Uint8Array(arrayBuffer);
        console.log(receipt);
        const chunkSize = 512; // Ukuran maksimum per potongan
        for (let offset = 0; offset < receipt.length; offset += chunkSize) {
        const chunk = receipt.slice(offset, offset + chunkSize); // Ambil potongan data
        await characteristic.writeValue(chunk); // Kirim potongan data
        console.log('Chunk sent to printer:', chunk);
        }
        // await characteristic.writeValue(receipt);




    // const receiptHTML = `
    //       <div style="width: 300px; font-family: Arial, sans-serif; padding: 10px; border: 1px solid #000;">
    //         <h2 style="text-align: center;">RECEIPT</h2>
    //         <p style="margin: 0;">Item: Sample Item</p>
    //         <p style="margin: 0;">Price: $10.00</p>
    //         <p style="margin: 0;">Total: $10.00</p>
    //         <p style="text-align: center;">Thank you for your purchase!</p>
    //       </div>
    //     `;

    //     // Mengonversi string HTML menjadi ArrayBuffer
    //     const encoder = new TextEncoder();
    //     const data = encoder.encode(receiptHTML); // Mengencode HTML ke Uint8Array

    //     // Mengirim data ke printer
    //     // if (writableCharacteristic) {
    //       const chunkSize = 512; // Ukuran maksimum per potongan
    //       for (let offset = 0; offset < data.length; offset += chunkSize) {
    //         const chunk = data.slice(offset, offset + chunkSize); // Ambil potongan data
    //         await characteristic.writeValue(chunk); // Kirim potongan data
    //         console.log('Chunk sent to printer:', chunk);
        //   }


        // await characteristic.writeValue(byteArray);

        // const encoder = new TextEncoder();
        // const data = encoder.encode("Hello, Printer!"); // Data untuk dikirim ke printer
        console.log('Data sent to printer!');
    }
    
    const changeBayar = (e:any) => {
        const hitungKembalian = e.target.value - Total;
        console.log(hitungKembalian);
        console.log(e.target.value);
        setBayar(e.target.value)
        setKembalian(hitungKembalian)
    }
    const PayOrder = async() => {
    //    e.preventDefault();
        console.log('ini jalan');
        console.log(Carts);
        console.log();
        const data = {
            'total':Total,
            'bayar':Bayar,
            'kembalian':Kembalian,
            'cart':Carts
        }
        
        const response = await fetch(`${url}/order`,{
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            },
            method:'post',
            body:JSON.stringify(data)
        });
        // IsAuth(response.status, function(res:any){
        //     if(res === true) router.push('/login');
        // });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json();
        printData(result.metadata.uuid)

        setKembalian(0)
        setBayar(0)
        setTotal(0)
        setCart([])
        
    }
    useEffect(() => {
        // getPrinterServices()
        fetchData()
        getCategory();

        if(localStorage.getItem('BT_Device')){
            localStorage.removeItem('BT_Device')
        }

        
    },[])

    const sortedOrders = Carts.sort((a:any, b:any) => b.id - a.id);

    return (
        <Suspense fallback={<>Loading...</>}>
            <div className="flex justify-between">
                <div className="w-[100%] z-[0]  md:w-[50%] lg:w-[70%]">
                    <div className="h-full">
                        {/* <div className="flex justify-around z-[1]">
                            <div className="w-full text-center m-1 bg-blue-400 text-white shadow-sm font-bold rounded-xl p-2">Kasir</div>
                            <div className="w-full text-center m-1 shadow-sm font-bold rounded-xl p-2">Online</div>
                        </div> */}
                        <div className="mt-2">
                            <Title weight="font-bold">Category</Title>
                            <div className="overflow-x-auto flex justify-start no-scrollbar mt-[4px]">
                                <div onClick={changeCategory} className={`text-[12px] text-center m-1 ${CategoryActive.id == '' ?'bg-blue-400 text-white hover:bg-blue-700':'text-gray-800 hover:bg-gray-200'} cursor-pointer shadow-sm font-bold rounded-xl py-2 px-4`}>All Items</div>
                                {Category.map((item:any)=>(
                                    <div onClick={changeCategory} className={`text-[12px] text-center m-1 ${CategoryActive.id == item.id ?'bg-blue-400 text-white hover:bg-blue-700':'text-gray-800 hover:bg-gray-200'}  cursor-pointer shadow-sm font-bold rounded-xl py-2 px-4`} id={item.id} key={item.id}>{item.name}</div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 md:p-4">
                            <Input className="w-full h-14 rounded-[100px] my-2 text-[16px] text-center" onChange={cariBarang} placeholder="Cari Barang"/>
                            <Title weight="font-bold">Product</Title>
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
                                {Products.map((post:any)=>(
                                    <div className="relative">
                                        <Card className="z-[1]" key={post.id}>
                                            <CardContent className="scale-100 h-52">
                                                <img src={post.pic} className="w-full h-full object-scale-down"/>
                                            </CardContent>
                                            <CardContent>
                                                <div>
                                                    <div className="font-semibold text-sm text-ellipsis text-nowrap overflow-hidden">
                                                        {post.name}
                                                    </div>
                                                    <div className="font-semibold text-[#2C96F1] text-sm">
                                                        {formatCurrency(post.harga_jual)}
                                                    </div>
                                                    <div className="mt-2">
                                                        <Button variant={'default'} onClick={()=>handleCart(post)}  className="bg-[#2C96F1] w-full font-semibold">Cart</Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <div className={`absolute top-0 right-0`}>
                                            {Carts.map((res:any) =>(
                                               res.id == post.id ? <div className="bg-red-400 text-white rounded-full flex items-center w-8 h-8 justify-center"> {res.qty} </div> : ''
                                            ))}
                                            </div>
                                    </div>
                                    
                                ),[])}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${OpenCart ? '':'hidden'} md:block z-[3] absolute md:fixed overflow-hidden w-[95%] md:w-[50%] lg:w-[30%] bg-white p-4 top-16 md:top-0 md:right-0  h-screen rounded-lg shadow-md`}>
                    <div className={`text-center ${OpenCart ? '':'hidden'} md:hidden`}>
                        <Button variant={'ghost'} className="text-center rounded-full shadow-2xl w-16 h-12 " onClick={()=>setOpenCart(false)}><FaX/></Button>
                    </div>
                    
                    <Input placeholder="Barcode" onChange={handleCartBarcode} className="hidden md:block w-full h-14 rounded-[100px] my-6 text-[16px] text-center"/>
                    <div className="font-semibold text-lg my-2">Keranjang</div>
                    <Card className="h-[50%] overflow-auto border-green-500" id="cart-orderx">
                        <CardContent className="p-4">
                            {sortedOrders.map((val:any)=>(
                                <div className="rounded-lg shadow-md flex justify-start items-center p-2 mt-2" key={val.id}>
                                    {/* <div className="w-20 bg-yellow-100 h-20">image</div> */}
                                    <div className="ml-2 w-full">
                                        <div className="font-semibold text-sm">{val.title}</div>
                                        <div className="font-semibold text-sm text-blue-700">{formatCurrency(val.price)}</div>
                                        <div className="grid grid-cols-3 md:grid-cols-3">
                                            {/* <div className="text-[10px] text-center m-1 bg-blue-400 text-white shadow-sm font-bold rounded-xl min-w-4  py-2 px-4">Dus</div> */}
                                            {/* <div className="text-[10px] text-center m-1 shadow-sm font-bold rounded-xl min-w-4 py-2 px-1">Pack</div>
                                            <div className="text-[10px] text-center m-1 shadow-sm font-bold rounded-xl min-w-4 py-2 px-1">Pic</div>
                                            <div className="text-[10px] text-center m-1 shadow-sm font-bold rounded-xl min-w-4 py-2 px-1">Lusin</div> */}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex">
                                                <span>
                                                    <Button variant={"outline"} className="my-2 w-11" onClick={()=>handleMinPlus('min',val)}><FaMinus/></Button>
                                                </span>
                                                <span>
                                                    <Input value={val.qty} onChange={(event)=>handleChangeQty(val, event.target.value)} className="my-2 ml-2 w-20 text-center"/>
                                                </span>
                                                <span>
                                                    <Button variant={"outline"} className="my-2 ml-2 w-11" onClick={()=>handleMinPlus('plus',val)}><FaPlus/></Button>
                                                </span>
                                            </div>
                                            <div className="font-semibold text-lg text-blue-700">{val.totalItem}</div>
                                        </div>
                                    </div>
                                </div>

                            ),[])}
                        </CardContent>
                    </Card>
                    <div className="flex justify-between my-4">
                        <div className="font-semibold">Total</div>
                        <div className="font-semibold text-blue-600">{formatCurrency(Total)}</div>
                    </div>
                    <Input name="bayar" onChange={changeBayar} value={Bayar === 0 ? '':Bayar} placeholder="Bayar" className="my-2 w-full"/>
                
                    <Input name="kembalian" value={Kembalian === 0 ? '':Kembalian} placeholder="Kembalian" className="my-2 w-full"/>
                    <Button variant={'default'} className="bg-[#2C96F1] w-full font-semibold mb-2" onClick={PayOrder}>Bayar</Button>
                    <Button variant={'default'} className="bg-[#2C96F1] w-full font-semibold" onClick={printData}>Connect to printer</Button>

                </div>
            </div>
            <div className="fixed bottom-5 z-[2] w-[92%] shadow-slate-950 md:hidden">
                {/* <Image className="w-full"  src="https://dummyimage.com/500x250" alt="dummy-image" /> */}
                <button className="cursor-pointer bg-cyan-600 text-white text-center rounded-xl shadow-2xl hover:bg-blue-800 w-full h-12 flex justify-center items-center font-semibold text-[16px]" onClick={()=>setOpenCart(true)}><FaCartPlus/>&nbsp;Checkout</button>
            </div>
        </Suspense>
    )
}
export default page;
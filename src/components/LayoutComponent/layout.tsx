'use client';

import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaBell, FaList, FaMoneyBill, FaMoneyBillWave, FaProductHunt, FaUser, FaWindows } from "react-icons/fa";
import MenuItem from "../menuItem/menuItemComponent";
import { FaObjectUngroup } from "react-icons/fa6";
import Title from "../titleComponent/titleComponent";

const data = [
    {
        id:10,
        name:'Dashboard',
        url:'/dashboard',
        icon:<FaWindows/>,
        category:'Dashboard'
    },
    {
        id:11,
        name:'User',
        url:'/master/user',
        icon:<FaUser/>,
        category:'Master'
    },
    {
        id:12,
        name:'Category',
        url:'/master/category',
        icon:<FaObjectUngroup/>,
        category:'Master'
    },
    {
        id:13,
        name:'Satuan',
        url:'/master/satuan',
        icon:<FaList/>,
        category:'Master'
    },
    {
        id:15,
        name:'product',
        url:'/master/product',
        icon:<FaProductHunt/>,
        category:'Master'
    },
    {
        id:14,
        name:'Cashier',
        url:'/cashier',
        icon:<FaMoneyBillWave/>,
        category:'Transaction'
    },
]
const header = [
    {
        id:1,
        category:'Dashboard'
    },
    {
        id:2,
        category:'Master'
    },
    {   
        id:3,
        category:'Transaction'
    },
]
export default function LayoutComponent (props:any) {
    const [isOpen, setOpen] = useState(false);
    // let headerName= await data;
    const toggleMenu = () => {
        setOpen(!isOpen)
        const element = document.getElementById('sidebar');
        isOpen ?
        element?.classList.toggle('w-1/4') // Mengubah lebar antara w-0 dan w-64
        :
        element?.classList.toggle('w-16') // Mengubah lebar antara w-0 dan w-64
        // element?.classList.toggle('w-0');
        
    };
    
        
    

    return (
        <div key={'sidbarID-1'}>
            <div className="flex items-center justify-between p-5 w-full h-16 bg-white shadow-sm text-black">
                <div className="flex justify-between items-center ">
                    <div className="cursor-pointer" onClick={toggleMenu} style={{fontSize:'26px'}}><FaBars/></div>
                    <div style={{fontSize:'24px'}} className="ml-2">GOCIRID</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className=" mr-6" style={{fontSize:'26px'}}><FaBell/></div>
                    <div className=" border-2 p-1 rounded-full" style={{fontSize:'26px'}}><FaUser/></div>
                </div>
            </div>
            <div className="md:flex md:justify-start">
                <div id="sidebar" className={isOpen ? 'bg-[#2C96F1] pt-2 transition-all duration-300 ease-in w-10/12 md:w-1/5 h-screen absolute z-[100] md:relative md:z-0 text-white':'hidden'} key={1}>
                    
                    {
                        data.map((res)=>(
                            <MenuItem title={res.name} key={res.id} id={res.id} icon={res.icon} url={res.url} isOpen={isOpen}/>
                        ))
                    }
                    

                </div>
                <div key='sidebar-child-1' className="w-full max-h-screen overflow-y-auto px-5 py-5">{props.children}</div>
            </div>
        </div>
    )
}
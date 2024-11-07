import {getCookie} from "../../../../../../utils/cookie";
const url = process.env.NEXT_PUBLIC_API_URL!;

const token = getCookie('token');
export const getCategories = async (uuid:any) =>{
        const uid = uuid;
        console.log('uuid', uid);
        
        const response = await fetch(`${url}/category`,{
            headers:{
                'authorization':`Bearer ${token}`
            }
        });
        // if(!response.ok) throw new Error('Insert Failed');

        const res = await response.json()
        return res;       
}
export const getProducts = async (uuid:any) => {
    const uid = uuid;
    
    const response = await fetch(`${url}/product/${uid}`,{
        headers:{
            'authorization':`Bearer ${token}`
        }
    });
    
    // if(!response.ok) throw new Error('Insert Failed');

    const res = await response.json()
    return res;
    

}

export async function AddCategoryProduct(data:any){
    const response = await fetch(`${url}/category-product`, {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'authorization':`Bearer ${token}`
        },
        body:JSON.stringify(data)
    })

    if(!response.ok)throw new Error('Get data error');
    return response.json();

}

export const getSatuans = async () => {
    const response = await fetch(`${url}/satuan`,{
        headers:{
            'authorization':`Bearer ${token}`
        }
    });
    // if(!response.ok) throw new Error('Insert Failed');

    const res = await response.json()
    return res;
    

}

export async function AddSatuanProduct(data:any){
    const response = await fetch(`${url}/satuan-product`, {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'authorization':`Bearer ${token}`
        },
        body:JSON.stringify(data)
    })

    if(!response.ok)throw new Error('insert data error');
    return response.json();
}

export const getCategoryProducts = async (id_product:any) => {
    const id=id_product;
    const response = await fetch(`${url}/category-product/${id}`,{
        headers:{
            'Content-Type':'application/json',
            'authorization':`Bearer ${token}`
        }
    });
    // if(!response.ok) throw new Error('Insert Failed');

    const res = await response.json()
    return res;
    

}
export const getSatuanProducts = async (id_product:any) => {
    const id=id_product;
    const response = await fetch(`${url}/satuan-product/${id}`,{
        headers:{
            'Content-Type':'application/json',
            'authorization':`Bearer ${token}`
        }
    });
    // if(!response.ok) throw new Error('Insert Failed');

    const res = await response.json()
    return res;
    

}
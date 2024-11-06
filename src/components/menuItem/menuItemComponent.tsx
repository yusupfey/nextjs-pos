import Link from "next/link";

export default function MenuItem (props:any){
    return (
        <div key={props.id}>
            <div className={`flex ${props.isOpen ? 'justify-start':'justify-center'} items-center h-10 p-2 hover:bg-blue-400 text-sm`}>
                <div className={`block`}>
                    {props.icon}
                </div>
                <div className={`${props.isOpen ? 'ml-2':'hidden'}`}>
                    <Link  href={props.url}>{props.title}</Link>
                </div>
            </div>
        </div>
    )
}  
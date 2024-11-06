import Title from "../titleComponent/titleComponent";

export default function TextBox(props:any){
    return (
        <div>
            <Title color="text-black" size="text-[12px]" weight="font-semibold">{props.title}</Title>
            <input type={`${props.title == 'Password' ? 'password':'text'}`} name={props.name} placeholder={props.placeholder} style={{fontSize:"12px"}} onChange={props.change} className="rounded-[8px] w-full h-[35px] mt-1 p-2 border border-solid border-[#929292]"/>
        </div>
    );
}
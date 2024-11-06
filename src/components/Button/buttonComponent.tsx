export default function Button(props:any){
    return (
        <button className={`${props.size} ${props.color} text-white rounded-[8px]`} onClick={props.click}>
            {props.children}
        </button>
    );
}
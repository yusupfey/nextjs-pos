export default function Title(props:any){
    return(
        <>
            <div className={`${props.color} ${props.size} ${props.weight}`}>
                {props.children}
            </div>
        </>
    );
}
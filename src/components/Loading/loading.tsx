export default function Loading(props:any){
    return(
        <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] ${props.color}`}
        role="status">
        
        </div>
    )
}
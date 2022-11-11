export const Task = (props) => {

    const handleChange = () => {
        props.setCompleted(props.id, !props.completed)
    }

    return (
        <div className="w-full justify-start flex py-2 px-2 glassless my-1 rounded-lg">
            <input type="checkbox" id={props.id} name={props.id} className="mr-2" checked={props.completed} onChange={handleChange}/>
            <div className="cursor-pointer" for={props.id} onClick = {() => props.toggleEdit(props.id, true)}>{props.name}</div> 
        </div>
    )
}
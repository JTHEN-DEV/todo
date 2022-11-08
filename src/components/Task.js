export const Task = (props) => {

    const handleChange = () => {
        props.setCompleted(props.id, !props.completed)
    }

    return (
        <div className="w-full justify-start flex py-2 px-2 glassless my-1 rounded-lg">
            <input type="checkbox" id={props.id} name={props.id} className="mr-2" checked={props.completed} onChange={handleChange}/>
            <label for={props.id}>{props.name}</label> 
        </div>
    )
}

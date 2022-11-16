import {IoMdCheckbox, IoMdSync} from "react-icons/io"
export const Task = (props) => {

    const handleChange = () => {
        props.setCompleted(props.id, !props.completed)
    }

    return (
        <div className="w-full justify-between flex px-2 glassless my-1 rounded-lg">
            <div className="flex py-2">
                <div>

                {!props.completed ? 
                            <div type="checkbox" className={`cursor-pointer glassless mr-2 mt-1 h-[14px] w-[14px] rounded`} value={props.completed} checked={props.completed} onClick = {handleChange}/>
                            :
                            <IoMdCheckbox type="checkbox" className="cursor-pointer mr-2 mt-1 scale-125 opacity-70 h-[14px] w-[14px]" value={props.completed} checked={props.completed} onClick = {handleChange}/>
                        }
                </div>
                <div className="cursor-pointer" for={props.id} onClick = {() => props.toggleEdit(props.id, props.date)}>{props.name}</div>
            </div>
            {props.repeat.type !== 'none' && <IoMdSync className="text-xs mt-6 -mr-1 text-black/50"/>}
        </div>
    )
}

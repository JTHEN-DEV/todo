import {IoMdCheckbox, IoIosReorder, IoMdSync} from "react-icons/io"
import moment from "moment/moment";
import { FiEdit2 } from "react-icons/fi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CssSyntaxError } from "postcss";
export const Task = (props) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: props.id})
    const style= {
        transform: CSS.Transform.toString(transform),
        transition
    }
    const taskClicked = () => {
        console.log(props.editedTask.startDate === undefined, props.editedTask.name)
        if(props.editedTask.startDate === undefined || (props.editedTask && props.editedTask.name)){
            onClick()
        }
    }
    let subTaskLength = props.subTasks.filter((subTask) => subTask.completed).length/props.subTasks.length
    const handleChange = () => {
        if(props.completions && props.repeat.type !== 'none') {
            const task= props.tasks.filter((task) => task.id === props.id)[0]
            if(props.completions.includes(props.date)) {
                const completes = task.completions
                completes.splice(completes.indexOf(props.date), 1)
                props.editTask(props.id, {...task, completions: completes})
            } else {
                props.editTask(props.id, {...task, completions: task.completions.concat(props.date)})
            }
        } else {
            props.setCompleted(props.id, !props.completed)
        }
    }

    const onClick = () => {
        if (props.repeat.type === 'none') {
            props.toggleEdit(props.id, props.date, false)
            console.log("toggleEdit called by task")
        } else {
            props.toggleEdit(props.id, props.date, false)
        }
    }

    return (
        <div className={`w-full px-2 flatui my-1 rounded-lg ${!props.overlay && props.activeId && props.activeId === props.id ? "opacity-0" : "opacity-100"}`} ref={setNodeRef} style={style}>
            <div className=" justify-between flex">
            <div className="flex py-2">
                <div>

                {/**!props.completed ||*/((props.completions&& props.repeat.type !== 'none') ? !props.completions.includes(props.date) : !props.completed) ? 
                            <div type="checkbox" className={`cursor-pointer glassless mr-2 mt-1 h-[14px] w-[14px] rounded`} value={props.completed} checked={props.completed} onClick = {handleChange}/>
                            :
                            <IoMdCheckbox type="checkbox" className="cursor-pointer mr-2 mt-1 scale-125 opacity-70 h-[14px] w-[14px]" value={props.completed} checked={props.completed} onClick = {handleChange}/>
                        }
                </div>
                <div className="cursor-pointer select-none font-medium" for={props.id} onClick = {taskClicked}>{props.name}</div>
            </div>
            <div>
                {props.repeat.type === 'none' && <IoIosReorder className={`justify-end mt-3 outline-0`} {...attributes} {...listeners}/>}
                {props.repeat.type !== 'none' && <div className="relative text-sm mt-3 text-black/50">
                    <IoMdSync/>
                </div>}
            </div>
            </div>
            {props.subTasks.length !== 0 && 
            <div className="flex justify-between"><div className={`mb-2 relative -mt-1 rounded-sm bg-gray-300 h-[2px]`} style={{"width": "100%"}}>
                <div className={`absolute top-0 left-0 mb-2 rounded-sm bg-gray-400 h-[2px]`} style={{"width": `${subTaskLength*100}%`}}/>
                </div>
                <div className="ml-2 text-xs -mt-3">{props.subTasks.filter((subTask) => subTask.completed).length}/{props.subTasks.length}</div>
                </div>}
        </div>
    )
}

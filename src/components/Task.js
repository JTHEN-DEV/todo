import {IoMdCheckbox, IoMdSync} from "react-icons/io"
import moment from "moment/moment";
import { FiEdit2 } from "react-icons/fi";
export const Task = (props) => {

    const handleChange = () => {
        if(props.completions) {
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
        } else {
            props.setRepeatWarning({show: true, id: props.id, date: props.date})
        }
    }

    return (
        <div className="w-full justify-between flex px-2 glassless my-1 rounded-lg">
            <div className="flex py-2">
                <div>

                {/**!props.completed ||*/(props.completions ? !props.completions.includes(props.date) : !props.completed) ? 
                            <div type="checkbox" className={`cursor-pointer glassless mr-2 mt-1 h-[14px] w-[14px] rounded`} value={props.completed} checked={props.completed} onClick = {handleChange}/>
                            :
                            <IoMdCheckbox type="checkbox" className="cursor-pointer mr-2 mt-1 scale-125 opacity-70 h-[14px] w-[14px]" value={props.completed} checked={props.completed} onClick = {handleChange}/>
                        }
                </div>
                <div className="cursor-pointer select-none" for={props.id} onClick = {onClick}>{props.name}</div>
            </div>
            {props.repeat.type !== 'none' && <div className="relative text-sm mt-6 -mr-1 text-black/50">
                <IoMdSync/>
            </div>}
        </div>
    )
}

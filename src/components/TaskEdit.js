import {IoIosClose} from 'react-icons/io';
import {IoMdAdd} from'react-icons/io';
import { useState } from 'react';

export const TaskEdit = (props) => {

    const [editedTask, setEditedTask] = useState(props.task)
    // etc.
    const [newSubTaskName, setNewSubTaskName] = useState('')

    const [notes, setNotes] = useState(props.task.notes)

    const onSave = () => {
        console.log(props.task)
        console.log(editedTask)
        props.editTask(props.task.id, editedTask)
        props.toggleEdit(0, false) //closes the edit box :)
        // NOTE: adding subtasks is independent of the save process
    }

    const onAddSubtask = () => {
        props.editSubTasks(props.task.id, props.task.subTasks.concat(newSubTaskName))
        setEditedTask({...editedTask, subTasks: editedTask.subTasks.concat(newSubTaskName)})
        setNewSubTaskName('')
    }

    

    return (
        <div className="rounded-xl glassless w-[40%] p-3 backdrop-blur-md">
            <div className="flex justify-between text-xl font-semibold">
                <div className="flex items-center">
                    <form>
                        <input type="checkbox" className="h-[23px] w-[23px] mr-2" value={props.task.completed} checked={props.task.completed} onClick = {() => props.setCompleted(props.task.id, !props.task.completed)}/>
                    </form>
                    <form>
                        <input className="rounded-lg glassless my-4 px-2" type = 'text' placeholder = 'Task Name...' value={editedTask.name} onChange={(e) => setEditedTask({...editedTask, name: e.target.value})}/>
                    </form>
                </div>
                <div className="flex items-center">
                    <IoIosClose style={{fontSize: "3rem", fontWeight: "bold"}} onClick = {() => props.toggleEdit(0, false)}/>
                    Three Icons
                </div>
            </div>
            <div className="text-left" style={{fontWeight:"bold"}}>Subtasks</div>
            <div className="rounded-lg glassless mb-4 text-left">
                {props.task.subTasks.map((subTask) => (<h1 className="px-6 my-0.3">{subTask}</h1>))}
                <form className='form-control'>
                    <div className='flex items-center'>
                        <IoMdAdd style={{fontSize: "1.5rem", color: 'grey', fontWeight: "semibold"}} onClick = {onAddSubtask}/>
                        <input type = 'text' className="my-1 bg-transparent outline-0 w-[95%]" placeholder = 'Add Subtask...' value={newSubTaskName} onChange={(e) => setNewSubTaskName(e.target.value)}/>
                    </div>
                </form>
            </div>
            <div className="rounded-xl glassless mb-4">
                <form className='form-control'>
                    <input type = 'text' placeholder = 'Add Notes...' value={editedTask.notes} onChange={(e) => setNotes({...editedTask, notes: e.target.value})}/>
                </form>
            </div>
            <div className="flex w-full justify-between">
                <button className="glassless rounded-xl w-[42%]" onClick = {onSave}>Save</button>
                <button className="glassless rounded-xl w-[42%]" onClick= {() => props.toggleEdit(0, false)}>Cancel</button>
            </div>
        </div>
    )
}

import {IoMdAdd} from'react-icons/io';
import { IoMdSync } from "react-icons/io";
import { useState } from 'react';
import { SubTask } from './SubTask';

export const TaskEdit = (props) => {

    const [editedTask, setEditedTask] = useState(props.task)
    // etc.
    const [newSubTaskName, setNewSubTaskName] = useState('')

    const [notes, setNotes] = useState(props.task.notes)

    const onSave = () => {
        console.log(props.task)
        console.log(editedTask)
        props.editTask(props.task.id, editedTask, props.selectedDate)
        props.toggleEdit(0, false) //closes the edit box :)
        // NOTE: adding subtasks is independent of the save process
    }

    const onAddSubtask = () => {
        props.incrementSubTaskCurrId(props.task.id)
        console.log(props.task.subTaskCurrId)
        props.editSubTasks(props.task.id, props.task.subTasks.concat({id: props.task.subTaskCurrId, name: newSubTaskName, completed: false}), props.selectedDate);
        console.log(props.task.subTasks)
        setEditedTask({...editedTask, subTasks: editedTask.subTasks.concat({id: props.task.subTaskCurrId, name: newSubTaskName, completed: false})})
        setNewSubTaskName('')
    }

    const deleteSubtask = () => {
        //delets a particular subtask
        
    }

    return (
        <div className="rounded-xl glassless w-[35%] px-3 pb-3.5 pt-0.5 backdrop-blur-md">
            <div className="flex justify-between text-xl font-semibold">
                <div className="flex items-center">
                    <form>
                        <input type="checkbox" className="h-[23px] w-[23px] mr-2 my-4 glassless bg-amber-400" value={props.task.completed} checked={props.task.completed} onClick = {() => props.setCompleted(props.task.id, !props.task.completed)}/>
                    </form>
                    <form>
                        <input className="rounded-lg glassless my-4 px-2 outline-0" type = 'text' placeholder = 'Task Name...' value={editedTask.name} onChange={(e) => setEditedTask({...editedTask, name: e.target.value})}/>
                    </form>
                </div>
                <div className="flex items-center">
                    <IoMdSync className="text-xl font-black text-gray-500 hover:text-gray-800 cursor-pointer"/>
                </div>
            </div>
            <div className="text-left mb-1" style={{fontWeight:"bold"}}>Subtasks</div>

            <div className="rounded-lg glassless mb-4 pt-0.5 px-1 text-left">
                {props.task.subTasks.map((subTask) => (<SubTask editedTask={editedTask} setEditedTask={setEditedTask} editSubTasks={props.editSubTasks} task = {props.task} key={subTask.id} subTask={subTask}/>))}
                <form className='form-control'>
                    <div className='flex items-center'>
                        <IoMdAdd className="mx-1 text-base font-extrabold text-gray-500 hover:text-gray-800 cursor-pointer mb-0.5" onClick = {onAddSubtask}/>
                        <input type = 'text' className="mb-1 mt-0.5 bg-transparent outline-0 w-[95%] text-[14px]" placeholder = 'Add Subtask...' value={newSubTaskName} onChange={(e) => setNewSubTaskName(e.target.value)}/>
                    </div>
                </form>
            </div>
            
            <div className="text-left mb-1" style={{fontWeight:"bold"}}>Notes</div>
            <div className="rounded-lg glassless mb-4">
                <form className='form-control'>
                    <input type = 'text' className="my-1 bg-transparent outline-0 w-[95%] text-sm " placeholder = 'Add Notes...' value={editedTask.notes} onChange={(e) => setEditedTask({...editedTask, notes: e.target.value})}/>
                </form>
            </div>
            <div className="flex w-full justify-between">
                <button className="glassless rounded-xl w-[48%]" onClick = {onSave}>Save</button>
                <button className="glassless rounded-xl w-[48%]" onClick= {() => props.toggleEdit(0, false)}>Cancel</button>
            </div>
        </div>
    )
}

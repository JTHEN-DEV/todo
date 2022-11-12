import { useState } from 'react';
import { IoMdClose } from "react-icons/io";

export const SubTask = (props) => {

    
    const onNameChange = (newName) => {
        props.editSubTasks(props.task.id, props.task.subTasks.map((task) => {
                if ((task.id) === props.subTask.id){
                    return {...task, name: newName};
                } else {
                    return task;
                }
        }))
        props.setEditedTask({...props.editedTask, subTasks: props.editedTask.subTasks.map((task) => {
                if ((task.id) === props.subTask.id){
                    return {...task, name: newName};
                } else {
                    return task;
                }
        })})
    }

    const onToggle = () => {
        props.editSubTasks(props.task.id, props.task.subTasks.map((task) => {
                if ((task.id) === props.subTask.id){
                    return {...task, completed: !props.subTask.completed};
                } else {
                    return task;
                }
        }))
        props.setEditedTask({...props.editedTask, subTasks: props.editedTask.subTasks.map((task) => {
                if ((task.id) === props.subTask.id){
                    return {...task, completed: !props.subTask.completed};
                } else {
                    return task;
                }
        })})
    }

        const onDelete = (newName) => {
        props.editSubTasks(props.task.id, props.task.subTasks.filter((subTask) => subTask.id !== props.subTask.id))
        props.setEditedTask({...props.editedTask, subTasks: props.task.subTasks.filter((subTask) => subTask.id !== props.subTask.id)})
    } // can't reuse id's FIX THIS!!

    const deleteSubtask = () => {
        //delets a particular subtask
        
    }

    return (
        <div>
            <div key={props.subTask.id} className="flex items-center glasslest hover:bg-white/40 rounded-md px-1 mx-0.5 my-1.5">
                <form>
                    <input type="checkbox" className="h-[10px] w-[10px]" value={props.subTask.completed} checked={props.subTask.completed} onClick = {onToggle}/>
                </form>
                <input className="ml-2 text-sm bg-transparent outline-0 w-[93%]" type='text' value={props.subTask.name} placeholder = 'Subtask Name...'onChange={(e) => onNameChange(e.target.value)}/>
                <IoMdClose className="text-right flex items-right text-gray-500 hover:text-gray-800 cursor-pointer mb-0.5" onClick={onDelete}/>
            </div>
        </div>
    )
}
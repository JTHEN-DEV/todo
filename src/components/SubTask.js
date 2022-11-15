import { useState } from 'react';
import { IoMdClose, IoIosReorder, IoMdCheckbox } from "react-icons/io";
import { Draggable } from "react-beautiful-dnd";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CssSyntaxError } from "postcss";

export const SubTask = (props) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: props.id})
    const style= {
        transform: CSS.Transform.toString(transform),
        transition
    }
    
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
        <div ref={setNodeRef} style={style} key={props.subTask.id} index={props.index}>
            <div key={props.subTask.id} className="flex items-center glasslest hover:bg-white/50 rounded-md px-1 mx-0.5 my-1.5">
                <form>
                    {!props.subTask.completed ? 
                        <div type="checkbox" className={`cursor-pointer glassless h-[12px] w-[12px]`} value={props.subTask.completed} checked={props.subTask.completed} onClick = {onToggle}/>
                        :
                        <IoMdCheckbox type="checkbox" className="cursor-pointer scale-125 opacity-70 h-[12px] w-[12px]" value={props.subTask.completed} checked={props.subTask.completed} onClick = {onToggle}/>
                    }
                </form>
                <input className="ml-2 text-sm bg-transparent outline-0 w-[93%]" type='text' value={props.subTask.name} placeholder = 'Subtask Name...'onChange={(e) => onNameChange(e.target.value)}/>
                <IoIosReorder {...attributes} {...listeners} className="text-gray-500 hover:text-gray-800 cursor-pointer outline-0 mr-1 mb-0.5"/>
                <IoMdClose className="text-right flex items-right text-gray-500 hover:text-gray-800 cursor-pointer mb-0.5" onClick={onDelete}/>
            </div>
        </div>
    )
}
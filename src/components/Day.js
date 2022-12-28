import { useState } from "react"
import { Task } from "./Task"
import moment from "moment/moment";
import {DndContext, closestCenter, useDroppable, DragOverlay} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

export const Day = (props) => {

    const {setNodeRef} = useDroppable({
    id: props.date,
  });

    const [hover, setHover] = useState(false);

    const handleMouseOver = () => {
        setHover(true);
    }

    const handleMouseOut = () => {
        setHover(false);
    }

    const setCompleted = (taskId, isCompleted) => {
        props.setCompleted(taskId, isCompleted, props.date);
    }

    const today = (props.date === moment().format("DD/MM/YYYY"))

    return (
        <div className="w-[19.5%] p-3" ref={setNodeRef}>
            <div className="text-xl pb-2 mb-2 font-semibold border-b border-gray-500 flex justify-between cursor-default select-none">
                <div className={`${today ? "text-blue-600": "text-black"}`}>
                    {props.name}
                </div>
                <div className="text-gray-400 font-medium">
                    {props.dateName}
                </div>
            </div>
            <div className="min-h-[30vh] flex flex-col overflow-y-auto h-[70vh] max-h-[70vh] pt-2 px-4 -mx-4 scrollbar-hide" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                <SortableContext items={props.tasklist} strategy={verticalListSortingStrategy} id={props.date}>
                    {props.tasks.map((task) => {return <Task activeId={props.activeId} overlay={false} date={props.date} key={task.id + "-" + props.date} iid={task.id + "/" + props.date} setCompleted={setCompleted} setRepeatWarning={props.setRepeatWarning} toggleEdit={props.toggleEdit} editTask={props.editTask} tasks={props.tasklist} {...task}/>})}
                </SortableContext>
                
                <div className={`flex px-2 py-1 transition-opacity ease-in-out duration-300 ${hover ? "opacity-100" : "opacity-0"}`}>
                    <div className="cursor-pointer" onClick={() => props.addTask(props.date)}>New Task</div>
                </div>
            </div>
        </div>
    )
}

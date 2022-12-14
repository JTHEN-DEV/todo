import { useState } from "react"
import { Task } from "./Task"

export const Day = (props) => {

    const [hover, setHover] = useState(false);

    const handleMouseOver = () => {
        setHover(true);
    }

    const handleMouseOut = () => {
        setHover(false);
    }

    const setCompleted = (taskId, isCompleted) => {
        props.setCompleted(taskId, isCompleted)
    }
    return (
        <div className="rounded-3xl glassless w-[19.5%] p-3">
            <div className="text-xl pb-2 mb-2 font-semibold border-b border-gray-500 flex justify-between">
                <div className="">
                    {props.name}
                </div>
                <div className="text-gray-400">
                    {props.date}
                </div>
            </div>
            <div className="min-h-[30vh] flex flex-col" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                {props.tasks.map((task) => {return <Task setCompleted={setCompleted} {...task}/>})}
                <div className={`flex px-2 py-1 transition-opacity ease-in-out duration-300 ${hover ? "opacity-100" : "opacity-0"}`}>
                    New Task
                </div>
            </div>
        </div>
    )
}

import { useState } from "react"
import { IoMdCheckbox } from "react-icons/io";

export const RepeatEditWarning = (props) => {
    const [thisTask, setThisTask] = useState(true)
    return (
        <div className="rounded-xl glassless w-[13%] px-3 pb-3.5 pt-1.5 backdrop-blur-md absolute select-none">
            <div className="font-bold mb-2">Edit Recurring Task</div>
            <div className="ml-1">
                <div className="flex cursor-pointer" onClick={() => setThisTask(true)}>
                    <div>{thisTask ? 
                        <IoMdCheckbox className="opacity-70 mt-1.5 mx-2 h-[12px] w-[12px]"/> 
                        : 
                        <div className="mt-1.5 mx-2 scale-90 glassless rounded h-[12px] w-[12px]"/>}
                    </div>
                    <div className="text-sm">This Task</div>
                </div>
                <div className="flex cursor-pointer" onClick={() => setThisTask(false)}>
                    <div>{!thisTask ? 
                        <IoMdCheckbox className="opacity-70 mt-1.5 mx-2 h-[12px] w-[12px]"/> 
                        : 
                        <div className="mt-1.5 mx-2 scale-90 glassless rounded h-[12px] w-[12px]"/>}
                    </div>
                    <div className="text-sm">All Tasks</div>
                </div>  
            </div>
            <div className="flex justify-between mt-4">
                <div className="glassless rounded-xl w-[45%] text-sm cursor-pointer" onClick={() => props.setRepeatWarning({show: false, id: 0, date: ""})}>Cancel</div>
                <div className="glassless rounded-xl w-[45%] text-sm cursor-pointer" onClick={() => {props.setRepeatWarning({...props.repeatWarning, show: false}); props.toggleEdit(props.repeatWarning.id, props.repeatWarning.date, thisTask)}}>Ok</div>
            </div>
        </div>
  )
}
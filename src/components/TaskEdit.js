import {IoIosClose} from 'react-icons/io';

export const TaskEdit = (props) => {
    return (
        <div className="rounded-3xl glassless w-[40%] p-3">
            <div className="flex justify-between text-xl font-semibold">
                <div className="flex items-center">
                    <input type="checkbox" className="h-[23px] w-[23px] mr-2"/>
                    <h1>Task Name</h1>
                </div>
                <div className="flex items-center">
                    <IoIosClose style={{fontSize: "3rem", fontWeight: "bold"}}/>
                    Three Icons
                </div>
            </div>
            <div className="rounded-3xl glassless my-4">
                Subtask List
            </div>
            <div className="rounded-3xl glassless mb-4">
                Notes
            </div>
            <div className="flex w-full justify-between">
                <button className="glassless rounded-3xl w-[42%]">Save</button>
                <button className="glassless rounded-3xl w-[42%]">Cancel</button>
            </div>
        </div>
    )
}

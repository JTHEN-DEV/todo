import {
    IoMdAdd,
    IoMdCheckmark,
    IoIosArrowDown,
    IoMdSync,
} from "react-icons/io";
import { useEffect, useState } from "react";
import { SubTask } from "./SubTask";
import { DatePicker } from "./DatePicker";
import moment from "moment/moment";


export const TaskEdit = (props) => {
    const [editedTask, setEditedTask] = useState(props.task);
    // etc.
    const [newSubTaskName, setNewSubTaskName] = useState("");

    const [showRepeat, setShowRepeat] = useState(false);

    const [editedRepeat, setEditedRepeat] = useState(props.task.repeat);
    
    const [showDatePicker, setShowDatePicker] = useState(false)

    const onSave = () => {
        console.log(props.task)
        console.log(editedTask)
        props.editTask(props.task.id, editedTask)
        props.toggleEdit(0, false) //closes the edit box :)
        // NOTE: adding subtasks is independent of the save process
    }
    const onAddSubtask = () => {
        console.log(props.task.subTaskCurrId)
        props.editSubTasks(props.task.id, props.task.subTasks.concat({id: props.task.subTaskCurrId, name: newSubTaskName, completed: false}))
        console.log(props.task.subTasks)
        setEditedTask({...editedTask, subTasks: editedTask.subTasks.concat({id: props.task.subTaskCurrId, name: newSubTaskName, completed: false})})
        setNewSubTaskName('')
        props.incrementSubTaskCurrId(props.task.id)
    }

    const [showRepeatType, setShowRepeatType] = useState(false);

    const setsEditedRepeat = (value) => {
        setEditedRepeat(value);
        setShowRepeatType(false);
    };

    useEffect(() => {
        setEditedTask(props.task);
        setEditedRepeat(props.task.repeat);
    }, [props.task]);

    return (
        <div className="rounded-xl glassless w-[35%] px-3 pb-3.5 pt-0.5 backdrop-blur-md">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <form>
                        <input
                            type="checkbox"
                            className="h-[23px] w-[23px] mr-2 my-4 glassless bg-amber-400"
                            value={props.task.completed}
                            checked={props.task.completed}
                            onClick={() =>
                                props.setCompleted(
                                    props.task.id,
                                    !props.task.completed
                                )
                            }
                        />
                    </form>
                    <form>
                        <input
                            className="rounded-lg glassless my-4 px-2 w-[250px] outline-0 text-xl font-semibold"
                            type="text"
                            placeholder="Task Name..."
                            value={editedTask.name}
                            onChange={(e) =>
                                setEditedTask({
                                    ...editedTask,
                                    name: e.target.value,
                                })
                            }
                        />
                    </form>
                </div>
                <div className="flex items-center">
                    <div>
                        {
                            <div
                                className={`backdrop-blur-3xl mr-1 rounded-lg glassless py-1 px-0.5 pl-1 transition-transform ease-in-out duration-150 origin-right ${
                                    showRepeat ? "scale-x-100" : "scale-x-0"
                                }`}
                            >
                                <div className="flex justify-end">
                                    <input
                                        className="w-[65px] mr-2 text-sm py-0.5 rounded-lg glassless outline-0 bg-transparent"
                                        min={1}
                                        step={1}
                                        type="number"
                                        placeholder="Interval"
                                        value={editedRepeat.frequency}
                                        onChange={(e) =>
                                            setEditedRepeat({
                                                ...editedRepeat,
                                                frequency: e.target.value,
                                            })
                                        }
                                    />
                                    <div className="relative">
                                        <div
                                            className="rounded-lg glassless outline-0 bg-transparent text-sm mr-1 p-0.5 cursor-pointer w-[72px] flex justify-between"
                                            onClick={() => {
                                                setShowRepeatType(
                                                    !showRepeatType
                                                );
                                            }}
                                        >
                                            <div className="ml-1">
                                                {editedRepeat.type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    editedRepeat.type.slice(1)}
                                            </div>
                                            <IoIosArrowDown className="text mt-1 font-black text-gray-500 cursor-pointer" />
                                        </div>
                                        {
                                            <div
                                                className={`py-0.5 absolute z-30 top-[30px] text-sm rounded-lg glassless cursor-pointer w-[72px] backdrop-blur-3xl transition-transform ease-in-out duration-150 origin-top ${
                                                    showRepeatType
                                                        ? "scale-y-100"
                                                        : "scale-y-0"
                                                }`}
                                            >
                                                <div
                                                    className="px-1.5 text-left bg-white/0 hover:bg-white/60 rounded-lg"
                                                    onClick={() => {
                                                        setsEditedRepeat({
                                                            ...editedRepeat,
                                                            type: "daily",
                                                        });
                                                    }}
                                                >
                                                    Daily
                                                </div>
                                                <div
                                                    className="px-1.5 text-left bg-white/0 hover:bg-white/60 rounded-lg"
                                                    onClick={() => {
                                                        setsEditedRepeat({
                                                            ...editedRepeat,
                                                            type: "weekly",
                                                        });
                                                    }}
                                                >
                                                    Weekly
                                                </div>
                                                <div
                                                    className="px-1.5 text-left bg-white/0 hover:bg-white/60 rounded-lg"
                                                    onClick={() => {
                                                        setsEditedRepeat({
                                                            ...editedRepeat,
                                                            type: "yearly",
                                                        });
                                                    }}
                                                >
                                                    Yearly
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div
                        className="text-xl rounded-lg glassless p-1.5 font-black text-gray-500 hover:text-gray-800 cursor-pointer"
                        onClick={() => {
                            setShowRepeat(!showRepeat);
                        }}
                    >
                        {showRepeat ? (
                            <IoMdCheckmark
                                onClick={() => {
                                    setEditedTask({
                                        ...editedTask,
                                        repeat: editedRepeat,
                                    });
                                    setShowRepeatType(false);
                                }}
                            />
                        ) : (
                            <IoMdSync />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex left-0 pl-8 relative">
                        {!showRepeat && <div>
                        <div className="glassless rounded-lg text-gray-600 text-sm font-semibold cursor-pointer px-1 p-1" onClick={() => setShowDatePicker(!showDatePicker)}>{editedTask.startDate}</div>
                        {showDatePicker && <DatePicker setEditedTask={setEditedTask} editedTask={editedTask} setShowDatePicker={setShowDatePicker} month={moment(editedTask.startDate, "DD/MM/YYYY").month()+1} year={moment(editedTask.startDate, "DD/MM/YYYY").year()}/>}
                        </div>}
            </div>

            <div className="text-left mb-1" style={{ fontWeight: "bold" }}>
                Subtasks
            </div>

            
            <div className="rounded-lg glassless mb-4 pt-0.5 px-1 text-left">
                            {props.task.subTasks.map((subTask, i) => (
                            <SubTask
                                index={i}
                                editedTask={editedTask}
                                setEditedTask={setEditedTask}
                                editSubTasks={props.editSubTasks}
                                task={props.task}
                                key={subTask.id}
                                subTask={subTask}
                            />
                            ))}
                <form className="form-control">
                    <div className="flex items-center">
                        <IoMdAdd
                            className="mx-1 text-base font-extrabold text-gray-500 hover:text-gray-800 cursor-pointer mb-0.5"
                            onClick={onAddSubtask}
                        />
                        <input
                            type="text"
                            className="mb-1 mt-0.5 bg-transparent outline-0 w-[95%] text-[14px]"
                            placeholder="Add Subtask..."
                            value={newSubTaskName}
                            onChange={(e) => setNewSubTaskName(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            <div className="text-left mb-1" style={{ fontWeight: "bold" }}>
                Notes
            </div>
            <div className="rounded-lg glassless mb-4">
                <form className="form-control">
                    <input
                        type="text"
                        className="my-1 bg-transparent outline-0 w-[95%] text-sm "
                        placeholder="Add Notes..."
                        value={editedTask.notes}
                        onChange={(e) =>
                            setEditedTask({
                                ...editedTask,
                                notes: e.target.value,
                            })
                        }
                    />
                </form>
            </div>
            <div className="flex w-full justify-between">
                <button
                    className="glassless rounded-xl w-[48%]"
                    onClick={onSave}
                >
                    Save
                </button>
                <button
                    className="glassless rounded-xl w-[48%]"
                    onClick={() => props.toggleEdit(0, false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

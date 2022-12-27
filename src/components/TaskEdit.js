import {
    IoMdAdd,
    IoMdCheckmark,
    IoIosArrowDown,
    IoMdSync,
    IoMdCheckbox,
    IoMdTrash,
    IoMdClose
} from "react-icons/io";
import TextareaAutosize from 'react-textarea-autosize';
import { useEffect, useState } from "react";
import { SubTask } from "./SubTask";
import { DatePicker } from "./DatePicker";
import moment from "moment/moment";
import {DndContext, closestCenter} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FaTasks } from "react-icons/fa";

export const TaskEdit = (props) => {
    console.log(props.selectedDate)
    // const [editedTask, setEditedTask] = useState({...props.task, startDate: props.selectedDate});
    // etc.

    const [currSubTaskId, setCurrSubTaskId] = useState(props.editedTask.subTaskCurrId)

    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const [newSubTaskName, setNewSubTaskName] = useState("");

    const [showRepeat, setShowRepeat] = useState(false);

    const [editedRepeat, setEditedRepeat] = useState(props.task.repeat);
    
    const [showDatePicker, setShowDatePicker] = useState(false)

    const handleDragEnd = (event) => {
        const{active, over} = event;
        const activeIndex = (props.task.subTasks.findIndex(item => item.id === active.id))
        const overIndex = (props.task.subTasks.findIndex(item => item.id === over.id))
        if(active.id !== over.id) {
            editSubTasks(props.task.id, arrayMove(props.task.subTasks, activeIndex, overIndex));
        }
    }

    const handleRepeat = () => {
        props.setEditedTask({
            ...props.editedTask,
            startDate: props.selectedDate,
            repeat: editedRepeat,
        }); 
        console.log(editedRepeat);
        setShowRepeatType(false);
    }

    const onAddSubtask = () => {
        editSubTasks(0, props.editedTask.subTasks.concat({id: currSubTaskId, name: newSubTaskName, completed: false}))
        // setEditedTask({...editedTask, subTasks: editedTask.subTasks.concat({id: props.task.subTaskCurrId, name: newSubTaskName, completed: false})})
        setNewSubTaskName('')
        setCurrSubTaskId(currSubTaskId+1)
    }

    const editSubTasks = (taskId, updatedSubTasks) => {
        console.log({...props.editedTask, subTasks: updatedSubTasks})
        props.setEditedTask({...props.editedTask, subTasks: updatedSubTasks})
    }

    const [showRepeatType, setShowRepeatType] = useState(false);

    const setsEditedRepeat = (value) => {
        setEditedRepeat(value);
        setShowRepeatType(false);
    };

    const onDeleteTask = () => {
        const tasks = props.tasks
        const index = tasks.map(task => task.id).indexOf(props.task.id);
        tasks.splice(index, 1)
        props.setTasks(tasks)
        props.toggleEdit(0, false, false)
    }

    // useEffect(() => {
    //     props.setEditedTask(props.task);
    //     setEditedRepeat(props.task.repeat);
    // }, [props.task]);
    
    const onClickSave = () => {
        console.log(props.editedTask.name.trim().length !== 0)
        if (props.editedTask.name.trim().length !== 0) {
            if (props.editedTask.repeat.type === 'none') {
                props.onSave()
            } else if (props.task.repeat.type === 'none') {
                props.onSave()
                console.log("THE NEW ADDITION >>>>>") 
            } else {
                props.setThisTask(true)
                props.setRepeatWarning({show: true, id: props.editedTask.id, date: props.editedTask.startDate})
            }
        }
    }

    const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        onAddSubtask();
    }
  };

    const onToggleCheck = () => {
        console.log(!props.task.completed || !props.task.completions.includes(props.selectedDate))
        if (props.editedTask.repeat.type === 'none') {
            props.editTask(props.editedTask.id, {...props.task, completed: !props.task.completed})
            props.setEditedTask({...props.editedTask, completed: !props.editedTask.completed})
        } else {
            // Repeating tasks have their completed set to true for the checkbox functionality to work in the taskedit
            if (props.task.completions.includes(props.selectedDate)) {
                props.editTask(props.editedTask.id, {...props.task, completed: true, completions: props.task.completions.filter((date) => date !== props.selectedDate)})
                props.setEditedTask({...props.editedTask, completed: true, completions: props.editedTask.completions.filter((date) => date !== props.selectedDate)})
            } else {
                props.editTask(props.editedTask.id, {...props.task, completed: true, completions: props.task.completions.concat(props.selectedDate)})
                props.setEditedTask({...props.editedTask, completed: true, completions: props.editedTask.completions.concat(props.selectedDate)})
            }
        }
    }

    console.log(props.editedTask)

    return (
        <div className="rounded-xl glassless w-[35%] px-3 pb-3.5 pt-0.5 backdrop-blur-md">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <form>

                        {(!props.task.completed || (props.task.repeat.type !== 'none' && props.task.completions && !props.task.completions.includes(props.selectedDate))) ? 
                        <div type="checkbox" className={`cursor-pointer glassless mr-2 my-4 h-[23px] w-[23px] rounded`} value={props.task.completed} checked={props.task.completed} onClick = {onToggleCheck}/>
                        :
                        <IoMdCheckbox type="checkbox" className="cursor-pointer mr-2 my-4 scale-125 opacity-70 h-[23px] w-[23px]" value={props.task.completed} checked={props.task.completed} onClick = {onToggleCheck}/>
                    }
                    </form>
                    <form>
                        <input
                            className="rounded-lg glassless my-4 px-2 w-[250px] outline-0 text-xl font-semibold text-ellipsis"
                            type="text"
                            placeholder="Task Name..."
                            value={props.editedTask.name}
                            onChange={(e) =>
                                props.setEditedTask({
                                    ...props.editedTask,
                                    name: e.target.value,
                                })
                            }
                        />
                    </form>
                </div>

                {props.editedTask.startDate && props.editedTask.startDate !== -1 && <div className="flex items-center">
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
                                                className={`py-0.5 absolute z-50 top-[30px] text-sm rounded-lg glassless cursor-pointer w-[72px] backdrop-blur-3xl transition-transform ease-in-out duration-150 origin-top ${
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
                                                <div
                                                    className="px-1.5 text-left bg-white/0 hover:bg-white/60 rounded-lg"
                                                    onClick={() => {
                                                        setsEditedRepeat({
                                                            ...editedRepeat,
                                                            type: "none",
                                                        });
                                                    }}
                                                >
                                                    None
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
                                onClick={() => {handleRepeat()
                                }}
                            />
                        ) : (
                            <IoMdSync />
                        )}
                    </div>
                </div>}
            </div>
            <div className="left-0 pl-8 relative w-[22%] mb-3">
                        {props.editedTask.startDate && props.editedTask.startDate !== -1 && <div>
                        <div className="glassless rounded-lg text-gray-600 text-[12px] font-semibold cursor-pointer -mt-3 p-0.5" onClick={() => setShowDatePicker(!showDatePicker)}>{props.editedTask.startDate}</div>
                        {showDatePicker && <DatePicker setEditedTask={props.setEditedTask} editedTask={props.editedTask} setShowDatePicker={setShowDatePicker} month={moment(props.editedTask.startDate, "DD/MM/YYYY").month()+1} year={moment(props.editedTask.startDate, "DD/MM/YYYY").year()}/>}
                        </div>}
            </div>

            <div className="text-left mb-1" style={{ fontWeight: "bold" }}>
                Subtasks
            </div>

            
            <div className="rounded-lg glassless mb-4 pt-0.5 px-1 text-left">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={props.editedTask.subTasks} strategy={verticalListSortingStrategy}>
                        {props.editedTask.subTasks.map((subTask, i) => (
                        <SubTask
                            index={i}
                            editedTask={props.editedTask}
                            setEditedTask={props.setEditedTask}
                            editSubTasks={editSubTasks}
                            task={props.editedTask}
                            key={subTask.id}
                            subTask={subTask}
                            id={subTask.id}
                        />
                        ))}
                    </SortableContext>
                </DndContext>
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
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </form>
            </div>

            <div className="text-left mb-1" style={{ fontWeight: "bold" }}>
                Notes
            </div>
            <div className="rounded-lg glassless mb-4">
                <form>
                    <TextareaAutosize
                        style={{resize: "none"}}
                        type="text"
                        className="my-1 bg-transparent outline-0 w-[95%] text-sm whitespace-normal"
                        placeholder="Add Notes..."
                        value={props.editedTask.notes}
                        onChange={(e) =>
                            props.setEditedTask({
                                ...props.editedTask,
                                notes: e.target.value,
                            })
                        }
                    />
                </form>
            </div>
            <div>
                {!deleteConfirm ?
                <div className="flex w-full justify-between">
                    <div className="text-red-600 glassless cursor-pointer rounded-lg w-[5%] px-1 py-1" onClick={() => setDeleteConfirm(true)}>
                        <IoMdTrash/>
                    </div>
                    <button
                        className="glassless font-semibold text-gray-700 hover:text-black rounded-lg w-[45%]"
                        onClick={() => {if(props.isNew){onDeleteTask()}; props.toggleEdit(0, false, false)}}
                    >
                        Cancel
                    </button>
                    <button
                        className="glassless font-semibold rounded-lg text-gray-700 hover:text-black w-[45%]"
                        onClick={onClickSave}
                    >
                        Save
                    </button>
                </div>
                :
                <div className="glassless rounded-lg flex w-[100%] justify-between">
                    <div className="font-semibold text-gray-700 ml-1 mt-2">Are you sure you want to delete?</div>
                    <div className="flex justify-between mr-1 my-1">
                        <div
                            className="m-1 rounded-lg glassless font-semibold px-3 text-gray-700 cursor-pointer w-[100%]"
                            onClick={() => setDeleteConfirm(false)}
                        >Cancel</div>
                        <div className="m-1 rounded-lg glassless font-semibold px-3 text-red-600 cursor-pointer w-[100%]"
                            onClick={onDeleteTask}>
                            Delete
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
};

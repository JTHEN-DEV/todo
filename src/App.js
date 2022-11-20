import moment from "moment/moment";
import { useState } from "react";
import "./App.css";
import { Day } from "./components/Day";
import { TaskEdit } from "./components/TaskEdit";
import { WeekController } from "./components/WeekController";
import {RepeatEditWarning} from "./components/RepeatEditWarning"

function App() {
    const [currTaskId, setCurrTaskId] = useState(3); // currently set to 3 because the next task will have an id of 3
    const [selectedDate, setSelectedDate] = useState(false); // logs the date of the task that is being edited by taskedit
    const [currentEditID, setCurrentEditID] = useState(0);
    const [dayOffset, setDayOffset] = useState(0);
    const [thisTask, setThisTask] = useState(true);
    const day = moment().add(dayOffset, "days");
    const [isNew, setIsNew] = useState(false); // tells taskedit if current task is a new task (on cancel will delete new task)
    const [editedTask, setEditedTask] = useState({
        startDate: ""
    })
    const [repeatWarning, setRepeatWarning] = useState({
        show: false,
        id: 0,
        date: ""
    })
    const [tasks, setTasks] = useState([
        {
            id: 0,
            dayIdx: 0,
            subTaskCurrId: 3, // currently set to 2 because a new task needs an id of 2
            name: "Finish coding project",
            completed: false,
            subTasks: [
                {
                    id: 1, // id of first element must be 1 for drag and drop to work
                    name: "test 1",
                    completed: false,
                },
                {
                    id: 2,
                    name: "test 2",
                    completed: false,
                },
            ],
            repeat: {
                type: "daily",
                frequency: 2,
            },
            startDate: "20/11/2022",
            rolledOver: false,
            notes: "",
            exceptions: [],
            completions: ["18/11/2022"], // Gives the date of repeating tasks that have been completed
        },
        {
            id: 1,
            dayIdx: 1,
            name: "Import boilerplate",
            subTaskCurrId: 3, // currently set to 2 because a new task needs an id of 2
            completed: false,
            subTasks: [
                {
                    id: 1,
                    name: "test a1",
                    completed: false,
                },
                {
                    id: 2,
                    name: "test a2",
                    completed: false,
                },
            ],
            startDate: "10/11/2022",
            repeat: {
                type: "weekly",
                frequency: 1,
            },
            rolledOver: false,
            notes: "testing :)",
            exceptions: [],
            completions: [],
        },
        {
            id: 2,
            dayIdx: 1,
            name: "Test non-repeat",
            subTaskCurrId: 3, // currently set to 2 because a new task needs an id of 2
            completed: false,
            subTasks: [
                {
                    id: 1,
                    name: "test a1",
                    completed: false,
                },
                {
                    id: 2,
                    name: "test a2",
                    completed: false,
                },
            ],
            startDate: "15/11/2022",
            repeat: {
                type: "none", // changed this to signify no repeats - easier to implement taskedit!
                frequency: 1,
            },
            rolledOver: false,
            notes: "this is a test non-repeating task",
            exceptions: [],
        },
    ]);

    const addTask = (date) => {
        setTasks(
            tasks.concat({
                id: currTaskId,
                dayIdx: 0,
                subTaskCurrId: 0,
                name: "",
                completed: false,
                subTasks: [],
                repeat: {
                    type: "none",
                    frequency: 1,
                },
                startDate: date,
                rolledOver: false,
                notes: "",
                exceptions: [],
                completions: [],
            })
        );
        toggleEdit(currTaskId, date, false, true)
        setCurrTaskId(currTaskId + 1);
    };

    const incrementSubTaskCurrId = (taskId) => {
        setTasks(tasks => {
            return tasks.map((task) => {
                if ((task.id) === taskId){
                    return {...task, subTaskCurrId: task.subTaskCurrId+1};
                } else {
                    return task;
                }
            })
        })
    }
    const setCompleted = (taskId, isCompleted) => {
        setTasks(tasks => {
            return tasks.map((task) => {
                if ((task.id) === taskId){
                    return {...task, completed: isCompleted};
                } else {
                    return task;
                }
            })
        })
    }
    const editTask = (taskId, newTask) => {
        setTasks(tasks => {
            return tasks.map((task) => {
                if ((task.id) === taskId){
                    console.log("task has been edited")
                    return newTask;
                } else {
                    return task;
                }
            })
        })
    }
    

    const rollAllTasks = () => {
        setTasks(
            tasks.map((task) => {
                if (
                    !task.completed &&
                    moment(task.startDate, "DD/MM/YYYY").isBefore(
                        moment(),
                        "day"
                    )
                ) {
                    return {
                        ...task,
                        startDate: moment().format("DD/MM/YYYY"),
                    };
                } else {
                    return task;
                }
            })
        );
    };

    const dayMatch = (date, task) => {
        if (
            task.exceptions &&
            task.exceptions.includes(date.format("DD/MM/YYYY"))
        ) {
            return false;
        }
        const daysBetween = Math.floor(
            date.diff(moment(task.startDate, "DD/MM/YYYY"), "days", true)
        );
        if (task.repeat.type === 'none') {
            return daysBetween === 0;
        } else {
            if (task.repeat.type === "daily") {
                return daysBetween % task.repeat.frequency === 0;
            } else if (task.repeat.type === "weekly") {
                return daysBetween % (7 * task.repeat.frequency) === 0;
            } else if (task.repeat.type === "yearly") {
                return (
                    date.format("DDMM") ===
                    moment(task.startDate, "DD/MM/YYYY").format("DDMM")
                );
            }
        }
    };

    const changeDay = (amount) => {
        //setDay((day) => day.add(amount, 'days'));
        setDayOffset((currentDayOffset) => currentDayOffset + amount);
    };

    const onSave = () => { // called when the taskedit saves the edited task to the main task list
        if (thisTask) {
            //Creates singular version of repeating task
            setTasks(tasks.concat({...editedTask, id: currTaskId, repeat: {type: "none", frequency: 1}, exceptions: []}))
            setCurrTaskId(currTaskId+1)
            //Creates exception
            const task = tasks.filter((task) => task.id === currentEditID)[0]
            editTask(currentEditID, {...task, exceptions: [...task.exceptions, selectedDate]})
        } else {
            //Edit completions to shift if startDate changes
            const task = tasks.filter((task) => task.id === currentEditID)[0]
            const start = moment(task.startDate, "DD/MM/YYYY")
            const difference = start.diff(moment(editedTask.startDate, "DD/MM/YYYY"), "days", true)
            const array = editedTask.completions.map((day) => {
                return moment(day, "DD/MM/YYYY").add(-difference, 'days').format("DD/MM/YYYY");
            })
            editTask(currentEditID, {...editedTask, completions: array})
        }
        toggleEdit(0, false, false) //closes the edit box :)
    }

    const toggleEdit = (id, date, thisTask, isNew) => {
        // Open -> true if the edit window is meant to open
        //         false is the edit window is meant to close
        // this function will handle the edit of repeating tasks
        // NOTE: need to create a function to handle "asynchronous edits" e.g. ticking the completed box without opening taskedit
        if (date) { // Makes sure that this function isn't run when the toggleEdit function is used to close the taskEdit window
             // this refers to the parent task (if there is one!)
            const t = {...tasks.filter((task) => task.id === id)[0], startDate: date}
            console.log(t)

            if (t.repeat.type !== 'none') {
                // repeated tasks have their "master complete" set to true to enable proper functionality of checkbox in taskedit
                editTask(id, {...t, completed: true})
                setEditedTask({...t, completed: true})
            } else {
                setEditedTask({...t})
            }
            //console.log("Editing this task? " + thisTask)
            //if (thisTask && task.repeat.type !== 'none') {
                // Creates new "non-repeating" version (with no exceptions and new date) of instance of repeating task
                //setTasks(tasks.concat({...task, id: currTaskId, repeat: {type: "none", frequency: 1}, startDate: date, exceptions: []}))
                //setCurrentEditID(currTaskId);
                //setCurrTaskId(currTaskId+1)
                // Sets an exception to the repeating task
                // editTask(id, {...task, exceptions: [...task.exceptions, date]})
                // THIS FUNCTION IS CONFIRMED TO WORK :)
            } //else {
                //editTask(id, {...tasks.filter((task) => task.id === id)[0], startDate: date})
            
                console.log(date)
                console.log(id)
                console.log(currTaskId)
                isNew ? setIsNew(true) : setIsNew(false)
                setCurrentEditID(id);
                setSelectedDate(date);
                setThisTask(thisTask)
            }
    

    return (
        <div
            className="App font-inter w-full flex flex-col items-center mx-auto p-4 h-[100vh] bg-cover bg-center"
            style={{ "background-image": `url(/background.jpg)` }}
        >
            <div className="max-w-[1500px] w-full relative">
                <WeekController day={day} changeDay={changeDay} />
                <div className="flex justify-between pt-5">
                    {[...Array(5)].map((e, i) => {
                        return (
                            <Day
                                setCompleted={setCompleted}
                                setRepeatWarning={setRepeatWarning}
                                addTask={addTask}
                                toggleEdit={toggleEdit}
                                editTask={editTask}
                                tasklist={tasks} // sending full task list
                                name={day
                                    .clone()
                                    .add(-2 + i, "days")
                                    .format("dddd")}
                                tasks={tasks.filter((task) =>
                                    dayMatch(
                                        day.clone().add(-2 + i, "days"),
                                        task
                                    )
                                )}
                                date={day
                                    .clone()
                                    .add(-2 + i, "days")
                                    .format("DD/MM/YYYY")}
                                dateName={day
                                    .clone()
                                    .add(-2 + i, "days")
                                    .format("DD.MM")}
                            />
                        );
                    })}
                </div>
                <div className="absolute w-full flex justify-center top-[50vh] -translate-y-[50%]">
                    {selectedDate && !repeatWarning.show && (
                        <TaskEdit
                            incrementSubTaskCurrId={incrementSubTaskCurrId}
                            toggleEdit={toggleEdit}
                            task={
                                tasks.filter(
                                    (task) => task.id === currentEditID
                                )[0]
                            }
                            tasks={tasks}
                            setTasks={setTasks}
                            editTask={editTask}
                            setCompleted={setCompleted}
                            selectedDate={selectedDate}
                            isNew={isNew}
                            editedTask={editedTask}
                            setEditedTask={setEditedTask}
                            onSave={onSave}
                            setThisTask={setThisTask}
                            setRepeatWarning={setRepeatWarning}
                        />
                    )}
                    <div className="absolute w-full flex justify-center mb-100 -top-20">
                        {repeatWarning.show && <RepeatEditWarning setRepeatWarning={setRepeatWarning} toggleEdit={toggleEdit} repeatWarning={repeatWarning} setThisTask={setThisTask} onSave={onSave} thisTask={thisTask}/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

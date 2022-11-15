import moment from "moment/moment";
import { useState } from "react";
import "./App.css";
import { Day } from "./components/Day";
import { TaskEdit } from "./components/TaskEdit";
import { WeekController } from "./components/WeekController";

function App() {
    const [currTaskId, setCurrTaskId] = useState(2); // currently set to 1 because the current id of the last "test task" is 1
    const [selectedDate, setSelectedDate] = useState(false);
    const [currentEditID, setCurrentEditID] = useState(0);
    const [dayOffset, setDayOffset] = useState(0);
    const day = moment().add(dayOffset, "days");
    const [tasks, setTasks] = useState([
        {
            id: 0,
            dayIdx: 0,
            subTaskCurrId: 2, // currently set to 2 because a new task needs an id of 2
            name: "Finish coding project",
            completed: false,
            subTasks: [
                {
                    id: 0,
                    name: "test 1",
                    completed: false,
                },
                {
                    id: 1,
                    name: "test 2",
                    completed: false,
                },
            ],
            repeat: {
                type: "weekly",
                frequency: 1,
            },
            startDate: "6/11/2022",
            rolledOver: false,
            notes: "",
        },
        {
            id: 1,
            dayIdx: 1,
            name: "Import boilerplate",
            subTaskCurrId: 2, // currently set to 2 because a new task needs an id of 2
            completed: false,
            subTasks: [
                {
                    id: 0,
                    name: "test a1",
                    completed: false,
                },
                {
                    id: 1,
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
                    type: "",
                    frequency: 1,
                },
                startDate: date,
                rolledOver: false,
                notes: "",
            })
        );
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
                    return newTask;
                } else {
                    return task;
                }
            })
        })
    }
    const editSubTasks = (taskId, updatedSubTasks) => {
        setTasks(tasks => {
            return tasks.map((task) => {
                if ((task.id) === taskId){
                    return {...task, subTasks: updatedSubTasks};
                } else {
                    return task;
                }
            })
        })
        console.log(tasks)
        // 'done' is printed but subtask list isn't updating?!?
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
        if (!task.repeat) {
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

    const toggleEdit = (id, date) => {
        // Open -> true if the edit window is meant to open
        //         false is the edit window is meant to close
        setCurrentEditID(id);
        setSelectedDate(date);
    };

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
                                addTask={addTask}
                                toggleEdit={toggleEdit}
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
                    {selectedDate && (
                        <TaskEdit
                            incrementSubTaskCurrId={incrementSubTaskCurrId}
                            toggleEdit={toggleEdit}
                            task={
                                tasks.filter(
                                    (task) => task.id === currentEditID
                                )[0]
                            }
                            editTask={editTask}
                            editSubTasks={editSubTasks}
                            setCompleted={setCompleted}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

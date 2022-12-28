import moment from "moment/moment";
import { useState, useEffect } from "react";
import "./App.css";
import { Day } from "./components/Day";
import { TaskEdit } from "./components/TaskEdit";
import { WeekController } from "./components/WeekController";
import {RepeatEditWarning} from "./components/RepeatEditWarning"
import {DndContext, closestCenter, useDroppable, DragOverlay} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from "./components/Task";
import { db } from "./firebase";
import { onValue, ref, set } from "firebase/database";

function App(props) {
    const [currTaskId, setCurrTaskId] = useState(2); // currently set to 4 because the next task will have an id of 4
    const [selectedDate, setSelectedDate] = useState(false); // logs the date of the task that is being edited by taskedit
    const [currentEditID, setCurrentEditID] = useState(0);
    const [dayOffset, setDayOffset] = useState(0);
    const [thisTask, setThisTask] = useState(true);
    const day = moment().add(dayOffset, "days");
    const [activeId, setActiveId] = useState(null)
    const [isNew, setIsNew] = useState(false); // tells taskedit if current task is a new task (on cancel will delete new task)
    const {setNodeRef} = useDroppable({
    id: "someday",
    });
    const [editedTask, setEditedTask] = useState({
        startDate: ""
    })
    function handleDragStart(event) {
    
  }
    const [repeatWarning, setRepeatWarning] = useState({
        show: false,
        id: 0,
        date: ""
    })
    const [tasks, setTasks] = useState([
        // {
        //     id: 1,
        //     dayIdx: 0,
        //     subTaskCurrId: 3, // currently set to 2 because a new task needs an id of 2
        //     name: "Finish coding project",
        //     completed: false,
        //     subTasks: [
        //         {
        //             id: 1, // id of first element must be 1 for drag and drop to work
        //             name: "test 1",
        //             completed: false,
        //         },
        //         {
        //             id: 2,
        //             name: "test 2",
        //             completed: false,
        //         },
        //     ],
        //     repeat: {
        //         type: "daily",
        //         frequency: 2,
        //     },
        //     startDate: "20/11/2022",
        //     rolledOver: false,
        //     notes: "",
        //     exceptions: [],
        //     completions: ["18/11/2022"], // Gives the date of repeating tasks that have been completed
        // },
        // {
        //     id: 2,
        //     dayIdx: 1,
        //     name: "Import boilerplate",
        //     subTaskCurrId: 3, // currently set to 2 because a new task needs an id of 2
        //     completed: false,
        //     subTasks: [
        //         {
        //             id: 1,
        //             name: "test a1",
        //             completed: false,
        //         },
        //         {
        //             id: 2,
        //             name: "test a2",
        //             completed: false,
        //         },
        //     ],
        //     startDate: "10/11/2022",
        //     repeat: {
        //         type: "weekly",
        //         frequency: 1,
        //     },
        //     rolledOver: false,
        //     notes: "testing :)",
        //     exceptions: [],
        //     completions: [],
        // },
        // {
        //     id: 3,
        //     dayIdx: 1,
        //     name: "Test non-repeat",
        //     subTaskCurrId: 3, // currently set to 2 because a new task needs an id of 2
        //     completed: false,
        //     subTasks: [
        //         {
        //             id: 1,
        //             name: "test a1",
        //             completed: false,
        //         },
        //         {
        //             id: 2,
        //             name: "test a2",
        //             completed: false,
        //         },
        //     ],
        //     startDate: "",
        //     repeat: {
        //         type: "none", // changed this to signify no repeats - easier to implement taskedit!
        //         frequency: 1,
        //     },
        //     rolledOver: false,
        //     notes: "this is a test non-repeating task",
        //     exceptions: [],
        //     completions: [],
        // },
    ]);

    const [dataRetrieved, setDataRetrieved] = useState(false);

    useEffect(() => {
  const timer = setInterval(() => {
    rollAllTasks()
  }, 600000);
  return () => clearInterval(timer);
}, []);

    useEffect(() => {
        if (dataRetrieved) {
            writeToFirebase();
        }
    }, [tasks, currTaskId]);

    const writeToFirebase = () => {
        console.log(tasks)
        const query = ref(db, props.user.uid);
        set(query, {tasks, currTaskId});
    }

    useEffect(() => {
        console.log(props.user.uid);
        const query = ref(db, props.user.uid);
        setDataRetrieved(true);
        return onValue(query, (snapshot) => {
            const data = snapshot.val();


            if (snapshot.exists()) {
                console.log("DATA >>> ", data);
                const template = { completions: [], exceptions: [], subTasks: []};
                setTasks(data.tasks ? data.tasks.map((task) => { return { ...template, ...task }}) : []);
                setCurrTaskId(data.currTaskId ? data.currTaskId : 1);
            }
        });
    }, []);

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
        toggleEdit(currTaskId, date, false, true, {
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
        if(!dataRetrieved || (selectedDate && !repeatWarning.show)) {
            console.log("fail")
            return;
        }
        console.log("roll")
        setTasks(
            tasks.flatMap((task) => {
                if (task.repeat.type === 'none') {
                    if(!task.completed && moment(task.startDate, "DD/MM/YYYY").isBefore(moment(), "day")) {
                        return {...task, startDate: moment().format("DD/MM/YYYY")}
                    } else {
                        return {...task}
                    }
                } else { //currently roll-over doesn't apply to repeating tasks
                    let prevdate = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY");
                    let diff = moment(task.startDate, "DD/MM/YYYY").diff(moment(), 'days')
                    if (task.repeat.type === "daily") {
                        diff = -((diff%(task.repeat.frequency)-(task.repeat.frequency))%(task.repeat.frequency))
                        prevdate.subtract(diff, 'days')
                    } else if (task.repeat.type === "weekly") {
                        diff = -((diff%(task.repeat.frequency * 7)-(task.repeat.frequency*7))%(task.repeat.frequency*7))
                        prevdate.subtract(diff, 'days')
                    } else if (task.repeat.type === "yearly") {
                        let datethisyear = moment(moment(task.startDate, "DD/MM/YYYY").format("DD/MM") + "/" + moment().format("YYYY"), "DD/MM/YYYY");
                        if (datethisyear.isBefore(moment(), 'day')) {
                            prevdate = datethisyear
                        } else {
                            prevdate = datethisyear.subtract(1, 'years')
                        }
                    }
                    console.log(diff)
                    prevdate = prevdate.format("DD/MM/YYYY")
                    console.log(prevdate)
                    if (task.exceptions.includes(prevdate) || task.completions.includes(prevdate)) {
                        return {...task}
                    } else {
                        setCurrTaskId(currTaskId+1)
                        return [{...task, exceptions: task.exceptions.concat(prevdate)}, {...task, startDate: moment().format("DD/MM/YYYY"), id: currTaskId-1, completed: false, repeat: {type: "none", frequency: 1}, exceptions: [], completions: []}]
                    }
                    // const upperbound = moment()
                    // let lowerbound = 0
                    // // const taskdate = moment(task.startDate, "DD/MM/YYYY")
                    // if (task.repeat.type === "daily") {
                    //     lowerbound = moment().subtract(task.repeat.frequency, 'd')
                    // } else if (task.repeat.type === "weekly") {
                    //     lowerbound = moment().subtract(task.repeat.frequency, 'w')
                    // } else if (task.repeat.type === "yearly") {
                    //     lowerbound = moment().subtract(task.repeat.frequency, 'y')
                    // }
                    // lowerbound.subtract(1,'d')
                    // let toberolled = true
                    // task.exceptions.forEach((exc) => {
                    //     if (exc.isBetween(lowerbound, upperbound)) {
                    //         toberolled = false
                    //     }
                    // })
                    // task.completions.forEach((exc) => {
                    //     if (exc.isBetween(lowerbound, upperbound)) {
                    //         toberolled = false
                    //     }
                    // })
                    // if (toberolled) {
                    //     return {...task, exceptions: task.exceptions.concat(moment().format("DD/MM/YYYY"))}
                    // } else {
                    //     return {...task, }
                    // }
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
            setTasks(tasks.concat({...editedTask, id: currTaskId, completed: editedTask.completions.includes(editedTask.startDate), repeat: {type: "none", frequency: 1}, exceptions: [], completions: []}))
            setCurrTaskId(currTaskId+1)
            //Creates exception
            const task = tasks.filter((task) => task.id === currentEditID)[0]
            const comp = editedTask.completions.filter((day) => day !== editedTask.startDate)
            console.log(comp)
            editTask(currentEditID, {...task, completions: comp, exceptions: [...task.exceptions, selectedDate]})
        } else {
            //Edit completions to shift if startDate changes
            const task = tasks.filter((task) => task.id === currentEditID)[0]
            const start = moment(task.startDate, "DD/MM/YYYY")
            const difference = start.diff(moment(editedTask.startDate, "DD/MM/YYYY"), "days", true)
            let array = editedTask.completions.map((day) => {
                return moment(day, "DD/MM/YYYY").add(-difference, 'days').format("DD/MM/YYYY");
            })
            let earray = editedTask.exceptions.map((day) => {
                return moment(day, "DD/MM/YYYY").add(-difference, 'days').format("DD/MM/YYYY");
            })
            // Clears completions/exceptions if the repeat type/frequency has been modified
            if(task.repeat.type !== editedTask.repeat.type || task.repeat.frequency !== editedTask.repeat.frequency) {
                console.log("change")
                array = []
                earray = []
            }
            if(editedTask.repeat.type === 'none') {
                editTask(currentEditID, {...editedTask, completions: [], exceptions: []})
            } else {
                editTask(currentEditID, {...editedTask, completions: array, exceptions: earray})
            }
        }
        toggleEdit(0, false, false) //closes the edit box :)
    }

    const toggleEdit = (id, date, thisTask, isNew, newTask) => {
        // Open -> true if the edit window is meant to open
        //         false is the edit window is meant to close
        // this function will handle the edit of repeating tasks
        // NOTE: need to create a function to handle "asynchronous edits" e.g. ticking the completed box without opening taskedit
        if (date) { // Makes sure that this function isn't run when the toggleEdit function is used to close the taskEdit window
             // this refers to the parent task (if there is one!)
            let t = {}
            if (newTask) {
                t = {...newTask}
            } else {
                t = {...tasks.filter((task) => task.id === id)[0], startDate: date} 
            }
            console.log(t)
            console.log(id)
            
            if (t.repeat.type !== 'none') {
                // repeated tasks have their "master complete" set to true to enable proper functionality of checkbox in taskedit
                editTask(id, {...t, completed: true})
                setEditedTask({...t, completed: true})
            } else {
                setEditedTask({...t})
            }
            console.log(date)
            console.log(id)
            console.log(currTaskId)
            isNew ? setIsNew(true) : setIsNew(false)
            setCurrentEditID(id);
            setSelectedDate(date);
            setThisTask(thisTask)
            //console.log("Editing this task? " + thisTask)
            //if (thisTask && task.repeat.type !== 'none') {
                // Creates new "non-repeating" version (with no exceptions and new date) of instance of repeating task
                //setTasks(tasks.concat({...task, id: currTaskId, repeat: {type: "none", frequency: 1}, startDate: date, exceptions: []}))
                //setCurrentEditID(currTaskId);
                //setCurrTaskId(currTaskId+1)
                // Sets an exception to the repeating task
                // editTask(id, {...task, exceptions: [...task.exceptions, date]})
                // THIS FUNCTION IS CONFIRMED TO WORK :)
        } else if (id !== 0) {
            let t = {}
            if (newTask) {
                t = {...newTask}
            } else {
                t = {...tasks.filter((task) => task.id === id)[0]} 
            }
            console.log(t)
            console.log(id)
            
            if (t.repeat.type !== 'none') {
                // repeated tasks have their "master complete" set to true to enable proper functionality of checkbox in taskedit
                editTask(id, {...t, completed: true})
                setEditedTask({...t, completed: true})
            } else {
                setEditedTask({...t})
            }
            console.log(date)
            console.log(id)
            console.log(currTaskId)
            isNew ? setIsNew(true) : setIsNew(false)
            setCurrentEditID(id);
            setSelectedDate(-1);
            setThisTask(thisTask)
        } else {
            console.log(date)
            console.log(id)
            console.log(currTaskId)
            isNew ? setIsNew(true) : setIsNew(false)
            setCurrentEditID(id);
            setSelectedDate(date);
            setThisTask(thisTask)

        }
            
            //else {
                //editTask(id, {...tasks.filter((task) => task.id === id)[0], startDate: date})
            
            }
    
    const handleDragEnd = (event) => {
    const{active, over} = event;
    const activeIndex = (tasks.findIndex(item => item.id === active.id))
    const overIndex = (tasks.findIndex(item => item.id === over.id))
    if(active.id !== over.id) {
      setTasks((items)=>{
        return arrayMove(items, activeIndex, overIndex)
      })
    }
    setActiveId(null);
  }
 
  const handleDragOver = (event) => {
    setActiveId(event.active.id)
    const {active, over} = event;
    console.log(active.id + " - " + over.id)
    const activeItem = (tasks.filter(item => item.id === active.id)[0])
    const overItem = (tasks.filter(item => item.id === over.id)[0])
    if(overItem) { // checks if item is dragged over another item or a new list!
        if(activeItem.startDate !== overItem.startDate) {
          setTasks(tasks.map(item => {
            if (item.id === active.id) {
              return {...activeItem, startDate: overItem.startDate}
            }
            return item
          }))
        }
    } else {
        if (over.id !== "someday" && activeItem.startDate !== over.id) {
            setTasks(tasks.map(item => {
            if (item.id === active.id) {
              return {...activeItem, startDate: over.id}
            }
            return item
          }))
        } else {
            setTasks(tasks.map(item => {
            if (item.id === active.id) {
              return {...activeItem, startDate: ""}
            }
            return item
          }))
        }
    }
  }


    return (
        <div
            className="App font-inter w-full flex flex-col items-center mx-auto p-4 h-[100vh] bg-cover bg-[#EFEFEF] bg-center"
            // style={{ "background-image": `url(/background.jpg)` }}
        >
            {/* <button onClick={rollAllTasks}>ROLLLLLLLLL</button> */}
            <DndContext onDragStart={handleDragStart} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
            <div className="max-w-[1500px] w-full relative h-full flex flex-col">
                <WeekController day={day} changeDay={changeDay} />
                <div className="flex justify-between pt-5 flex-1">
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
                                activeId={activeId}
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
                    <DragOverlay>
                    {activeId ? (
                     <Task overlay={true} key={activeId} iid={activeId} {...tasks.filter(task => task.id === activeId)[0]}/>
                          ): null}
                    </DragOverlay>  
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
            {/* <div className="flex w-full">
                <div className="rounded-xl glassless w-[19.5%] p-3 my-4" ref={setNodeRef}>
                <div className="text-xl pb-2 mb-2 font-semibold border-b border-gray-500 flex justify-between cursor-default select-none">
                    <div className="">
                        Someday
                    </div>
                </div>
                <div className="min-h-[30vh] flex flex-col">
                    <SortableContext items={tasks} strategy={verticalListSortingStrategy} id={"someday"}>
                        {tasks.filter(task => !task.startDate).map((task) => {return <Task activeId={activeId} overlay={false} key={task.id} iid={task.id} setCompleted={setCompleted} setRepeatWarning={setRepeatWarning} toggleEdit={toggleEdit} editTask={editTask} tasks={tasks} {...task}/>})}
                    </SortableContext>
                        
                        <div className={`flex px-2 py-1 transition-opacity ease-in-out duration-300 hover:opacity-100 opacity-0`}>
                        <div className="cursor-pointer" onClick={() => addTask("")}>New Task</div>
                    </div>
                </div>
            </div>
        </div> */}
        </DndContext>
        </div>
    );
}

export default App;

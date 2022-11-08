import moment from 'moment/moment';
import { useState } from 'react';
import './App.css';
import { Day } from './components/Day';
import { TaskEdit } from './components/TaskEdit';
import { WeekController } from './components/WeekController';

function App() {
    const [dayOffset, setDayOffset] = useState(0);
    const day = moment().add(dayOffset, 'days');
    const [tasks, setTasks] = useState([
        {
            id: 0,
            dayIdx: 0,
            name: "Finish coding project",
            completed: false,
            subTasks: [],
            startDate: "10/11/2022",
            rolledOver: false,
        },
        {
            id: 1,
            dayIdx: 1,
            name: "Import boilerplate",
            completed: true,
            startDate: "10/11/2022",
            repeat: {
                type: "yearly",
                frequency: 1
            },
            rolledOver: false
        }
    ]);

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

    const dayMatch = (date, task) => {
        const daysBetween = (Math.floor(date.diff(moment(task.startDate, "DD/MM/YYYY"), 'days', true)) )
        if (!task.repeat){
            return daysBetween === 0;
        } else {
            if (task.repeat.type === "daily"){
                return daysBetween % task.repeat.frequency === 0;
            } else if (task.repeat.type === "weekly"){
                return daysBetween % (7*task.repeat.frequency) === 0;
            } else if (task.repeat.type === "yearly"){
                return (date.format("DDMM") === moment(task.startDate, "DD/MM/YYYY").format("DDMM"));
            }
        }
    }

    const changeDay = (amount) => {
        console.log(day.add(amount, 'days'), amount);
        //setDay((day) => day.add(amount, 'days'));
        setDayOffset((currentDayOffset) => currentDayOffset + amount);
    }

    return (
        <div className="App font-inter w-full flex flex-col items-center mx-auto p-4 h-[100vh] bg-cover bg-center"
            style={{"background-image": `url(/background.jpg)`}}>
            <div className="max-w-[1500px] w-full relative">
                <WeekController day={day} changeDay={changeDay}/>
                <div className="flex justify-between pt-5">
                    {[...Array(5)].map((e, i) => { return ( <Day setCompleted={setCompleted} name={day.clone().add(-2+i, 'days').format("dddd")} tasks={tasks.filter((task) => dayMatch(day.clone().add(-2+i, 'days'), task))} date={day.clone().add(-2+i, 'days').format("DD.MM")}/> ) })}
                </div>
                <div className="absolute w-full flex justify-center top-[50vh] -translate-y-[50%]">
                </div>
            </div>
        </div>
    );
}

export default App;

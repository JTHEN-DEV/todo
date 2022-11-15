import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import { useEffect, useState } from "react";
export const DatePicker = (props) => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const [selectedYear, setSelectedYear] = useState(props.year)
    const [selectedMonth, setSelectedMonth] = useState(props.month)
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
    const numExtraDays = new Date(prevYear, prevMonth).getDay() - 1;
    const numExtraAfterDays =
        7 - new Date(prevYear, prevMonth, daysInMonth).getDay();
    const days = [];
    const selectedDays = [2, 8, 10, 24, 27];
    const dayEffect = []; // "selected", "grey", ""
    for (let i = 0; i < numExtraDays; i++) {
        days.push(i - numExtraDays + daysInPrevMonth + 1);
        dayEffect.push("grey");
    }
    for (let i = 0; i < daysInMonth; i++) {
        days.push(i + 1);
        dayEffect.push(selectedDays.includes(i + 1) ? "selected" : "");
    }
    for (let i = 0; i < numExtraAfterDays; i++) {
        days.push(i + 1);
        dayEffect.push("grey");
    }
    const numRows = days.length / 7;
    console.log(numRows);
    const day = [];
    for (let i = 0; i < numRows; i++) {
        let temp = [];
        for (let a = 0; a < 7; a++) {
            temp.push([days[i * 7 + a], dayEffect[i * 7 + a]]);
        }
        day.push(temp);
    }

    const incMonth = (value /* either 1 or -1 */) => {
        if (selectedMonth+value === 0) {
            setSelectedYear(selectedYear-1)
            setSelectedMonth(12)
        } else if (selectedMonth+value === 13) {
            setSelectedYear(selectedYear+1)
            setSelectedMonth(1)
        } else {
            setSelectedMonth(selectedMonth+value)
        }
    }

    const dateClicked = (days) => {
        if (days[1] !== 'grey') {
            props.setShowDatePicker(false)
            props.setEditedTask({...props.editedTask, startDate: days[0] + "/" + selectedMonth + "/" + selectedYear})
        }
    }

    return (
        <div className="scale-75 glassless text-sm text-center rounded-2xl mb-5 p-2 px-3">
            <h1 className="text-lg flex justify-between">
                <FaChevronLeft className="mt-1 ml-1 cursor-pointer text-gray-500 hover:text-gray-800" onClick={()=>incMonth(-1)}/>
                <div className="font-bold">{`${
                months[selectedMonth - 1]
            } ${selectedYear}`}</div>
                <FaChevronRight className="mt-1 mr-1 cursor-pointer text-gray-500 hover:text-gray-800" onClick={()=>incMonth(1)}/>
            </h1>
            <div className="flex flex-row font-semibold items-center justify-center cursor-default">
                <div className="flex-1 square">M</div>
                <div className="flex-1 square">T</div>
                <div className="flex-1 square">W</div>
                <div className="flex-1 square">T</div>
                <div className="flex-1 square">F</div>
                <div className="flex-1 square">S</div>
                <div className="flex-1 square">S</div>
            </div>
            {/* {(numRows) => {
                for (let i = 0; i < numRows; i++) {
                    return (
                        <div className="flex flex-row">
                            <div className="flex-1">{days[i * 7]}</div>
                            <div className="flex-1">{days[i * 7 + 1]}</div>
                            <div className="flex-1">{days[i * 7 + 2]}</div>
                            <div className="flex-1">{days[i * 7 + 3]}</div>
                            <div className="flex-1">{days[i * 7 + 4]}</div>
                            <div className="flex-1">{days[i * 7 + 5]}</div>
                            <div className="flex-1">{days[i * 7 + 6]}</div>
                        </div>
                    );
                }
            }} */}
            {day.map((days) => (
                <div className="flex flex-row">
                    <div className={`flex-1 square my-0.5 px-0.5 mx-0.5  ${days[0][1] === 'grey' ? "text-gray-500 cursor-default" : "text-black glassless rounded-lg cursor-pointer hover:bg-white/80"} `} onClick={() => dateClicked(days[0])}>
                        {days[0][0]}
                    </div>
                    <div className={`flex-1 square my-0.5 px-0.5 mx-0.5  ${days[1][1] === 'grey' ? "text-gray-500 cursor-default" : "text-black glassless rounded-lg cursor-pointer hover:bg-white/80"} `} onClick={() => dateClicked(days[1])}>
                        {days[1][0]}
                    </div>
                    <div className={`flex-1 square my-0.5 px-0.5 mx-0.5  ${days[2][1] === 'grey' ? "text-gray-500 cursor-default" : "text-black glassless rounded-lg cursor-pointer hover:bg-white/80"} `} onClick={() => dateClicked(days[2])}>
                        {days[2][0]}
                    </div>
                    <div className={`flex-1 square my-0.5 px-0.5 mx-0.5  ${days[3][1] === 'grey' ? "text-gray-500 cursor-default" : "text-black glassless rounded-lg cursor-pointer hover:bg-white/80"} `} onClick={() => dateClicked(days[3])}>
                        {days[3][0]}
                    </div>
                    <div className={`flex-1 square my-0.5 px-0.5 mx-0.5  ${days[4][1] === 'grey' ? "text-gray-500 cursor-default" : "text-black glassless rounded-lg cursor-pointer hover:bg-white/80"} `} onClick={() => dateClicked(days[4])}>
                        {days[4][0]}
                    </div>
                    <div className={`flex-1 square my-0.5 px-0.5 mx-0.5  ${days[5][1] === 'grey' ? "text-gray-500 cursor-default" : "text-black glassless rounded-lg cursor-pointer hover:bg-white/80"} `} onClick={() => dateClicked(days[5])}>
                        {days[5][0]}
                    </div>
                    <div className={`flex-1 square my-0.5 px-0.5 mx-0.5  ${days[6][1] === 'grey' ? "text-gray-500 cursor-default" : "text-black glassless rounded-lg cursor-pointer hover:bg-white/80"} `} onClick={() => dateClicked(days[6])}>
                        {days[6][0]}
                    </div>
                </div>
            ))}
        </div>
    );
};


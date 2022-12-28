import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';

export const WeekController = (props) => {

    const increaseDay = () => {
        props.changeDay(1);
    } 

    const decreaseDay = () => {
        props.changeDay(-1);
    }

    return (
        <div className="rounded-xl flex justify-between w-full px-2 pt-1 items-center cursor-default select-none">
            <FaChevronLeft style={{fontSize: "1.5rem", fontWeight: "semibold"}} className="cursor-pointer text-gray-500 hover:text-gray-800" onClick={decreaseDay} />
            <div>
                <div className="font-bold text-2xl">{props.day.clone().subtract(2, 'days').format("DD MMM YY")} - {props.day.clone().add(2, 'days').format("DD MMM YY")}</div>
            </div>
            <FaChevronRight style={{fontSize: "1.5rem", fontWeight: "semibold"}} className="cursor-pointer text-gray-500 hover:text-gray-800" onClick={increaseDay} />
        </div>
    )
}

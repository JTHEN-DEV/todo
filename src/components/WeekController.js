import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';

export const WeekController = (props) => {

    const increaseDay = () => {
        props.changeDay(1);
    } 

    const decreaseDay = () => {
        props.changeDay(-1);
    }

    return (
        <div className="bg-gray-200 rounded-xl flex justify-between w-full p-4 items-center glassless">
            <FaChevronLeft style={{fontSize: "2rem", fontWeight: "bold"}} className="cursor-pointer" onClick={decreaseDay} />
            <div>
                <div className="font-bold text-3xl"><span>{props.day.format("YYYY")}</span> Week 42/43</div>
                <div className="font-semibold text-xl text-gray-400">{props.day.clone().subtract(2, 'days').format("DD MMM")} - {props.day.clone().add(2, 'days').format("DD MMM")}</div>
            </div>
            <FaChevronRight style={{fontSize: "2rem", fontWeight: "bold"}} className="cursor-pointer" onClick={increaseDay} />
        </div>
    )
}

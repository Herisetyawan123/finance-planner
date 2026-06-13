import Card from ".";
import { fmtShort } from "../../utils/global";
import MiniAreaChart from "../charts/mini-area-chart";

export default function SummaryCard({title,value,trend,color,icon,mini}) {
    return (
    <Card className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {title}
        </span>
        <span className="text-lg">
            {icon}
        </span>
        </div>
        <div className="text-xl font-bold" style={{color}}>
            {fmtShort(value)}
        </div>
        {mini && <MiniAreaChart data={mini} color={color}/>}
        {trend && <span className="text-xs text-emerald-600 dark:text-emerald-400">{trend}</span>}
    </Card>
    );
}
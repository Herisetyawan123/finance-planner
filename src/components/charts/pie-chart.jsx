import React from 'react'

export default function PieChart({
    data
}) {
    const total = data.reduce((s,d)=>s+d.value,0);
    const colors=[
        "#10b981",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#f97316",
        "#84cc16"
    ];
    let angle = -Math.PI/2;
    const slices = data.map((d,i)=>{
        const a = (d.value/total)*2*Math.PI;
        const x1 = 80+70*Math.cos(angle); const y1=80+70*Math.sin(angle);
        angle+=a;
        const x2 = 80+70*Math.cos(angle); const y2=80+70*Math.sin(angle);
        const large = a>Math.PI?1:0;
        const path = `M80,80 L${x1.toFixed(1)},${y1.toFixed(1)} A70,70 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
        return {path,color:colors[i%colors.length],label:d.label,value:d.value,pct:((d.value/total)*100).toFixed(1)};
    });
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
        <svg viewBox="0 0 160 160" className="w-40 h-40 flex-shrink-0">
            {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2"/>)}
        </svg>
        <div className="flex flex-col gap-1 w-full">
            {slices.map((s,i)=>(
            <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{background:s.color}}/>
                <span className="text-gray-600 dark:text-gray-400 flex-1 truncate">{s.label}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{s.pct}%</span>
            </div>
            ))}
        </div>
        </div>
    );
}

import React from 'react'


const BarChart = ({data, color="#10b981"}) => {
  const max = Math.max(...data.map(d=>d.value)); const h=100; const barW=24; const gap=8;
  const total = data.length*(barW+gap);
  return (
    <svg viewBox={`0 0 ${total+20} ${h+30}`} className="w-full" style={{height:130}}>
      {data.map((d,i)=>{
        const bh = max>0?(d.value/max)*h:0;
        const x = 10+i*(barW+gap);
        return (
          <g key={i}>
            <rect x={x} y={h-bh} width={barW} height={bh} rx="4" fill={color} opacity="0.85"/>
            <text x={x+barW/2} y={h+15} textAnchor="middle" fontSize="9" fill="#6b7280">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

export default BarChart;

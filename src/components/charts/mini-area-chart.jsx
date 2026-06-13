import React from 'react'

const MiniAreaChart = ({data, color="#10b981"}) => {
  const max = Math.max(...data); const min = Math.min(...data);
  const w=200; const h=48;
  const pts = data.map((v,i)=>({
    x: (i/(data.length-1))*(w-4)+2,
    y: h-4-((v-min)/(max-min||1))*(h-8)
  }));
  const path = pts.map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  // const fill = [...pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`), `${pts[pts.length-1].x.toFixed(1)},${h}`, `2,${h}`].join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
      {/* <polygon points={fill} fill={color} opacity="0.15"/> */}
      <polyline points={pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

export default MiniAreaChart;

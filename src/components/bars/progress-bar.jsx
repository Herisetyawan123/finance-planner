import "react";

const ProgressBar = ({value, color="#10b981", className=""}) => (
  <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
    <div className="h-2 rounded-full transition-all duration-700" style={{width:`${Math.min(100,value)}%`, background:color}}/>
  </div>
);

export default ProgressBar;
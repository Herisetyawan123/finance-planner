import React from 'react'

const Badge = ({label, color="emerald"}) => {
  const colors = {
    emerald:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    red:"bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    yellow:"bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    blue:"bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    gray:"bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[color]||colors.gray}`}>{label}</span>;

}

export default Badge

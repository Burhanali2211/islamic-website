import React from 'react';
import { motion } from 'framer-motion';

interface Column<T> {
  accessor: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T extends { id: string }>({ columns, data }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto glass-card p-4 rounded-3xl">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((col, index) => (
              <th key={index} className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-4 text-gray-800 dark:text-gray-200">
                  {col.render ? col.render(item) : (item[col.accessor as keyof T] as React.ReactNode)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

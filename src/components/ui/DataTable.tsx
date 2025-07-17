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
  if (data.length === 0) {
    return (
      <div className="glass-card p-12 rounded-3xl text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Available</h3>
        <p className="text-gray-500 dark:text-gray-400">There are no records to display at this time.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden glass-card rounded-3xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-b border-emerald-200 dark:border-emerald-800">
              {columns.map((col, index) => (
                <th key={index} className="p-4 text-sm font-semibold text-emerald-800 dark:text-emerald-200 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, rowIndex) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.05, duration: 0.3 }}
                className="group hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-blue-50/50 dark:hover:from-emerald-900/10 dark:hover:to-blue-900/10 transition-all duration-300 cursor-pointer"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4 text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                    {col.render ? col.render(item) : (item[col.accessor as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

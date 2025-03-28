// src/components/Preview.jsx
import React from "react";

/**
 * Componente que muestra una tabla con los datos del archivo Excel.
 * @param {Array} data - Matriz bidimensional (Array<Array<any>>) con los datos a mostrar.
 */
export default function Preview({ data }) {
  if (!data) return null; // si no hay datos, no renderizamos nada

  return (
    <div className="mt-3 w-full max-h-[60vh] overflow-auto border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm">
      <table className="w-full border-collapse table-auto">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            {data[0].map((cell, index) => (
              <th
                key={index}
                className="whitespace-nowrap border border-gray-300 p-2 text-center font-semibold"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {data[0].map((_, cellIndex) => (
                <td
                  key={cellIndex}
                  className="whitespace-nowrap border border-gray-300 p-2 text-center"
                >
                  {row[cellIndex] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

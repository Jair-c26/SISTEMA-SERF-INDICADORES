import React from 'react';

const FilePreviewTable = ({ data }) => (
    <div className="mt-3 max-h-[600px] max-w-full overflow-y-auto overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full border-collapse table-auto">
            <thead>
                <tr>
                    {data[0].map((cell, index) => (
                        <th
                            key={index}
                            className="p-2 border border-gray-300 text-center whitespace-nowrap"
                        >
                            {cell}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {data[0].map((_, cellIndex) => (
                            <td
                                key={cellIndex}
                                className="p-2 border border-gray-300 text-center whitespace-nowrap"
                            >
                                {row[cellIndex] || ''}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default FilePreviewTable;

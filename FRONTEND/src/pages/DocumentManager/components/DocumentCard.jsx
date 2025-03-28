import React from 'react';
import folderSVG from '../../../assets/icons/folder.svg';

const DocumentCard = ({ file_name, file_code, file_quantity, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="flex flex-col items-center gap-1 rounded-xl bg-white p-6 shadow-lg min-w-[200px] cursor-pointer hover:shadow-xl transition-shadow"
        >
            <img 
                src={folderSVG} 
                alt="Folder icon" 
                className="w-14 h-14 mb-2"
            />
            <h3 className="text-lg font-semibold">{file_name}</h3>
            <p className="text-sm text-gray-600">Code: {file_code}</p>
            <p className="text-sm text-gray-600">
                Files: {file_quantity || 0}
            </p>
        </div>
    );
};

export default DocumentCard;
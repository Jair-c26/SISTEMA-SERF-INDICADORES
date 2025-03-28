import React from 'react';
import Documentfolders from './components/Documentfolders';

const DocumentManager = () => {
    return (
        <div className="flex flex-col gap-2 transition-all ease-in-out text-start">
            <h1 className="text-base font-semibold">
                GESTOR DE DOCUMENTOS
            </h1>

            {/* Contenedor para "GESTOR DE CARPETAS" */}
            <div className="border-2 border-[#152B52] rounded-xl p-4 bg-[#e3f2fd]">
                <h2 className="text-sm font-medium">
                    GESTOR DE CARPETAS
                </h2>
                <p className="text-xs text-gray-600">
                    En este módulo, los usuarios pueden crear carpetas para organizar sus archivos. Dentro de cada carpeta, es posible agregar y gestionar archivos Excel, facilitando la clasificación y el acceso rápido a la información almacenada.
                </p>
            </div>

            {/* Mostrar las carpetas de documentos */}
            <Documentfolders />
        </div>
    );
};

export default DocumentManager;

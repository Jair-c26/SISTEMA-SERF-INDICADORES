import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './OptionListCard.css';

const OptionListCard = ({
    icon,
    primaryText = "x",
    checkboxItems,
    secondaryText = "x",
    necessaryValue = "x",
    onChange,
}) => {
    const [open, setOpen] = useState(false); // Control del despliegue de las opciones
    const [checked, setChecked] = useState(null); // Estado para manejar la casilla seleccionada

    const handleClick = useCallback(() => {
        setOpen((prevState) => !prevState); // Alternar visibilidad
    }, []);

    const handleToggle = useCallback((value) => {
        setChecked((prevChecked) => (prevChecked === value ? null : value)); // Alternar la selección de las casillas
        onChange(value); // Llamar la función onChange
    }, [onChange]);

    const renderedCheckboxItems = useMemo(() => {
        return checkboxItems.map((item, index) => (
            <div key={item.value} className="py-1 px-4">
                <div onClick={() => handleToggle(item.value)} className="flex items-center">
                    <input
                        type="checkbox"
                        checked={checked === item.value}
                        onChange={() => {}}
                        className="mr-2"
                        aria-labelledby={`checkbox-list-label-${index}`}
                    />
                    <label
                        id={`checkbox-list-label-${index}`}
                        className="font-teko text-sm text-gray-700"
                    >
                        {item.text || `Item ${index + 1}`}
                    </label>
                </div>
            </div>
        ));
    }, [checkboxItems, checked, handleToggle]);

    return (
        <div className="w-full bg-white shadow-md rounded-lg my-2">
            <div onClick={handleClick} className="flex items-center p-3 cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center">
                    <img src={icon} alt="Icono" className="option-icon w-full h-full object-contain" />
                </div>
                <div className="flex flex-col ml-3 items-start space-y-0.5">
                    <p className="font-teko text-lg">{primaryText}</p>
                    <p className="text-gray-500 text-sm">{secondaryText}</p>
                    <p className="text-gray-500 text-sm">Cantidad: {necessaryValue}</p>
                </div>
            </div>
            {open && (
                <div className="bg-gray-100">
                    {renderedCheckboxItems}
                </div>
            )}
        </div>
    );
};

OptionListCard.propTypes = {
    icon: PropTypes.string.isRequired,
    primaryText: PropTypes.string,
    checkboxItems: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.any.isRequired,
            text: PropTypes.string,
        })
    ).isRequired,
    secondaryText: PropTypes.string,
    necessaryValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default OptionListCard;

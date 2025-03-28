import React from "react";
import PropTypes from "prop-types";

const FunctionCCD = ({ data }) => {
  const calculateDifference = (mes1, mes2) => mes2 - mes1;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th rowSpan="2" className="border border-gray-300 p-2 text-center bg-[#152B52] text-white">
              DELITOS
            </th>
            <th colSpan="2" className="border border-gray-300 p-2 text-center bg-[#152B52] text-white">
              CASOS
            </th>
            <th rowSpan="2" className="border border-gray-300 p-2 text-center bg-[#152B52] text-white">
              INCREMENTO
            </th>
          </tr>
          <tr>
            <th className="border border-gray-300 p-2 text-center bg-[#152B52] text-white">
              MES 1
            </th>
            <th className="border border-gray-300 p-2 text-center bg-[#152B52] text-white">
              MES 2
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ textAlign: "left"}} className="border border-gray-300 p-2">
                {item.delito}
              </td>
              <td className="border border-gray-300 p-2">
                {item.cantidad_mes1}
              </td>
              <td className="border border-gray-300 p-2">
                {item.cantidad_mes2}
              </td>
              <td className="border border-gray-300 p-2">
                {calculateDifference(item.cantidad_mes1, item.cantidad_mes2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border border-gray-300 p-2 bg-[#DCE6F1]">
              TOTAL
            </td>
            <td className="border border-gray-300 p-2">
              {data.reduce((total, item) => total + item.cantidad_mes1, 0)}
            </td>
            <td className="border border-gray-300 p-2">
              {data.reduce((total, item) => total + item.cantidad_mes2, 0)}
            </td>
            <td className="border border-gray-300 p-2">
              {data.reduce((total, item) => total + calculateDifference(item.cantidad_mes1, item.cantidad_mes2), 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

FunctionCCD.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      delito: PropTypes.string.isRequired,
      cantidad_mes1: PropTypes.number.isRequired,
      cantidad_mes2: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default FunctionCCD;

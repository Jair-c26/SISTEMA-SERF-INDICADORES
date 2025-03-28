import React from "react";

const TaxInformationTable = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full border-collapse border rounded-lg border-gray-300">
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="border border-gray-300 p-2 text-center bg-[#152B52] text-white"
            >
              Año
            </th>
            <th
              rowSpan={2}
              className="border border-gray-300 p-2 text-center bg-[#152B52] text-white"
            >
              Fiscalía
            </th>
            <th
              rowSpan={2}
              className="border border-gray-300 p-2 text-center bg-[#152B52] text-white"
            >
              Delitos
            </th>
            <th
              rowSpan={2}
              className="border border-gray-300 p-2 text-center bg-[#152B52] text-white"
            >
              Cantidad
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((fiscalia, fiscaliaIndex) => (
            <React.Fragment key={fiscaliaIndex}>
              <tr>
                <td
                  className="border border-gray-300 p-2 text-center bg-[#DCE6F1]"
                  rowSpan={fiscalia.delitos.length + 1}
                >
                  2024
                </td>
                <td
                  className="border border-gray-300 p-2 text-center bg-[#DCE6F1]"
                  rowSpan={fiscalia.delitos.length + 1}
                >
                  {fiscalia.nombre_fiscalia}
                </td>
              </tr>
              {fiscalia.delitos.map((delito, delitoIndex) => (
                <tr key={delitoIndex}>
                  <td className="border border-gray-300 p-2">{delito.delito}</td>
                  <td className="border border-gray-300 p-2 text-center">{delito.cantidad}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaxInformationTable;

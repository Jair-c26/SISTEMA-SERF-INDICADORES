import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Genera un PDF a partir de varios elementos (cada uno con su id),
 * agregando una página por cada contenedor. Retorna la URL Blob.
 *
 * @param {string[]} elementIds - Array de strings con los ids de los contenedores
 */
export async function generatePdfFromMultipleElements(elementIds) {
    // Crear el PDF (A4 en puntos)
    const pdf = new jsPDF("p", "pt", "a4");

    // Margen para cada lado (en puntos, 1pt ~ 1/72 inch)
    const marginLeftRight = 30;
    const marginTopBottom = 30;

    for (let i = 0; i < elementIds.length; i++) {
        const elementId = elementIds[i];
        const input = document.getElementById(elementId);

        if (!input) {
            console.warn(`No se encontró ningún elemento con id="${elementId}"`);
            continue;
        }

        // Solo agregamos nueva página si no es la primera
        if (i > 0) {
            pdf.addPage();
        }

        // Capturar el elemento en un canvas (escala 1.5)
        const canvas = await html2canvas(input, {
            scale: 1.5,
        });

        // Generar imagen base64 en JPEG con ~80% de calidad
        const imgData = canvas.toDataURL("image/jpeg", 0.8);

        // Dimensiones de la página
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calcular el tamaño disponible (restando márgenes)
        // Observa que dejamos 30pt a cada lado, por lo tanto:
        // - Ancho máximo disponible = (pageWidth - marginLeftRight * 2)
        // - Alto máximo disponible = (pageHeight - marginTopBottom * 2)
        let availableWidth = pageWidth - marginLeftRight * 2;
        let availableHeight = pageHeight - marginTopBottom * 2;

        // Calcular la relación de aspecto de la imagen
        const imgProps = pdf.getImageProperties(imgData);

        let finalImgWidth = availableWidth;
        let finalImgHeight = (imgProps.height * finalImgWidth) / imgProps.width;

        // Si la altura resultante sobrepasa el espacio disponible, escalamos
        if (finalImgHeight > availableHeight) {
            const ratio = availableHeight / finalImgHeight;
            finalImgHeight = availableHeight;
            finalImgWidth = finalImgWidth * ratio;
        }

        // Agregar la imagen en la página,
        // dejando el margen top = marginTopBottom y left = marginLeftRight
        pdf.addImage(
            imgData,
            "JPEG",
            marginLeftRight,
            marginTopBottom,
            finalImgWidth,
            finalImgHeight
        );
    }

    // Retornar como bloburl para mostrar en <iframe> o descargar
    return pdf.output("bloburl");
}

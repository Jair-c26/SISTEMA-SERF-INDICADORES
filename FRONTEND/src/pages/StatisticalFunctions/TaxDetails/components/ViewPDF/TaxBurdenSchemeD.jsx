// TaxBurdenSchemeD.jsx
import React from "react";
import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
  },
  headerContainer: {
    backgroundColor: "#274E94",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "white",
  },
  headerInfo: {
    fontSize: 8,
    color: "white",
    textAlign: "right",
  },
  deadlineHeader: {
    borderBottom: "1pt solid #aaa",
    paddingVertical: 4,
    marginTop: 8,
  },
  deadlineHeaderTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  metricBox: {
    flexDirection: "column",
    alignItems: "center",
    margin: 2,
    padding: 4,
    borderRight: "1pt solid #ccc",
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 10,
    color: "#555",
  },
  card: {
    border: "1pt solid #eee",
    padding: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  centralContainer: {
    marginVertical: 8,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  footer: {
    backgroundColor: "#274E94",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "white",
  },
  chartImage: {
    width: "100%",
    height: 200,
    marginTop: 4,
  },
});


// Encabezado simulado (DeadlineHeaderPDF)
const DeadlineHeaderPDF = ({ generalSede, reportType, headerTitle, formattedDate }) => {
  const thirdLabel = reportType === "D" ? "Cantidad de despachos" : "Cantidad de dependencias";
  return (
    <View style={styles.deadlineHeader}>
      {headerTitle && (
        <View style={{ paddingHorizontal: 4, paddingBottom: 4 }}>
          <Text style={styles.deadlineHeaderTitle}>{headerTitle}</Text>
        </View>
      )}
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Casos Ingresados</Text>
          <Text style={styles.metricValue}>{generalSede.Casos_Ingresados ?? 0}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Fiscales</Text>
          <Text style={styles.metricValue}>{generalSede.Total_Fiscales ?? 0}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>{thirdLabel}</Text>
          <Text style={styles.metricValue}>{generalSede.Total_Dependencias ?? 0}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Fecha Registro</Text>
          <Text style={[styles.metricValue, { fontSize: 8 }]}>{formattedDate}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Código Reporte</Text>
          <Text style={styles.metricValue}>[Barcode]</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Logo MP</Text>
          <Text style={styles.metricValue}>[Logo]</Text>
        </View>
      </View>
    </View>
  );
};

// Simulación de TaxData (TaxDataPDF)
const TaxDataPDF = ({ workspaces }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>FISCALES ACTIVOS / VIGENTES</Text>
      {workspaces.map((ws, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            marginBottom: 4,
            borderBottom: "0.5pt solid #ccc",
            paddingBottom: 4,
          }}
        >
          {/* Bloque Izquierdo: Nombre y columnas de métricas */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 0.3, justifyContent: "center" }}>
              <Text style={{ fontSize: 8, fontWeight: "bold" }}>{ws.name}</Text>
            </View>
            <View
              style={{
                flex: 0.7,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ alignItems: "center" }}>
                
                <Text style={{ fontSize: 8, color: "#555" }}>
                  {ws.metrics?.dentroPlazo?.quantity}
                </Text>
                <Text style={{ fontSize: 8, color: "#555" }}>
                  {ws.metrics?.dentroPlazo?.label}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                
                <Text style={{ fontSize: 8, color: "#555" }}>
                  {ws.metrics?.porVencer?.quantity}
                </Text>
                <Text style={{ fontSize: 8, color: "#555" }}>
                  {ws.metrics?.porVencer?.label}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                
                <Text style={{ fontSize: 8, color: "#555" }}>
                  {ws.metrics?.vencidos?.quantity}
                </Text>
                <Text style={{ fontSize: 8, color: "#555" }}>
                  {ws.metrics?.vencidos?.label}
                </Text>
              </View>
            </View>
          </View>
          {/* Bloque Derecho: Métrica total */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 4,
            }}
          >
            <Text style={{ fontSize: 8, color: "#555" }}>
              {ws.metrics?.total?.label}
            </Text>
            <Text style={{ fontSize: 8, color: "#555" }}>
              <Text style={{ fontWeight: "bold", color: "#91CC75" }}>
                {ws.metrics?.total?.percentage}%
              </Text>{" "}
              {ws.metrics?.total?.quantity}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Componente principal TaxBurdenSchemeD
const TaxBurdenSchemeD = ({
  containerId = "DeadlineControlE",
  workspaces = [],
  dependencyName = "Dependencia sin nombre",
  generalSede = {},
  reportType = "D",
  fiscalChartData = {
    xAxisData: [],
    dataResueltos: [],
    dataIngresados: [],
    dataTramite: [],
  },
  pieChartData = [],
  rankingData = {
    yAxisRanking: [],
    seriesRanking: [],
  },
  etapasChartData = {
    xAxisData: [],
    legendData: [],
    seriesData: [],
  },
  estadoChartData = {
    xAxisData: [],
    seriesData: [],
  },
  version = "1.1.1",
  user = { nombre: "Administrador", apellido: "" },
  // Nuevos props con los dataURLs pre-renderizados
  barChartDataURL,
  pieChartDataURL,
  rankingChartDataURL,
  etapasChartDataURL,
  estadoChartDataURL,
}) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const fullName = user ? `${user.nombre} ${user.apellido}` : "Administrador";
  const orientation = workspaces.length > 10 ? "vertical" : "horizontal";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado superior */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>CARGA LABORAL</Text>
          <View>
            <Text style={styles.headerInfo}>SERF: {version}</Text>
            <Text style={styles.headerInfo}>Fecha de impresión: {formattedDate}</Text>
          </View>
        </View>

        {/* Sección DeadlineHeader */}
        <DeadlineHeaderPDF
          generalSede={generalSede}
          reportType={reportType}
          headerTitle={dependencyName}
          formattedDate={formattedDate}
        />

        {/* Contenido principal en una única columna central */}
        <View style={styles.centralContainer}>
          {/* Bloque de gráficos */}
          <View style={styles.card}>
            {barChartDataURL ? (
              <Image src={barChartDataURL} style={styles.chartImage} />
            ) : (
              <Text style={styles.text}>Cargando gráfico de barras...</Text>
            )}
          </View>

          <View style={styles.gridRow}>
            <View style={{ flex: 0.5, paddingRight: 4 }}>
              <View style={styles.card}>

                {pieChartDataURL ? (
                  <Image src={pieChartDataURL} style={styles.chartImage} />
                ) : (
                  <Text style={styles.text}>Cargando gráfico...</Text>
                )}
              </View>
            </View>
            <View style={{ flex: 0.5, paddingRight: 0 }}>
              <View style={styles.card}>

                {rankingChartDataURL ? (
                  <Image src={rankingChartDataURL} style={styles.chartImage} />
                ) : (
                  <Text style={styles.text}>Cargando gráfico...</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            {etapasChartDataURL ? (
              <Image src={etapasChartDataURL} style={styles.chartImage} />
            ) : (
              <Text style={styles.text}>Cargando gráfico de etapas...</Text>
            )}
          </View>

          <View style={styles.card}>
            {estadoChartDataURL ? (
              <Image src={estadoChartDataURL} style={styles.chartImage} />
            ) : (
              <Text style={styles.text}>Cargando gráfico de estado...</Text>
            )}
          </View>
        </View>

        {/* Bloque inferior: Información de fiscales (TaxData) */}
        <TaxDataPDF workspaces={workspaces} />

        {/* Pie de página */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerText}>
              Elaborado por el Área de Gestión e Indicadores
            </Text>
            <Text style={styles.footerText}>
              Ministerio Público del Distrito Fiscal de Madre de Dios
            </Text>
          </View>
          <View>
            <Text style={styles.footerText}>Usuario: {fullName}</Text>
            <Text style={styles.footerText}>IP: 192.168.1.56</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TaxBurdenSchemeD;

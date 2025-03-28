import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function UserActivity() {
  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {/* Timeline Item 1 */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Card className="w-full my-2">
            <CardContent className="flex flex-col w-full font-teko font-normal">
              <p><strong>Fecha y hora:</strong> 2025-01-30 10:00 AM</p>
              <p><strong>Modificación realizada:</strong> Actualización de perfil</p>
              <p><strong>Usuario:</strong> Juan Pérez</p>
              <p><strong>Cargo:</strong> Desarrollador Frontend</p>
            </CardContent>
          </Card>
        </TimelineContent>
      </TimelineItem>

      {/* Timeline Item 2 */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Card className="w-full my-2">
            <CardContent className="flex flex-col w-full font-teko font-normal">
              <p><strong>Fecha y hora:</strong> 2025-01-30 12:00 PM</p>
              <p><strong>Modificación realizada:</strong> Revisión de código</p>
              <p><strong>Usuario:</strong> María López</p>
              <p><strong>Cargo:</strong> Líder de equipo</p>
            </CardContent>
          </Card>
        </TimelineContent>
      </TimelineItem>

      {/* Timeline Item 3 */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="secondary" />
        </TimelineSeparator>
        <TimelineContent>
          <Card className="w-full my-2">
            <CardContent className="flex flex-col w-full font-teko font-normal">
              <p><strong>Fecha y hora:</strong> 2025-01-30 02:00 PM</p>
              <p><strong>Modificación realizada:</strong> Implementación de nueva funcionalidad</p>
              <p><strong>Usuario:</strong> Carlos Sánchez</p>
              <p><strong>Cargo:</strong> Desarrollador Backend</p>
            </CardContent>
          </Card>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}

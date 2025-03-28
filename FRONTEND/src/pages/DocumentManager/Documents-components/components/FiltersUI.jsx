import React from "react";
import { Button } from "../../../../components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/dashboard/DropdownMenu";
import { IconSortDescending2 } from "@tabler/icons-react";

export const Filters = ({ selectedFilter, setSelectedFilter }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Usamos items-baseline o items-center, pero movemos el ícono con top-[2px] */}
        <Button variant="secondary" className="flex items-baseline gap-1">
          <IconSortDescending2
            size={15}
            className="relative top-[2px]" // Mueve el ícono hacia abajo ~2px
          />
          Filtrar
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={selectedFilter}
            onValueChange={setSelectedFilter}
          >
            <DropdownMenuRadioItem value="recent">Más Recientes</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Más Antiguos</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="type">Tipo de Archivo</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

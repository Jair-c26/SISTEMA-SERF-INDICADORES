// Breadcrumbs.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Mapa de segmentos a nombre
const breadcrumbNameMap = {
  "": "Home",
  inbox: "Inbox",
  usuarios: "Usuarios",
  sales: "Sales",
  quotes: "Quotes",
  orders: "Orders",
  insights: "Insights & Reports",
  products: "Products",
  items: "Items",
  variants: "Variants",
  suppliers: "Suppliers",
};

export function Breadcrumbs() {
  const location = useLocation();

  // e.g. "/usuarios" => ["usuarios"]
  // e.g. "/sales/quotes" => ["sales", "quotes"]
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="ml-2">
      <ol className="flex items-center space-x-3 text-sm">
        {/* Siempre mostramos "Home" como primer item */}
        <li className="flex">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const name = breadcrumbNameMap[value] || value; // fallback: value

          return (
            <React.Fragment key={to}>
              <li>
                <ChevronRight className="size-4 shrink-0 text-gray-600" aria-hidden="true" />
              </li>
              <li>
                {isLast ? (
                  <span className="text-gray-900">{name}</span>
                ) : (
                  <Link to={to} className="text-gray-500 hover:text-gray-700">
                    {name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

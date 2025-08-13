import "~/index.css";
import "~/lib/locales/i18n";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "~/routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);


import * as React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Bootloader } from "../components/bootloader";


export const Route = createRootRoute({
    component: RootWithBootloader,
});

function RootWithBootloader() {
    const [booted, setBooted] = React.useState(false);

    if (!booted) {
        return <Bootloader onFinish={() => setBooted(true)} />;
    }
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    );
}

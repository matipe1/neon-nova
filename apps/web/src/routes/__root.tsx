import AppLayout from '../components/layout/AppLayout'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <AppLayout>
                    <Outlet />
                    <TanStackRouterDevtools />
                </AppLayout>
            </>
        )
    }
})
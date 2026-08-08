import AppLayout from '../components/layout/AppLayout'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <AppLayout>
                    <Outlet />
                    <TanStackRouterDevtools />
                    <ReactQueryDevtools />
                </AppLayout>
            </>
        )
    }
})
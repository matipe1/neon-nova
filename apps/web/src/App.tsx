import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree })

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;

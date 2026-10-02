import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/routes/router'; // extension resolved automatically

export default function App() {
  return <RouterProvider router={router} />;
}

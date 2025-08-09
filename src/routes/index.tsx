import MapScreen from "../pages/map/MapScreen";
import MainLayout from "../layouts/MainLayout";
import NotFoundPage from "../pages/notfound/NotFoundPage";

interface AppRoute {
  path: string;
  element: JSX.Element;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}

export const appRoutes: AppRoute[] = [
  { path: "*", element: <NotFoundPage /> },
  {
    path: "/map",
    element: <MapScreen />,
    layout: MainLayout,
  },
];

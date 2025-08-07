import MapScreen from "../pages/map/MapScreen";
import MainLayout from "../layouts/MainLayout";

interface AppRoute {
  path: string;
  element: JSX.Element;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}

export const appRoutes: AppRoute[] = [
  { path: "*", element: <div>Page not found</div> },
  {
    path: "/map",
    element: <MapScreen />,
    layout: MainLayout,
  },
];

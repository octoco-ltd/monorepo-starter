import { Suspense, lazy, FC } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';
import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';
import SuspenseLoader from 'src/components/SuspenseLoader';
import pages from './routes';

const Loader = (Component: FC) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages
const Home = Loader(lazy(() => import('src/pages/Home')));
const Input = Loader(lazy(() => import('src/pages/Input')));

// Status
const Status404 = Loader(
  lazy(() => import('src/components/Fallbacks/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/components/Fallbacks/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/components/Fallbacks/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/components/Fallbacks/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    /**
     * This is the root path API_URL
     */
    path: '',
    /**
     * This is a basic container element without any Navbars or Sidebars
     */
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to={pages.home.path} replace />,
      },
      {
        path: '/home',
        element: <Navigate to={pages.home.path} replace />,
      },
      {
        path: pages.status.root,
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />,
          },
          {
            path: pages.status.status404.name,
            element: <Status404 />,
          },
          {
            path: pages.status.status500.name,
            element: <Status500 />,
          },
          {
            path: pages.status.statusMaintenance.name,
            element: <StatusMaintenance />,
          },
          {
            path: pages.status.statusComingSoon.name,
            element: <StatusComingSoon />,
          },
        ],
      },
      {
        path: '*',
        element: <Status404 />,
      },
    ],
  },
  {
    /**
     * This is a sub path. All children element are located at API_URL/sidebar/{children}
     */
    path: 'sidebar',
    element: (
      /**
       * All children with this element will have a Sidebar and top Navbar
       */
      <SidebarLayout />
    ),
    children: [
      {
        path: '',
        element: <Navigate to={pages.home.name} replace />,
      },
      {
        path: pages.home.name,
        element: <Home />,
      },
      {
        path: pages.input.name,
        element: <Input />,
      },
    ],
  },
];

export default routes;

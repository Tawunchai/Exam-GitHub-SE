import { lazy } from "react";
import { useRoutes, RouteObject} from "react-router-dom";
import Loadable from "../component/third-patry/Loadable";

const Login = Loadable(lazy(() => import("../page/Login")));
const Register = Loadable(lazy(() => import("../page/Register")));

const AdminPage = Loadable(lazy(() => import("../page/Admin")));
const UserPage = Loadable(lazy(() => import("../page/User")));

const ManageZooShop = Loadable(lazy(() => import("../page/Zoosale/ManageZooShop")));
const ReceiveProduct = Loadable(lazy(() => import("../page/Zoosale/ReceiveProduct")));
const SaleProduct = Loadable(lazy(() => import("../page/Zoosale/SaleProduct")));
const OrganizeProducts = Loadable(lazy(() => import("../page/Zoosale/organizeproduct")));

//Zookeeper
const ZookeeperLayout = Loadable(lazy(() => import("../page/Zookeeper/ZookeeperLayout/MainLayout")));
const Animal = Loadable(lazy(() => import("../page/Zookeeper/animals/animal")));
const CreateAnimal = Loadable(lazy(() => import("../page/Zookeeper/animals/create/index")));
const EditAnimal = Loadable(lazy(() => import("../page/Zookeeper/animals/edit/index")));
const Habitat = Loadable(lazy(() => import("../page/Zookeeper/habitat/habitat")));
const CreateHabitat = Loadable(lazy(() => import("../page/Zookeeper/habitat/create/index")));
const EditHabitat = Loadable(lazy(() => import("../page/Zookeeper/habitat/edit/index")));
const Report = Loadable(lazy(() => import("../page/Zookeeper/report/report")));
const CreateReport = Loadable(lazy(() => import("../page/Zookeeper/report/create/index")));
const Calendar = Loadable(lazy(() => import("../page/Zookeeper/calendar/calendar")));
const Event = Loadable(lazy(() => import("../page/Zookeeper/event/event")));
const CreateEvent = Loadable(lazy(() => import("../page/Zookeeper/event/create/index")));
const EditEvent = Loadable(lazy(() => import("../page/Zookeeper/event/edit/index")));
const Work = Loadable(lazy(() => import("../page/Zookeeper/work/work")));
const CreateWork = Loadable(lazy(() => import("../page/Zookeeper/work/work")));

//User Reviews
const MyTicket = Loadable(lazy(() => import("../page/User/Ticket/MyTicket/myticket")));
const Review = Loadable(lazy(() => import("../page/reviews/review")));

//Vehicle Manager
const Vehicle = Loadable(lazy(() => import("../page/VehicleManager/vehicle")));
const VehicleLayout = Loadable(lazy(() => import("../component/vehiclemanager/topbar")));
const Rental = Loadable(lazy(() => import("../page/VehicleManager/rental")));
const CreateVehicle = Loadable(lazy(() => import("../page/VehicleManager/create/create")));
const EditVehicle = Loadable(lazy(() => import("../page/VehicleManager/edit/update")));

//BookTicket and RentVehicle
const ShowTicket = Loadable(lazy(() => import("../page/User/ShowTicket/showticket")));
const Ticket = Loadable(lazy(() => import("../page/User/Ticket/ticket")));
const Booked = Loadable(lazy(() => import("../page/User/Ticket/booked")));
const Myticket = Loadable(lazy(() => import("../page/User/Ticket/myticket")));
const Rent = Loadable(lazy(() => import("../page/User/Rent/rent")));

const Vetdashboard = Loadable(lazy(() => import("../page/VetDashboard")));


const AdminRoutes = (): RouteObject[] => [
  {
    path: "/", element: <AdminPage />, 
  },                                          
  {
    path: "/admin",
    children: [
      { index: true, element: <AdminPage /> },
    ],
  },
];

const UserRoutes = (): RouteObject[] => [
  {
    path: "/", element: <UserPage />, 
  },                                          
  {
    path: "/user",
    children: [
      { index: true, element: <UserPage /> },
      { path: "showticket", element: <ShowTicket /> },
      { path: "ticket", element: <Ticket /> },
      { path: "rent", element: <Rent /> },
      { path: "booked", element: <Booked /> },
      { path: "myticket", element: <Myticket /> },
      
    ],
  },
];

const ZookeeperRoutes = (): RouteObject[] => [
  {
    path: "/",
    element: <ZookeeperLayout />,  
    children: [
      { index: true, element: <Animal /> },  
    ],
  },
  {
    path: "/zookeeper",
    element: <ZookeeperLayout />,  
    children: [
      { index: true, element: <Animal /> },
      { path: "create-animal", element: <CreateAnimal /> },
      { path: "animals/edit/:id", element: <EditAnimal /> },
      { path: "habitat", element: <Habitat /> },
      { path: "create-habitat", element: <CreateHabitat /> },
      { path: "habitat/edit/:id", element: <EditHabitat /> },
      { path: "report", element: <Report /> },
      { path: "create-report", element: <CreateReport /> },
      { path: "calendar", element: <Calendar /> },
      { path: "event", element: <Event /> },
      { path: "create-event", element: <CreateEvent /> },
      { path: "events/edit/:id", element: <EditEvent /> },
      { path: "work", element: <Work /> },
      { path: "create-work", element: <CreateWork /> },
      { path: "myticket", element: <MyTicket /> }, // Test User Reviews
      { path: "review", element: <Review /> }, // Test User Reviews
      { path: "login", element: <Login /> },
    ],
  },
];


const VehicleManager = (): RouteObject[] => [
  {
    path: "/vehiclemanager",
    element: <VehicleLayout />, 
    children: [
      { index: true, element: <Vehicle /> },
      { path: "rental", element: <Rental /> }, 
      { path: "create-vehicle", element: <CreateVehicle /> },
      { path: "vehicles/edit/:id", element: <EditVehicle /> },
      { path: "login", element: <Login /> },
    ],
  },
];

const ZooSaleRoutes = (): RouteObject[] => [
  {
    path: "/", element: <ManageZooShop />, 
  },                                          
  {
    path: "/zoosale",
    children: [
      { index: true, element: <ManageZooShop /> },
      {path: "receiveproduct", element: <ReceiveProduct/>},
      {path: "saleproduct", element: <SaleProduct/>},
      {path: "organizeproduct", element: <OrganizeProducts/>},
    ],
  },
];

const MainRoutes = (): RouteObject[] => [
  {
    path: "/",
    children: [
      { index: true, element: <Login /> },
      {path: "/register", element: <Register/>},
      { path: "*", element: <Login /> },
    ],
  },
];

const VetDashboardRoutes = (): RouteObject[] => [
  {
    path: "/", element: <Vetdashboard />, 
  },                                          
  {
    path: "/vetdashboard",
    children: [
      { index: true, element: <Vetdashboard /> },
    ],
  },
];


function ConfigRoutes() {
  const isLoggedIn = localStorage.getItem('isLogin') === 'true';
  const roleName = localStorage.getItem('roleName');
  //const roleid = localStorage.getItem('roleid');
  const userid = localStorage.getItem('userid');

  console.log("isLoggedIn:", isLoggedIn);
  console.log("roleName:", roleName);
  //console.log("roleid:", roleid);
  console.log("userid:", userid);

  let routes: RouteObject[] = [];

  if (isLoggedIn) {
    switch (roleName) {
      case 'Admin':
        routes = AdminRoutes();
        break;
      case 'User':
        routes = UserRoutes();
        break;
      case 'Zookeeper':
        routes = ZookeeperRoutes();
        break;
      case 'VehicleManager':
        routes = VehicleManager();
        break;
      case 'ZooSale':
        routes = ZooSaleRoutes();
        break;
      case 'Veterinarian':
        routes = VetDashboardRoutes();
        break;
      default:
        routes = MainRoutes();
        break;
    }
  } 
  else {
    routes = MainRoutes();
  }

  return useRoutes(routes);
}
export default ConfigRoutes;

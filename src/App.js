import './App.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from './Copmponent/login/Login';
import Register from './Copmponent/register/Register';
import ForgetPass from './Copmponent/forgetPass/ForgetPass';
import ResetPass from './Copmponent/resetPass/ResetPass';
import ConfirmCode from './Copmponent/confimCode/ConfirmCode';
import Layout from './Copmponent/layout/Layout';
import Home from './Copmponent/home/Home';
import { AuthProvider } from "./context/authentication";
import DeviceDetails from './Copmponent/deviceDetails/DeviceDetails';
import NextDetails from './Copmponent/nextDetails/NextDetails';
import Profile from './Copmponent/profile/Profile';
import { ProfileContextProvider} from './Copmponent/context/ProfileContextProvider';
import About from './Copmponent/about/About';
import ContactUs from './Copmponent/contactUs/ContactUs';
import PersonDetails from './Copmponent/personDetails/PersonDetails';
import FilesDetails from './Copmponent/filesDetails/FilesDetails';
import CarsDetails from './Copmponent/carsDetails/CarsDetails';
import ThingsDetails from './Copmponent/thingsDetails/ThingsDetails';
import MyT3mem from './Copmponent/myt3mem/MyT3mem';
import ShowTaemem from './Copmponent/showTaemem/ShowTaemem';
import CarsEdit from './Copmponent/editTaemem/CarsEdit';
import FilesEdit from './Copmponent/editTaemem/FilesEdit';
import DeviceEdit from './Copmponent/editTaemem/DeviceEdit';
import PersonEdit from './Copmponent/editTaemem/PersonEdit';
import ThingsEdit from './Copmponent/editTaemem/ThingsEdit';
import MapEdit from './Copmponent/editTaemem/MapEdit';
import CreateLocation from './Copmponent/editTaemem/CreateLocation';
import ChangePass from './Copmponent/changepass/ChangePass';
const myRouter = createBrowserRouter([
  {
   
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }, 
      { path: "home", element: <Home /> },   
      { path: 'ForgetPass', element: <ForgetPass /> },
      { path: 'Resetpass', element: <ResetPass /> },
      { path: 'change-pass', element: <ChangePass /> },
      { path: 'Confirmcode', element: <ConfirmCode /> },
      { path: 'deviceDetails', element: <DeviceDetails/> },
      { path: 'personDetails', element: <PersonDetails/> },
      { path: 'nextDetails', element: <NextDetails/> },
      { path: 'profile', element: <Profile/> },
      { path: 'myt3mem', element: <MyT3mem/>},
      { path: 'about', element: <About/>},
      { path: 'contact', element: <ContactUs/>},
      { path: 'filesDetails', element: <FilesDetails/>},
      { path: 'carsDetails', element: <CarsDetails/>},
      { path: 'thingsDetails', element: <ThingsDetails/>},
      { path: 'myt3mem', element: <MyT3mem/>},
      { path: 'show-taemem/:id', element: <ShowTaemem /> },
      { path: 'edit-cars', element: <CarsEdit /> },
      { path: 'edit-files', element: <FilesEdit /> },
      { path: 'edit-device', element: <DeviceEdit /> },
      { path: 'edit-person', element: <PersonEdit /> },
      { path: 'edit-things', element: <ThingsEdit /> },
      { path: 'edit-map/:id', element: <MapEdit /> },
      { path: 'create-location/:id', element: <CreateLocation /> }
      ],
    
  },
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <ProfileContextProvider> 
          <RouterProvider router={myRouter}/>
        </ProfileContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;

import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ROUTES } from './routes/routes'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { UserLayout } from './layout/UserLayout'
import { AdminLayout } from './layout/AdminLayout'
import HomePage from './pages/user/HomePage'
import { RetiroPage } from './pages/user/Retiro'
import { LicenciasPage } from './pages/user/LicenciasPage'
import { HistorialPage } from './pages/user/HisotrialPage'
import { ProfilePage } from './pages/user/ProfilePage'
import { SoportePage } from './pages/user/SoportePage'
import { TransferenciaInternaPage } from './pages/user/TransferenciaInternaPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { GestionPagosPage } from './pages/admin/GestionPagosPage'
import { GestionRetirosPage } from './pages/admin/GestionRetirosPage'
import { GestionKycPage } from './pages/admin/GestionKycPage'
import { EditarUsuarioPage } from './pages/admin/EditarUsuarioPage'
import { ExploradorUsuarioPage } from './pages/admin/ExploradorUsuarioPage'
import { store } from './store'
import "./i18n";
import RedUsuarioPage from './pages/user/RedUsuarioPage'
import GestionSoportePage from './pages/admin/GestionSoportePage'
import RecuperarPassword from './pages/user/RecuperarPassword'
import NovedadesPage from './pages/user/NovedadesPage'
import NewsReports from './pages/user/NewReports'
import MiningPage from './pages/user/MiningPage'


function App() {

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.LANDING} element={<LandingPage />} />
            <Route path={ROUTES.LANDING_REF} element={<LandingPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.REGISTER_REF} element={<RegisterPage />} />
            <Route path={ROUTES.RECUPERAR_PASSWORD} element={<RecuperarPassword />} />

            <Route path={ROUTES.USER.LAYOUT} element={<UserLayout />} >

              <Route path={ROUTES.USER.HOME} element={<HomePage />} />
              <Route path={ROUTES.USER.LICENCIAS} element={<LicenciasPage />} />
              <Route path={ROUTES.USER.RETIRO} element={<RetiroPage />} />
              <Route path={ROUTES.USER.HISTORIAL} element={<HistorialPage />} />
              <Route path={ROUTES.USER.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.USER.SOPORTE} element={<SoportePage />} />
              <Route path={ROUTES.USER.TRANSFERENCIA_INTERNA} element={<TransferenciaInternaPage />} />
              <Route path={ROUTES.USER.RED_USUARIOS} element={<RedUsuarioPage />} />
              <Route path={ROUTES.USER.TOOLS} element={<NovedadesPage />} />
              <Route path={ROUTES.USER.NEWS_REPORTS} element={<NewsReports />} />
              <Route path={ROUTES.USER.MINING} element={<MiningPage />} />

            </Route>

            <Route path={ROUTES.ADMIN.LAYOUT} element={<AdminLayout />} >
              <Route path={ROUTES.ADMIN.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.ADMIN.GESTION_PAGOS} element={<GestionPagosPage />} />
              <Route path={ROUTES.ADMIN.GESTION_RETIROS} element={<GestionRetirosPage />} />
              <Route path={ROUTES.ADMIN.GESTION_KYC} element={<GestionKycPage />} />
              <Route path={`${ROUTES.ADMIN.EDITAR_USUARIO}/:userId`} element={<EditarUsuarioPage />} />
              <Route path={ROUTES.ADMIN.USERS_EXPLORER} element={<ExploradorUsuarioPage />} />
              <Route path={ROUTES.ADMIN.GESTION_SOPORTE} element={<GestionSoportePage />} />
            </Route>
          </Routes>

        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Provider>
    </>
  )
}

export default App

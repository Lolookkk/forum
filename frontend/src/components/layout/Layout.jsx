import { Outlet, useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import LeftNav from "./LeftNav";
import "./Layout.css";
import { useAuth } from "../../hooks/useAuth";
import { useSettings } from "../../hooks/useSettings";
import Banner from "./Banner";


function MaintenanceBanner() {
  const { settings, hydrated } = useSettings();
  if (!hydrated || !settings?.maintenance_mode) return null;

  return (
    <div className="maintenance-banner" role="alert" aria-live="polite">
      <span className="maintenance-banner-icon" aria-hidden="true">🛠️</span>
      <div className="maintenance-banner-text">
        <strong>Mode maintenance activé</strong>
        <span>
          Le site est actuellement en maintenance.
        </span>
      </div>
    </div>
  );
}

// L'écran de maintenance plein écran pour les visiteurs
function MaintenanceScreen({ forumName }) {
  return (
    <main className="maintenance-gate" style={{ minHeight: "100vh", alignItems: "center" }}>
      <div className="form-card form-card--md form-card--center">
        <div className="form-header form-header--yellow">
          <span aria-hidden="true" style={{ marginRight: 8 }}>🛠️</span>
          Maintenance en cours
        </div>
        <div className="form-body" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "var(--fs-md)", lineHeight: 1.5, color: "var(--color-text-body)", marginBottom: 12 }}>
            <strong>Nous serons de retour très vite !</strong>
          </p>
          <p style={{ fontSize: "var(--fs-base-sm)", color: "var(--color-text-subtle)", lineHeight: 1.5 }}>
            L'équipe {forumName || "du forum"} est en train de mettre à jour le
            site pour vous offrir une meilleure expérience. Merci de votre patience.
          </p>
        </div>
      </div>
    </main>
  );
}



export default function Layout() {
  const { user } = useAuth();
  const { settings, hydrated } = useSettings();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const isMaintenanceActive = hydrated && settings?.maintenance_mode && !isAdmin;
  const isAdminLoginPage = location.pathname === "/admin-login";

  if (isMaintenanceActive && isAdminLoginPage) {
    return (
      <div className="layout-container" style={{ minHeight: "100vh", justifyContent: "center" }}>
        <Outlet />
      </div>
    );
  }

  if (isMaintenanceActive) {
    return <MaintenanceScreen forumName={settings?.forum_name} />;
  }

  return (
    <div className="layout-container">
      <MaintenanceBanner />
      <Banner />
      <Topbar />
      <div className="layout-main">
        <LeftNav />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import LeftNav from "./LeftNav";
import "./Layout.css";
import { useAuth } from "../../hooks/useAuth";
import { useSettings } from "../../hooks/useSettings";
import Banner from "./Banner";

function MaintenanceBanner() {
  const { settings, hydrated } = useSettings();
  if (!hydrated) return null;
  if (!settings?.maintenance_mode) return null;

  return (
    <div className="maintenance-banner" role="alert" aria-live="polite">
      <span className="maintenance-banner-icon" aria-hidden="true">🛠️</span>
      <div className="maintenance-banner-text">
        <strong>Mode maintenance activé</strong>
        <span>
          Le site est actuellement en maintenance. Certaines fonctionnalités peuvent être
          indisponibles.
        </span>
      </div>
    </div>
  );
}

function MaintenanceGate({ children }) {
  const { user } = useAuth();
  const { settings, hydrated } = useSettings();
  const isAdmin = user?.role === "admin";

  if (!hydrated) return children;
  if (!settings?.maintenance_mode) return children;
  if (isAdmin) return children;

  return (
    <main className="maintenance-gate">
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
            L'équipe {settings.forum_name || "du forum"} est en train de mettre à jour le
            site pour vous offrir une meilleure expérience. Merci de votre patience.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Layout() {
  return (
    <div className="layout-container">
      <MaintenanceBanner />
      <Banner />
      <Topbar />
      <div className="layout-main">
        <LeftNav />
        <MaintenanceGate>
          <div className="content-wrapper">
            <Outlet />
          </div>
        </MaintenanceGate>
      </div>
    </div>
  );
}

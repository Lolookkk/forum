import { Outlet } from "react-router-dom";
import Banner from "./Banner";
import LeftNav from "./LeftNav";
import Topbar from "./Topbar";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-layout">
      {/* La bannière passe tout au-dessus */}
      <Banner />

      <div className="app-container">
        <LeftNav />
        <div className="main-wrapper">
          <Topbar />
          <main className="content-area">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
import "./Banner.css";
import sunflowerLogo from "../../assets/tournesol.png";
import { useSettings } from "../../hooks/useSettings";

export default function Banner() {
  const { settings, hydrated } = useSettings();
  const forumName =
    hydrated && settings?.forum_name ? settings.forum_name : "SHYFORUM";
  const forumNameDisplay = forumName.trim() ? forumName : "SHYFORUM";

  return (
    <header className="top-banner">
      <div className="banner-content">
        <div className="banner-logo">
          <img
            src={sunflowerLogo}
            alt={`Logo de ${forumNameDisplay}`}
            className="sunflower"
          />
        </div>
        <div className="banner-title-group">
          <h1 className="banner-title">{forumNameDisplay}</h1>
          <p className="banner-subtitle">
            Espace de discussion & d'entraide bienveillant
          </p>
        </div>
      </div>
    </header>
  );
}

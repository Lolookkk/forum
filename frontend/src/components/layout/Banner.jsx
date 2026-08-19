import "./Banner.css";
// Remplacez 'logo.png' par le chemin exact de votre image de tournesol
import sunflowerLogo from "../../assets/tournesol.png"; 

export default function Banner() {
  return (
    <header className="top-banner">
      <div className="banner-content">
        <div className="banner-logo">
          <img src={sunflowerLogo} alt="Logo Tournesol SHYFORUM" className="sunflower" />
        </div>
        <div className="banner-title-group">
          <h1 className="banner-title">SHYFORUM</h1>
          <p className="banner-subtitle">Espace de discussion & d'entraide bienveillant</p>
        </div>
      </div>
    </header>
  );
}
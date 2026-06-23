import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <section className="hero">
        <h1 className="hero-title">
          A letter to <span className="accent">who you are becoming</span>
        </h1>
        <p className="hero-subtitle">Write to your future self. Seal it. Let time do the rest.</p>
        
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate('/Register')}>
            Write your first capsule
          </button>
          <button className="btn-secondary" onClick={() => navigate('/Login')}>
            Sign in
          </button>
        </div>

        <p className="sealed-quote">"It's sealed. See you later."</p>
      </section>

      <section className="wall-preview">
        <h2>From the emotional wall</h2>
        <div className="wall-cards">
          <div className="wall-card">
            <div className="wall-header">
              <span className="wall-time">Sealed 6 months ago</span>
            </div>
            <div className="wall-username">Anonymous</div>
            <p className="wall-content">I hope you're proud of yourself now. You did it.</p>
            <div className="wall-footer">
              <span className="wall-likes">❤️ 24</span>
            </div>
          </div>

          <div className="wall-card">
            <div className="wall-header">
              <span className="wall-time">Sealed 2 weeks ago</span>
            </div>
            <div className="wall-username">@maya_writes</div>
            <p className="wall-content">Remember when you thought you couldn't do this? Look at you now. You made it through all the hard days, all the doubts. I'm so proud of you. Keep going.</p>
            <div className="wall-details">
              <span>🎵 Favorite: "Still Life"</span>
              <span>Age: 16</span>
            </div>
            <div className="wall-footer">
              <span className="wall-likes">❤️ 67</span>
            </div>
          </div>

          <div className="wall-card">
            <div className="wall-header">
              <span className="wall-time">Sealed yesterday</span>
            </div>
            <div className="wall-username">@josh_pine</div>
            <p className="wall-content">You were so scared about the future, but you handled it better than you expected. All those nights you couldn't sleep... they led you here. Thank you for not giving up on yourself.</p>
            <div className="wall-details">
              <span>🎵 Favorite: "Mikrokosmos"</span>
              <span>Age: 17</span>
            </div>
            <div className="wall-footer">
              <span className="wall-likes">❤️ 14</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { getMascotImagePath } from '../utils/mascotUtils';
import SoundToggle from './SoundToggle';
import CoinDisplay from './CoinDisplay';
import DesktopLayout from './DesktopLayout';
import './AppShell.css';

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useGameStore();

  const isSetupRoute = location.pathname.startsWith('/setup');
  const isParentRoute = location.pathname.startsWith('/parent');

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  if (isSetupRoute || isParentRoute) {
    return (
      <DesktopLayout>
        <div className="app-shell">{children}</div>
      </DesktopLayout>
    );
  }

  return (
    <DesktopLayout>
      <div className={`app-shell app-shell--${user.genderTheme} theme--${user.genderTheme}`}>
        <header className="app-shell__header">
        <div className="app-shell__mascot-mini">
          {user.selectedMascotId && (
            <img 
              src={getMascotImagePath(user.selectedMascotId)} 
              alt="Mascot"
              className="mascot-mini__image"
            />
          )}
        </div>
        
        <div className="app-shell__stats">
          <div className="stat-item">
            <CoinDisplay />
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">Nível {user.level}</span>
          </div>
          <SoundToggle className="sound-toggle--header" />
        </div>
      </header>

      <main className="app-shell__main">
        {children}
      </main>

      <nav className="app-shell__nav">
        <button 
          className={`nav-tab ${location.pathname === '/home' ? 'nav-tab--active' : ''}`}
          onClick={() => handleTabClick('/home')}
        >
          <span className="nav-tab__icon">🏠</span>
          <span className="nav-tab__label">Início</span>
        </button>
        
        <button 
          className={`nav-tab ${location.pathname === '/missions' ? 'nav-tab--active' : ''}`}
          onClick={() => handleTabClick('/missions')}
        >
          <span className="nav-tab__icon">🎯</span>
          <span className="nav-tab__label">Missões</span>
        </button>
        
        <button 
          className={`nav-tab ${location.pathname === '/shop' ? 'nav-tab--active' : ''}`}
          onClick={() => handleTabClick('/shop')}
        >
          <span className="nav-tab__icon">🛍️</span>
          <span className="nav-tab__label">Loja</span>
        </button>
        
        <button 
          className={`nav-tab ${location.pathname === '/diary' ? 'nav-tab--active' : ''}`}
          onClick={() => handleTabClick('/diary')}
        >
          <span className="nav-tab__icon">📔</span>
          <span className="nav-tab__label">Diário</span>
        </button>
        
        <button 
          className={`nav-tab ${location.pathname === '/more' ? 'nav-tab--active' : ''}`}
          onClick={() => handleTabClick('/more')}
        >
          <span className="nav-tab__icon">⭐</span>
          <span className="nav-tab__label">Mais</span>
        </button>
      </nav>
      </div>
    </DesktopLayout>
  );
};

export default AppShell;

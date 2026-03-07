import type { ReactNode } from 'react';
import { useGameStore } from '../store/useGameStore';
import './DesktopLayout.css';

interface DesktopLayoutProps {
  children: ReactNode;
}

const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  const { user } = useGameStore();
  
  return (
    <div className={`desktop-layout desktop-layout--${user.genderTheme}`}>
      <div className="desktop-layout__wrapper">
        <div className="desktop-layout__container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;

import { useOnlineStatus } from '../hooks/useOnlineStatus';
import './OfflineBanner.css';

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="offline-banner">
      <span className="offline-icon">📡</span>
      <span className="offline-text">Sem internet — modo somente leitura</span>
    </div>
  );
};

export default OfflineBanner;

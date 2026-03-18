import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useGameStore } from '../store/useGameStore';
import './ParentAccessGate.css';

interface ParentAccessGateProps {
  children: ReactNode;
}

const ParentAccessGate = ({ children }: ParentAccessGateProps) => {
  const unlockedUntil = useGameStore((state) => state.parentSecurity.unlockedUntil);
  const unlockParentAccess = useGameStore((state) => state.unlockParentAccess);
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isUnlocked = !!unlockedUntil && now < unlockedUntil;

  if (isUnlocked) {
    return <>{children}</>;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = unlockParentAccess(pin);
    setMessage(result.message);
    if (result.success) {
      setPin('');
    }
  };

  return (
    <div className="parent-gate">
      <div className="parent-gate__card">
        <h1>🔒 Área dos Pais</h1>
        <p>Digite o PIN para acessar o painel parental.</p>

        <form onSubmit={handleSubmit} className="parent-gate__form">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="PIN (4 a 8 dígitos)"
            className="parent-gate__input"
            aria-label="PIN dos pais"
            required
          />
          <button type="submit" className="parent-gate__button">
            Desbloquear
          </button>
        </form>

        {message && <p className="parent-gate__message">{message}</p>}
      </div>
    </div>
  );
};

export default ParentAccessGate;

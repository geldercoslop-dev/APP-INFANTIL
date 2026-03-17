import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { getLocalISODate } from '../utils/dateUtils';
import BackButton from '../components/BackButton';
import './Page.css';

const isValidBackupPayload = (data: unknown): data is Record<string, unknown> => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const payload = data as Record<string, unknown>;
  const hasRequiredBlocks =
    typeof payload.user === 'object' &&
    payload.user !== null &&
    typeof payload.profile === 'object' &&
    payload.profile !== null &&
    typeof payload.moods === 'object' &&
    payload.moods !== null;

  if (!hasRequiredBlocks) {
    return false;
  }

  if (payload.parentSettings && typeof payload.parentSettings !== 'object') {
    return false;
  }

  if (payload.parentSecurity && typeof payload.parentSecurity !== 'object') {
    return false;
  }

  return true;
};

const Backup = () => {
  const { exportState, importState } = useGameStore();
  const [importError, setImportError] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    try {
      const data = exportState();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kids-mission-backup-${getLocalISODate()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setImportError('Erro ao exportar backup');
      setTimeout(() => setImportError(''), 3000);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError('');
    setImportSuccess('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!isValidBackupPayload(data)) {
          throw new Error('Estrutura inválida');
        }
        
        // Confirm before importing
        if (confirm('Isso vai substituir seus dados atuais. Tem certeza?')) {
          importState(data);
          setImportSuccess('Backup importado com sucesso!');
          setTimeout(() => setImportSuccess(''), 3000);
        }
      } catch {
        setImportError('Arquivo inválido ou corrompido');
        setTimeout(() => setImportError(''), 3000);
      } finally {
        setIsImporting(false);
        // Clear file input
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      setImportError('Erro ao ler arquivo');
      setTimeout(() => setImportError(''), 3000);
      setIsImporting(false);
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  return (
    <div className="page">
      <BackButton to="/home" />
      <div className="page__header">
        <h1>💾 Backup</h1>
        <p>Exporte e importe seus dados do jogo</p>
      </div>
      
      <div className="page__content">
        <div className="backup-section">
          <h2>📤 Exportar Backup</h2>
          <p className="backup-description">
            Baixe todos os seus dados (missões, conquistas, perfil, etc.) em um arquivo JSON.
          </p>
          <button 
            className="btn btn-primary btn-large"
            onClick={handleExport}
          >
            <span className="btn-icon">💾</span>
            Exportar Backup
          </button>
        </div>

        <div className="backup-section">
          <h2>📥 Importar Backup</h2>
          <p className="backup-description">
            Restaure seus dados a partir de um arquivo de backup anterior.
          </p>
          <div className="import-controls">
            <label className="file-input-label">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="file-input"
              />
              <span className="file-input-text">
                {isImporting ? 'Importando...' : 'Escolher arquivo JSON'}
              </span>
            </label>
          </div>
        </div>

        {importError && (
          <div className="backup-message backup-error">
            <span className="message-icon">❌</span>
            <span>{importError}</span>
          </div>
        )}

        {importSuccess && (
          <div className="backup-message backup-success">
            <span className="message-icon">✅</span>
            <span>{importSuccess}</span>
          </div>
        )}

        <div className="backup-info">
          <h3>ℹ️ Informações Importantes</h3>
          <ul className="info-list">
            <li>O backup contém todo o seu progresso, perfil e conquistas</li>
            <li>Importar um backup substitui completamente seus dados atuais</li>
            <li>Guarde seus backups em lugar seguro</li>
            <li>Recomendamos fazer backup regularmente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Backup;

import React, { useState, useEffect } from 'react';
import { analyzeCode } from './services/analyzerService';
import type{ Language, Issue } from './types';

// Definimos la estructura de un elemento del historial
interface HistoryItem {
  id: number;
  code: string;
  language: Language;
  date: string;
  issueCount: number;
}

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<Language>('java');
  const [results, setResults] = useState<Issue[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 1. Cargar historial al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem('analysis_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleAnalyze = () => {
    const foundIssues = analyzeCode(code, language);
    setResults(foundIssues);

    // 2. Guardar en el historial
    const newItem: HistoryItem = {
      id: Date.now(),
      code: code,
      language: language,
      date: new Date().toLocaleString(),
      issueCount: foundIssues.length
    };

    const updatedHistory = [newItem, ...history].slice(0, 10); // Guardamos solo los últimos 10
    setHistory(updatedHistory);
    localStorage.setItem('analysis_history', JSON.stringify(updatedHistory));
  };

  const loadFromHistory = (item: HistoryItem) => {
    setCode(item.code);
    setLanguage(item.language);
    // Re-analizamos automáticamente al cargar
    setResults(analyzeCode(item.code, item.language));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>🛡️ Clean Code Analyzer</h1>
      </header>

      <main style={styles.main}>
        {/* Panel Izquierdo: Editor e Historial */}
        <section style={styles.leftPanel}>
          <div style={styles.toolbar}>
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} style={styles.select}>
              <option value="java">☕ Java</option>
              <option value="javascript">📜 JavaScript</option>
              <option value="sql">🗄️ SQL</option>
            </select>
            <button onClick={handleAnalyze} style={styles.button}>Analizar</button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Pega tu código aquí..."
            style={styles.textarea}
          />

          {/* Sección de Historial */}
          <div style={styles.historySection}>
            <h4 style={{ color: '#64748b', marginBottom: '10px' }}>Recientes</h4>
            <div style={styles.historyList}>
              {history.map(item => (
                <div key={item.id} onClick={() => loadFromHistory(item)} style={styles.historyItem}>
                  <span>{item.date}</span>
                  <span style={styles.historyBadge}>{item.issueCount} issues</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Panel Derecho: Resultados */}
        <section style={styles.resultsSection}>
          <div style={styles.healthContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong>Salud del Código</strong>
              <span>{calculateHealth(results)}%</span>
            </div>
            <div style={styles.healthBarBg}>
              <div style={{
                ...styles.healthBarFill,
                width: `${calculateHealth(results)}%`,
                backgroundColor: calculateHealth(results) > 70 ? '#22c55e' : calculateHealth(results) > 40 ? '#f59e0b' : '#ef4444'
              }} />
            </div>
          </div>

          <h2>Issues Detectados ({results.length})</h2>
          {/* Aquí sigue tu mapeo de resultados... */}
        </section>
        {/* Panel Derecho: Resultados (Igual al anterior con el botón de copiar) */}
        <section style={styles.resultsSection}>
          <h2>Resultados ({results.length})</h2>
          {results.map((issue, index) => (
            <div key={index} style={{...styles.card, borderLeft: `6px solid ${getSeverityColor(issue.severity)}`}}>
              <div style={styles.cardHeader}>
                <span style={styles.ruleId}>{issue.ruleId}</span>
                <span style={{...styles.badge, backgroundColor: getSeverityColor(issue.severity)}}>{issue.severity}</span>
              </div>
              <h4 style={styles.ruleName}>{issue.ruleName}</h4>
              <p>{issue.message}</p>
              {issue.suggestedFix && (
                <div style={styles.fixBox}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong>Sugerencia:</strong>
                    <button onClick={() => { navigator.clipboard.writeText(issue.suggestedFix!); alert('Copiado'); }} style={styles.copyButton}>Copiar</button>
                  </div>
                  <pre style={styles.pre}><code>{issue.suggestedFix}</code></pre>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

// Helper para colores
const getSeverityColor = (sev: string) => {
  switch (sev) {
    case 'CRITICAL': return '#ef4444';
    case 'WARNING': return '#f59e0b';
    default: return '#3b82f6';
  }
};

const calculateHealth = (issues: Issue[]) => {
  if (issues.length === 0) return 100;
  // Penalización por severidad
  const penalty = issues.reduce((acc, issue) => {
    if (issue.severity === 'CRITICAL') return acc + 20;
    if (issue.severity === 'WARNING') return acc + 10;
    return acc + 5;
  }, 0);
  return Math.max(0, 100 - penalty);
};

// Estilos rápidos
const styles: Record<string, React.CSSProperties> = {
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100vh', 
    fontFamily: 'Inter, system-ui, sans-serif', 
    backgroundColor: '#f8fafc' 
  },
  header: { 
    padding: '1rem 2rem', 
    backgroundColor: '#1e293b', 
    color: 'white' 
  },
  main: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '20px', 
    padding: '20px', 
    flex: 1, 
    overflow: 'hidden' 
  },
  leftPanel: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px', 
    overflow: 'hidden' 
  },
  toolbar: { display: 'flex', gap: '10px', alignItems: 'center' },
  select: { padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' },
  button: { padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  textarea: { flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'Fira Code, monospace', fontSize: '14px', resize: 'none', outline: 'none' },
  resultsSection: { overflowY: 'auto', paddingRight: '10px' },
  card: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  ruleId: { fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' },
  badge: { padding: '2px 8px', borderRadius: '12px', color: 'white', fontSize: '0.7rem', fontWeight: 'bold' },
  ruleName: { margin: '0 0 10px 0', color: '#1e293b' },
  message: { fontSize: '0.9rem', color: '#475569', lineHeight: '1.4' },
  fixBox: { marginTop: '10px', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '4px', fontSize: '0.85rem' },
  pre: { marginTop: '5px', overflowX: 'auto', color: '#0f172a' },
  emptyState: { textAlign: 'center', marginTop: '50px', color: '#94a3b8' },
  copyButton: {
    padding: '4px 10px',
    fontSize: '0.75rem',
    backgroundColor: '#10b981', 
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  historySection: { 
    marginTop: '10px', 
    padding: '10px', 
    backgroundColor: '#e2e8f0', 
    borderRadius: '8px' 
  },
  historyList: { 
    display: 'flex', 
    gap: '8px', 
    overflowX: 'auto', 
    paddingBottom: '5px' 
  },
  historyItem: { 
    minWidth: '150px', 
    padding: '8px', 
    backgroundColor: 'white', 
    borderRadius: '5px', 
    fontSize: '0.75rem', 
    cursor: 'pointer', 
    border: '1px solid #cbd5e1' 
  },
  historyBadge: { 
    display: 'block', 
    color: '#2563eb', 
    fontWeight: 'bold', 
    marginTop: '4px' 
  },
  healthContainer: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  healthBarBg: {
    height: '10px',
    backgroundColor: '#e2e8f0',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  healthBarFill: {
    height: '100%',
    transition: 'width 0.5s ease-in-out, background-color 0.5s'
  },
};
export default App;
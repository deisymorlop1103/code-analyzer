import React, { useState } from 'react';
import { analyzeCode } from './services/analyzerService';
import type { Language, Issue } from './types';
import './App.css'; // Asegúrate de tener estilos básicos

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<Language>('java');
  const [results, setResults] = useState<Issue[]>([]);

  const handleAnalyze = () => {
    const foundIssues = analyzeCode(code, language);
    setResults(foundIssues);
  };

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Analizador de Clean Code & SonarQube</h1>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Lenguaje: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
          <option value="java">Java</option>
          <option value="sql">SQL (Proximamente)</option>
          <option value="javascript">JavaScript (Proximamente)</option>
        </select>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Pega tu clase o método aquí..."
        rows={15}
        style={{ width: '100%', fontFamily: 'monospace', padding: '10px' }}
      />

      <button 
        onClick={handleAnalyze} 
        style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
      >
        Analizar Código
      </button>

      <div className="results-panel" style={{ marginTop: '30px' }}>
        <h2>Resultados ({results.length})</h2>
        {results.length === 0 && <p>¡Todo limpio! No se encontraron problemas.</p>}
        
        {results.map((issue, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px', borderLeft: `5px solid ${issue.severity === 'CRITICAL' ? 'red' : issue.severity === 'WARNING' ? 'orange' : 'blue'}` }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{issue.ruleName} ({issue.ruleId})</h3>
            <p><strong>Problema:</strong> {issue.message}</p>
            {issue.suggestedFix && (
              <div style={{ background: '#f4f4f4', padding: '10px', borderRadius: '4px' }}>
                <strong>💡 Ejemplo de solución:</strong>
                <pre style={{ margin: 0 }}><code>{issue.suggestedFix}</code></pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
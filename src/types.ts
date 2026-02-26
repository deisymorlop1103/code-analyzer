export type Language = 'java' | 'javascript' | 'sql' | 'hql';

export interface Issue {
  ruleId: string;
  ruleName: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  suggestedFix?: string; // Ejemplo de cómo debería quedar
}

export interface Rule {
  id: string;
  name: string;
  targetLanguage: Language;
  // La función que recibe el código y devuelve los problemas encontrados
  analyze: (code: string) => Issue[]; 
}
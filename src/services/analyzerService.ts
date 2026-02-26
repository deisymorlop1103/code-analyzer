import type { Rule, Issue, Language } from '../types';
import { javaRules } from '../rules/javaRules';
import { sqlRules } from '../rules/sqlRules';
// import { sqlRules } from '../rules/sqlRules'; <-- Así agregarías más en el futuro

// Registro central de reglas
const ALL_RULES: Rule[] = [
  ...javaRules,
  ...sqlRules
  // ...sqlRules
];

export const analyzeCode = (code: string, language: Language): Issue[] => {
  const issues: Issue[] = [];
  
  // Filtramos solo las reglas que aplican al lenguaje seleccionado
  const activeRules = ALL_RULES.filter(rule => rule.targetLanguage === language);

  // Ejecutamos cada regla contra el código
  activeRules.forEach(rule => {
    const ruleIssues = rule.analyze(code);
    issues.push(...ruleIssues);
  });

  return issues;
};
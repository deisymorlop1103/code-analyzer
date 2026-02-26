
import type { Rule } from '../types';

export const hqlRules: Rule[] = [
{
  id: 'hql:S101',
  name: 'Avoid positional parameters',
  targetLanguage: 'hql',
  analyze: (code: string) => {
    const issues = [];
    if (/\?/.test(code)) { // Detecta ? en lugar de :nombre
      issues.push({
        ruleId: 'hql:S101',
        ruleName: 'Parámetros posicionales en HQL',
        message: 'Usa parámetros nombrados (:name) en lugar de posicionales (?) para mejorar la legibilidad.',
        severity: 'INFO' as const,
        suggestedFix: 'Query q = session.createQuery("FROM User WHERE id = :id");\nq.setParameter("id", userId);'
      });
    }
    return issues;
  }
}];
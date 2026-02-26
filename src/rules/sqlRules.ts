import type { Rule } from '../types';

export const sqlRules: Rule[] = [
  {
    id: 'sql:S110',
    name: 'Avoid SELECT *',
    targetLanguage: 'sql',
    analyze: (code: string) => {
      const issues = [];
      if (/SELECT\s+\*/i.test(code)) {
        issues.push({
          ruleId: 'sql:S110',
          ruleName: 'Uso de SELECT *',
          message: 'Especifica las columnas explícitamente para mejorar el rendimiento y evitar errores si la tabla cambia.',
          severity: 'WARNING' as const,
          suggestedFix: 'SELECT id, nombre, fecha FROM tabla;'
        });
      }
      return issues;
    }
  }
];
import type { Rule } from '../types';

export const jsRules: Rule[] = [

{
  id: 'js:no-eval',
  name: 'Avoid using eval()',
  targetLanguage: 'javascript',
  analyze: (code: string) => {
    const issues = [];
    if (/eval\(.*\)/.test(code)) {
      issues.push({
        ruleId: 'js:no-eval',
        ruleName: 'Uso de eval() peligroso',
        message: 'La función eval() es un riesgo de seguridad...',
        severity: 'CRITICAL' as const, 
        suggestedFix: 'Usa JSON.parse()...'
      });
    }
    return issues;
  }
}];






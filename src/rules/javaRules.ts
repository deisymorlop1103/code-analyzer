import type { Rule } from '../types';

export const javaRules: Rule[] = [
  {
    id: 'java:S106',
    name: 'Standard outputs should not be used directly',
    targetLanguage: 'java',
    analyze: (code: string) => {
      const issues = [];
      if (/System\.(out|err)\.print/g.test(code)) {
        issues.push({
          ruleId: 'java:S106',
          ruleName: 'Evitar System.out.println',
          message: 'Los loggers deben usarse en lugar de System.out o System.err por Clean Code y control de niveles de log.',
          severity: 'WARNING' as const,
          suggestedFix: 'Reemplaza System.out.println("mensaje"); por logger.info("mensaje");'
        });
      }
      return issues;
    }
  },
  {
    id: 'java:S108',
    name: 'Nested blocks of code should not be left empty',
    targetLanguage: 'java',
    analyze: (code: string) => {
      const issues = [];
      // Busca bloques catch vacíos de forma básica
      if (/catch\s*\([^)]+\)\s*\{\s*\}/g.test(code)) {
        issues.push({
          ruleId: 'java:S108',
          ruleName: 'Bloques catch vacíos',
          message: 'Ignorar excepciones ocultará errores y hará que la aplicación sea difícil de depurar.',
          severity: 'CRITICAL' as const,
          suggestedFix: 'catch (Exception e) {\n    logger.error("Error al procesar", e);\n    throw new CustomException(e);\n}'
        });
      }
      return issues;
    }
  },
  {
    id: 'clean:Naming',
    name: 'Class names should comply with a naming convention',
    targetLanguage: 'java',
    analyze: (code: string) => {
      const issues = [];
      const classMatch = code.match(/class\s+([a-z][A-Za-z0-9]*)/);
      if (classMatch) {
        issues.push({
          ruleId: 'clean:Naming',
          ruleName: 'Convención de nombres de Clases (PascalCase)',
          message: `El nombre de la clase "${classMatch[1]}" comienza en minúscula. En Java, las clases deben usar PascalCase.`,
          severity: 'INFO' as const,
          suggestedFix: `class ${classMatch[1].charAt(0).toUpperCase() + classMatch[1].slice(1)} {\n // ... \n}`
        });
      }
      return issues;
    }
  }
];
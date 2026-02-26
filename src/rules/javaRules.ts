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
  },
  {
  id: 'java:S2068',
  name: 'Hardcoded passwords are security risks',
  targetLanguage: 'java',
  analyze: (code: string) => {
    const issues = [];
    // Busca variables llamadas password, secret, token seguidas de un string
    const secretRegex = /(password|secret|token|pwd)\s*=\s*".+"[;|\s]/i;
    if (secretRegex.test(code)) {
      issues.push({
        ruleId: 'java:S2068',
        ruleName: 'Credenciales expuestas',
        message: 'Se detectó una posible contraseña o token escrito directamente en el código. Usa variables de entorno o un manejador de secretos (Vault).',
        severity: 'CRITICAL' as const,
        suggestedFix: 'String dbPassword = System.getenv("DB_PASSWORD");'
      });
    }
    return issues;
  }
},
{
  id: 'java:S3776',
  name: 'Cognitive Complexity of methods should not be too high',
  targetLanguage: 'java',
  analyze: (code: string) => {
    const issues = [];
    // Contamos cuántos bloques de control (if, for, while, switch) hay
    const complexityMatches = code.match(/(if|for|while|switch|catch)\s*\(/g);
    const count = complexityMatches ? complexityMatches.length : 0;

    if (count > 4) {
      issues.push({
        ruleId: 'java:S3776',
        ruleName: 'Complejidad Cognitiva Elevada',
        message: `Este método tiene demasiadas ramificaciones (${count}). Es difícil de entender y testear. Refactoriza extrayendo lógica a métodos más pequeños.`,
        severity: 'WARNING' as const,
        suggestedFix: '// Ejemplo: Extraer el interior del bucle a un nuevo método\npublic void procesarItem(Item item) { ... }'
      });
    }
    return issues;
  }
},
{
  id: 'clean:VariableNaming',
  name: 'Avoid cryptic variable names',
  targetLanguage: 'java',
  analyze: (code: string) => {
    const issues = [];
    // Busca variables de un solo caracter (excluyendo i, j, k para bucles)
    const crypticMatch = code.match(/(int|String|double|boolean|var)\s+([a-h|l-z])\s*=/g);
    
    if (crypticMatch) {
      issues.push({
        ruleId: 'clean:VariableNaming',
        ruleName: 'Nombres de variables no descriptivos',
        message: 'Evita usar nombres como "a", "x" o "temp". El nombre debe revelar la intención de la variable.',
        severity: 'INFO' as const,
        suggestedFix: 'int userAge = 25; // En lugar de int a = 25;'
      });
    }
    return issues;
  }
}
];
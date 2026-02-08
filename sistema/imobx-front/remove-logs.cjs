const fs = require('fs');
const path = require('path');

// Função para processar um arquivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;

    // Padrões para encontrar console.log (mas não console.error, console.warn)
    const patterns = [
      // console.log simples em uma linha
      /^(\s*)console\.log\([^;]*\);?\s*$/gm,
      // console.log com quebras de linha
      /^(\s*)console\.log\(\s*$/gm,
    ];

    // Substituir console.log por comentário
    patterns.forEach(pattern => {
      content = content.replace(pattern, (match, indent) => {
        changes++;
        return `${indent}// ${match.trim()}`;
      });
    });

    // Tratar console.log multi-linha de forma mais complexa
    const lines = content.split('\n');
    let inConsoleLog = false;
    let consoleLogStart = -1;
    let parenthesesCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Detectar início de console.log (mas não error/warn)
      if (trimmed.match(/^console\.log\s*\(/) && !inConsoleLog) {
        if (!trimmed.match(/^console\.(error|warn|info|debug|trace|table|time|timeEnd|group|groupEnd)/)) {
          inConsoleLog = true;
          consoleLogStart = i;
          parenthesesCount = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
          
          // Se completo na mesma linha
          if (parenthesesCount === 0 || trimmed.endsWith(');')) {
            if (!lines[i].trim().startsWith('//')) {
              lines[i] = lines[i].replace(/^(\s*)/, '$1// ');
              changes++;
            }
            inConsoleLog = false;
          }
        }
      } else if (inConsoleLog) {
        // Contar parênteses
        parenthesesCount += (line.match(/\(/g) || []).length;
        parenthesesCount -= (line.match(/\)/g) || []).length;
        
        // Se fechou o console.log
        if (parenthesesCount <= 0) {
          // Comentar todas as linhas do console.log
          for (let j = consoleLogStart; j <= i; j++) {
            if (!lines[j].trim().startsWith('//')) {
              lines[j] = lines[j].replace(/^(\s*)/, '$1// ');
            }
          }
          changes++;
          inConsoleLog = false;
        }
      }
    }

    content = lines.join('\n');

    // Salvar apenas se houve mudanças
    if (content !== originalContent && changes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}: ${changes} logs comentados`);
      return changes;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Erro em ${filePath}:`, error.message);
    return 0;
  }
}

// Função recursiva para processar diretório
function processDirectory(dirPath, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let totalChanges = 0;
  let filesProcessed = 0;

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Ignorar node_modules, dist, build, .git
        if (!['node_modules', 'dist', 'build', '.git', '.cursor'].includes(item)) {
          const result = processDirectory(fullPath, extensions);
          totalChanges += result.changes;
          filesProcessed += result.files;
        }
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (extensions.includes(ext)) {
          const changes = processFile(fullPath);
          if (changes > 0) {
            totalChanges += changes;
            filesProcessed++;
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao processar diretório ${dirPath}:`, error.message);
  }

  return { changes: totalChanges, files: filesProcessed };
}

// Executar
console.log('🚀 Iniciando remoção de console.log...\n');
const result = processDirectory('./src');
console.log(`\n✅ Concluído! ${result.files} arquivos modificados, ${result.changes} logs comentados.`);


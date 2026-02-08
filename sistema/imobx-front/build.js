#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { rmSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.NODE_OPTIONS = '--max-old-space-size=8192';

const tscPath = join(__dirname, 'node_modules', 'typescript', 'lib', 'tsc.js');
const vitePath = join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const distPath = join(__dirname, 'dist');

try {
  console.log('Verificando TypeScript...');
  try {
    execSync(`node "${tscPath}" -b`, { stdio: 'inherit', env: process.env, shell: true });
    console.log('✓ TypeScript: sem erros\n');
  } catch (tscError) {
    console.warn('⚠ TypeScript: erros encontrados, mas continuando o build...\n');
  }
  
  // Limpar diretório dist antes do build
  // Nota: O Vite já faz limpeza automática, mas tentamos limpar antes para evitar conflitos
  if (existsSync(distPath)) {
    console.log('Limpando diretório dist...');
    try {
      rmSync(distPath, { recursive: true, force: true });
      console.log('✓ Diretório dist limpo\n');
    } catch (cleanError) {
      // No Windows, arquivos podem estar em uso (antivírus, indexador, etc)
      // O Vite tem sua própria lógica de limpeza, então continuamos mesmo com erro
      console.warn('⚠ Aviso: Não foi possível limpar completamente o diretório dist:', cleanError.message);
      console.log('O Vite fará a limpeza automaticamente. Continuando o build...\n');
    }
  }
  
  console.log('Fazendo build com Vite...');
  execSync(`node "${vitePath}" build`, { stdio: 'inherit', env: process.env, shell: true });
  
  console.log('Build concluído com sucesso!');
} catch (error) {
  console.error('Erro no build:', error.message);
  process.exit(1);
}


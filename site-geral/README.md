# Site Geral

Projeto React com TypeScript, Material UI e Styled Components.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **Material UI** - Biblioteca de componentes React seguindo o Material Design
- **Styled Components** - CSS-in-JS com tagged template literals

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar em desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 🏗️ Build para produção

```bash
npm run build
```

## 👀 Preview da build

```bash
npm run preview
```

## 🗂️ Estrutura do Projeto

```
site-geral/
├── public/                    # Arquivos estáticos
│   └── vite.svg              # Favicon
├── src/                      # Código fonte
│   ├── components/           # Componentes reutilizáveis
│   │   └── Layout/          # Componentes de layout
│   │       ├── Container.tsx
│   │       ├── Section.tsx
│   │       └── index.ts
│   ├── pages/               # Páginas da aplicação
│   │   └── HomePage.tsx
│   ├── styles/              # Estilos globais
│   │   └── global.ts        # Estilos globais com Styled Components
│   ├── theme/               # Configurações de tema
│   │   ├── muiTheme.ts      # Tema do Material UI
│   │   └── styledTheme.ts   # Tema do Styled Components
│   ├── types/               # Definições de tipos TypeScript
│   │   └── index.ts
│   ├── utils/               # Funções utilitárias
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts
│   │   └── index.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   ├── index.css            # Estilos CSS básicos
│   └── vite-env.d.ts        # Tipos do Vite
├── index.html                # HTML base
├── package.json              # Dependências
├── tsconfig.json             # Configuração TypeScript
├── vite.config.ts            # Configuração Vite
└── README.md                 # Este arquivo
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## 🎨 Características

### Tema e Estilos
- **Material UI Theme**: Configuração completa com paleta de cores, tipografia e componentes customizados
- **Styled Components Theme**: Sistema de design consistente com variáveis CSS
- **Global Styles**: Reset CSS moderno, tipografia responsiva e utilitários
- **Google Fonts**: Fonte Inter para melhor legibilidade

### Componentes
- Componentes de layout reutilizáveis (Container, Section)
- Integração perfeita entre Material UI e Styled Components
- Tipagem TypeScript completa

### Utilitários
- Formatação de moeda brasileira (R$)
- Formatação de datas em pt-BR
- Tipos TypeScript genéricos e reutilizáveis


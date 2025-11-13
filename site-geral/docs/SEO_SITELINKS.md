# Configuração de Sitelinks do Google

Este documento descreve as configurações implementadas para habilitar os sitelinks do Google no site Dream Keys.

## O que são Sitelinks?

Sitelinks são links adicionais que aparecem abaixo do resultado principal do site nos resultados de pesquisa do Google. Eles ajudam os usuários a navegar diretamente para seções importantes do site.

## Configurações Implementadas

### 1. Sitemap.xml
- **Localização**: `public/sitemap.xml`
- **Descrição**: Contém todas as páginas importantes do site com suas prioridades e frequências de atualização
- **Páginas incluídas**:
  - Página inicial (prioridade 1.0)
  - Casas à Venda (prioridade 0.9)
  - Apartamentos à Venda (prioridade 0.9)
  - Casas para Locação (prioridade 0.9)
  - Apartamentos para Locação (prioridade 0.9)
  - Lançamentos (prioridade 0.8)
  - Corretores (prioridade 0.7)
  - Imobiliárias (prioridade 0.7)
  - Minha Casa Minha Vida (prioridade 0.8)

### 2. Robots.txt
- **Localização**: `public/robots.txt`
- **Descrição**: Configura quais páginas os crawlers do Google podem indexar
- **Configurações**:
  - Permite indexação de todas as páginas principais
  - Aponta para o sitemap.xml
  - Bloqueia páginas de desenvolvimento/teste

### 3. Dados Estruturados (Schema.org)
- **Localização**: `index.html`
- **Tipos implementados**:
  - **Organization**: Informações sobre a empresa
  - **WebSite**: Informações sobre o site com ItemList das páginas principais
  - **SearchAction**: Permite que o Google exiba uma caixa de pesquisa

### 4. Navegação Estruturada
- **HomePage**: Seção de navegação rápida com links para as principais páginas
- **Footer**: Seção "Links Rápidos" com navegação semântica usando tags `<nav>` e `<ul>`

## Próximos Passos para Ativar os Sitelinks

### 1. Configurar o Domínio
1. Atualize o domínio em `public/sitemap.xml` substituindo `dreamskeys.com.br` pelo domínio real
2. Atualize o domínio em `public/robots.txt` substituindo `dreamskeys.com.br` pelo domínio real
3. Atualize o domínio em `index.html` nos dados estruturados (Schema.org)

### 2. Submeter o Sitemap no Google Search Console
1. Acesse [Google Search Console](https://search.google.com/search-console)
2. Adicione sua propriedade (domínio do site)
3. Vá em "Sitemaps" no menu lateral
4. Adicione a URL do sitemap: `https://seusite.com.br/sitemap.xml`
5. Clique em "Enviar"

### 3. Verificar os Dados Estruturados
1. Use a [Ferramenta de Teste de Dados Estruturados](https://search.google.com/test/rich-results) do Google
2. Cole a URL da página inicial
3. Verifique se não há erros nos dados estruturados

### 4. Esperar a Indexação
- Os sitelinks são gerados automaticamente pelo Google
- Pode levar algumas semanas para aparecerem
- O Google decide quais links mostrar baseado em:
  - Relevância das páginas
  - Popularidade das páginas
  - Estrutura de navegação do site
  - Dados estruturados

## Boas Práticas para Sitelinks

### 1. Estrutura de Navegação Clara
- ✅ Links importantes na página inicial
- ✅ Navegação consistente em todo o site
- ✅ Links no footer para páginas importantes
- ✅ URLs descritivas e amigáveis

### 2. Conteúdo Relevante
- ✅ Cada página deve ter conteúdo único e relevante
- ✅ Títulos descritivos e únicos para cada página
- ✅ Meta descriptions apropriadas

### 3. Performance
- ✅ Site rápido e responsivo
- ✅ Boa experiência do usuário
- ✅ Páginas bem estruturadas

### 4. Autoridade
- ✅ Backlinks de qualidade
- ✅ Conteúdo atualizado regularmente
- ✅ Site confiável e seguro (HTTPS)

## Monitoramento

### Google Search Console
- Monitore o desempenho das páginas
- Verifique se o sitemap está sendo processado corretamente
- Acompanhe os erros de indexação

### Google Analytics
- Monitore o tráfego das páginas
- Identifique as páginas mais populares
- Ajuste a estratégia conforme necessário

## Notas Importantes

1. **Sitelinks são automáticos**: O Google decide quais links mostrar baseado em algoritmos próprios
2. **Não há garantia**: Não há como forçar o Google a mostrar sitelinks específicos
3. **Pode demorar**: Pode levar semanas ou meses para os sitelinks aparecerem
4. **Mudanças frequentes**: Os sitelinks podem mudar com o tempo baseado no comportamento dos usuários

## Recursos Úteis

- [Google Search Central - Sitelinks](https://developers.google.com/search/docs/appearance/sitelinks)
- [Google Search Console](https://search.google.com/search-console)
- [Schema.org - WebSite](https://schema.org/WebSite)
- [Ferramenta de Teste de Dados Estruturados](https://search.google.com/test/rich-results)

## Suporte

Se tiver dúvidas sobre a configuração dos sitelinks, consulte a documentação do Google Search Central ou entre em contato com a equipe de desenvolvimento.


# Ajustes de Status e Visibilidade – Ficha de Proposta

Este documento descreve os ajustes de **status** e **visibilidade** na ficha de proposta de compra, referenciados na documentação da API Ficha de Venda.

---

## Status da proposta

**Regra de negócio:** até o momento do envio, a proposta tem status **rascunho**. Ela só fica **disponível** após o envio (POST com sucesso).

| Valor        | Descrição |
|-------------|-----------|
| `rascunho`  | Proposta em rascunho (ainda não enviada). |
| `disponivel`| Proposta já enviada (disponível após o envio). |

- A **listagem** de propostas (`GET /api/ficha-proposta?corretorCpf=...` ou `?gestorCpf=...`) pode aceitar o parâmetro **`status`** para filtrar por `rascunho` ou `disponivel`.
- Cada item retornado pode incluir o campo **`status`** para exibição no front (badge, filtro, etc.).
- Na listagem “Propostas Anteriores”, as propostas exibidas são as já enviadas; quando a API não informar `status`, o front pode tratar como **disponível**.

**No frontend:**

- Em `fichaPropostaApi.ts`, o tipo `PropostaListItem` pode incluir `status?: 'rascunho' | 'disponivel'` quando a API retornar esse campo.
- O filtro `ListProposalsFilters` já possui `status?: string`; use os valores `'rascunho'` ou `'disponivel'` ao filtrar.
- Na tela de listagem (Propostas Anteriores), exibir o status de cada proposta (e opcionalmente um filtro por status) quando a API passar a devolver `status`.

---

## Visibilidade

A **visibilidade** das propostas segue a regra:

- **Qualquer usuário com CPF vinculado à unidade** pode acessar as propostas dessa unidade (conforme já implementado: listagem por `corretorCpf` ou `gestorCpf`).
- Corretor vê apenas propostas vinculadas a ele; gestor vê as da equipe (mesma unidade ou critério definido no backend).

Não é necessário alterar a lógica de listagem no front para “visibilidade” além do que já existe (obrigatoriedade de `corretorCpf` ou `gestorCpf` na listagem e no acesso ao PDF/assinaturas).

---

## Resumo para o frontend

1. **Status:** tratar e exibir `status` (`rascunho` \| `disponivel`) em `PropostaListItem` e, se desejado, filtro na listagem.
2. **Visibilidade:** manter o fluxo atual (corretorCpf/gestorCpf); a regra “CPF vinculado na unidade” é garantida pelo backend.

Quando o backend passar a retornar `status` nas listagens e a aceitar filtro `status`, o front já estará preparado para exibir e filtrar por esses valores.

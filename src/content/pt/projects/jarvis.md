---
title: Jarvis, o meu assistente pessoal de IA
summary: Um assistente controlado por voz, inspirado no J.A.R.V.I.S. do Homem de Ferro. Fica à escuta de uma palavra de ativação, entende linguagem natural e atua no meu PC e na minha casa inteligente.
period: Desde 2026
role: Projeto pessoal
tech: [Python, LLM API (Gemini), Reconhecimento de voz, Text-to-speech]
---

## A ideia

E se eu pudesse simplesmente _falar_ com o meu computador? O Jarvis é a minha versão de um assistente pessoal: digo a palavra de ativação, peço algo em linguagem simples e ele responde ou faz o que pedi.

## Como funciona

1. **Ouve** a palavra de ativação, cumprimenta-me ("Hello Sir, how can I help you today?") e transcreve o que digo.
2. **Entende** o pedido com um modelo de linguagem, que responde num formato JSON rigoroso: ou uma resposta de conversa, ou uma **chamada a uma ferramenta** com argumentos.
3. **Age** executando a ferramenta correspondente e **diz** o resultado em voz alta.

## O que já consegue fazer

- Abrir aplicações, bloquear o PC, agendar ou cancelar o encerramento.
- Ligar e desligar as luzes inteligentes de cada divisão.
- Consultar a meteorologia.
- Lembrar-se da conversa recente (uma janela deslizante de mensagens) para continuar o diálogo com naturalidade.

## Detalhes de engenharia que valorizo

- Um **registo de ferramentas**: adicionar uma nova capacidade é só escrever uma função e registá-la.
- Um **modo mock** que substitui a IA por correspondência de palavras-chave, para testar offline sem gastar chamadas à API.
- **Novas tentativas com back-off** quando o fornecedor de IA limita o número de pedidos.

## A seguir

Mais ferramentas, melhor voz e uma memória mais inteligente. Cresce uma funcionalidade de cada vez.

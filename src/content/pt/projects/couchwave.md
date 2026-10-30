---
title: Couchwave
summary: Uma consola de jogos de grupo para o ecrã grande, em que o telemóvel é o comando. A TV mostra o jogo, os amigos leem um código QR e jogam juntos em tempo real, sem instalar nenhuma aplicação.
period: Desde 2026
role: Projeto individual · arquitetura, front-end, back-end e deployment
---

## A ideia

Abre-se o Couchwave numa TV ou num portátil e aparece um código de sala e um código QR. Cada pessoa lê-o com o telemóvel, escolhe um nome e um avatar (ou tira uma selfie), e o telemóvel passa a ser o comando. O primeiro jogador a entrar é o anfitrião da sala: navega na biblioteca de jogos usando o telemóvel como joystick, inicia os jogos e pode expulsar jogadores.

## Os jogos até agora

- **Trivia relâmpago:** seis temas, tempo e duração configuráveis e uma pontuação em que a rapidez é uma aposta: respostas certas rápidas valem mais, mas respostas erradas rápidas custam mais. Termina com um pódio.
- **Draw & Guess:** o artista desenha uma palavra secreta com o dedo e cada traço aparece em direto na TV, enquanto os outros escrevem palpites no telemóvel, com letras reveladas como pistas à medida que o tempo passa.

## Como está construído

Um monorepo em TypeScript (Turborepo) com três aplicações e dois pacotes partilhados:

- **App da TV** em **React + Vite**, e um **comando para o telemóvel** em **React Native (Expo)** que funciona de forma nativa em iOS e Android ou diretamente no browser.
- **API em NestJS** com um gateway **Socket.IO** que detém todo o estado do jogo. Os telemóveis só enviam ações e é o servidor que decide o resultado, por isso ninguém consegue fazer batota.
- **Um único contrato de eventos tipado**, com esquemas **Zod**, partilhado pelo servidor, pela TV e pelos telemóveis: se um evento mudar de nome, nenhuma aplicação compila até ser atualizada.
- Um **motor de jogo puro**: cada minijogo é uma máquina de estados que recebe o tempo e a aleatoriedade como argumentos, o que o torna determinístico e fácil de testar.

## Os detalhes de que mais me orgulho

- **Ninguém perde o lugar.** Se um telemóvel bloquear ou perder o Wi-Fi, o jogador fica na sala durante um período de tolerância e volta a entrar automaticamente quando a ligação regressa. A TV também pode ser atualizada a meio de um jogo.
- **As contagens decrescentes coincidem em todos os ecrãs**, corrigindo o relógio de cada dispositivo que esteja adiantado ou atrasado em relação ao servidor.
- **Desenhos que ficam iguais em qualquer ecrã:** os traços são enviados em pequenos lotes a cada 50 ms, com coordenadas relativas a uma tela fixa, por isso adaptam-se a qualquer tamanho.
- **Um pipeline de CI/CD completo** em GitHub Actions: lint, verificação de tipos, testes unitários (Vitest), testes end-to-end da API com clientes de socket reais e testes **Playwright** em que uma TV e dois telemóveis jogam partidas completas num browser real. Só depois é feito o deploy da API (uma imagem **Docker** no Render) e das aplicações web (Vercel), por esta ordem, para que os front-ends nunca falem com uma API mais antiga.

## O que vem a seguir

Mais jogos, contas e perfis, pacotes de perguntas gerados por IA e salas suportadas por Redis, para que o servidor possa escalar para lá de uma única instância.

_O servidor gratuito adormece quando ninguém está a jogar, por isso a primeira sala pode demorar até um minuto a abrir._

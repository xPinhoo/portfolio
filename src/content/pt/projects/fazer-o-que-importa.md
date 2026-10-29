---
title: Fazer o Que Importa
summary: 'Aplicação web de apoio ao livro de autoajuda "STOP: Insónia". Os leitores leem códigos QR no livro para aceder a exercícios, ferramentas e conteúdos mais aprofundados.'
role: Developer, da primeira versão à publicação
---

## O contexto

Uma equipa de psicólogos dedicada à psicoterapia da **insónia** precisava de um complemento digital para os seus pacientes e, mais tarde, para os leitores do seu próprio livro de autoajuda, **_STOP: Insónia_**. O livro remete para o site através de **códigos QR**, para que o leitor possa saltar diretamente de um capítulo para o exercício correspondente ou para material mais aprofundado.

## O que construí

- **Contas pessoais** para que cada pessoa guarde o seu progresso, com áreas protegidas para utilizadores autenticados.
- **Descoberta de valores:** um exercício com cartas para identificar o que realmente importa e usá-lo como bússola.
- **Ações comprometidas:** transformar esses valores em ações concretas e acompanhá-las ao longo do tempo.
- **Diário do sono:** registos diários do sono, um horário de sono e uma vista detalhada de cada noite, para que pacientes e terapeutas possam acompanhar a evolução.
- **"Mito ou facto?":** um quiz interativo que desmonta crenças comuns sobre o sono, como "toda a gente precisa de 8 horas".
- **Recursos** e conteúdos guiados que complementam o livro.

## Por dentro

- Single-page app em **React** com routing do lado do cliente.
- **Firebase Authentication** para as contas e **Cloud Firestore** para os valores, ações e registos de sono de cada utilizador.
- Alojada no **Firebase Hosting**, com verificação automática de versão: depois de uma nova release, as sessões abertas detetam a nova versão e pedem ao utilizador para atualizar, para que ninguém fique preso a código antigo.

## Porque é importante para mim

É software que pessoas reais usam enquanto atravessam algo difícil. Está ao lado de um livro impresso, por isso tem de estar sempre online e ser simples de usar para leitores que podem não estar à vontade com tecnologia.

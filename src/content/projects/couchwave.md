---
title: Couchwave
summary: A party games console for the big screen, where your phone is the controller. The TV shows the game, friends scan a QR code and play together in real time, with no app to install.
status: ongoing
period: Since 2026
role: Solo project · architecture, front-end, back-end and deployment
tech: [TypeScript, React, React Native (Expo), NestJS, Socket.IO, Zod, Turborepo, Vitest, Playwright, Docker, GitHub Actions]
demo: https://couchwave-host.vercel.app
repo: https://github.com/xPinhoo/couchwave
cover: ../../assets/projects/couchwave.jpg
order: 0
---

## The idea

Open Couchwave on a TV or laptop and you get a room code and a QR code. Everyone scans it with their phone, picks a name and an avatar (or takes a selfie), and the phone becomes the controller. The first player to join is the room's host: they browse the games library using their phone as a joystick, start games and can kick players.

## The games so far

- **Quick-fire trivia:** six topics, configurable timer and length, and a scoring system where speed is a gamble: fast right answers score more, but fast wrong ones cost more. Ends with a podium.
- **Draw & Guess:** the artist draws a secret word with their finger and every stroke streams live to the TV while the others type guesses on their phones, with letter hints as the clock runs down.

## How it's built

A TypeScript monorepo (Turborepo) with three apps and two shared packages:

- **TV app** in **React + Vite**, and a **phone controller** in **React Native (Expo)** that runs natively on iOS and Android or straight in the browser.
- **NestJS API** with a **Socket.IO** gateway that owns all game state. Phones only send inputs and the server decides the outcome, so nobody can cheat.
- **One typed event contract** with **Zod** schemas, shared by the server, the TV and the phones: rename an event and every app fails to compile until it's updated.
- A **pure game engine**: each mini-game is a state machine that receives time and randomness as arguments, which makes it deterministic and easy to unit-test.

## The details I'm proud of

- **Nobody loses their seat.** If a phone sleeps or drops Wi-Fi, the player stays in the room for a grace period and silently rejoins on reconnect. The TV can be refreshed mid-game too.
- **Countdowns line up on every screen**, by correcting for each device's clock being ahead or behind the server's.
- **Drawing that looks the same everywhere:** strokes are sent in small batches every 50 ms, as coordinates relative to a fixed canvas, so they scale to any screen.
- **A full CI/CD pipeline** in GitHub Actions: lint, type checks, unit tests (Vitest), API end-to-end tests with real socket clients, and **Playwright** tests where a TV and two phones play complete games in a real browser. Only then does it deploy the API (a **Docker** image on Render) and the web apps (Vercel), in that order, so the front-ends never talk to an older API.

## What's next

More games, accounts and profiles, AI-generated question packs, and Redis-backed rooms so the server can scale beyond a single instance.

_The free server sleeps when nobody's playing, so the first room can take up to a minute to open._

---
title: Fazer o Que Importa
summary: 'Companion web app for the self-help book "STOP: Insónia". Readers scan QR codes in the book to reach exercises, tools and deeper content.'
status: completed
period: 2024 — 2026
role: Developer, from first build to deployment
tech: [React 18, React Router, Firebase Auth, Cloud Firestore, Firebase Hosting]
demo: https://saber-o-que-importa.web.app
cover: ../../assets/projects/fazer-o-que-importa.jpg
interactive: sleep-diary
order: 1
---

## The context

A team of psychologists working on psychotherapy for **insomnia** needed a digital companion for their patients, and later for readers of their own self-help book, **_STOP: Insónia_**. The book references the website through **QR codes**, so a reader can jump straight from a chapter to the matching exercise or to more in-depth material.

## What I built

- **Personal accounts** so each person keeps their own progress, with protected areas for signed-in users.
- **Values discovery:** a card-based exercise to identify what truly matters to you and use it as a compass.
- **Committed actions:** turning those values into concrete actions and tracking them over time.
- **Sleep diary:** daily sleep records, a sleep schedule and a detailed view of each night, so patients and therapists can follow progress.
- **"Myth or fact?":** an interactive quiz that debunks common beliefs about sleep, such as "everyone needs 8 hours".
- **Resources** and guided content that complement the book.

## Under the hood

- Single-page app in **React** with client-side routing.
- **Firebase Authentication** for accounts and **Cloud Firestore** for each user's values, actions and sleep records.
- Hosted on **Firebase Hosting**, with an automatic version check: after a new release, open sessions detect the new version and prompt users to refresh, so nobody gets stuck on stale code.

## Why it matters to me

This is software that real people use while dealing with something hard. It sits next to a printed book, so it has to stay online and simple to use for readers who may not be comfortable with technology.

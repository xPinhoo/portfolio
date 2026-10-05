---
title: Jarvis, my personal AI assistant
summary: A voice-controlled assistant inspired by Iron Man's J.A.R.V.I.S. It listens for a wake word, understands natural language and acts on my PC and smart home.
status: ongoing
period: Since 2026
role: Personal project
tech: [Python, LLM API (Gemini), Speech recognition, Text-to-speech]
visual: voice
order: 1
---

## The idea

What if I could just _talk_ to my computer? Jarvis is my take on a personal assistant: say the wake word, ask for something in plain language, and it either answers or does it.

## How it works

1. **Listens** for a wake word, then greets me ("Hello Sir, how can I help you today?") and transcribes what I say.
2. **Understands** the request with a large language model, which replies in a strict JSON format: either a conversational answer or a **tool call** with arguments.
3. **Acts** by running the matching tool and **speaks** the result back.

## What it can do so far

- Open applications, lock the PC, schedule or cancel a shutdown.
- Turn smart lights on and off per room.
- Check the weather.
- Remember the recent conversation (a rolling window of messages) for natural follow-ups.

## Engineering details I care about

- A **tool registry**: adding a new ability is just writing a function and registering it.
- A **mock mode** that swaps the AI for keyword matching, for offline testing without using API calls.
- **Retry with back-off** when the AI provider rate-limits requests.

## Next up

More tools, better voice and a smarter memory. It grows one feature at a time.

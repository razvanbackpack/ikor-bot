---
sidebar_position: 1
---

# About

Welcome to the ikor-bot wiki!

You can find here some basic info about `ikor-bot`, how to run it, and how to modify it.

## Tech Stack
- TypeScript + Node.JS
- better-sqlite3 
- tsx

## What's in here?

### Commands
| COMMAND     | WHAT DO                                   |
|-------------|-------------------------------------------|
| ping        | Responds with Pong!                       |
| info        | Show some bot info                        |
| help        | Shows available commands                  |
| react       | Reacts to the user's message              |
| leaderboard | Shows the server's Level rank leaderboard |
| roll        | Roll a dice!                              |

### XP & Level system
The bot has a very basic XP and level system coded.
Messages are checked, for each user, based on a cooldown timer, and then rewarded XP points, and a level up if XP is enough.

**Cooldown** is **20 seconds** and it rewards **10 XP** per level. 
There is a modifier, but it is set to x1.

## How to run it?
1. Copy `.env.example` to `.env`
2. Get your bot token and fill it in `.env`
3. Run `npm run dev`



 

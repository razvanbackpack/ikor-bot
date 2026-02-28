# IKOR - Stoat chat bot
*Version: v0.1.2*

**NOTE: IKOR is heavily under development. Use it at your own risk.**

IKOR is a simple Stoat bot that aims to replicate some fun functionalities other bots had on Discord.  
This is primarily aimed at my group of friends, and built around our needs - but maybe the code helps other people that want to build bots.

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

### How to run it?
1. Copy `.env.example` to `.env`
2. Get your bot token and fill it in `.env`
3. `cd` into the code and then run `npm run dev`


### How to create a command?
```npm run create-command -- <command-name>```
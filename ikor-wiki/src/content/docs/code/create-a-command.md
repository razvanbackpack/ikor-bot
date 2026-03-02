---
title: Create a command
description: Create your first custom command
---
## Create your own command
```npm run create-command -- <command-name>```  
This creates `./src/commands/<command-name>.ts` with the default command boilerplate.

> Commands are discovered and loaded automatically at runtime, so after implementing the command
> logic, no manual import or registration step is required.

 
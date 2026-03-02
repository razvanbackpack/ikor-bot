---
sidebar_position: 5
---

# Create a command

```npm run create-command -- <command-name>```  
This creates `./src/commands/<command-name>.ts` with the default command boilerplate.

:::tip
Commands are discovered and loaded automatically at runtime, so after implementing the command logic, no manual import or registration step is required.
:::
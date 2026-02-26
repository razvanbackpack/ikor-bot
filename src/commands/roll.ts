import { register, type Command } from "./command";

interface RollResult {
  type: string;
  timesRolled: number;
  rolledNumbers: number[];
  totalSum: number,
  average: number,
  highestRoll: number,
  lowestRoll: number,
  error: {
    error: boolean;
    message: string;
  }
};

const roll: Command = {
  name: "roll",
  description: "Roll a dice. Example: !roll d20 10, rolls a d20 10 times and outputs the values",
  execute: async (message, args) => {
    const rollResult: RollResult = rollDice(args);
    const messageData: string[] = [];

    if(rollResult.error.error) {
      messageData.push(rollResult.error.message);
    } else {
      messageData.push(
        `${rollResult.type} rolled ${rollResult.timesRolled} times`
      );

      let rolledNumbers: string[] = [];
      
      rollResult.rolledNumbers.forEach((number, index) => {
        rolledNumbers.push(`**${number}**`);
      });

      messageData.push(`Rolls: [${rolledNumbers.join(', ')}]`);

      messageData.push(
      `Sum: ${rollResult.totalSum} | Average: ${rollResult.average}
      Highest: ${rollResult.highestRoll} | Lowest: ${rollResult.lowestRoll}`
      );
    }

    await message.reply({
    embeds: [{
      title: "Dice Roll",
      description: messageData.join("\n"),
      colour: "#00ff00"
    }]
  });
  }
}

function rollDice(args: string[]): RollResult {
  let rollResult = {} as RollResult;
  rollResult = {
    type: "",
    timesRolled: 0,
    rolledNumbers: [],
    totalSum: 0,
    average: 0,
    highestRoll: 0,
    lowestRoll: 9999999,
    error: {
      error: false,
      message: ""
    }
  };

  const diceType = args[0]?.trim() ?? "";
  const diceNumberArg = args[1]?.trim() ?? "";
  const parsedDiceType = parseDiceType(diceType);
  const diceNumber = parsePositiveInt(diceNumberArg);

  if(!parsedDiceType || !diceNumber)  {
    rollResult.error.error = true;

    rollResult.error.message = 
    `Wrong command usage!\n
    **!roll <diceType> <rollTimes>**
    <diceType> - d1, d4, d6, d8, d20, etc...
    <rollTimes> - 1, 2, 3, 4,
    example: !roll d20 10
    `;

    return rollResult;
  }

  const rolledNumbers: number[] = [];
  const sides = parsedDiceType;
  const times = diceNumber;

  let totalSum = 0;

  for(let i = 0; i < times; i++ ) {
    const rolledNumber = Math.floor(Math.random() * sides) + 1;

    rolledNumbers.push(rolledNumber);
    totalSum += rolledNumber;

    if(rolledNumber > rollResult.highestRoll) {
      rollResult.highestRoll = rolledNumber;
    }

    if(rolledNumber < rollResult.lowestRoll) {
      rollResult.lowestRoll = rolledNumber
    }
  }

  rollResult.type = diceType;
  rollResult.totalSum = totalSum;
  rollResult.rolledNumbers = rolledNumbers;
  rollResult.timesRolled = rolledNumbers.length;
  rollResult.average = totalSum/rolledNumbers.length;

  return rollResult;
}

function parseDiceType(input: string): number|null {
  const match = /^d(\d+)$/i.exec(input);
  if(!match) return null;

  const sides = Number(match[1]);

  if(!Number.isSafeInteger(sides) || sides < 1) return null;
  return sides;
}

function parsePositiveInt(input:string): number|null {
  const value = Number(input);
  if(!Number.isSafeInteger(value) || value < 1) return null;
  return value;
}

register(roll);

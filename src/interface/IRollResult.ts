export default interface IRollResult {
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

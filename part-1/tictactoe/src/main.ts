type IGetWinner = (state: Array<"x" | "o" | null>) => "x" | "o" | null;

export const getWinnerVerbose: IGetWinner = (state) => {
  if (
    state[0] &&
    state[1] &&
    state[2] &&
    state[0] === state[1] &&
    state[1] === state[2]
  ) {
    return state[0];
  }

  if (
    state[3] &&
    state[4] &&
    state[5] &&
    state[3] === state[4] &&
    state[4] === state[5]
  ) {
    return state[3];
  }

  if (
    state[6] &&
    state[7] &&
    state[8] &&
    state[6] === state[7] &&
    state[7] === state[8]
  ) {
    return state[6];
  }

  if (
    state[0] &&
    state[3] &&
    state[6] &&
    state[0] === state[3] &&
    state[3] === state[6]
  ) {
    return state[0];
  }

  if (
    state[1] &&
    state[4] &&
    state[7] &&
    state[1] === state[4] &&
    state[4] === state[7]
  ) {
    return state[1];
  }

  if (
    state[2] &&
    state[5] &&
    state[8] &&
    state[2] === state[5] &&
    state[5] === state[8]
  ) {
    return state[2];
  }

  if (
    state[0] &&
    state[4] &&
    state[8] &&
    state[0] === state[4] &&
    state[4] === state[8]
  ) {
    return state[0];
  }

  if (
    state[2] &&
    state[4] &&
    state[6] &&
    state[2] === state[4] &&
    state[4] === state[6]
  ) {
    return state[2];
  }

  return null;
};

const CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const getWinner: IGetWinner = (state) => {
  for (const condition of CONDITIONS) {
    const cells = condition.map((index) => state[index]);
    const symbol = cells[0];

    if (symbol && cells.every((value) => value === symbol)) {
      return symbol;
    }
  }

  return null;
};

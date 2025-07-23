export const enum playerStatus {
  INIT = 'idle', // Standing
  JUMP = 'jump', // Jumping
  RUN = 'run', // Running
  ROLL = 'roll', // Rolling down
  DANCE = 'dance', // Dancing
  LOOKBACK = 'lookback', // Looking back
  RUNLOOKBACK = 'runlookback', // Running and looking back
  FALL = 'fall', // Falling
  DIE = 'die', // Dying
}
export const Obstacal: any = {
  train: {
      x: 5.646066284179687,
      y: 8.351531163230542,
      z: 16.539642333984375,
  },
  kerbStone: {
      x: 3.7279505729675293,
      y: 3.6123956470692073,
      z: 3.989417910575868,
  },
};

export const enum GAME_STATUS {
  READY = 'ready',
  START = 'start',
  PAUSE = 'pause',
  END = 'end',
}

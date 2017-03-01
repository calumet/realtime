module.exports = {
  server: 'http://127.0.0.1:9700',
  token: 'realtime-testing',
  pause: 250,
  mock: {
    userCategory: 'CT1',
    spaceId: 'S1',
    case1: {
      space: 'aulavirtual',
      user: 'U1298',
      rooms: ['R1', 'R2', 'R3', 'R4'],
      sharedRoom: 'R1',
      isolatedRoom: 'R4',
    },
    case2: {
      space: 'aulavirtual',
      user: 'U1289',
      rooms: ['R1', 'R3', 'R5'],
      sharedRoom: 'R1',
      isolatedRoom: 'R5',
    },
    case3: {
      space: 'aulavirtual',
      roomTag: 'Mat42',
      user: 'U1292',
      rooms: ['R1', 'R3', 'R6', 'R7', 'R8'],
      sharedRoom: 'R1',
      noTagRoom: 'R3',
      isolatedRoom: 'R7',
    },
  },
};

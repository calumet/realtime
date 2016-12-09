module.exports = {
  server: 'http://127.0.0.1:9700',
  mock: {
    case1: {
      space: 'aulavirtual',
      user: 'U1298',
      rooms: [1, 2, 3, 4],
      sharedRoom: 1,
      isolatedRoom: 4,
    },
    case2: {
      space: 'aulavirtual',
      user: 'U1289',
      rooms: [1, 3, 5],
      sharedRoom: 1,
      isolatedRoom: 5,
    },
    case3: {
      space: 'aulavirtual',
      roomTag: 'Mat42',
      user: 'U1292',
      rooms: [1, 3, 6, 7, 8],
      sharedRoom: 1,
      noTagRoom: 3,
      isolatedRoom: 7,
    },
  },
  pause: 250,
};

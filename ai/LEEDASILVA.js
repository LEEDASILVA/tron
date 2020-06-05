/*******************************
 * functions given to the students
 ********************************/
const SIZE = 100
const MAP = new Int8Array(SIZE * SIZE)
const isFree = ({ x, y }) => MAP[y * SIZE + x] === 0
const isOccupied = ({ x, y }) => MAP[y * SIZE + x] === 1
const inBounds = (n) => n < SIZE && n >= 0
const isInBounds = ({ x, y }) => inBounds(x) && inBounds(y)
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

/***********
 * My functions
 ************/
const symmetric12 = (x, y, direction) => {
  if (direction === 1 || direction === 2) {
    let up = path(x, y - 1, 0, 0)
    let left = path(x - 1, y, 3, 0) /////////// isAlley use it to final version
    // console.log('up left', up, left)
    return up > left
      ? 1
      : up === 0 && left === 0
      ? 0
      : up === left && direction === 1
      ? 0
      : up === left && direction === 2
      ? 3
      : 2
  }
}
const symmetric03 = (x, y, direction) => {
  if (direction === 3 || direction === 0) {
    let right = path(x + 1, y, 1, 0)
    let down = path(x, y + 1, 2, 0)
    // console.log('down right', down, right)
    return down > right
      ? 3
      : down === 0 && right === 0
      ? 2
      : down === right && direction === 3
      ? 2
      : down === right && direction === 0
      ? 1
      : 0
  }
}
const symmetric01 = (x, y, direction) => {
  if (direction === 0 || direction === 1) {
    let down = path(x, y + 1, 2, 0)
    let left = path(x - 1, y, 3, 0)
    // console.log('down left', down, left)
    return down > left
      ? 1
      : down === 0 && left === 0
      ? 2
      : down === left && direction === 1
      ? 2
      : down === left && direction === 0
      ? 3
      : 0
  }
}
const symmetric23 = (x, y, direction) => {
  if (direction === 2 || direction === 3) {
    let up = path(x, y - 1, 0, 0)
    let right = path(x + 1, y, 1, 0)
    // console.log('up right', up, right)
    return up > right
      ? 3
      : up === 0 && right === 0
      ? 0
      : up === right && direction === 3
      ? 0
      : up === right && direction === 2
      ? 1
      : 2
  }
}

const isAlley = ({ x, y }) => !isFree({ x, y }) || !isInBounds({ x, y })

// this functions will find the best path, so the path that has more empty spaces
// so use `isFree`,
const findBestPath = (state) => {
  let arr = []

  if (state.player.cardinal === 0 || state.player.cardinal === 3) {
    // if it as a block on the symmetric position it must
    // simulate the symmetric position and see witch path is the best
    let xad = state.player.x - 1
    let yad = state.player.y - 1
    if (!isFree({ x: xad, y: yad })) {
      return state.player.coords[symmetric03(xad, yad, state.player.cardinal)]
    }
  }
  if (state.player.cardinal === 0 || state.player.cardinal === 1) {
    let xad = state.player.x + 1
    let yad = state.player.y - 1
    if (!isFree({ x: xad, y: yad })) {
      return state.player.coords[symmetric01(xad, yad, state.player.cardinal)]
    }
  }
  if (state.player.cardinal === 1 || state.player.cardinal === 2) {
    let xad = state.player.x + 1
    let yad = state.player.y + 1
    if (!isFree({ x: xad, y: yad })) {
      console.log(symmetric12(xad, yad, state.player.cardinal))
      return state.player.coords[symmetric12(xad, yad, state.player.cardinal)]
    }
  }
  if (state.player.cardinal === 2 || state.player.cardinal === 3) {
    let xad = state.player.x - 1
    let yad = state.player.y + 1
    if (!isFree({ x: xad, y: yad })) {
      return state.player.coords[symmetric23(xad, yad, state.player.cardinal)]
    }
  }

  for ({ x, y, cardinal } of state.player.coords) {
    // if everything is ok it must continue with the best path
    arr.push(path(x, y, cardinal, 0))
  }
  return state.player.coords[arr.indexOf(Math.max(...arr))]
}

const path = (x, y, car, count) => {
  if (car <= 0) {
    if (
      isAlley({ x: x + 1, y }) &&
      isAlley({ x: x, y: y - 1 }) &&
      isAlley({ x: x - 1, y })
    )
      return -1
    return !isFree({ x, y }) || !isFree({ x, y: y - 1 }) || !inBounds(y - 1)
      ? count
      : path(x, y - 1, car, count + 1)
  }
  if (car === 1) {
    if (
      isAlley({ x, y: y + 1 }) &&
      isAlley({ x, y: y - 1 }) &&
      isAlley({ x: x + 1, y })
    )
      return -1
    return !isFree({ x, y }) || !isFree({ x: x + 1, y }) || !inBounds(x + 1)
      ? count
      : path(x + 1, y, car, count + 1)
  }
  if (car === 2) {
    if (
      isAlley({ x: x - 1, y }) &&
      isAlley({ x, y: y + 1 }) &&
      isAlley({ x: x + 1, y })
    )
      return -1
    return !isFree({ x, y }) || !isFree({ x, y: y + 1 }) || !inBounds(y + 1)
      ? count
      : path(x, y + 1, car, count + 1)
  }
  if (car === 3) {
    if (
      isAlley({ x, y: y - 1 }) &&
      isAlley({ x: x - 1, y }) &&
      isAlley({ x, y: y + 1 })
    )
      return -1
    return !isFree({ x, y }) || !isFree({ x: x - 1, y }) || !inBounds(x - 1)
      ? count
      : path(x - 1, y, car, count + 1)
  }
}

// `update` this function is called at each turn
const update = (state) => {
  // this IA will have tho states:
  // - normal state that will try to play it safe
  //   avoiding the enemies if possible
  // - attack mode that will search for the enemies and try to trap him
  //   the attack mode will be for the min of 2 players

  // console.log(state.player)

  // return state.players.length <= 2 ? attackMode(state) : findBestPath(state)
  return findBestPath(state)
}

addEventListener(
  'message',
  (self.init = (initEvent) => {
    const { seed, id } = JSON.parse(initEvent.data)
    const isOwnPlayer = (p) => p.name === id
    const addToMap = ({ x, y }) => (MAP[y * SIZE + x] = 1)

    let _seed = seed // We use a seeded random to replay games
    const _m = 0x80000000
    Math.random = () => (_seed = (1103515245 * _seed + 12345) % _m) / (_m - 1)
    removeEventListener('message', self.init)
    addEventListener('message', ({ data }) => {
      const players = JSON.parse(data)
      const player = players.find(isOwnPlayer)
      players.forEach(addToMap) // I update the MAP with the new position of
      // each players

      postMessage(JSON.stringify(update({ players, player })))
    })
    postMessage('loaded') // Signal that the loading is over
  })
)

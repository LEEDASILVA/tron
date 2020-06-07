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
 * My functions // MUST REFACTOR THIS CODE !!!!!!!!!!!!!! VERY BAD!!!! BUT IT WORKS
 ************/
const symmetric12 = (x, y, direction) => {
  if (direction === 1 || direction === 2) {
    let up = calDistance(x, y - 1, 0, 0)
    let left = calDistance(x - 1, y, 3, 0)
    let line =
      direction === 1
        ? calDistance(x, y - 1, direction, 0)
        : calDistance(x - 1, y, direction, 0)
    // console.log('1 2 line up left', line, up, left)
    return line === -1 && !isFree({ x, y: y + 1 }) && direction === 1
      ? 0
      : line === -1 && !isFree({ x, y: y - 1 }) && direction === 1
      ? 2
      : line === -1 && !isFree({ x: x + 1, y }) && direction === 2
      ? 3
      : line === -1 && !isFree({ x: x - 1, y }) && direction === 2
      ? 1
      : (up === -1 || left === -1) && direction === 1
      ? 1
      : (up === -1 || left === -1) && direction === 2
      ? 2
      : up === 0 && left === 0
      ? 'nop'
      : up === left && direction === 1
      ? false // all sides occupied 0
      : up === left && direction === 2
      ? 3
      : line > up && line > left && direction === 2
      ? 2
      : line > up && line > left && direction === 1
      ? 1
      : up > left
      ? 1
      : 2
  }
}
const symmetric03 = (x, y, direction) => {
  if (direction === 3 || direction === 0) {
    let right = calDistance(x + 1, y, 1, 0)
    let down = calDistance(x, y + 1, 2, 0)
    let line =
      direction === 0
        ? calDistance(x + 1, y, direction, 0)
        : calDistance(x, y + 1, direction, 0)
    // console.log('0 3 down right', line, down, right)
    return line === -1 && !isFree({ x, y: y + 1 }) && direction === 3
      ? 0
      : line === -1 && !isFree({ x, y: y - 1 }) && direction === 3
      ? 2
      : line === -1 && !isFree({ x: x + 1, y }) && direction === 0
      ? 3
      : line === -1 && !isFree({ x: x - 1, y }) && direction === 0
      ? 1
      : (down === -1 || right === -1) && direction === 0
      ? 0
      : (down === -1 || right === -1) && direction === 3
      ? 3
      : down === 0 && right === 0
      ? 'nop'
      : down === right && direction === 3
      ? false // 2
      : down === right && direction === 0
      ? 1
      : down > right || (line > down && line > right && direction === 3)
      ? 3
      : down < right || (line > right && line > down && direction === 0)
      ? 0
      : 0
  }
}
const symmetric01 = (x, y, direction) => {
  if (direction === 0 || direction === 1) {
    let down = calDistance(x, y + 1, 2, 0)
    let left = calDistance(x - 1, y, 3, 0)
    let line =
      direction === 0
        ? calDistance(x - 1, y, direction, 0)
        : calDistance(x, y + 1, direction, 0)
    return line === -1 && !isFree({ x, y: y + 1 }) && direction === 1
      ? 0
      : line === -1 && !isFree({ x, y: y - 1 }) && direction === 1
      ? 2
      : line === -1 && !isFree({ x: x + 1, y }) && direction === 0
      ? 3
      : line === -1 && !isFree({ x: x - 1, y }) && direction === 0
      ? 1
      : (down === -1 || left === -1) && direction === 1
      ? 1
      : (down === -1 || left === -1) && direction === 0
      ? 0
      : down === 0 && left === 0
      ? 'nop'
      : down === left && direction === 1
      ? false // 2
      : down === left && direction === 0
      ? 3
      : down > left || (line > down && line > left && direction === 1)
      ? 1
      : down < left || (line > down && line > left && direction === 0)
      ? 0
      : 0
  }
}
const symmetric23 = (x, y, direction) => {
  if (direction === 2 || direction === 3) {
    let up = calDistance(x, y - 1, 0, 0)
    let right = calDistance(x + 1, y, 1, 0)
    let line =
      direction === 2
        ? calDistance(x + 1, y, direction, 0)
        : calDistance(x, y - 1, direction, 0)
    // console.log('2 3 line up right', line, up, right)
    return line === -1 && !isFree({ x, y: y + 1 }) && direction === 3
      ? 0
      : line === -1 && !isFree({ x, y: y - 1 }) && direction === 3
      ? 2
      : line === -1 && !isFree({ x: x + 1, y }) && direction === 2
      ? 3
      : line === -1 && !isFree({ x: x - 1, y }) && direction === 2
      ? 1
      : (up === -1 || right === -1) && direction === 3
      ? 3
      : (up === -1 || right === -1) && direction === 2
      ? 2
      : up === 0 && right === 0
      ? 'nop'
      : up === right && direction === 3
      ? false // 0
      : up === right && direction === 2
      ? 1
      : up > right || (line > up && line > right && direction === 3)
      ? 3
      : up < right || (line > right && line > right && direction === 2)
      ? 2
      : 2
  }
}

const isAlley = ({ x, y }) => !isFree({ x, y }) || !isInBounds({ x, y })

// this functions will find the best path, so the path that has more empty spaces
// so use `isFree`,
const findBestPath = (state) => {
  let arr = []

  if (state.player.cardinal === 2 || state.player.cardinal === 3) {
    let xad = state.player.x - 1
    let yad = state.player.y + 1
    const car = symmetric23(xad, yad, state.player.cardinal)
    if (!isFree({ x: xad, y: yad }) && car !== 'nop') {
      const index = car === false ? 0 : car
      return state.player.coords[index]
    }
  }
  if (state.player.cardinal === 0 || state.player.cardinal === 3) {
    // if it as a block on the symmetric position it must
    // simulate the symmetric position and see witch path is the best
    let xad = state.player.x - 1
    let yad = state.player.y - 1
    const car = symmetric03(xad, yad, state.player.cardinal)
    if (!isFree({ x: xad, y: yad }) && car !== 'nop') {
      const index = car === false ? 2 : car
      return state.player.coords[index]
    }
  }
  if (state.player.cardinal === 0 || state.player.cardinal === 1) {
    let xad = state.player.x + 1
    let yad = state.player.y - 1
    const car = symmetric01(xad, yad, state.player.cardinal)
    if (!isFree({ x: xad, y: yad }) && car !== 'nop') {
      const index = car === false ? 2 : car
      return state.player.coords[index]
    }
  }
  if (state.player.cardinal === 1 || state.player.cardinal === 2) {
    let xad = state.player.x + 1
    let yad = state.player.y + 1
    const car = symmetric12(xad, yad, state.player.cardinal)
    if (!isFree({ x: xad, y: yad }) && car !== 'nop') {
      const index = car === false ? 0 : car
      return state.player.coords[index]
    }
  }

  for ({ x, y, cardinal } of state.player.coords) {
    // if everything is ok it must continue with the best path
    arr.push(calDistance(x, y, cardinal, 0))
  }
  return state.player.coords[arr.indexOf(Math.max(...arr))]
}

// recursion
const calDistance = (x, y, car, count) => {
  if (car <= 0) {
    if (
      isFree({ x, y }) &&
      isAlley({ x: x + 1, y }) &&
      isAlley({ x: x, y: y - 1 }) &&
      isAlley({ x: x - 1, y })
    )
      return -1
    return !isFree({ x, y }) || !isFree({ x, y: y - 1 }) || !inBounds(y - 1)
      ? count
      : calDistance(x, y - 1, car, count + 1)
  }
  if (car === 1) {
    if (
      isFree({ x, y }) &&
      isAlley({ x, y: y + 1 }) &&
      isAlley({ x, y: y - 1 }) &&
      isAlley({ x: x + 1, y })
    )
      return -1
    return !isFree({ x, y }) || !isFree({ x: x + 1, y }) || !inBounds(x + 1)
      ? count
      : calDistance(x + 1, y, car, count + 1)
  }
  if (car === 2) {
    if (
      isFree({ x, y }) &&
      isAlley({ x: x - 1, y }) &&
      isAlley({ x, y: y + 1 }) &&
      isAlley({ x: x + 1, y })
    )
      return -1
    return !isFree({ x, y }) || !isFree({ x, y: y + 1 }) || !inBounds(y + 1)
      ? count
      : calDistance(x, y + 1, car, count + 1)
  }
  if (car === 3) {
    if (
      isFree({ x, y }) &&
      isAlley({ x, y: y - 1 }) &&
      isAlley({ x: x - 1, y }) &&
      isAlley({ x, y: y + 1 })
    )
      return -1
    return !isFree({ x, y }) || !isFree({ x: x - 1, y }) || !inBounds(x - 1)
      ? count
      : calDistance(x - 1, y, car, count + 1)
  }
}

const update = (state) => {
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

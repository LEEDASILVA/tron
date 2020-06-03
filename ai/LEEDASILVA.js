/*******************************
 * functions given to the students
 ********************************/
const SIZE = 100
const MAP = new Int8Array(SIZE * SIZE) // State of the Map
const isFree = ({ x, y }) => MAP[y * SIZE + x] === 0 // 0 = block free
const isOccupied = ({ x, y }) => MAP[y * SIZE + x] === 1 // 1 = block occupied
// `inBounds` check if our coord (n) is an existing index in our MAP
const inBounds = (n) => n < SIZE && n >= 0
// `isInBounds` check that properties x and y of our argument are both in bounds
const isInBounds = ({ x, y }) => inBounds(x) && inBounds(y)
// `pickRandom` Get a random element from an array
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

/***********
 * My functions
 ************/
// for now this function will search for enemies
// the goal is to KILL THEM ALL :D
// find the enemi that is mos close to has and focus on that one
const getEnemies = (players) =>
  players.filter((pl) => !/LEEDASILVA+/g.test(pl.name))

const attackMode = (state) => {
  let targets = getEnemies(state.players)
}

// this functions will find the best path, so the path that has more empty spaces
// so use `isFree`,
const findBestPath = (state) => {
  let arr = []
  for ({ x, y, cardinal } of state.player.coords) {
    arr.push(seeBig(x, y, cardinal, 0))
  }
  console.log(arr)
  return state.player.coords[arr.indexOf(Math.max(...arr))]
}

const isAlley = ({ x, y }) => !isFree({ x, y }) || !isInBounds({ x, y })

const seeBig = (x, y, car, count) => {
  if (car === 0) {
    // console.log(car, x, y, x - 1, x + 1, y + 1)
    if (
      isAlley({ x: x + 1, y }) &&
      isAlley({ x: x, y: y + 1 }) &&
      isAlley({ x: x - 1, y })
    )
      return 0
    return !isFree({ x, y }) || !inBounds(y)
      ? count
      : seeBig(x, y - 1, car, count + 1)
  }
  if (car === 1) {
    // console.log(car, x, y, x - 1, y + 1, y - 1)
    if (
      isAlley({ x, y: y + 1 }) &&
      isAlley({ x: x - 1, y }) &&
      isAlley({ x, y: y - 1 })
    )
      return 0
    return !isFree({ x, y }) || !inBounds(x)
      ? count
      : seeBig(x + 1, y, car, count + 1)
  }
  if (car === 2) {
    // console.log(car, x, y, x - 1, x + 1)
    if (
      isAlley({ x: x - 1, y }) &&
      isAlley({ x, y: y - 1 }) &&
      isAlley({ x: x + 1, y })
    )
      return 0
    return !isFree({ x, y }) || !inBounds(y)
      ? count
      : seeBig(x, y + 1, car, count + 1)
  }
  if (car === 3) {
    // console.log(car, x, y, x + 1, y - 1, y + 1)
    if (
      isAlley({ x, y: y - 1 }) &&
      isAlley({ x: x + 1, y }) &&
      isAlley({ x, y: y + 1 })
    )
      return 0
    return !isFree({ x, y }) || !inBounds(x)
      ? count
      : seeBig(x - 1, y, car, count + 1)
  }
}

// `update` this function is called at each turn
const update = (state) => {
  // this IA will have tho states:
  // - normal state that will try to play it safe
  //   avoiding the enemies if possible
  // - attack mode that will search for the enemies and try to trap him
  //   the attack mode will be for the min of 2 players

  // return state.players.length <= 2 ? attackMode(state) : findBestPath(state)
  return findBestPath(state)
}

// This part of the code should be left untouch since it's initializing
// and configuring communication of the web worker to the main page.
// Only edit that if you know your shit
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

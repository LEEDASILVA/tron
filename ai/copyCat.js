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
// for now this function will search for enemies
// the goal is to KILL THEM ALL :D
// find the enemy that is mos close to has and focus on that one
const getEnemies = (players) =>
  players.filter((pl) => !/kill+/g.test(pl.name))[0]

const attackMode = (state) => {
  let targets = getEnemies(state.players)
  for ([i, { x, y, cardinal }] of state.player.coords.entries()) {
    console.log(i, cardinal, state.player.coords, targets.cardinal)
    if (targets.cardinal === 0) return state.player.coords[2]
    if (targets.cardinal === 1) return state.player.coords[3]
    if (targets.cardinal === 2) return state.player.coords[0]
    if (targets.cardinal === 3) return state.player.coords[1]
  }
  return state.player.coords[0]
}

// `update` this function is called at each turn
const update = (state) => {
  // this IA will have tho states:
  // - normal state that will try to play it safe
  //   avoiding the enemies if possible
  // - attack mode that will search for the enemies and try to trap him
  //   the attack mode will be for the min of 2 players

  return attackMode(state)
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

/* eslint import/no-mutable-exports: off */
let SHIP_TYPES = null
let SYSTEMS_DATA = null

function loadData() {
  if (SHIP_TYPES && SYSTEMS_DATA) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('already loaded!')
    }
    return Promise.resolve()
  }
  const m1 = import('./systems.json')
    .then(module => { SYSTEMS_DATA = module.default })
  const m2 = import('./SHIP_TYPES.json')
    .then(module => { SHIP_TYPES = module.default })
  return Promise.all([m1, m2])
}
// const file = require('./SHIP_TYPES.json')

// export const SYSTEMS_DATA = SYSTEMS_DATA
// export const SHIP_TYPES = SHIP_TYPES


let npcs
if (process.env.NODE_ENV === 'development') {
  npcs = require('./npcs.json')
} else {
  npcs = []
}

const CITADELS = [
  40340, // "Upwell Palatine Keepstar"
  35834, // "Keepstar"
  35827, // "Sotiyo"
  47512, // "'Moreau' Fortizar'"
  47513, // "'Draccous' Fortizar'"
  47514, // "'Horizon' Fortizar'"
  47515, // "'Marginis' Fortizar'"
  47516, // "'Prometheus' Fortizar'"
  35833, // "Fortizar"
  35836, // "Tatara"
  35826, // "Azbel"
  35832, // "Astrahus"
  35835, // "Athanor"
  35825, // "Raitaru"
  45006, // "♦ Sotiyo"
  35840, // Pharolux Cyno Beacon
  35841, // Ansiblex Jump Gate
  37846, // Standup Cruise Missile
  37847, // Standup Heavy Missile
  37848, // Standup Light Missile
  37849, // Standup Heavy Guided Bomb
  37850, // Standup Light Guided Bomb
  35923, // Standup Guided Bomb Launcher I
  35924, // Standup XL Energy Neutralizer I
  35925, // Standup Heavy Energy Neutralizer I
  35943, // Standup Stasis Webifier I
  35949, // Standup Focused Warp Disruptor I
  47334, // Standup Focused Warp Disruptor II
]

const NPC_SHIPS = npcs
// [
//   11899, // Angel General
//   11024, // Angel Impaler
// ]

export {
  loadData,
  SYSTEMS_DATA,
  SHIP_TYPES,
  CITADELS,
  NPC_SHIPS,
}

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
  35941, // Standup Remote Sensor Dampener I
  47368, // Standup Remote Sensor Dampener II
  35945, // Standup Weapon Disruptor I
  47364, // Standup Weapon Disruptor II
  35947, // Standup Target Painter I
  47366, // Standup Target Painter II
  35949, // Standup Focused Warp Disruptor I
  47334, // Standup Focused Warp Disruptor II
  47332, // Standup Heavy Energy Neutralizer II
  47330, // Standup XL Energy Neutralizer II
  47327, // Standup Point Defense Battery II
  47325, // Standup Guided Bomb Launcher II
  47323, // Standup Anticapital Missile Launcher II
  47298, // Standup Multirole Missile Launcher II

  47035, // Standup Templar I
  47036, // Standup Gram I
  47037, // Standup Siren I
  47038, // Standup Mantis I
  47039, // Standup Gungnir I
  47116, // Standup Malleus I
  47117, // Standup Cyclops I
  47118, // Standup Tyrfing I
  47119, // Standup Malleus II
  47120, // Standup Mantis II
  47121, // Standup Cyclops II
  47122, // Standup Tyrfing II
  47123, // Standup Shadow
  47124, // Standup Ametat I
  47125, // Standup Termite I
  47126, // Standup Antaeus I
  47127, // Standup Ametat II
  47128, // Standup Termite II
  47129, // Standup Antaeus II
  47130, // Standup Gungnir II
  47131, // Standup Cenobite I
  47132, // Standup Scarab I
  47133, // Standup Dromi I
  47134, // Standup Cenobite II
  47135, // Standup Scarab II
  47136, // Standup Siren II
  47137, // Standup Dromi II
  47138, // Standup Dragonfly I
  47139, // Standup Firbolg I
  47140, // Standup Einherji I
  47141, // Standup Templar II
  47142, // Standup Dragonfly II
  47143, // Standup Firbolg II
  47144, // Standup Einherji II
  47145, // Standup Equite I
  47146, // Standup Locust I
  47147, // Standup Satyr I
  47148, // Standup Equite II
  47149, // Standup Locust II
  47150, // Standup Satyr II
  47151, // Standup Gram II
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

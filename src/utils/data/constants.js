const file = require('./SHIP_TYPES.json')

let npcs
if (process.env.NODE_ENV === 'development') {
  npcs = require('./npcs.json')
} else {
  npcs = []
}

export const SHIP_TYPES = file

export const CITADELS = [
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

export const NPC_SHIPS = npcs
// [
//   11899, // Angel General
//   11024, // Angel Impaler
// ]

class NamesUtils {

  printLocalStorageSpace(titleLog = 'Current local storage:') {
    let data = ''
    console.log(titleLog)
    for (const key in window.localStorage) { // eslint-disable-line
      if (window.localStorage.hasOwnProperty(key)) { // eslint-disable-line
        data += window.localStorage[key]
        const size = ((window.localStorage[key].length * 16) / (8 * 1024)).toFixed(2)
        console.log(`  ${key}: ${size} KB`)
      }
    }
    const totalSize = ((data.length * 16) / (8 * 1024)).toFixed(2)
    console.log(data ? `Total space used: ${totalSize} KB` : 'Empty (0 KB)')
    console.log(data ? `Approx. space remaining: ${5120 - totalSize} KB` : '5 MB')
  }

  extractUnknownNames(data, alreadyExistNames) {
    const all = {
      allys: {},
      corps: {},
      chars: {},
      types: {},
      systems: {},
    }

    let allNames = { ...alreadyExistNames }
    if (!alreadyExistNames.systems) {
      // alreadyExistNames is empty
      allNames = {
        allys: {},
        corps: {},
        chars: {},
        types: {},
        systems: {},
      }
    }

    // console.log('allNames:', allNames)
    if (data[0] && !allNames.systems[data[0].system]) {
      all.systems[data[0].system] = 1
    }
    data.forEach(km => {
      const v = km.victim
      if (!v) {
        console.log('WTF! where is victim?', km)
      } else {
        // if (v.ally && !allNames.allys[v.ally]) all.allys[v.ally] = 1
        // if (v.corp && !allNames.corps[v.corp]) all.corps[v.corp] = 1
        // if (v.char && !allNames.chars[v.char]) all.chars[v.char] = 1
        if (v.ship && !allNames.types[v.ship]) all.types[v.ship] = 1
        km.attackers.forEach(att => {
          // if (att.ally && !allNames.allys[att.ally]) all.allys[att.ally] = 1
          // if (att.corp && !allNames.corps[att.corp]) all.corps[att.corp] = 1
          // if (att.char && !allNames.chars[att.char]) all.chars[att.char] = 1
          if (att.ship && !allNames.types[att.ship]) all.types[att.ship] = 1
          if (att.weap && !allNames.types[att.weap]) all.types[att.weap] = 1
        })
      }
    })
    // console.log('unknown ids:', all)
    return all
  }

  dedupAllLegacy(data, allNames) {
    const all = {
      ...allNames,
    }
    all.systems[data[0].system] = 1
    data.forEach(km => {
      const v = km.victim
      if (!v) {
        console.log('WTF! where is victim?', km)
      } else {
        if (v.ally) all.allys[v.ally] = 1
        if (v.corp) all.corps[v.corp] = 1
        if (v.char) all.chars[v.char] = 1
        if (v.ship) all.types[v.ship] = 1
        km.attackers.forEach(att => {
          if (att.ally) all.allys[att.ally] = 1
          if (att.corp) all.corps[att.corp] = 1
          if (att.char) all.chars[att.char] = 1
          if (att.ship) all.types[att.ship] = 1
          if (att.weap) all.types[att.weap] = 1
        })
      }
    })
    return all
  }

  plainIds(data) {
    const result = []
    Object.keys(data).forEach(typeKey => {
      if (typeKey !== 'chars') {
        Object.keys(data[typeKey]).forEach(id => result.push(id))
      }
    })
    // chars would be last in array
    if (data.chars) {
      Object.keys(data.chars).forEach(id => result.push(id))
    }
    return result
  }

  parseNames(data, involvedNames) {
    let names = { ...involvedNames }
    if (!involvedNames.systems) {
      // involvedNames is empty
      names = {
        allys: {},
        corps: {},
        chars: {},
        types: {},
        systems: {},
        version: 1,
      }
    }
    return data.reduce((inv, elem) => {
      switch (elem.category) {
        // case 'character':
        //   inv.chars[elem.id] = elem.name
        //   break
        // case 'corporation':
        //   inv.corps[elem.id] = elem.name
        //   break
        // case 'alliance':
        //   inv.allys[elem.id] = elem.name
        //   break
        case 'solar_system':
          inv.systems[elem.id] = elem.name
          break
        case 'inventory_type':
        default:
          inv.types[elem.id] = this.transformName(elem.name)
      }
      return inv
    }, names)
  }

  transformName(sdeName) {
    // eslint-disable-next-line
    let result = sdeName.replace(' Issue', '').replace(" 'Auroral' 197-variant", '')
    result = result.replace('Drifter Battleship', 'Drifter BS')
    result = result.replace('Drifter Cruiser', 'Drifter Cr')
    result = result.replace('Caldari Navy', 'Cal Navy')
    result = result.replace('Imperial Navy', 'Imp Navy')
    result = result.replace('Republic Fleet', 'Rep Fleet')
    result = result.replace('Federation Navy', 'Fed Navy')
    return result
  }

}

export default new NamesUtils()

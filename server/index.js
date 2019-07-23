const ApiService = require('./api')
const assets = require('../dist/assets.json')
const SYSTEMS_DATA = require('../src/data/systems.json')
const { parseZkillDatetime, formatSum, getUTCTime } = require('../src/utils/FormatUtils')


function getSystemName(systemID) {
  const relSystemID = systemID - 30000000
  const system = SYSTEMS_DATA.systems.find(sys => sys[1] === relSystemID)
  const region = system && SYSTEMS_DATA.regions[system[2]]
  return `${system[0]} (${region})`
}

// for example:
// title: 'Ihakana (The Forge) / 2019-07-23 14:00',
// description: 'Battle in Ihakana (The Forge) involving 39 pilots who lost a total of 67,991,796,202 isk',

function generateTemplateVars(summary) {
  const { systemID, datetime, totalLost, totalPilots } = summary // kmsCount also
  const systemName = getSystemName(systemID)
  const date = parseZkillDatetime(datetime)
  const isoDate = date.toISOString()
  const title = `${systemName} / ${isoDate.split('T')[0]}, ${getUTCTime(date, false)} ET`
  const description = `Battle in ${systemName} involving ${totalPilots} pilots who lost a total of ${formatSum(totalLost)} isk`
  console.log({ title })
  console.log({ description })
  const vars = {
    title,
    description,
    main_css: assets['main.css'],
    manifest_js: assets['manifest.js'],
    main_js: assets['main.js'],
    vendors_js: assets['vendors.js'],
  }
  return { vars }
}

const handleRelated = distPath => async (request, response) => {
  const { systemID, time } = request.params

  const summary = await ApiService.fetchRelatedSummaryData(systemID, time)
    .then(({ data }) => {
      if (data.result === 'success') {
        return data.summary
      }
      return {
        error: `result: ${data.result}`,
      }
    })
    .catch(error => ({ error }))

  if (summary.error) {
    console.log('Error: fetchRelatedSummaryData:', summary.error)
    response.sendFile(`${distPath}/index.html`)
  } else {
    response.render('related', generateTemplateVars(summary))
  }
}

module.exports = {
  handleRelated,
}

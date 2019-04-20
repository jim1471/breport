import BaseAPI from './BaseAPI'

// const base = 'http://localhost:4000'
const base = 'http://192.168.0.13:4000'
// const base = process.env.API_SERVER


class RelatedService extends BaseAPI {

  fetchRelatedData(systemID, time) {
    return this.call({
      method: 'post',
      url: `${base}/api/v1/related`,
      data: {
        systemID,
        time,
      },
    })
  }

  saveComposition(teams, systemID, time) {
    return this.call({
      method: 'post',
      url: `${base}/api/v1/composition/add`,
      data: {
        related: `${systemID}/${time}`,
        teams,
      },
    })
  }

  getComposition(compositionID) {
    return this.call({
      method: 'get',
      url: `${base}/api/v1/composition/get/${compositionID}`,
    })
  }
}

export default new RelatedService()

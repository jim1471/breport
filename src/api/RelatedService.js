import BaseAPI from './BaseAPI'

const base = process.env.API_SERVER

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


}

export default new RelatedService()

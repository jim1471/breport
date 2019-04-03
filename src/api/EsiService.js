import BaseAPI from './BaseAPI'

// https://esi.evetech.net/latest/universe/names/?datasource=tranquility
const base = 'https://esi.evetech.net/latest'
const src = 'datasource=tranquility'


class EsiService extends BaseAPI {

  fetchNames(ids) {
    return this.call({
      method: 'post',
      url: `${base}/universe/names/?${src}`,
      data: [...ids],
    })
  }

}

export default new EsiService()

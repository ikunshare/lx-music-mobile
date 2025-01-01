import { httpFetch } from '../../request'
import { requestMsg } from '../../message'
import { headers, timeout } from '../options'
import { dnsLookup } from '../utils'

const api_ikun = {
  getMusicUrl(songInfo, type) {
    const requestObj = httpFetch(`https://lxmusic.ikunshare.com/url/mg/${songInfo.copyrightId}/${type}`, {
      method: 'get',
      timeout,
      headers,
      lookup: dnsLookup,
      family: 4,
    })
    requestObj.promise = requestObj.promise.then(({ statusCode, body }) => {
      if (statusCode == 429) return Promise.reject(new Error(requestMsg.tooManyRequests))
      switch (body.code) {
        case 0: return Promise.resolve({ type, url: body.data })
        case 1: return Promise.reject(new Error(requestMsg.ipblock))
        case 2: return Promise.reject(new Error(requestMsg.fail))
        case 5: return Promise.reject(new Error(requestMsg.ohh))
      }
    })
    return requestObj
  },
}

export default api_ikun

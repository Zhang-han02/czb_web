import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/serverConfig',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/serverConfig/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/serverConfig',
    method: 'put',
    data
  })
}

export function latest() {
  return request({
    url: 'api/serverConfig/latest',
    method: 'get'

  })
}

export function save(data) {
  return request({
    url: 'api/serverConfig/save',
    method: 'post',
    data
  })
}

export function accountSet(data) {
  return request({
    url: 'api/serverConfig/accountSet',
    method: 'post',
    data
  })
}

export default { add, edit, del, save }

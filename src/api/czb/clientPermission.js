import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/clientPermission',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/clientPermission/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/clientPermission',
    method: 'put',
    data
  })
}

export function listAll(params) {
  return request({
    url: 'api/clientPermission/all',
    method: 'get',
    params
  })
}

export default { add, edit, del }

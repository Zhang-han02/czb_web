import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/prod',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/prod/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/prod',
    method: 'put',
    data
  })
}

export function list(params) {
  return request({
    url: 'api/prod',
    method: 'get',
    params
  })
}
export function importData(flag) {
  return request({
    url: 'api/prod/importData/'+flag,
    method: 'get',
  })
}

export default { add, edit, del }

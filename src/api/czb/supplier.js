import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/supplier',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/supplier/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/supplier',
    method: 'put',
    data
  })
}

export function list(params) {
  return request({
    url: 'api/supplier',
    method: 'get',
    params
  })
}
export function importData(flag) {
  return request({
    url: 'api/supplier/importData/'+flag,
    method: 'get',
  })
}

export default { add, edit, del, list, importData }

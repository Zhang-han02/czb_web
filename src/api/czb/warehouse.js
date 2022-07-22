import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/warehouse',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/warehouse/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/warehouse',
    method: 'put',
    data
  })
}

export function importData(flag) {
  return request({
    url: 'api/warehouse/importData/'+flag,
    method: 'get',
  })
}

export default { add, edit, del, importData}

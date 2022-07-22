import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/billDetail',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/billDetail/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/billDetail',
    method: 'put',
    data
  })
}

export function collectDetail(params) {
  return request({
    url: 'api/billDetail/collectDetail',
    method: 'get',
    params
  })
}

export default { add, edit, del }

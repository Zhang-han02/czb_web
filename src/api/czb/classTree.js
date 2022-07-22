import request from '@/utils/request'

export function list(data) {
  return request({
    url: 'api/classTree',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: 'api/classTree',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/classTree/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/classTree',
    method: 'put',
    data
  })
}

export default { add, edit, del, list }

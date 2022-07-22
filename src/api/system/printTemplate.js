import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/printTemplate',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/printTemplate/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/printTemplate',
    method: 'put',
    data
  })
}

/**
 * 查询打印模板配置
 * @param {*} params
 * @returns
 */
export function detail(params) {
  return request({
    url: 'api/printTemplate/detail',
    method: 'get',
    params
  })
}

/**
 * 保存打印模板配置
 * @param {*} data
 * @returns
 */
export function save(data) {
  return request({
    url: 'api/printTemplate/save',
    method: 'post',
    data
  })
}

export default { add, edit, del }

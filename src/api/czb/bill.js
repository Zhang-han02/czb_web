import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/bill',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/bill/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/bill',
    method: 'put',
    data
  })
}

export function collect(params) {
  return request({
    url: 'api/bill/collect',
    method: 'get',
    params
  })
}

/**
 * 获取流水号
 * @param {*} billType 单据类型 1：采购入库 2：销售出库
 * @returns
 */
export function serialNumber(billType) {
  return request({
    url: 'api/bill/serialNumber',
    method: 'get',
    params: {
      billType
    }
  })
}
/**
 * 出入库单据打印
 * @param {*} ids 主键集合，用逗号拼接成字符串
 * @returns
 */
export function print(ids) {
  return request({
    url: 'api/bill/print',
    method: 'get',
    params: {
      ids
    }
  })
}

export default { add, edit, del }

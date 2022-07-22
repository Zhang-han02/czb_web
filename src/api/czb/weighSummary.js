import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/weighSummary',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/weighSummary/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/weighSummary',
    method: 'put',
    data
  })
}

export function collect(params) {
  return request({
    url: 'api/weighSummary',
    method: 'get',
    params
  })
}


export function collectDetailAll(params) {
  return request({
    url: 'api/weighSummary/detailAll',
    method: 'get',
    params
  })
}
export function collectDetail(params) {
  return request({
    url: 'api/weighSummary/detail',
    method: 'get',
    params
  })
}

/**
 * 称重汇总明细打印
 * @returns
 */
export function print(params) {
  return request({
    url: 'api/weighSummary/print',
    method: 'get',
    params
  })
}

/**
 * 称重汇总明细生单
 * @returns
 */
export function createUpOrder(ids) {
  return request({
    url: 'api/weighSummary/createUpOrder',
    method: 'post',
    data: ids
  })
}

export function findPound() {
  return request({
    url: 'api/weighSummary/findPound',
    method: 'get',
  })
}

export function findProd(params) {
  return request({
    url: 'api/weighSummary/findProd',
    method: 'get',
    params
  })
}

export function outPut(params) {
  return request({
    url: 'api/weighSummary/outPut',
    method: 'get',
    params
  })
}

export function prodTopThree() {
  return request({
    url: 'api/weighSummary/prodTopThree',
    method: 'get',
  })
}

export default { add, edit, del }

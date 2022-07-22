import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/barcodeConfig',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/barcodeConfig/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/barcodeConfig',
    method: 'put',
    data
  })
}

export function latest() {
  return request({
    url: 'api/barcodeConfig/latest',
    method: 'get'

  })
}

export function save(data) {
  return request({
    url: 'api/barcodeConfig/save',
    method: 'post',
    data
  })
}

export default { add, edit, del }

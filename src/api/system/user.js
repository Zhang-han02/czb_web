import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

export function add(data) {
  return request({
    url: 'apis/users',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'apis/users',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'apis/users',
    method: 'put',
    data
  })
}

export function editUser(data) {
  return request({
    url: 'apis/users/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'apis/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'apis/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

export function list(params) {
  return request({
    url: 'apis/users',
    method: 'get',
    params
  })
}

export function expirationInfo(params) {
  return request({
    url: 'auth/expirationTime',
    method: 'get',
    params
  })
}

export function saveRegisterCode(params) {
  return request({
    url: 'auth/saveRegisterCode',
    method: 'post',
    params
  })
}

export default { add, edit, del }


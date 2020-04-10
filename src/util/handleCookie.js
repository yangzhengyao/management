import Cookies from 'js-cookie'

//token键名称
const TokenKey = 'userInfo'

export function getToken(token) {
  return Cookies.get(token)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getPermissionList() {
  return Cookies.get("menuInfo")
}

export function commonSetValue(key,value) {
  return Cookies.set(key, value)
}

export default{
	getToken,
	setToken,
	removeToken,
	getPermissionList,
	commonSetValue
}
import { removeItem } from './storage'

export default () => {
  removeItem('token')
  removeItem('refresh-token')
  window.location.replace('/login')
}

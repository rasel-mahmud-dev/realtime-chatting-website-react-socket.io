import axios from 'axios'
import api from '../../apis/api'

import {PUSH_NOTIFICATION} from './types'


export const pushNotification = (notification) => async (dispatch) => {
  // let { data } = await api.get(`/api/fetch-my-friend/?type=${type}`)
  
  dispatch({
    type: PUSH_NOTIFICATION,
    payload: notification
  })
  
}


// ?  subscribers...       room,  to global member room.
import axios from 'axios'

const journalApi = axios.create({
    baseURL:'https://vue-learning-96ff9-default-rtdb.firebaseio.com'
})


export default journalApi
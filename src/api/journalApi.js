import axios from 'axios'

const journalApi = axios.create({
    baseURL:'https://vue-learning-96ff9-default-rtdb.firebaseio.com'
})

// console.log(process.env.NODE_ENV)  //PARA VER EN QUE ENTORNO SE ESTÁ


export default journalApi
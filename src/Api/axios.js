import axios from "axios";

const customAxios = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/todos',
})


export default customAxios
import axios from 'axios';

const storifyApi = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})
export default storifyApi;

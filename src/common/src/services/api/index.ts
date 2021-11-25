import axios from 'axios';
import Client from './Client';

const storifyApi = new Client(
  axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
);
export default storifyApi;

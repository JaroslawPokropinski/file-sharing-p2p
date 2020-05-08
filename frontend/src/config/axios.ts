import axios from 'axios';
import server from './server';

export default axios.create({
  baseURL: server.url,
});

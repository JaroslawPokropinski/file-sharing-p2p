export default {
  wsUrl: process.env.REACT_APP_SERVER_WS_URL ?? 'ws://localhost:8080/fileshare',
  url: process.env.REACT_APP_SERVER_URL ?? 'http://localhost:8080/fileshare',
};

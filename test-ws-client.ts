import { EVENT_NAME } from './src/common/enum';

const io = require('socket.io-client');

// Replace with your server URL
const SERVER_URL = 'http://localhost:5757';
// Replace with the session ID you want to test with
const SESSION_ID = 'test-session-id';

const socket = io(SERVER_URL);

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);

  console.log(`Starting conversation: ${SESSION_ID}`);
  socket.emit(EVENT_NAME.START_CHAT, { sessionId: SESSION_ID });
});

socket.on(EVENT_NAME.JOINED_CONVERSATION, (data) => {
  console.log('Joined conversation:', data);
});

socket.on(EVENT_NAME.CHAT_ANALYSIS_RESPONSE, (data) => {
  console.log('Received analysis response:', JSON.stringify(data, null, 2));
});

socket.on(EVENT_NAME.ANALYSIS_SESSION_COMPLETE, (data) => {
  console.log(
    'Received analysis session complete:',
    JSON.stringify(data, null, 2),
  );
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

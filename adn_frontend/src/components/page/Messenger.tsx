// import React, { useEffect, useRef, useState } from 'react';
// import SockJS from 'sockjs-client';
// import { Client, type IMessage } from '@stomp/stompjs';
// import { jwtDecode } from 'jwt-decode';

// type ChatMessage = {
//   sender: string;
//   content?: string;
//   type: 'JOIN' | 'LEAVE' | 'CHAT';
// };

// type DecodedJWT = {
//   sub: string;
//   id: number;
//   exp: number;
//   iat: number;
// };

// const Messenger: React.FC = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [messageInput, setMessageInput] = useState<string>('');
//   const stompClientRef = useRef<Client | null>(null);

//   const token = localStorage.getItem('token');
//   const username = token ? (jwtDecode(token) as DecodedJWT).sub : 'Anonymous';

//   useEffect(() => {
//     if (!token) {
//       console.warn('⚠️ No token found. Cannot connect to WebSocket.');
//       return;
//     }

//     const socket = new SockJS('http://localhost:8080/ws');
//     const stompClient = new Client({
//       webSocketFactory: () => socket,
//       connectHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       debug: (str) => console.log('[STOMP]', str),
//       onConnect: () => {
//         console.log('✅ Connected to WebSocket');

//         // Sub to public topic
//         stompClient.subscribe('/topic/public', (message: IMessage) => {
//           try {
//             const msg: ChatMessage = JSON.parse(message.body);
//             setMessages((prev) => [...prev, msg]);
//           } catch (err) {
//             console.error('❌ Failed to parse message', err);
//           }
//         });

//         // Notify server: user joined
//         stompClient.publish({
//           destination: '/app/chat.addUser',
//           body: JSON.stringify({ sender: username, type: 'JOIN' }),
//         });
//       },
//       onStompError: (frame) => {
//         console.error('❌ Broker error:', frame.headers['message']);
//         console.error(frame.body);
//       },
//     });

//     stompClient.activate();
//     stompClientRef.current = stompClient;

//     return () => {
//       stompClientRef.current?.deactivate();
//       console.log('🛑 Disconnected from WebSocket');
//     };
//   }, [token]);

//   const sendMessage = () => {
//     if (messageInput.trim() && stompClientRef.current?.connected) {
//       const msg: ChatMessage = {
//         sender: username,
//         content: messageInput.trim(),
//         type: 'CHAT',
//       };

//       stompClientRef.current.publish({
//         destination: '/app/chat.sendMessage',
//         body: JSON.stringify(msg),
//       });

//       setMessageInput('');
//     }
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: '0 auto', fontFamily: 'Arial' }}>
//       <h2>💬 Real-Time Messenger</h2>
//       <div
//         style={{
//           border: '1px solid #ccc',
//           height: 350,
//           overflowY: 'auto',
//           padding: 10,
//           marginBottom: 10,
//           background: '#f8f8f8',
//           borderRadius: '6px',
//         }}
//       >
//         {messages.map((msg, index) => {
//           if (msg.type === 'JOIN')
//             return (
//               <div key={index} style={{ color: 'green', fontStyle: 'italic' }}>
//                 🟢 <strong>{msg.sender}</strong> has joined
//               </div>
//             );
//           if (msg.type === 'LEAVE')
//             return (
//               <div key={index} style={{ color: 'red', fontStyle: 'italic' }}>
//                 🔴 <strong>{msg.sender}</strong> has left
//               </div>
//             );
//           return (
//             <div key={index}>
//               <strong>{msg.sender}:</strong> {msg.content}
//             </div>
//           );
//         })}
//       </div>

//       <div style={{ display: 'flex', gap: 10 }}>
//         <input
//           type="text"
//           value={messageInput}
//           onChange={(e) => setMessageInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//           placeholder="Type a message..."
//           style={{
//             flexGrow: 1,
//             padding: 8,
//             borderRadius: 4,
//             border: '1px solid #ccc',
//           }}
//         />
//         <button
//           onClick={sendMessage}
//           style={{
//             padding: '8px 16px',
//             borderRadius: 4,
//             border: 'none',
//             backgroundColor: '#007bff',
//             color: 'white',
//             fontWeight: 600,
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Messenger;

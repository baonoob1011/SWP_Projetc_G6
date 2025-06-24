// import React, { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// const TotalUserChart = () => {
//   const [totalUser, setTotalUser] = useState<number>(0);

//   useEffect(() => {
//     const fetchTotalUsers = async () => {
//       try {
//         const res = await fetch(
//           'http://localhost:8080/api/dashboard/total-users'
//         );
//         const data = await res.json();
//         if (res.ok) {
//           setTotalUser(data.result);
//         }
//       } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu người dùng:', error);
//       }
//     };

//     fetchTotalUsers();
//   }, []);

//   // Dữ liệu cho biểu đồ
//   const chartData = [
//     {
//       result: totalUser,
//     },
//   ];

//   return (
//     <div style={{ width: '100%', height: 300 }}>
//       <h4 className="text-center mb-3">Tổng số người dùng</h4>
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={chartData}
//           layout="vertical"
//           margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis type="number" />
//           <YAxis type="category" dataKey="name" />
//           <Tooltip />
//           <Bar dataKey="value" fill="#8884d8" barSize={40} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default TotalUserChart;

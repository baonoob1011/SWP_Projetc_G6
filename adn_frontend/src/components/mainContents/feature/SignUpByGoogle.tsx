// import React, { useEffect } from "react";

// type LoginByGoogleProps = {
//   onLoginSuccess: (fullName: string, token: string) => void;
// };

// declare global {
//   interface Window {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     google: any;
//   }
// }

// const LoginByGoogle = ({ onLoginSuccess }: LoginByGoogleProps) => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "http://localhost:8080/login/oauth2/code/google";
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       window.google.accounts.id.initialize({
//         client_id: "355282163324-n2ko3l829l806cv1tj71em71tnvktvku.apps.googleusercontent.com", // lấy từ Google Cloud Console
//         callback: handleCallbackResponse,
//       });

//       window.google.accounts.id.renderButton(
//         document.getElementById("googleSignInDiv"),
//         { theme: "outline", size: "large", width: 250 }
//       );

//       window.google.accounts.id.prompt(); // hiển thị prompt đăng nhập tự động nếu có thể
//     };

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleCallbackResponse = (response: any) => {
//     const base64Url = response.credential.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );

//     const userObject = JSON.parse(jsonPayload);

//     const fullName = userObject.name;
//     const token = response.credential;

//     localStorage.setItem("token", token);
//     localStorage.setItem("fullName", fullName);
//     localStorage.setItem("email", userObject.email);
//     localStorage.setItem("picture", userObject.picture);

//     onLoginSuccess(fullName, token);
//   };

//   return <div id="googleSignInDiv"></div>;
// };

// export default LoginByGoogle;

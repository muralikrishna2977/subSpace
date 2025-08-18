// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { NhostProvider } from "@nhost/react";
// import { Toaster } from "react-hot-toast";
// import "katex/dist/katex.min.css";

// import SignUp from "./pages/SignUp";
// import SignIn from "./pages/SignIn";
// import Dashboard from "./pages/Dashboard";
// import { nhost } from "./lib/nhost";

// // import "./styles.css"
// import RequireAuth from "./pages/RequireAuth";

// export default function App() {
//   return (
//     <NhostProvider nhost={nhost}>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/sign-up" element={<SignUp />} />
//           <Route path="/" element={<SignIn />} />

//           {/* Protected routes */}
//           <Route element={<RequireAuth />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//       <Toaster />
//     </NhostProvider>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NhostProvider } from "@nhost/react";
import { Toaster } from "react-hot-toast";
import "katex/dist/katex.min.css";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail"; // ✅ new
import { nhost } from "./lib/nhost";

import RequireAuth from "./pages/RequireAuth";

export default function App() {
  return (
    <NhostProvider nhost={nhost}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/verify-email" element={<VerifyEmail />} /> {/* ✅ */}

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </NhostProvider>
  );
}

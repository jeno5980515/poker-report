import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';

import ReportPage from "./pages/ReportPage";
import RangePage from "./pages/RangePage";

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/report">Report</Link>
          </li>
          <li>
            <Link to="/range">Range</Link>
          </li>
        </ul>
      </nav>

      <hr />
      <Outlet />
    </div>
  );
}


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ReportPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="range" element={<RangePage />} />
      </Route>
    </Routes>
  );
}

import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';

import ReportPage from "./pages/ReportPage";
import RangePage from "./pages/RangePage";
import SolutionPage from "./pages/SolutionPage";
import TurnReportPage from "./pages/TurnReportPage";

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
          <li>
            <Link to="/range">Solution</Link>
          </li>
          <li>
            <Link to="/turn-report">Turn Report</Link>
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
        <Route path="solution" element={<SolutionPage />} />
        <Route path="turn-report" element={<TurnReportPage />} />
      </Route>
    </Routes>
  );
}

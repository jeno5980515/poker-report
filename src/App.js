import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import ReportPage from "./pages/ReportPage";
import RangePage from "./pages/RangePage";
import SolutionPage from "./pages/SolutionPage";
import TurnReportPage from "./pages/TurnReportPage";

import './App.css';

function Layout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link onClick={() => navigate(-1, { replace: false, query: searchParams.toString() })}>Back</Link>
          </li>
          <li>
            <Link to="/report">Report</Link>
          </li>
          <li>
            <Link to="/range">Range</Link>
          </li>
          <li>
            <Link to="/solution">Solution</Link>
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

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import Users from "./pages/Users";
import TranscriptAnalysis from "./pages/TranscriptAnalysis";
import { API_BASE } from "./config/constants";
import toast, { Toaster } from "react-hot-toast";
const App = () => {
  const [users, setUsers] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchMeetings();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await fetch(`${API_BASE}/meetings`);
      const data = await res.json();
      setMeetings(data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
    }
  };
  // console.log("Meetings:", meetings);
  // meeting reminder logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      meetings.forEach((meeting) => {
        const meetingTime = new Date(meeting.startTime);
        const timeDiff = meetingTime - now;
        if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
          toast(
            `Reminder: Meeting Between "${meeting.employee.name}" and "${meeting.manager.name}" starts in less than 5 minutes!`
          );
        }
      });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [meetings]);

  return (
    <Router>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />
        <Toaster position="top-right"/>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<Dashboard users={users} meetings={meetings} />}
            />
            <Route
              path="/meetings"
              element={
                <Meetings
                  meetings={meetings}
                  users={users}
                  refreshMeetings={fetchMeetings}
                />
              }
            />
            <Route
              path="/users"
              element={<Users users={users} refreshUsers={fetchUsers} />}
            />
            <Route path="/transcript" element={<TranscriptAnalysis />} />
            <Route
              path="*"
              element={<Dashboard users={users} meetings={meetings} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

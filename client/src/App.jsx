import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Meetings from './pages/Meetings';
import Users from './pages/Users';
import TranscriptAnalysis from './pages/TranscriptAnalysis';
import { API_BASE } from './config/constants';

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
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
      console.error('Error fetching users:', err);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await fetch(`${API_BASE}/meetings`);
      const data = await res.json();
      setMeetings(data);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard users={users} meetings={meetings} />;
      case 'meetings':
        return <Meetings meetings={meetings} users={users} refreshMeetings={fetchMeetings} />;
      case 'users':
        return <Users users={users} refreshUsers={fetchUsers} />;
      case 'transcript':
        return <TranscriptAnalysis />;
      default:
        return <Dashboard users={users} meetings={meetings} />;
    }
  };

  // meeting reminder logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      meetings.forEach(meeting => {
        const meetingTime = new Date(meeting.startTime);
        const timeDiff = meetingTime - now;
        if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) { // 5 minutes before
          alert(`Reminder: Meeting Between "${meeting.employee}" and "${meeting.manager}" starts in less than 5 minutes!`);
          // can use emailJs or nottification API here for real notifications
        }
      });
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, [meetings]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
import React from "react";
import { Users, Calendar, Zap, Clock } from "lucide-react";

const Dashboard = ({ users, meetings }) => {
  const upcomingMeetings = meetings
    .filter((m) => new Date(m.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {users.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {users.filter((u) => u.role === "employee").length} Employees,{" "}
                {users.filter((u) => u.role === "manager").length} Managers
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Scheduled Meetings
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {meetings.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {upcomingMeetings.length} Upcoming
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI-Powered</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">Active</p>
              <p className="text-xs text-gray-500 mt-1">
                Smart Scheduling Enabled
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Recent Meetings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Meetings
        </h3>
        {upcomingMeetings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No upcoming meetings scheduled
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingMeetings
              .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
              .map((meeting, idx) => {
                const isDone = new Date(meeting.startTime) < new Date();
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${
                      isDone ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {meeting.employee?.name || "N/A"} ↔{" "}
                          {meeting.manager?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(meeting.startTime).toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium mr-2 ${
                        meeting.autoRescheduled
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {meeting.autoRescheduled ? "Auto-Scheduled" : "Scheduled"}
                    </span>
                    {isDone && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Done
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
            <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Schedule Meeting
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center">
            <Users className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Add User</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center">
            <Zap className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Analyze Transcript
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

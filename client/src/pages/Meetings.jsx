import React, { useState } from "react";
import { Plus, Trash2, Calendar, Zap } from "lucide-react";
import { API_BASE } from "../config/constants";

const Meetings = ({ meetings, users, refreshMeetings }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    employee: "",
    manager: "",
    startTime: "",
    endTime: "",
    mode: "manual",
  });

  const employees = users.filter((u) => u.role === "employee");
  const managers = users.filter((u) => u.role === "manager");

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeeting),
      });

      const data = await res.json();

      if (res.status === 409) {
        alert("Conflict detected! Check suggested slots.");
      } else {
        alert(data.message || "Meeting created successfully!");
        setShowForm(false);
        setNewMeeting({
          employee: "",
          manager: "",
          startTime: "",
          endTime: "",
          mode: "manual",
        });
        refreshMeetings();
      }
    } catch (err) {
      alert("Error creating meeting: " + err.message);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;

    try {
      await fetch(`${API_BASE}/meetings/${id}`, { method: "DELETE" });
      refreshMeetings();
    } catch (err) {
      alert("Error deleting meeting: " + err.message);
    }
  };

  return (
    <div className="space-y-0 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meetings</h2>
          <p className="text-gray-600 mt-1">Manage and schedule meetings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Meeting</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/60 bg-opacity-40">
          <form
            className="relative max-w-4xl w-full max-h-screen overflow-y-auto z-100 bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Schedule New Meeting
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="employee"
                >
                  Employee
                </label>
                <select
                  id="employee"
                  value={newMeeting.employee}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, employee: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="manager"
                >
                  Manager
                </label>
                <select
                  id="manager"
                  value={newMeeting.manager}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, manager: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Manager</option>
                  {managers.map((mgr) => (
                    <option key={mgr._id} value={mgr._id}>
                      {mgr.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="startTime"
                >
                  Start Time
                </label>
                <input
                  id="startTime"
                  type="datetime-local"
                  value={newMeeting.startTime}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, startTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="endTime"
                >
                  End Time
                </label>
                <input
                  id="endTime"
                  type="datetime-local"
                  value={newMeeting.endTime}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, endTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                Scheduling Mode
              </legend>
              <div className="flex space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="manual"
                    checked={newMeeting.mode === "manual"}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, mode: e.target.value })
                    }
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Manual</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="auto"
                    checked={newMeeting.mode === "auto"}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, mode: e.target.value })
                    }
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Auto</span>
                </label>
              </div>
            </fieldset>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Meeting"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {meetings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No meetings scheduled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {meetings.map((meeting) => (
                  <tr
                    key={meeting._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {meeting.employee?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {meeting.manager?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(meeting.startTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(meeting.endTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          meeting.autoRescheduled
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {meeting.autoRescheduled && (
                          <Zap className="w-3 h-3 mr-1" />
                        )}
                        {meeting.autoRescheduled
                          ? "Auto-Scheduled"
                          : meeting.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(meeting._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;

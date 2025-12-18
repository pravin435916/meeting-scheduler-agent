import React, { useState } from "react";
import {
  MessageSquare,
  Target,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { API_BASE } from "../config/constants";

const TranscriptAnalysis = () => {
  const [transcript, setTranscript] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!transcript.trim() || transcript.length < 10) {
      alert("Please enter a valid transcript (at least 10 characters)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/transcripts/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      alert("Error analyzing transcript: " + err.message);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setTranscript("");
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Transcript Analysis
        </h2>
        <p className="text-gray-600 mt-1">
          AI-powered meeting transcript analysis
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Transcript
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here...

Example:
Manager: Let's discuss the Q4 goals. What are your main objectives?
Employee: I'd like to focus on improving customer satisfaction scores by 15% and completing the new feature rollout by December. Manager: Great! Let's set up weekly check-ins to track progress."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              {transcript.length} characters
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={loading || !transcript.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              <span>{loading ? "Analyzing..." : "Analyze with AI"}</span>
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {analysisResult && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>Action Items</span>
              </h3>
            </div>
            <div className="p-6">
              {analysisResult.action_items &&
              analysisResult.action_items.length > 0 ? (
                <div className="space-y-3">
                  {analysisResult.action_items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          item.owner === "Employee"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        <span className="text-xs font-bold">
                          {item.owner === "Employee" ? "E" : "M"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.task}
                        </p>
                        {item.deadline && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-600">
                              {item.deadline}
                            </p>
                          </div>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.owner === "Employee"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.owner}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No action items identified
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-linear-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Goals</span>
              </h3>
            </div>
            <div className="p-6">
              {analysisResult.goals && analysisResult.goals.length > 0 ? (
                <ul className="space-y-2">
                  {analysisResult.goals.map((goal, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-600">
                          {idx + 1}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 flex-1">{goal}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No goals identified
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span>Follow-ups</span>
              </h3>
            </div>
            <div className="p-6">
              {analysisResult.follow_ups &&
              analysisResult.follow_ups.length > 0 ? (
                <ul className="space-y-2">
                  {analysisResult.follow_ups.map((followUp, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-2"></div>
                      <p className="text-sm text-gray-900 flex-1">{followUp}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No follow-ups identified
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptAnalysis;

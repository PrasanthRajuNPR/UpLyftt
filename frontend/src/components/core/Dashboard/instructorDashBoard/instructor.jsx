import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";

import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileApi";
import InstructorChart from "./instructorChart";

const Instructor=()=> {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);       
  const [courses, setCourses] = useState([]);  

  useEffect(() => {
    (async () => {
      setLoading(true);

      const instructorStats = await getInstructorData(token);
      const instructorCourses = await fetchInstructorCourses(token);

      if (Array.isArray(instructorStats)) {
        setStats(instructorStats);
      }

      if (Array.isArray(instructorCourses)) {
        setCourses(instructorCourses);
      }

      setLoading(false);
    })();
  }, [token]);

  const totalIncome = stats.reduce(
    (sum, s) => sum + (s.totalAmountGenerated || 0),
    0
  );

  const totalStudents = stats.reduce(
    (sum, s) => sum + (s.totalStudentsEnrolled || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-400">
          Here's an overview of your teaching performance
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<BookOpen className="w-8 h-8 text-cyan-400" />}
          value={courses.length}
          label="Total Courses"
          gradient="from-cyan-900/30 to-blue-900/30"
          border="border-cyan-500/30"
        />

        <StatCard
          icon={<Users className="w-8 h-8 text-blue-400" />}
          value={totalStudents}
          label="Total Students"
          gradient="from-blue-900/30 to-cyan-900/30"
          border="border-blue-500/30"
        />

        <StatCard
          icon={<DollarSign className="w-8 h-8 text-green-400" />}
          value={`₹ ${totalIncome.toLocaleString()}`}
          label="Total Income"
          gradient="from-green-900/30 to-emerald-900/30"
          border="border-green-500/30"
        />
      </div>

      {courses.length > 0 ? (
        <>
          {/* CHART + STATS */}
          <div className="grid lg:grid-cols-2 gap-8">
            <InstructorChart courses={stats} />

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Statistics
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>Total Courses: {courses.length}</p>
                <p>Total Students: {totalStudents}</p>
                <p>Total Income: ₹ {totalIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* COURSES */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Recent Courses
              </h2>
              <Link
                to="/dashboard/my-courses"
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View All →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <div
                  key={course._id}
                  className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all"
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-gray-600" />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-1">
                      {course.courseName}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>
                        {course.studentsEnrolled?.length || 0} students
                      </span>
                      <span>₹ {course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

/* STAT CARD */
function StatCard({ icon, value, label, gradient, border }) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} border ${border} rounded-lg p-6`}
    >
      <div className="flex items-center justify-between">
        {icon}
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-gray-400 text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}

/* EMPTY STATE */
function EmptyState() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
      <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        No Courses Yet
      </h3>
      <p className="text-gray-400 mb-6">
        Start creating courses to see your teaching performance
      </p>
      <Link
        to="/dashboard/add-course"
        className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:opacity-90"
      >
        Create Your First Course
      </Link>
    </div>
  );
}

export default Instructor;
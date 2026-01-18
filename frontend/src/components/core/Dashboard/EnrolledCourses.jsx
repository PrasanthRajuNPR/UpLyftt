import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../services/operations/profileApi";
import { BookOpen, Clock, TrendingUp } from "lucide-react";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const data = await getUserEnrolledCourses({ token });

      const mapped = (data || []).map((course) => ({
        id: course._id,
        progress: course.progressPercentage || 0,
        enrolled_at: null,
        course: {
          title: course.courseName,
          description: course.courseDescription,
          thumbnail_url: course.thumbnail,
          duration: course.totalDuration,
          category: "course",
          courseContent: course.courseContent,
          _id: course._id,
        },
      }));

      setEnrollments(mapped);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading courses...</p>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          No Enrolled Courses
        </h3>
        <p className="text-gray-400 mb-6">
          Start learning by enrolling in courses from our catalog
        </p>
        <a
          href="/catalog"
          className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
        >
          Browse Courses
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Learning</h1>
        <p className="text-gray-400">Continue where you left off</p>
      </div>

      <div className="grid gap-6">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all"
          >
            <div className="flex flex-col md:flex-row">
              {enrollment.course.thumbnail_url ? (
                <img
                  src={enrollment.course.thumbnail_url}
                  alt={enrollment.course.title}
                  className="w-full md:w-64 h-48 object-cover"
                />
              ) : (
                <div className="w-full md:w-64 h-48 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-gray-600" />
                </div>
              )}

              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-gray-400 line-clamp-2">
                      {enrollment.course.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-cyan-400 font-semibold">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{enrollment.course.duration || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="capitalize">
                          {enrollment.course.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/view-course/${enrollment.course._id}/section/${enrollment.course.courseContent?.[0]?._id}/sub-section/${enrollment.course.courseContent?.[0]?.subSection?.[0]?._id}`
                        )
                      }
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

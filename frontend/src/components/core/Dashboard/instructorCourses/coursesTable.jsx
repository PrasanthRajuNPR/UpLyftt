import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";

import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { formatDate } from "../../../../services/operations/formatDate";

export default function CoursesTable({ courses, setCourses }) {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const TRUNCATE_LENGTH = 30;

  const handleDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) setCourses(result);
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-950 border-b border-gray-800">
              <tr>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">
                  Course
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">
                  Duration
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold">
                  Price
                </th>
                <th className="text-center px-6 py-4 text-gray-400 font-semibold">
                  Status
                </th>
                <th className="text-center px-6 py-4 text-gray-400 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-b border-gray-800 hover:bg-gray-950 transition-colors"
                >
                  {/* COURSE */}
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-4">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br 
                                        from-cyan-900/30 to-blue-900/30 
                                        flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-gray-600" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">
                          {course.courseName}
                        </h3>

                        <p className="text-gray-400 text-sm">
                          {course.courseDescription.split(" ").length >
                          TRUNCATE_LENGTH
                            ? course.courseDescription
                                .split(" ")
                                .slice(0, TRUNCATE_LENGTH)
                                .join(" ") + "..."
                            : course.courseDescription}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Created: {formatDate(course.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* DURATION */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>2hr 30min</span>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="px-6 py-4">
                    <span className="text-cyan-400 font-semibold">
                      ₹{course.price}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 text-center">
                    {course.status === COURSE_STATUS.PUBLISHED ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 
                                      bg-green-500/10 border border-green-500/50 
                                      rounded-full text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 
                                      bg-yellow-500/10 border border-yellow-500/50 
                                      rounded-full text-yellow-400 text-sm">
                        <XCircle className="w-4 h-4" />
                        <span>Draft</span>
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/edit-course/${course._id}`)
                        }
                        className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Delete this course?",
                            text2:
                              "All course data will be permanently removed.",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () => handleDelete(course._id),
                            btn2Handler: () => setConfirmationModal(null),
                          })
                        }
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  );
}

import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate,Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import CoursesTable from "./instructorCourses/coursesTable"
import { resetCourse } from "../../../redox/slices/courseSlice";
import { BookOpen } from "lucide-react"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
    }
    fetchCourses()
  }, [])

  if (courses.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Courses Yet</h3>
        <p className="text-gray-400 mb-6">
          Start creating courses to share your knowledge with students
        </p>
        <Link
          to="/dashboard/add-course"
          className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
        >
          Create Your First Course
        </Link>
      </div>
    );
  }

  return (
    
    <div>
      <div className="mb-14 flex items-center justify-between">
  <h1 className="text-3xl font-bold text-white">
    My Courses
  </h1>

  <Link
    to="/dashboard/add-course"
    className="
      flex items-center justify-center
      w-12 h-12 sm:w-auto sm:h-auto
      px-0 sm:px-6 py-0 sm:py-3
      bg-gradient-to-r from-cyan-500 to-blue-500
      text-white rounded-lg
      font-semibold
      hover:from-cyan-600 hover:to-blue-600
      transition-all
      shadow-lg shadow-cyan-500/20
    "
    onClick={() => {
        dispatch(resetCourse())
    }}
  >
    <VscAdd className="text-2xl sm:text-xl" />
    <span className="hidden sm:inline sm:ml-2">
      Add Course
    </span>
  </Link>
</div>
{console.log("courch : ",courses)}

      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  )
}
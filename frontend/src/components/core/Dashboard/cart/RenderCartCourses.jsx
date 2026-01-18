import { Trash2, BookOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../../redox/slices/cartSlice";

export default function RenderCartCourses() {
  const { cart = [] } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div>
      {cart.map((course, indx) => (
        <div
          key={course._id}
          className="my-6 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Course Image */}
            {course?.thumbnail ? (
              <img
                src={course?.thumbnail}
                alt={course?.courseName}
                className="w-full sm:w-48 h-32 object-cover"
              />
            ) : (
              <div className="w-full sm:w-48 h-32 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-600" />
              </div>
            )}

            {/* Course Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white mb-1">{course?.courseName}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{course?.category?.name}</p>
              </div>

              {/* Price and Remove Button */}
              <div className="flex items-center justify-between mt-3">
                <span className="text-xl font-bold text-cyan-400">₹ {course?.price}</span>
                <button
                  onClick={() => dispatch(removeFromCart(course._id))}
                  className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

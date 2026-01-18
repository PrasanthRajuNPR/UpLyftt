import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../common/IconBtn"; 
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id);
    buyCourse(token, courses, user, navigate, dispatch);  
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>

      {/* Subtotal and Discount */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-gray-300">
          <span>Subtotal ({cart.length} {cart.length !== 1 ? 'items' : 'item'})</span>
          <span className="text-cyan-400">₹ {total}</span>
        </div>
        <div className="flex items-center justify-between text-gray-300">
          <span>Discount</span>
          <span className="text-green-400">₹ 0.00</span>
        </div>
        <div className="border-t border-gray-800 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-2xl font-bold text-cyan-400">₹ {total}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <IconBtn
        text="Checkout"
        onclick={handleBuyCourse}
        customClasses="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
      />

      <p className="text-xs text-gray-500 text-center mt-4">
        30-day money-back guarantee
      </p>
    </div>
  );
}

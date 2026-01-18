import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";
import { ShoppingCart } from 'lucide-react';
export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);

  return (
    <>
    {(totalItems===0)?(
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Your Cart is Empty</h3>
        <p className="text-gray-400 mb-6">
          Browse our course catalog and add courses to your cart
        </p>
        <a
          href="/catalog/all"
          className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
        >
          Browse Courses
        </a>
      </div>
    ):(
      <div className="space-y-6">
      {/* Heading */}{console.log("total",totalItems)}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
        <p className="text-gray-400">{totalItems} course{totalItems !== 1 ? 's' : ''} in cart</p>
      </div>

      {/* Cart Items and Order Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <RenderCartCourses />
        </div>
        <div className="lg:col-span-1">
          <RenderTotalAmount />
        </div>
      </div>
    </div>
    )}
    </>
  );
}

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Calendar, User as UserIcon, Edit } from "lucide-react";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  console.log(user)
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-gray-300">
          <Mail className="w-5 h-5 text-gray-500" />
          <span>{user.email}</span>
        </div>
      </div>

      {/* About Me */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">About Me</h3>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-400">
          {user.additionalDetails?.about ||
            "No information provided yet. Click edit to add your bio."}
        </p>
      </div>

      {/* Personal Details */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Personal Details</h3>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <UserIcon className="w-4 h-4" />
                <label className="text-sm">First Name</label>
              </div>
              <p className="text-white">{user.firstName}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <UserIcon className="w-4 h-4" />
                <label className="text-sm">Last Name</label>
              </div>
              <p className="text-white">{user.lastName}</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Mail className="w-4 h-4" />
              <label className="text-sm">Email</label>
            </div>
            <p className="text-white">{user.email}</p>
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Phone className="w-4 h-4" />
              <label className="text-sm">Phone Number</label>
            </div>
            <p className="text-white">
              {user.additionalDetails?.contactNumber || "Not provided"}
            </p>
          </div>

          {/* Gender & DOB */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <UserIcon className="w-4 h-4" />
                <label className="text-sm">Gender</label>
              </div>
              <p className="text-white capitalize">
                {user.additionalDetails?.gender || "Not provided"}
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <label className="text-sm">Date of Birth</label>
              </div>
              <p className="text-white">
                {user.additionalDetails?.dateOfBirth
                  ? new Date(user.additionalDetails.dateOfBirth).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

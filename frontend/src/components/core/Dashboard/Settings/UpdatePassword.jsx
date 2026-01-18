import { useState } from "react";
import { useSelector } from "react-redux";
import { changePassword } from "../../../../services/operations/settingsApi";  
import { Save, CheckCircle, AlertCircle } from "lucide-react";

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      
      await changePassword(token, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      setSuccess(true);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Update Password</h2>

      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-400">Password updated successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={formData.oldPassword}
            onChange={(e) =>
              setFormData({ ...formData, oldPassword: e.target.value })
            }
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

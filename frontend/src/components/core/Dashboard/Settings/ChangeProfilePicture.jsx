import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiUpload } from "react-icons/fi";
import { updateDisplayPicture } from "../../../../services/operations/settingsApi";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

export default function ChangeProfilePicture() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [previewSource, setPreviewSource] = useState(user?.image || null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef();

  const handleClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setPreviewSource(reader.result);
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("displayPicture", imageFile);
      await dispatch(updateDisplayPicture(token, formData));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile) previewFile(imageFile);
  }, [imageFile]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Profile Picture</h2>

      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-400">Profile picture updated successfully!</p>
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-6">
        <img
            src={previewSource}
            alt={`profile-${user?.firstName}`}
            className="w-24 h-24 sm:w-24 sm:h-24 flex-shrink-0 rounded-full object-cover border border-gray-700"
            />

        <div className="flex flex-col gap-3 flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
          />
          <button
            onClick={handleClick}
            disabled={loading}
            className="
                relative overflow-hidden
                px-5 py-2.5 rounded-lg
                bg-gradient-to-r from-gray-800 to-gray-700
                text-white font-medium
                border border-gray-600
                shadow-md
                hover:from-gray-700 hover:to-gray-600
                hover:shadow-lg
                active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
            "
            >
            Select Image
            </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="
                relative overflow-hidden
                flex items-center justify-center gap-2
                px-5 py-2.5 rounded-lg
                bg-gradient-to-r from-cyan-500 to-blue-500
                text-white font-semibold
                shadow-lg shadow-cyan-500/30
                hover:from-cyan-400 hover:to-blue-500
                hover:shadow-cyan-500/50
                active:scale-[0.97]
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
            "
            >
            <FiUpload />
            {loading ? "Uploading..." : "Upload"}
            </button>

        </div>
      </div>
    </div>
  );
}

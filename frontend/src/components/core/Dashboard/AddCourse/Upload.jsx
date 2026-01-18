import { useEffect, useRef, useState } from "react"
import { FiUploadCloud } from "react-icons/fi"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )

  const fileInputRef = useRef(null)
  const objectUrlRef = useRef(null)

  useEffect(() => {
    console.log("[Upload] registering field:", name)
    register(name, { required: true })
  }, [register, name])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    console.log("[Upload] handleFileChange fired for:", name)
    console.log("[Upload] raw files:", e.target.files)
    console.log("[Upload] selected file:", file)

    if (!file) {
      console.log("[Upload] no file selected, returning")
      return
    }

    setValue(name, file, {
      shouldValidate: true,
      shouldDirty: true,
    })
    console.log("[Upload] setValue called for field:", name, "with:", file)

    if (video) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
      const blobUrl = URL.createObjectURL(file)
      objectUrlRef.current = blobUrl
      setPreviewSource(blobUrl)
      console.log("[Upload] video preview blob URL:", blobUrl)
    } else {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        console.log("[Upload] image preview base64 generated")
        setPreviewSource(reader.result)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        console.log("[Upload] cleaning up blob URL")
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5">
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      <input
        type="file"
        ref={fileInputRef}
        accept={video ? "video/*" : "image/*"}
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={() => {
          console.log("[Upload] container clicked, opening file dialog for:", name)
          fileInputRef.current?.click()
        }}
        className="bg-richblack-700 flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500"
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <div className="w-full aspect-video">
                <video
                  src={previewSource}
                  controls
                  className="h-full w-full rounded-md object-contain"
                />
              </div>
            )}

            {!viewData && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log("[Upload] Cancel clicked for:", name)
                  setPreviewSource("")
                  setValue(name, null)

                  if (objectUrlRef.current) {
                    console.log("[Upload] revoking blob URL on cancel")
                    URL.revokeObjectURL(objectUrlRef.current)
                    objectUrlRef.current = null
                  }
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>

            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a file
            </p>

            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

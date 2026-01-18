import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  SkipForward,
  SkipBack,
  Repeat,
} from "lucide-react";

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../redox/slices/viewCourseSlice";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [tapSide, setTapSide] = useState(null);

  useEffect(() => {
    if (!courseSectionData.length) return;

    if (!courseId && !sectionId && !subSectionId) {
      navigate(`/dashboard/enrolled-courses`);
      return;
    }

    const filteredSection = courseSectionData.find(
      (section) => section._id === sectionId
    );

    const filteredVideo = filteredSection?.subSection.find(
      (sub) => sub._id === subSectionId
    );

    setVideoData(filteredVideo || null);
    setPreviewSource(courseEntireData.thumbnail || "");
    setVideoEnded(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [
    courseSectionData,
    courseEntireData,
    location.pathname,
    courseId,
    sectionId,
    subSectionId,
    navigate,
  ]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      if (!isLooping) setVideoEnded(true);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= 1) {
      setDuration(video.duration || 0);
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isLooping, videoData]);
  const isFirstVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIndex = courseSectionData[sectionIndex]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );
    return sectionIndex === 0 && subIndex === 0;
  };

  const isLastVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIndex = courseSectionData[sectionIndex]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );
    return (
      sectionIndex === courseSectionData.length - 1 &&
      subIndex === courseSectionData[sectionIndex].subSection.length - 1
    );
  };

  const goToNextVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIndex = courseSectionData[sectionIndex]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );

    if (subIndex < courseSectionData[sectionIndex].subSection.length - 1) {
      const nextSubId =
        courseSectionData[sectionIndex].subSection[subIndex + 1]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubId}`
      );
    } else {
      const nextSectionIndex = sectionIndex + 1;
      if (nextSectionIndex < courseSectionData.length) {
        const nextSectionId = courseSectionData[nextSectionIndex]._id;
        const nextSubId = courseSectionData[nextSectionIndex].subSection[0]._id;
        navigate(
          `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubId}`
        );
      }
    }
  };

  const goToPrevVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId);
    const subIndex = courseSectionData[sectionIndex]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );

    if (subIndex > 0) {
      const prevSubId =
        courseSectionData[sectionIndex].subSection[subIndex - 1]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubId}`
      );
    } else if (sectionIndex > 0) {
      const prevSectionIndex = sectionIndex - 1;
      const prevSectionId = courseSectionData[prevSectionIndex]._id;
      const prevSubId =
        courseSectionData[prevSectionIndex].subSection.slice(-1)[0]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubId}`
      );
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
    setVideoEnded(false);
  };

  const skip = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, videoRef.current.currentTime + seconds)
    );
  };

  const toggleLoop = () => {
    if (!videoRef.current) return;
    videoRef.current.loop = !isLooping;
    setIsLooping(!isLooping);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !videoRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleVideoClick = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const side = clickX < rect.width / 2 ? "left" : "right";

    const now = Date.now();
    if (now - lastTapTime < 300 && tapSide === side) {
      skip(side === "left" ? -10 : 10);
      showSkipFeedback(side);
    } else togglePlayPause();

    setLastTapTime(now);
    setTapSide(side);
  };

  const showSkipFeedback = (side) => {
    const overlay = document.createElement("div");
    overlay.className = `skip-feedback ${side}`;
    overlay.innerHTML =
      side === "left" ? '<span>-10s</span>' : "<span>+10s</span>";
    containerRef.current?.appendChild(overlay);
    setTimeout(() => overlay.remove(), 600);
  };

  const handleRewatch = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setVideoEnded(false);
  };

  const handleMarkComplete = async () => {
    if (!subSectionId) return;
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId, subsectionId: subSectionId },
      token
    );
    if (res) dispatch(updateCompletedLectures(subSectionId));
    setVideoEnded(false);
    setLoading(false);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!videoData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#020617] p-4">
        {previewSource ? (
          <img
            src={previewSource}
            alt="Course Preview"
            className="h-60 w-full md:h-96 object-cover rounded-md"
          />
        ) : (
          <p className="text-[#94A3B8] text-center">Select a video to start learning</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#020617] overflow-y-auto my-14 lg:my-0">
      <div className="max-w-6xl mx-auto px-4 lg:p-8">
        <div
          ref={containerRef}
          className="relative bg-black rounded-2xl overflow-hidden shadow-2xl mb-8 group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        >
          <div onClick={handleVideoClick} className="cursor-pointer w-full">
            <video
              ref={videoRef}
              className="w-full aspect-video sm:aspect-[16/9] md:aspect-[16/9] lg:aspect-video"
              src={videoData.videoUrl}
              playsInline
              controls={false}
            />
          </div>

          {/* Completion Overlay */}
          {videoEnded && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fade-in z-20 p-4">
              {!completedLectures.includes(subSectionId) && (
                <button
                  disabled={loading}
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2 px-6 py-3 bg-[#22D3EE] text-[#020617] rounded-lg font-semibold hover:bg-[#67E8F9] transition-all duration-300 text-sm sm:text-base"
                >
                  Mark as Complete
                </button>
              )}

              <button
                onClick={handleRewatch}
                className="flex items-center gap-2 px-6 py-3 bg-[#1E293B] border border-[#3B82F6] text-[#CBD5E1] rounded-lg hover:bg-[#3B82F6]/20 transition-all text-sm sm:text-base"
              >
                <RotateCcw className="w-5 h-5" />
                Rewatch
              </button>

              <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-x-4 text-sm sm:text-lg">
                {!isFirstVideo() && (
                  <button
                    onClick={goToPrevVideo}
                    className="px-4 py-2 bg-[#1E293B] text-[#CBD5E1] rounded-lg hover:bg-[#3B82F6]/20 transition-all"
                  >
                    Prev
                  </button>
                )}

                {!isLastVideo() && (
                  <button
                    onClick={goToNextVideo}
                    className="px-4 py-2 bg-[#1E293B] text-[#CBD5E1] rounded-lg hover:bg-[#3B82F6]/20 transition-all"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 sm:p-4 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Progress Bar */}
            <div
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="w-full h-1.5 sm:h-2 bg-[#1E293B] rounded-full cursor-pointer mb-2 sm:mb-4"
            >
              <div
                className="h-full bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] rounded-full relative transition-all"
                style={{
                  width: duration ? `${(currentTime / duration) * 100}%` : "0%",
                }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#22D3EE] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] opacity-0 sm:group-hover:opacity-100" />
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  onClick={togglePlayPause}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#22D3EE] text-[#020617] hover:bg-[#67E8F9] transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>

                {!isFirstVideo() && (
                  <button
                    onClick={goToPrevVideo}
                    className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white"
                  >
                    <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}

                {!isLastVideo() && (
                  <button
                    onClick={goToNextVideo}
                    className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white"
                  >
                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}

                <button
                  onClick={toggleLoop}
                  className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-all ${
                    isLooping ? "bg-[#22D3EE]/20 text-[#22D3EE]" : "hover:bg-white/10 text-white"
                  }`}
                >
                  <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <span className="text-white text-xs sm:text-sm ml-1 sm:ml-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={toggleMute}
                    className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-12 sm:w-20 transition-all duration-300 accent-[#22D3EE]"
                  />
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white"
                >
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4 mx-1 sm:mx-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-white text-lg sm:text-2xl font-semibold">{videoData.title}</h1>
            {videoData.duration && (
              <span className="text-[#94A3B8] text-sm sm:text-base">{formatTime(videoData.duration)}</span>
            )}
          </div>
          {videoData.description && (
            <p className="text-[#94A3B8] text-sm sm:text-base">{videoData.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;

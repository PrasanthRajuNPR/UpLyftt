import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "./Course_Card"; 

const CourseCarousel = ({ Courses, autoScrollInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const autoScrollTimerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsPerView(1); 
      else if (width < 1024) setCardsPerView(2); 
      else setCardsPerView(3); 
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, Courses.length - cardsPerView);

  const scrollToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const scrollToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  
  useEffect(() => {
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);

    autoScrollTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoScrollInterval);

    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [autoScrollInterval, maxIndex]);

  if (!Courses?.length) { 
    return (
      <p className="text-xl text-richblack-5 text-center py-8">
        No Courses Found
      </p>
    );
  }

  return (
    <div className="relative w-full">
  <div className="overflow-hidden">
    <div
      className="flex transition-transform duration-500 ease-out"
      style={{ transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` }}
    >
      {Courses.map((course, index) => (
        <div
          key={course._id || `${course.name}-${index}`}
          className="flex-shrink-0 px-2 sm:px-4"
          style={{ width: `${100 / cardsPerView}%` }}
        >
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  </div>

  {/* Arrows */}
  <button
    onClick={scrollToPrev}
    className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-card border border-secondary flex items-center justify-center hover:bg-secondary/10"
  >
    <ChevronLeft className="w-5 h-5 text-secondary" />
  </button>

  <button
    onClick={scrollToNext}
    className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 z-20 w-10 h-10 rounded-full bg-card border border-secondary flex items-center justify-center hover:bg-secondary/10"
  >
    <ChevronRight className="w-5 h-5 text-secondary" />
  </button>
</div>

  );
};

export default CourseCarousel;

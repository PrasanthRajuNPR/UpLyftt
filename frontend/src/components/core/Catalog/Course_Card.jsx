import React from "react";
import { Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import GetAvgRating from "../../../utils/avgRating";

const CourseCard = ({ course }) => {
  const avgRating =
    typeof course.averageRating === "number"
      ? course.averageRating
      : GetAvgRating(course.ratingAndReview || []);
  const reviewCount = course.ratingAndReview?.length || 0;
  const studentsCount = course?.studentsEnrolled?.length || 0;

  return (
    <Link to={`/courses/${course._id}`}>
      <div className="bg-card border border-[rgba(34,211,238,0.15)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(103,232,249,0.3)] flex flex-col h-full min-h-[20rem] sm:min-h-[22rem]">

        {/* Image */}
        <div className="w-full h-48 sm:h-56 md:h-64 lg:h-48 overflow-hidden bg-border">
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Body */}
        <div className="p-3 sm:p-5 flex flex-col flex-grow">

          {/* Top Row */}
          <div className="flex flex-row items-start justify-between mb-3 gap-2 sm:gap-0">
            <span className="text-primary text-xs font-semibold px-3 py-1 bg-primary/10 rounded-full w-max">
              {course.category?.name || "category"}
            </span>
            <span className="text-heading font-bold text-lg">
              ${course.price}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-heading font-semibold text-sm sm:text-lg mb-2 line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem]">
            {course.courseName}
          </h3>

          {/* Description */}
          <p className="text-body text-xs sm:text-sm sm:text-base mb-4 leading-relaxed line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {course.courseDescription}
          </p>

          {/* Rating */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-heading font-semibold text-sm sm:text-base">
                {avgRating}
              </span>
            </div>
            <span className="text-helper text-xs sm:text-sm">
              ({reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          {/* Students */}
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-4 h-4 text-helper" />
            <span className="text-helper text-xs sm:text-sm">
              {studentsCount.toLocaleString()} students
            </span>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[rgba(34,211,238,0.15)] mt-auto">
            <p className="text-subheading text-sm sm:text-base font-medium tracking-wide">
              {course.instructor
                ? `${course.instructor.firstName} ${course.instructor.lastName}`
                : `Learn ${course.tag?.[0]?.replace(/[\[\]"\\]/g, ' ')}` }
            </p>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

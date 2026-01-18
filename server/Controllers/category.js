const Category = require("../models/Category");
const Course =require("../models/Course")


const getAverageRating = (course) => {
  const ratings = course.ratingAndReview || [];

  if (!Array.isArray(ratings) || ratings.length === 0) return 0;

  const sum = ratings.reduce(
    (acc, review) => acc + Number(review.rating || 0),
    0
  );

  return Number((sum / ratings.length).toFixed(1));
};


exports.createCategory = async(req,res)=>{
    try{
        const {name,description} = req.body;

        console.log("Name : ",name," description : ",description);
        
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"Please fill all details"
            })
        }

        const category = await Category.create({name:name,description:description});

        console.log("Category : ",category);
        
        res.status(200).json({
            success:true,
            message:"Category created successfully"
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message,
        })
    }
}

exports.showAllCategories = async(req,res)=>{
    try{
        const allCategories = await Category.find({});
        console.log("All Categories",allCategories);
        res.status(200).json({
            success:true,
            message:"Successfully Categories retrived",
            data:allCategories
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}
const getRandomInt = (max) => Math.floor(Math.random() * max);

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    console.log("CATEGORY ID RECEIVED:", categoryId);

    // 1️⃣ Handle "all" case
    if (categoryId === "all") {
      // Fetch all courses globally
      const allCourses = await Course.find({ status: "Published" })
        .populate([
          { path: "category", select: "name" },
          { path: "instructor", select: "firstName lastName" },
          { path: "ratingAndReview", select: "rating" },
        ]);

      // Most Popular: sort by average rating
      const mostPopular = allCourses
        .map(course => ({
          ...course._doc,
          averageRating: getAverageRating(course),
          instructorName: course.instructor?.name || "",
          categoryName: course.category?.name || "",
        }))
        .sort((a, b) => b.averageRating - a.averageRating);

      // New Courses: sort by createdAt descending
      const newCourses = [...allCourses].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Top Courses: you can define as top by rating + students count
      const topCourses = allCourses
        .map(course => ({
          ...course._doc,
          averageRating: getAverageRating(course),
          studentsCount: course.studentsEnrolled?.length || 0,
          instructorName: course.instructor?.name || "",
          categoryName: course.category?.name || "",
        }))
        .sort((a, b) => {
          if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
          return b.studentsCount - a.studentsCount;
        })
        .slice(0, 10); // optional: top 10 globally

      return res.status(200).json({
        success: true,
        data: {
          mostPopular,
          newCourses,
          topCourses
        },
      });
    }

    // 2️⃣ Normal category handling
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "category", select: "name" },
          { path: "instructor", select: "firstName lastName" },
          { path: "ratingAndReview", select: "rating" }
        ],
      })
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!selectedCategory.courses || selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category",
      });
    }

    // Prepare selected category courses
    const mostPopularCourses = selectedCategory.courses
      .map((course) => ({
        ...course._doc,
        averageRating: getAverageRating(course),
        instructorName: course.instructor?.name || "",
        categoryName: course.category?.name || "",
      }))
      .sort((a, b) => b.averageRating - a.averageRating);

    const newCourses = [...selectedCategory.courses].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const formattedSelectedCategory = {
      _id: selectedCategory._id,
      name: selectedCategory.name,
      most_popular: mostPopularCourses,
      new: newCourses,
    };

    // Different categories
    const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } })
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "category", select: "name" },
          { path: "instructor", select: "name" },
          { path: "ratingAndReview", select: "rating" }
        ],
      });

    let differentCourses = [];
    for (let cat of categoriesExceptSelected) {
      if (cat.courses && cat.courses.length > 0) differentCourses.push(...cat.courses);
    }
    differentCourses.sort((a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0));

    const mostSellingCourses = selectedCategory.courses
      .map(course => ({
        ...course._doc,
        averageRating: getAverageRating(course),
        studentsCount: course.studentsEnrolled?.length || 0,
        instructorName: course.instructor?.name || "",
        categoryName: course.category?.name || "",
      }))
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
        return b.studentsCount - a.studentsCount;
      });

    // Send normal category response
    res.status(200).json({
      success: true,
      data: {
        selectedCategory: formattedSelectedCategory,
        differentCategory: differentCourses,
        mostSellingCourses,
      },
    });

  } catch (error) {
    console.error("CATEGORY PAGE DATA API ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


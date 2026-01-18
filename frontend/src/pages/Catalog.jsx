import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories} from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import { useSelector } from "react-redux"
import Error from "./Error"
import { ArrowLeft } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import CourseCarousel from '../components/core/Catalog/CourseSlider';

const Catalog = () => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (catalogName === "all") {
          const res = await getCatalogaPageData("all"); 
          setCatalogPageData({
            success: true,
            data: {
              selectedCategory: {
                name: "All Courses",
                most_popular: res.data.mostPopular,  
                new: res.data.newCourses            
              },
              mostSellingCourses: res.data.topCourses, 
              differentCategory: [] 
            }
          });
        } else {
          
          const categoriesRes = await apiConnector("GET", categories.CATEGORIES_API);
          const category_id = categoriesRes?.data?.data?.filter(
            (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
          )[0]?._id;
          setCategoryId(category_id);

          if (category_id) {
            const res = await getCatalogaPageData(category_id);
            setCatalogPageData(res);
          }
        }
      } catch (err) {
        console.log("Catalog fetch error:", err);
      }
    }

    fetchData();
  }, [catalogName]);

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:text-hover transition-colors mb-6 sm:mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm sm:text-base">Back to Catalogs</span>
        </button>

        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-heading mb-2">
            {catalogPageData.data.selectedCategory.name}
          </h1>
          <p className="text-body text-sm sm:text-base">
            {catalogPageData.data.selectedCategory?.new?.length} courses available
          </p>
        </div>

        {/* Most Popular / New */}
        <section className="mb-12 sm:mb-16 ">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
            <button
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                active === 1
                  ? 'bg-primary text-card shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'bg-card border border-secondary text-secondary hover:bg-secondary/10'
              }`}
              onClick={() => setActive(1)}
            >
              Most Popular
            </button>
            <button
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                active === 2
                  ? 'bg-primary text-card shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'bg-card border border-secondary text-secondary hover:bg-secondary/10'
              }`}
              onClick={() => setActive(2)}
            >
              New
            </button>
          </div>
          <CourseCarousel
            category={catalogPageData.data?.selectedCategory?.name}
            Courses={
              active === 1
                ? catalogPageData?.data?.selectedCategory?.most_popular
                : catalogPageData?.data?.selectedCategory?.new
            }
          />
        </section>

        {/* Top Courses */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-heading mb-4 sm:mb-6">
            {catalogName === "all"
              ? "Top Courses Globally"
              : `Top Courses in ${catalogPageData?.data?.selectedCategory?.name}`}
          </h2>
          <CourseCarousel Courses={catalogPageData?.data?.mostSellingCourses}/>
        </section>

        {/* Most Enrolled row removed if catalogName === "all" */}
        {catalogName !== "all" && (
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-heading mb-4 sm:mb-6">
              Most Enrolled Courses
            </h2>
            <CourseCarousel Courses={catalogPageData?.data?.differentCategory} />{console.log("qwerty  :: ",catalogPageData?.data?.differentCategory)}
          </section>
        )}
      </div>
    </div>
  )
}

export default Catalog

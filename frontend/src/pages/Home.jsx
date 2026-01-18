import { useState, useEffect } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { useSelector } from "react-redux";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { AnimatedTerminal } from "../components/common/AnimatedTerminal";

import {
  BookOpen,
  Target,
  Award,
  Users,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Sparkles,
  Globe,
} from "lucide-react";

import { ACCOUNT_TYPE } from "../utils/constants";

export default function Home() {
  const navigate = useNavigate();

  /* ---------------- REDUX AUTH ---------------- */
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  /* ---------------- STATS ---------------- */
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      students: 15000,
      courses: 120,
      instructors: 30,
      satisfaction: 95,
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setStats({
        students: Math.floor(targets.students * progress),
        courses: Math.floor(targets.courses * progress),
        instructors: Math.floor(targets.instructors * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  /* ---------------- HANDLERS (OLD LOGIC RESTORED) ---------------- */

  const handleLearnerAccess = () => {
    if (!token) {
      navigate("/signup", {
        state: { role: "student" },
      });
    } else {
      navigate("/catalog/all");
    }
  };

  
  const handleInstructorAccess = () => {
    if (!token) {
      navigate("/signup", {
        state: { role: "instructor" },
      });
      return;
    }

    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      navigate("/dashboard/instructor");
    } else {
        navigate("/signup", {
        state: { role: "instructor" },
      });
      return;
    }
  };

  /* ---------------- DATA ---------------- */

  const features = [
    {
      icon: BookOpen,
      title: "Industry-Ready Courses",
      description:
        "Learn skills that employers actually need. Our curriculum is built with input from industry professionals.",
    },
    {
      icon: Target,
      title: "Project-Based Learning",
      description:
        "Build real-world projects that showcase your skills. Every course includes hands-on assignments.",
    },
    {
      icon: Award,
      title: "Verified Certificates",
      description:
        "Earn certificates recognized by top companies. Showcase your achievements on LinkedIn.",
    },
  ];

const learningPaths = [
  {
    title: 'Frontend Developer',
    description: 'Master HTML, CSS, JavaScript, React, and modern UI/UX',
    duration: '6 months',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Backend Developer',
    description: 'Learn Node.js, databases, APIs, and server architecture',
    duration: '8 months',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Full Stack Engineer',
    description: 'Complete frontend and backend mastery',
    duration: '12 months',
    gradient: 'from-cyan-400 to-blue-600',
  },
];  

  const instructorBenefits = [
    { icon: DollarSign, text: "Earn money" },
    { icon: Sparkles, text: "Build your brand" },
    { icon: Globe, text: "Teach globally" },
  ];

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Learn. Build.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Grow.
              </span>
            </h1>

            <p className="text-xl text-gray-400">
              Master real-world skills with hands-on courses designed by industry experts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" onClick={handleLearnerAccess}>
                Browse Courses
              </Button>
              <Button variant="secondary" onClick={handleLearnerAccess}>
                Start Learning
              </Button>
            </div>
          </div>

          <div className="lg:block">
            <AnimatedTerminal />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                  <feature.icon size={32} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Learning Paths</h2>
          <p className="text-xl text-gray-400">
            Structured journeys to reach your career goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {learningPaths?.map((path, index) => (
              <div
                key={index}
                className="relative bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-cyan-500/50 transition-all overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${path.gradient} opacity-10 rounded-bl-full`}></div>
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{path.title}</h3>
                <p className="text-gray-400 mb-4 relative z-10">{path.description}</p>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-cyan-400 font-semibold">{path.duration}</span>
                  <Link
                    to="/signup"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold group-hover:underline transition-all"
                  >
                    Start Path →
                  </Link>
                </div>
              </div>
            ))}
          </div>
      </section>

      {/* INSTRUCTOR CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
          <div className="text-center space-y-8 py-8">
            <GraduationCap size={64} className="text-cyan-400 mx-auto" />
            <h2 className="text-4xl font-bold text-white">
              Become an Instructor. Inspire Millions.
            </h2>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Share your knowledge, build your personal brand, and earn money while
              teaching students around the world.
            </p>

            <div className="flex flex-wrap justify-center gap-8 py-4">
              {instructorBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-cyan-400"
                >
                  <benefit.icon size={24} />
                  <span className="text-lg">{benefit.text}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" onClick={handleInstructorAccess}>
              Become an Instructor
            </Button>
          </div>
        </Card>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: `${stats.students.toLocaleString()}+`, label: "Students", icon: Users },
            { value: `${stats.courses}+`, label: "Courses", icon: BookOpen },
            { value: `${stats.instructors}+`, label: "Instructors", icon: GraduationCap },
            { value: `${stats.satisfaction}%`, label: "Satisfaction", icon: TrendingUp },
          ].map((item, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {item.value}
              </div>
              <div className="text-gray-400 flex items-center justify-center space-x-2">
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <Card hover className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/30">
            <div className="text-center space-y-6 py-8">
              <BookOpen size={48} className="text-cyan-400 mx-auto" />
              <h3 className="text-3xl font-bold text-white">Start Learning Today</h3>
              <p className="text-gray-300">
                Join thousands of students mastering new skills and advancing their careers.
              </p>
              <Button variant="primary" fullWidth onClick={handleLearnerAccess}>
                Explore Courses
              </Button>
            </div>
          </Card>

          <Card hover className="bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/30">
            <div className="text-center space-y-6 py-8">
              <GraduationCap size={48} className="text-blue-400 mx-auto" />
              <h3 className="text-3xl font-bold text-white">Start Teaching Today</h3>
              <p className="text-gray-300">
                Share your expertise with learners worldwide and build your personal brand.
              </p>
              <Button variant="secondary" fullWidth onClick={handleInstructorAccess}>
                Become an Instructor
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

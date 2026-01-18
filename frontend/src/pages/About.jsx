import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Target, Eye, Heart, Shield, Quote } from "lucide-react";
import aboutusimage from "../assets/Images/Aboutuspage.png"
export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: "Practical Learning",
      description:
        "We believe in learning by doing. Every course is hands-on and project-based.",
    },
    {
      icon: Heart,
      title: "Accessibility",
      description:
        "Quality education should be accessible to everyone, everywhere.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We maintain the highest standards in content quality and student support.",
    },
    {
      icon: Eye,
      title: "Community",
      description:
        "Learning is better together. We foster a supportive, collaborative environment.",
    },
  ];

  const quotes = [
    {
      text:
        "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela",
    },
    {
      text:
        "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King",
    },
    {
      text:
        "Live as if you were to die tomorrow. Learn as if you were to live forever.",
      author: "Mahatma Gandhi",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* HERO */}
       <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <Quote size={65} className="text-cyan-400 mx-auto opacity-50" />
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-relaxed italic">
            "Education is not just about learning skills,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              it's about unlocking potential.
            </span>"
          </h1>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={aboutusimage}
                alt="Team collaboration"
                className="rounded-lg shadow-2xl border border-gray-800"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Who We Are</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                We are a passionate team of educators, developers, and innovators dedicated to revolutionizing
                the way people learn. Founded with the vision of making quality education accessible to everyone,
                we've built a platform that connects learners with expert instructors from around the world.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our platform combines cutting-edge technology with proven teaching methodologies to deliver
                an engaging and effective learning experience. Whether you're looking to advance your career,
                explore a new hobby, or share your expertise, we're here to support your journey.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Our Mission & Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/30">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Target size={24} className="text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  To empower learners worldwide with practical, real-world skills that transform careers
                  and unlock opportunities.
                </p>
              </div>
            </Card>

           <Card className="bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/30">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Eye size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  To create a world where quality education is accessible to everyone, enabling individuals
                  to reach their full potential regardless of their background.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
      {/* WHY WE EXIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why We Exist
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Traditional education often falls short in preparing students for
            real-world challenges. We bridge that gap by connecting passionate
            learners with expert instructors who teach practical,
            industry-relevant skills.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 py-4">
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4">The Problem</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Theory-heavy curriculum with limited practical application</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Outdated content that doesn't reflect current industry needs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Limited access to quality education for many learners</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4">Our Solution</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Project-based courses with real-world applications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Industry experts teaching current, relevant skills</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Accessible platform available to learners worldwide</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-400">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} hover>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto">
                  <value.icon size={32} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {value.title}
                </h3>
                <p className="text-gray-400">
                  {value.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* QUOTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Words of Wisdom
          </h2>
          <p className="text-xl text-gray-400">
            Inspiring quotes about learning and growth
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {quotes.map((quote, index) => (
            <Card key={index} className="relative">
              <Quote size={40} className="text-cyan-400/20 absolute top-4 left-4" />
              <div className="pt-8 space-y-4">
                <p className="text-gray-300 italic text-lg leading-relaxed">
                  {quote.text}
                </p>
                <p className="text-cyan-400 font-medium">
                  — {quote.author}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
          <div className="text-center space-y-8 py-8">
            <h2 className="text-3xl font-bold text-white">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of learners transforming their careers with
              practical skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={() => navigate("/catalog/all")}>
                Start Learning
              </Button>
              <Button variant="secondary" onClick={() => navigate("/contact")}>
                Contact Us
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

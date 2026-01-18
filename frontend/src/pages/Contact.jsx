import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

import { apiConnector } from "../services/apiconnector";
import { contactusEndpoint } from "../services/apis";

const countries = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
];

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[2]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const payload = {
      firstname: firstName,
      lastname: lastName,
      email,
      phoneNo: `${selectedCountry.dialCode} ${phoneNumber}`,
      message,
    };

    try {
      setLoading(true);
      await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        payload
      );

      setSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
    } catch (error) {
      console.log("CONTACT FORM ERROR:", error);
    } finally {
      setLoading(false);
    }

    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">Let's Talk</h1>
              <p className="text-xl text-gray-400">
                Have questions? We'd love to hear from you. Send us a message and
                we'll respond as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Mail size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Email Us
                    </h3>
                    <p className="text-gray-400">
                      support@eduplatform.com
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MessageSquare size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Quick Response
                    </h3>
                    <p className="text-gray-400">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    Become an Instructor
                  </h3>
                  <p className="text-gray-300">
                    Interested in teaching? Fill out the form and select
                    "Instructor Inquiry" in your message.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* FORM */}
          <Card>
            {success ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={48} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-400">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
                <Button variant="primary" onClick={() => setSuccess(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="John"
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 focus:border-cyan-500 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Doe"
                        className="focus:border-cyan-500 w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className={`focus:border-cyan-500 w-full pl-10 pr-4 py-3 bg-slate-800 border rounded-lg text-white ${
                        emailError ? "border-red-500" : "border-slate-700"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-red-400 text-sm mt-1">{emailError}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>

                  <div className="flex space-x-2 relative">
                    {/* COUNTRY SELECT */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setCountryDropdownOpen((prev) => !prev)}
                        className="w-32 px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg 
                                  text-white focus:outline-none focus:border-cyan-500 
                                  transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center space-x-2">
                          <span className="text-xl">{selectedCountry.flag}</span>
                          <span className="text-sm">{selectedCountry.dialCode}</span>
                        </span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            countryDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* ✅ DROPDOWN LIST */}
                      {countryDropdownOpen && (
                        <div className="absolute z-20 top-full mt-2 w-64 bg-slate-900 
                                        border border-slate-700 rounded-lg shadow-xl 
                                        shadow-cyan-500/10 max-h-64 overflow-y-auto">
                          {countries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country);
                                setCountryDropdownOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-slate-800 
                                        transition-colors flex items-center space-x-3"
                            >
                              <span className="text-xl">{country.flag}</span>
                              <span className="text-gray-300">{country.name}</span>
                              <span className="text-cyan-400 ml-auto">
                                {country.dialCode}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* PHONE INPUT */}
                    <div className="relative flex-1">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        placeholder="123 456 7890"
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 
                                  rounded-lg text-white placeholder-gray-500 
                                  focus:outline-none focus:border-cyan-500 
                                  transition-colors"
                      />
                    </div>
                  </div>
                </div>


                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="focus:border-cyan-500 w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../component/apiurl";
import cookies from "js-cookie";

export const UserLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/user/login", { mobile, password });

      if (res.data.success) {
        cookies.set("flowspace_user_auth", res.data.token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        navigate("/dashboard");
      } else {
        setError(res.data.message || "লগইন ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "সার্ভার থেকে এরর এসেছে।");
      } else {
        setError("নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8">
        
        {/* হেডার */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Flowspace
          </h1>
          <p className="text-slate-400 text-sm mt-2">আপনার ক্লাউড স্টোরেজে লগইন করুন</p>
        </div>

        {/* এরর মেসেজ */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {/* ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* মোবাইল ইনপুট */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">মোবাইল নম্বর</label>
            <div className="relative">
              {/* Phone SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" 
                   className="absolute inset-y-0 left-3 w-5 h-5 text-slate-500 my-auto" 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h3.75a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75H6.75v1.5a9.75 9.75 0 009.75 9.75h1.5v-1.5a.75.75 0 01.75-.75h3.75a.75.75 0 01.75.75v3.75c0 1.243-1.007 2.25-2.25 2.25h-3.75A15.75 15.75 0 012.25 6.75z" />
              </svg>
              <input
                type="tel"
                required
                placeholder="01xxxxxxxxx"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* পাসওয়ার্ড ইনপুট */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">পাসওয়ার্ড</label>
            <div className="relative">
              {/* Lock SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" 
                   className="absolute inset-y-0 left-3 w-5 h-5 text-slate-500 my-auto" 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M16.5 10.5V7.5a4.5 4.5 0 00-9 0v3m-.75 0h10.5a.75.75 0 01.75.75v9a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-9a.75.75 0 01.75-.75z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 text-slate-400 hover:text-slate-200 text-xs"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg disabled:opacity-50"
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>
      </div>
    </div>);
};

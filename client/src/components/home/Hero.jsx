import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user } = useSelector((state) => state.auth);

  const companiesLogo = [
    {
      logo: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          className="h-7 opacity-70"
        />
      ),
    },
    {
      logo: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
          className="h-7 opacity-70"
        />
      ),
    },
    {
      logo: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
          className="h-7 opacity-70"
        />
      ),
    },
    {
      logo: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
          className="h-7 opacity-70"
        />
      ),
    },
    {
      logo: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
          className="h-7 opacity-70"
        />
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen pb-20">
        {/* NAVBAR */}
        <nav className="z-50 flex items-center justify-between w-full py-4 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-40 text-sm">

          <a href="/">
            <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-slate-800">
            <a href="#" className="hover:text-green-600">Home</a>
            <a href="#features" className="hover:text-green-600">Features</a>
            <a href="#testimonials" className="hover:text-green-600">Testimonials</a>
            <a href="#cta" className="hover:text-green-600">Contact</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-3">
            {!user && (
              <>
                <Link
                  to="/app?state=register"
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-full text-white"
                >
                  Get started
                </Link>

                <Link
                  to="/app?state=login"
                  className="px-6 py-2 border rounded-full"
                >
                  Login
                </Link>
              </>
            )}

            {user && (
              <Link
                to="/app"
                className="px-8 py-2 bg-green-500 hover:bg-green-600 rounded-full text-white"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 5h16M4 12h16M4 19h16" />
            </svg>
          </button>

        </nav>

        {/* MOBILE MENU */}
        <div
          className={`fixed inset-0 z-[100] bg-black/70 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 text-white transition-all duration-300 ${menuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
        >
          <a href="#" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</a>
          <a href="#cta" onClick={() => setMenuOpen(false)}>Contact</a>

          {!user && (
            <>
              <Link
                to="/app?state=register"
                className="bg-green-500 px-6 py-2 rounded-full"
              >
                Get Started
              </Link>

              <Link
                to="/app?state=login"
                className="border px-6 py-2 rounded-full"
              >
                Login
              </Link>
            </>
          )}

          {user && (
            <Link
              to="/app"
              className="bg-green-500 px-6 py-2 rounded-full"
            >
              Dashboard
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(false)}
            className="bg-green-600 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>

        {/* HERO SECTION */}
        <div className="relative flex flex-col items-center justify-center text-black px-4 sm:px-6 md:px-16 lg:px-24 xl:px-40">

          <div className="absolute top-28 left-1/4 -z-10 size-52 sm:size-72 md:size-96 bg-green-300 blur-[100px] opacity-30"></div>

          {/* USERS */}
          <div className="flex items-center mt-20">

            <div className="flex -space-x-3 pr-3">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" className="size-8 rounded-full border-2 border-white" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg" className="size-8 rounded-full border-2 border-white" />
              <img src="https://randomuser.me/api/portraits/men/11.jpg" className="size-8 rounded-full border-2 border-white" />
              <img src="https://randomuser.me/api/portraits/women/12.jpg" className="size-8 rounded-full border-2 border-white" />
            </div>

            <div>
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-green-600"
                  >
                    <path d="M12 .587l3.668 7.568L24 9.75l-6 5.86L19.335 24 12 19.897 4.665 24 6 15.61 0 9.75l8.332-1.595z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-gray-600">Used by 10,000+ users</p>
            </div>
          </div>

          {/* HERO TITLE */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold max-w-5xl text-center mt-6 leading-tight md:leading-[70px]">
            Land your dream job with
            <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent px-2">
              AI-powered
            </span>
            resumes
          </h1>

          {/* DESCRIPTION */}
          <p className="max-w-md text-center text-base my-7 text-gray-700">
            Create, edit and download professional resumes with AI powered assistance.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4">

            <Link
              to="/app"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 h-12 flex items-center"
            >
              Get started →
            </Link>

            <button className="border border-slate-400 hover:bg-green-50 rounded-full px-7 h-12 text-slate-700">
              Try demo
            </button>

          </div>

          {/* TRUST TEXT */}
          <p className="py-6 text-slate-600 mt-14 text-center">
            Trusted by leading brands
          </p>

          {/* COMPANY LOGOS */}
          <div className="flex flex-wrap justify-center sm:justify-between gap-8 max-w-3xl w-full mx-auto py-4">
            {companiesLogo.map((company, index) => (
              <div key={index}>{company.logo}</div>
            ))}
          </div>

        </div>
      </div>

      {/* FONT */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        *{font-family:'Poppins',sans-serif}
        `}
      </style>
    </>
  );
};

export default Hero;
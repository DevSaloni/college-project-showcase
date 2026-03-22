export default function Footer() {
  return (
    <footer className="relative bg-[#020814] text-white pt-16 pb-8 border-t border-white/10 overflow-hidden">

      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-40 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at 80% 10%, var(--pv-accent), transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">

        {/* Brand */}
        <div>
          <h2
            className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent text-white"
            style={{
              background: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))",
            }}
          >
            ProjectVista
          </h2>

          <p className="mt-3 text-white/60 leading-relaxed text-[15px]">
            A smart platform to showcase college projects and connect students,
            mentors, and recruiters seamlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[17px] font-semibold mb-3 text-[var(--pv-accent)]">Quick Links</h4>
          <ul className="space-y-2 text-white/70 text-[15px]">
            {[
              "Home",
              "Explore Projects",
              "Categories",
              "How It Works",
              "About Us",
              "Contact",
            ].map((item, i) => (
              <li key={i} className="hover:text-white transition cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-[17px] font-semibold mb-3 text-[var(--pv-accent)]">Top Categories</h4>
          <ul className="space-y-2 text-white/70 text-[15px]">
            {[
              "AI / ML",
              "Blockchain",
              "Web Development",
              "Data Science",
              "IoT",
              "Cybersecurity",
            ].map((item, i) => (
              <li key={i} className="hover:text-white transition cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-[17px] font-semibold mb-3 text-[var(--pv-accent)]">Support</h4>
          <ul className="space-y-2 text-white/70 text-[15px]">
            {[
              "Privacy Policy",
              "Terms & Conditions",
              "Help Center",
              "Report Issue",
            ].map((item, i) => (
              <li key={i} className="hover:text-white transition cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Social + Bottom */}
      <div className="mt-12 border-t border-white/10 pt-5 max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between relative z-10">

        {/* Social Icons */}
        <div className="flex space-x-5 text-white/70 text-xl">
          {[
            "ri-linkedin-fill",
            "ri-github-fill",
            "ri-instagram-line",
            "ri-mail-line",
          ].map((icon, i) => (
            <a key={i} href="#" className="hover:text-white transition">
              <i className={icon}></i>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-white/50 text-sm mt-5 sm:mt-0">
          © {new Date().getFullYear()} ProjectVista. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

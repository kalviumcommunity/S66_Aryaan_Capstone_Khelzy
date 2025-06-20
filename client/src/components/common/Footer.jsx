const Footer = () => {
    return (
      <footer className="bg-[#0b2d72] py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-[#06c1ff] rounded-lg flex items-center justify-center text-[#0b2d72] font-bold text-xl">
                  K
                </div>
                <div className="text-2xl font-bold text-white">Khelzy</div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                Khelzy is the ultimate destination for free online games. Play instantly without downloads across all devices and challenge your friends.
              </p>
              <div className="flex gap-4">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#06c1ff] transition-all duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#06c1ff] transition-all duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-10 after:h-0.5 after:bg-[#06c1ff]">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 text-sm hover:text-[#06c1ff] transition-all duration-300 hover:pl-1">Home</a></li>
                <li><a href="#" className="text-white/70 text-sm hover:text-[#06c1ff] transition-all duration-300 hover:pl-1">About Us</a></li>
                <li><a href="#" className="text-white/70 text-sm hover:text-[#06c1ff] transition-all duration-300 hover:pl-1">Games</a></li>
                <li><a href="#" className="text-white/70 text-sm hover:text-[#06c1ff] transition-all duration-300 hover:pl-1">Contact</a></li>
              </ul>
            </div>
            

            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-10 after:h-0.5 after:bg-[#06c1ff]">
                Help & Support
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 text-sm hover:text-[#06c1ff] transition-all duration-300 hover:pl-1">FAQs</a></li>
                <li><a href="#" className="text-white/70 text-sm hover:text-[#06c1ff] transition-all duration-300 hover:pl-1">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 text-sm hover:text-[#06c1ff] transition-all duration-300 hover:pl-1">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 text-sm hover:text-[#06c1ff] transition-all duration-300 hover:pl-1">Support Center</a></li>
                <li><a href="#" className="text-white/70 text-sm hover:text-[#06c1ff] transition-all duration-300 hover:pl-1">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Khelzy. All Rights Reserved.
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
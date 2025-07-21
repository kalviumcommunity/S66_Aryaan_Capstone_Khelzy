import React, { useEffect } from 'react';
import { Shield, Eye, Lock, Database, Globe, Users, AlertTriangle, Mail, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/common/Footer';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function PrivatePolicy() {
  const { theme } = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const privacyPrinciples = [
    {
      icon: <Shield className="w-8 h-8 text-[#06c1ff]" />,
      title: "Data Protection",
      description: "Your game data and authentication information is securely stored using modern encryption methods."
    },
    {
      icon: <Eye className="w-8 h-8 text-[#06c1ff]" />,
      title: "Transparency",
      description: "We clearly explain what minimal data we collect for the gaming experience to function."
    },
    {
      icon: <Lock className="w-8 h-8 text-[#06c1ff]" />,
      title: "User Control",
      description: "You have control over your login sessions and can logout anytime to clear your data."
    },
    {
      icon: <Database className="w-8 h-8 text-[#06c1ff]" />,
      title: "Minimal Collection",
      description: "We only collect data essential for authentication and basic gameplay functionality."
    }
  ];

  const dataTypes = [
    {
      category: "Authentication Information",
      icon: <Users className="w-6 h-6 text-[#06c1ff]" />,
      collected: ["Google account email and name (via Google OAuth)", "WebAuthn credentials (stored locally on your device)", "User ID for session management"],
      purpose: "To enable secure login to your gaming account and maintain your session while playing games."
    },
    {
      category: "Game Data",
      icon: <FileText className="w-6 h-6 text-[#06c1ff]" />,
      collected: ["Game scores and progress", "Favorite games list", "Games you've played"],
      purpose: "To save your game progress and remember your favorite games across sessions."
    },
    {
      category: "Session Information",
      icon: <Globe className="w-6 h-6 text-[#06c1ff]" />,
      collected: ["Login timestamps", "Session tokens", "Basic browser compatibility data"],
      purpose: "To maintain your login session and ensure games work properly in your browser."
    }
  ];

  const userRights = [
    {
      right: "View Your Data",
      description: "See what game data and scores we have stored for your account",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      right: "Logout Anytime",
      description: "End your session and clear local authentication data",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      right: "Data Portability",
      description: "Export your game scores and statistics in a readable format",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      right: "Contact for Deletion",
      description: "Reach out to request removal of your account data",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    }
  ];

  return (
    <div className={`min-h-screen ${theme.background} ${theme.primary} transition-colors duration-300`}>
      <Header />
      
      <main className="container mx-auto px-6 pt-28 pb-16 max-w-6xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <motion.div 
              className="absolute top-20 left-1/4 w-72 h-72 bg-[#06c1ff]/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360] 
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#0b2d72]/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 0.8, 1],
                rotate: [360, 180, 0] 
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <motion.div 
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#06c1ff] to-[#0b2d72] rounded-full mb-8"
            whileHover={{ 
              rotate: 360,
              scale: 1.1,
              boxShadow: "0 25px 50px -12px rgba(6, 193, 255, 0.25)"
            }}
            transition={{ duration: 0.6 }}
            data-aos="zoom-in"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#0b2d72] to-[#06c1ff] bg-clip-text text-transparent"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Privacy Policy
          </motion.h1>

          <motion.p 
            className={`text-xl md:text-2xl ${theme.secondary} max-w-4xl mx-auto leading-relaxed font-light mb-8`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Simple and honest: here's exactly what data Khelzy collects and why we need it for your gaming experience.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-6 text-sm"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className={`${theme.cardBg} ${theme.border} border rounded-xl px-4 py-2`}>
              <strong>Last Updated:</strong> January 21, 2025
            </div>
            <div className={`${theme.cardBg} ${theme.border} border rounded-xl px-4 py-2`}>
              <strong>Effective Date:</strong> January 21, 2025
            </div>
          </motion.div>
        </motion.div>

        {/* Privacy Principles */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              Our Approach to Privacy
            </h2>
            <p className={`text-lg ${theme.secondary} max-w-3xl mx-auto`}>
              As a student capstone project, we keep things simple and focus on what's essential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyPrinciples.map((principle, index) => (
              <motion.div 
                key={index}
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300`}
                data-aos="fade-up"
                data-aos-delay={100 * index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mb-4">{principle.icon}</div>
                <h3 className={`text-lg font-bold mb-3 ${theme.primary}`}>{principle.title}</h3>
                <p className={`text-sm ${theme.secondary} leading-relaxed`}>{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What We Actually Collect */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              What We Actually Collect
            </h2>
            <p className={`text-lg ${theme.secondary} max-w-3xl mx-auto`}>
              Khelzy is a simple gaming platform. Here's the minimal data we need to make it work:
            </p>
          </div>

          <div className="space-y-8">
            {dataTypes.map((dataType, index) => (
              <motion.div 
                key={index}
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-8`}
                data-aos="fade-right"
                data-aos-delay={100 * index}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  {dataType.icon}
                  <h3 className={`text-2xl font-bold ${theme.primary}`}>{dataType.category}</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`text-lg font-semibold mb-3 ${theme.primary}`}>What We Collect:</h4>
                    <ul className={`space-y-2 ${theme.secondary}`}>
                      {dataType.collected.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#06c1ff] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className={`text-lg font-semibold mb-3 ${theme.primary}`}>Why We Need It:</h4>
                    <p className={`${theme.secondary} leading-relaxed`}>{dataType.purpose}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How We Actually Use Your Data */}
        <div className="mb-20" data-aos="fade-up">
          <motion.div 
            className={`${theme.cardBg} ${theme.border} border rounded-3xl p-8 md:p-12`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className={`text-4xl font-bold mb-8 ${theme.primary} text-center`}>
              How Khelzy Actually Works
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold mb-4 ${theme.primary}`}>What We Do:</h3>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#06c1ff] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Store Game Scores</h4>
                    <p className={`${theme.secondary}`}>Save your high scores and progress in our MongoDB database</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#06c1ff] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Remember Your Favorites</h4>
                    <p className={`${theme.secondary}`}>Keep track of games you've marked as favorites</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#06c1ff] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Enable Authentication</h4>
                    <p className={`${theme.secondary}`}>Use Google OAuth or WebAuthn for secure login</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#06c1ff] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Track Game Play</h4>
                    <p className={`${theme.secondary}`}>Remember which games you've played for a personalized experience</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold mb-4 ${theme.primary}`}>What We DON'T Do:</h3>
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Sell Your Data</h4>
                    <p className={`${theme.secondary}`}>This is a student project - no monetization involved</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Track You Across Sites</h4>
                    <p className={`${theme.secondary}`}>No analytics, no tracking pixels, no third-party cookies</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Store Device Information</h4>
                    <p className={`${theme.secondary}`}>We don't collect or store your device type or specifications</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Send Marketing Emails</h4>
                    <p className={`${theme.secondary}`}>No newsletters, no spam - just gaming</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Your Rights */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              Your Control Over Your Data
            </h2>
            <p className={`text-lg ${theme.secondary} max-w-3xl mx-auto`}>
              It's your data, and you have control over it
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRights.map((right, index) => (
              <motion.div 
                key={index}
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
                data-aos="fade-up"
                data-aos-delay={100 * index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {right.icon}
                  <h3 className={`text-lg font-bold ${theme.primary}`}>{right.right}</h3>
                </div>
                <p className={`text-sm ${theme.secondary} leading-relaxed`}>{right.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <div className="mb-20" data-aos="fade-up">
          <motion.div 
            className={`${theme.cardBg} ${theme.border} border rounded-3xl p-8 md:p-12 relative overflow-hidden`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#06c1ff] to-[#0b2d72]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            <div className="text-center mb-8">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#06c1ff] to-[#0b2d72] rounded-full mb-6"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
                Technical Implementation
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className={`text-xl font-semibold mb-4 ${theme.primary}`}>How We Store Data:</h3>
                <ul className={`space-y-3 ${theme.secondary}`}>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#06c1ff]" />
                    MongoDB Atlas cloud database
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#06c1ff]" />
                    HTTPS encryption for all communications
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#06c1ff]" />
                    JWT tokens for session management
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#06c1ff]" />
                    WebAuthn credentials stored on your device
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#06c1ff]" />
                    Google OAuth for secure authentication
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className={`text-xl font-semibold mb-4 ${theme.primary}`}>Data Retention:</h3>
                <ul className={`space-y-3 ${theme.secondary}`}>
                  <li className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#06c1ff]" />
                    Game data: Stored indefinitely unless requested for deletion
                  </li>
                  <li className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#06c1ff]" />
                    Session data: Automatically cleared on logout
                  </li>
                  <li className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#06c1ff]" />
                    Login history: Basic timestamps for security
                  </li>
                  <li className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#06c1ff]" />
                    Deletion requests: Processed manually upon contact
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features We Don't Have */}
        <div className="mb-20" data-aos="fade-up">
          <motion.div 
            className={`${theme.cardBg} ${theme.border} border rounded-3xl p-8 md:p-12`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className={`text-4xl font-bold mb-8 ${theme.primary} text-center`}>
              What Khelzy Doesn't Have (Yet)
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className={`text-xl font-bold mb-3 ${theme.primary}`}>No Leaderboards</h3>
                <p className={`${theme.secondary}`}>Currently, we don't have a leaderboard system to compare scores with other players</p>
              </div>
              
              <div className="text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className={`text-xl font-bold mb-3 ${theme.primary}`}>No Account Deletion</h3>
                <p className={`${theme.secondary}`}>There's no built-in delete account feature - contact us for manual deletion</p>
              </div>
              
              <div className="text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className={`text-xl font-bold mb-3 ${theme.primary}`}>No Device Tracking</h3>
                <p className={`${theme.secondary}`}>We don't collect or store information about your device type or specifications</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <div className="mb-20" data-aos="fade-up">
          <motion.div 
            className={`${theme.cardBg} ${theme.border} border rounded-3xl p-8 md:p-12 text-center`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#06c1ff] to-[#0b2d72] rounded-full mb-6"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Mail className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              Questions? Just Ask!
            </h2>
            
            <p className={`text-lg ${theme.secondary} mb-8 max-w-3xl mx-auto`}>
              This is a student capstone project by Aryaan Panwar. If you have any questions about 
              how your data is handled or want to request deletion, feel free to reach out.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <motion.a 
                href="https://github.com/aryaanpanwar50"
                className="flex items-center gap-3 bg-gradient-to-r from-[#0b2d72] to-[#0b2d72]/80 hover:from-[#0b2d72]/90 hover:to-[#0b2d72]/70 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-5 h-5" />
                <span className="font-semibold">Contact Developer</span>
              </motion.a>
              
              <motion.a 
                href="https://www.linkedin.com/in/aryaan-panwar-5668b8269/"
                className="flex items-center gap-3 bg-gradient-to-r from-[#06c1ff] to-[#0b8fd8] hover:from-[#06c1ff]/90 hover:to-[#0b8fd8]/90 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-5 h-5" />
                <span className="font-semibold">LinkedIn</span>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Student Project Notice */}
        <motion.div 
          className={`${theme.cardBg} ${theme.border} border rounded-2xl p-6 text-center`}
          data-aos="fade-up"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-[#06c1ff]" />
            <h3 className={`text-xl font-bold ${theme.primary}`}>About This Project</h3>
          </div>
          <p className={`${theme.secondary}`}>
            Khelzy is a capstone project developed by Aryaan Panwar as part of the Kalvium Software Product Engineering program 
            at Lovely Professional University. This privacy policy reflects the current implementation and may be updated as 
            the project evolves. No commercial use or data monetization is intended.
          </p>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
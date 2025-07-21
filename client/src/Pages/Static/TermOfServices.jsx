import React, { useEffect } from 'react';
import { Shield, AlertTriangle, MessageSquare, Zap, Users, Ban, CheckCircle, XCircle, Flag, Clock, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/common/Footer';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TermOfServices = () => {
  const { theme } = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const communityPrinciples = [
    {
      icon: <Shield className="w-8 h-8 text-[#06c1ff]" />,
      title: "Respectful Gaming",
      description: "We maintain a welcoming environment where all gamers can enjoy their experience without harassment."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-[#06c1ff]" />,
      title: "Clean Communication",
      description: "All comments and reviews must be appropriate and constructive to help fellow gamers."
    },
    {
      icon: <Eye className="w-8 h-8 text-[#06c1ff]" />,
      title: "Active Moderation",
      description: "Our automated systems and community reports ensure quick action against policy violations."
    },
    {
      icon: <Users className="w-8 h-8 text-[#06c1ff]" />,
      title: "Community First",
      description: "Every action we take is focused on creating the best possible gaming community experience."
    }
  ];

  const prohibitedActivities = [
    {
      category: "Vulgar Content",
      icon: <Ban className="w-6 h-6 text-[#06c1ff]" />,
      violations: ["Profanity in game reviews", "Offensive language in comments", "Sexual or inappropriate content", "Hate speech or discriminatory language"],
      consequence: "Immediate comment removal and warning on first offense, temporary ban on repeat violations."
    },
    {
      category: "Spam Activities",
      icon: <AlertTriangle className="w-6 h-6 text-[#06c1ff]" />,
      violations: ["Repeated identical comments", "Promotional links or advertisements", "Flooding game pages with comments", "Bot-generated or automated content"],
      consequence: "Content removal and account restrictions based on severity and frequency of violations."
    },
    {
      category: "Disruptive Behavior",
      icon: <XCircle className="w-6 h-6 text-[#06c1ff]" />,
      violations: ["Personal attacks on other users", "Harassment or bullying", "Off-topic promotional content", "Intentionally misleading game reviews"],
      consequence: "Progressive penalties from warnings to permanent account suspension depending on severity."
    }
  ];

  const consequences = [
    {
      level: "First Strike",
      description: "Comment removed + Warning notification",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      action: "Educational warning with community guidelines reminder"
    },
    {
      level: "Second Strike",
      description: "24-hour commenting ban",
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      action: "Temporary restriction on posting comments and reviews"
    },
    {
      level: "Third Strike",
      description: "Permanent account suspension",
      icon: <Ban className="w-5 h-5 text-red-500" />,
      action: "Complete removal from platform with no appeal process"
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
            Terms of Service
          </motion.h1>

          <motion.p 
            className={`text-xl md:text-2xl ${theme.secondary} max-w-4xl mx-auto leading-relaxed font-light mb-8`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Clear rules for a respectful gaming community. No vulgar comments, no spam - just great gaming experiences.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-6 text-sm"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className={`${theme.cardBg} ${theme.border} border rounded-xl px-4 py-2`}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </div>
            <div className={`${theme.cardBg} ${theme.border} border rounded-xl px-4 py-2`}>
              <strong>Effective:</strong> Immediately upon posting
            </div>
          </motion.div>
        </motion.div>

        {/* Community Principles */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              Our Community Standards
            </h2>
            <p className={`text-lg ${theme.secondary} max-w-3xl mx-auto`}>
              Khelzy is built on respect, fun, and great gaming experiences for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityPrinciples.map((principle, index) => (
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

        {/* Platform Usage */}
        <div className="mb-20" data-aos="fade-up">
          <motion.div 
            className={`${theme.cardBg} ${theme.border} border rounded-3xl p-8 md:p-12`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className={`text-4xl font-bold mb-8 ${theme.primary} text-center`}>
              What You Can Do on Khelzy
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold mb-4 ${theme.primary}`}>Encouraged Activities:</h3>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#06c1ff] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Browse & Discover Games</h4>
                    <p className={`${theme.secondary}`}>Explore our collection of games and find your new favorites</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#06c1ff] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Write Helpful Reviews</h4>
                    <p className={`${theme.secondary}`}>Share honest, constructive feedback about games you've played</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#06c1ff] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Comment Respectfully</h4>
                    <p className={`${theme.secondary}`}>Engage in positive discussions about games and gaming experiences</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#06c1ff] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Rate Games</h4>
                    <p className={`${theme.secondary}`}>Help other gamers by rating games based on your experience</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold mb-4 ${theme.primary}`}>What's Not Allowed:</h3>
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Vulgar Language</h4>
                    <p className={`${theme.secondary}`}>No profanity, offensive language, or inappropriate content</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Spam Comments</h4>
                    <p className={`${theme.secondary}`}>No repeated messages, promotional content, or flooding</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Harassment</h4>
                    <p className={`${theme.secondary}`}>No personal attacks, bullying, or targeting other users</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>Fake Reviews</h4>
                    <p className={`${theme.secondary}`}>No misleading or dishonest reviews designed to manipulate ratings</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Prohibited Activities */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              What Gets You in Trouble
            </h2>
            <p className={`text-lg ${theme.secondary} max-w-3xl mx-auto`}>
              These activities will result in immediate moderation action
            </p>
          </div>

          <div className="space-y-8">
            {prohibitedActivities.map((activity, index) => (
              <motion.div 
                key={index}
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-8`}
                data-aos="fade-right"
                data-aos-delay={100 * index}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  {activity.icon}
                  <h3 className={`text-2xl font-bold ${theme.primary}`}>{activity.category}</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`text-lg font-semibold mb-3 ${theme.primary}`}>Specific Violations:</h4>
                    <ul className={`space-y-2 ${theme.secondary}`}>
                      {activity.violations.map((violation, violationIndex) => (
                        <li key={violationIndex} className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          {violation}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className={`text-lg font-semibold mb-3 ${theme.primary}`}>Consequences:</h4>
                    <p className={`${theme.secondary} leading-relaxed`}>{activity.consequence}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Consequences */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              Strike System
            </h2>
            <p className={`text-lg ${theme.secondary} max-w-3xl mx-auto`}>
              We use a progressive penalty system to give users opportunities to improve
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {consequences.map((consequence, index) => (
              <motion.div 
                key={index}
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300`}
                data-aos="fade-up"
                data-aos-delay={100 * index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  {consequence.icon}
                  <h3 className={`text-lg font-bold ${theme.primary}`}>{consequence.level}</h3>
                </div>
                <p className={`text-sm ${theme.secondary} mb-4 font-medium`}>{consequence.description}</p>
                <p className={`text-xs ${theme.secondary} leading-relaxed`}>{consequence.action}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Automated Moderation */}
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
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
                Content Monitoring
              </h2>
            </div>

            <div className="text-center space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${theme.primary}`}>Automated Systems:</h3>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 justify-center">
                    <Shield className="w-5 h-5 text-[#06c1ff]" />
                    <span className={`${theme.secondary}`}>Automatic vulgar word detection</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <Shield className="w-5 h-5 text-[#06c1ff]" />
                    <span className={`${theme.secondary}`}>Spam pattern recognition</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <Shield className="w-5 h-5 text-[#06c1ff]" />
                    <span className={`${theme.secondary}`}>Comment frequency monitoring</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <Shield className="w-5 h-5 text-[#06c1ff]" />
                    <span className={`${theme.secondary}`}>Inappropriate content filtering</span>
                  </div>
                </div>
              </div>
              
              <div className={`bg-gradient-to-r from-[#06c1ff]/10 to-[#0b2d72]/10 rounded-2xl p-6 ${theme.border} border`}>
                <p className={`text-lg ${theme.secondary} leading-relaxed`}>
                  Our systems automatically monitor all comments and reviews to maintain a clean gaming environment. 
                  Violations are handled immediately without manual intervention.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gaming Platform Notice */}
        <motion.div 
          className={`${theme.cardBg} ${theme.border} border rounded-2xl p-6 text-center`}
          data-aos="fade-up"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-[#06c1ff]" />
            <h3 className={`text-xl font-bold ${theme.primary}`}>Gaming Community Guidelines</h3>
          </div>
          <p className={`${theme.secondary}`}>
            Khelzy is designed to be a fun and welcoming gaming platform for all ages. These terms of service 
            are enforced to ensure everyone can enjoy games and discussions in a respectful environment. 
            By using Khelzy, you agree to follow these community standards and help us create a positive gaming experience.
          </p>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default TermOfServices
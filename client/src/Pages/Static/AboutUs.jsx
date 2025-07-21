import React, { useEffect } from 'react';
import { Github, Linkedin, Globe, Gamepad2, Shield, Users, Code2, Rocket, Target, Star, Trophy, Clock, Heart, Zap, Brain, Award, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/common/Footer';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutUs() {
  const { theme } = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const stats = [
    { label: "Games Available", value: 25, suffix: "+" },
    { label: "Active Users", value: 1000, suffix: "+" },
    { label: "Hours Played", value: 5000, suffix: "+" },
    { label: "User Rating", value: 4.9, suffix: "/5" }
  ];
  
  const features = [
    {
      icon: <Gamepad2 className="w-12 h-12 text-[#06c1ff]" />,
      title: "Instant Gaming Experience",
      description: "Jump into games immediately without downloads or installations. Our browser-based platform delivers smooth, responsive gameplay across all devices.",
      highlight: "Zero Wait Time"
    },
    {
      icon: <Shield className="w-12 h-12 text-[#06c1ff]" />,
      title: "Next-Gen Authentication",
      description: "Experience cutting-edge security with WebAuthn face recognition, seamless GitHub OAuth, and JWT token management for a passwordless future.",
      highlight: "Face Recognition"
    },
    {
      icon: <Trophy className="w-12 h-12 text-[#06c1ff]" />,
      title: "Competitive Gaming",
      description: "Track your progress, compete with friends, and climb leaderboards. Every game is a chance to prove your skills and earn recognition.",
      highlight: "Leaderboards"
    },
    {
      icon: <Clock className="w-12 h-12 text-[#06c1ff]" />,
      title: "Perfect for Any Schedule",
      description: "Whether you have 5 minutes or an hour, our quick mini-games are designed to fit perfectly into your busy lifestyle.",
      highlight: "Quick Sessions"
    },
    {
      icon: <Heart className="w-12 h-12 text-[#06c1ff]" />,
      title: "Built with Passion",
      description: "Every feature is crafted with care, focusing on user experience, performance, and the pure joy of gaming.",
      highlight: "User-Centric"
    },
    {
      icon: <Zap className="w-12 h-12 text-[#06c1ff]" />,
      title: "Lightning Fast",
      description: "Optimized performance ensures smooth gameplay with minimal latency, delivering an exceptional user experience.",
      highlight: "High Performance"
    }
  ];

  const gameTypes = [
    { 
      icon: "🎯", 
      title: "Strategy Games", 
      description: "Test your tactical thinking and strategic planning",
      gradient: "from-blue-500 to-purple-600"
    },
    { 
      icon: "⚡", 
      title: "Reaction Games", 
      description: "Challenge your reflexes and quick decision making",
      gradient: "from-yellow-500 to-orange-600"
    },
    { 
      icon: "🧩", 
      title: "Puzzle Games", 
      description: "Exercise your brain with mind-bending challenges",
      gradient: "from-green-500 to-teal-600"
    },
    { 
      icon: "🎮", 
      title: "Arcade Classics", 
      description: "Nostalgia meets modern design and gameplay",
      gradient: "from-pink-500 to-red-600"
    },
    { 
      icon: "🏃", 
      title: "Action Games", 
      description: "Fast-paced excitement and adrenaline rush",
      gradient: "from-indigo-500 to-blue-600"
    }
  ];

  const techStack = [
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Framework" },
    { name: "Node.js", category: "Backend" },
    { name: "JavaScript", category: "Language" },
    { name: "TypeScript", category: "Language" },
    { name: "MongoDB", category: "Database" },
    { name: "WebAuthn", category: "Authentication" },
    { name: "JWT", category: "Security" },
    { name: "GitHub OAuth", category: "Authentication" },
    { name: "Vercel", category: "Deployment" },
    { name: "MongoDB Atlas", category: "Cloud" },
    { name: "GitHub Actions", category: "CI/CD" }
  ];

  return (
    <div className={`min-h-screen ${theme.background} ${theme.primary} transition-colors duration-300`}>
      <Header />
      
      <main className="container mx-auto px-6 pt-28 pb-16 max-w-7xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-32 relative"
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
            ></motion.div>
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
            ></motion.div>
          </div>
          
          <motion.div 
            className="inline-flex items-center gap-4 mb-10 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-[#06c1ff] to-[#0b2d72] rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl"
              whileHover={{ 
                rotate: 360,
                scale: 1.1 
              }}
              transition={{ duration: 0.5 }}
            >
              K
            </motion.div>
            <motion.h1 
              className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#0b2d72] to-[#06c1ff] bg-clip-text text-transparent"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Khelzy
            </motion.h1>
          </motion.div>
          
          <motion.div 
            className="space-y-6 mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Where Gaming Meets 
              <span className="relative">
                <span className="text-[#06c1ff]"> Innovation</span>
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#06c1ff] to-transparent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.2, duration: 1 }}
                ></motion.div>
              </span>
            </h2>
            <p className={`text-xl md:text-2xl ${theme.secondary} max-w-4xl mx-auto leading-relaxed font-light`}>
              The future of casual gaming is here. Experience instant, secure, and addictive mini-games 
              designed for the modern web.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-8 text-lg mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.div 
              className="flex items-center gap-3 bg-gradient-to-r from-[#06c1ff]/10 to-transparent px-6 py-3 rounded-full border border-[#06c1ff]/20"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Star className="w-6 h-6 text-[#06c1ff]" />
              <span className="text-[#06c1ff] font-semibold">No Downloads Required</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3 bg-gradient-to-r from-[#06c1ff]/10 to-transparent px-6 py-3 rounded-full border border-[#06c1ff]/20"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Shield className="w-6 h-6 text-[#06c1ff]" />
              <span className="text-[#06c1ff] font-semibold">Face Authentication</span>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            ref={ref}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-6 text-center shadow-lg`}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#06c1ff] mb-2">
                  {inView && (
                    <CountUp
                      end={stat.value}
                      duration={2}
                      delay={0.5}
                      decimals={stat.value === 4.9 ? 1 : 0}
                    />
                  )}
                  {stat.suffix}
                </div>
                <div className={`text-sm ${theme.secondary} font-medium`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* What is Khelzy Section */}
        <div className="mb-32" data-aos="fade-up">
          <div className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#06c1ff] to-[#0b2d72] rounded-full mb-8"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className={`text-5xl font-bold mb-8 ${theme.primary}`} data-aos="fade-up" data-aos-delay="200">
              What is Khelzy?
            </h3>
            <div className={`max-w-5xl mx-auto text-xl ${theme.secondary} space-y-8`}>
              <motion.div 
                className={`${theme.cardBg} ${theme.border} border rounded-3xl p-8 md:p-12 shadow-lg`}
                data-aos="fade-right"
                data-aos-delay="300"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="leading-relaxed text-left">
                  <strong className={`${theme.primary} text-2xl`}>Khelzy</strong> is a revolutionary gaming platform that reimagines how we play casual games online. 
                  Built for the modern web, it combines the nostalgia of classic mini-games with cutting-edge technology 
                  to deliver an unparalleled gaming experience.
                </p>
              </motion.div>
              <motion.div 
                className={`${theme.cardBg} ${theme.border} border rounded-3xl p-8 md:p-12 shadow-lg`}
                data-aos="fade-left"
                data-aos-delay="400"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="leading-relaxed text-left">
                  Our platform eliminates the friction of traditional gaming. No downloads, no installations, no waiting. 
                  Just open your browser, authenticate with your face or GitHub account, and dive into a world of 
                  carefully crafted mini-games that respect your time while delivering maximum fun.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Game Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {gameTypes.map((game, index) => (
              <motion.div 
                key={index}
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 text-center group hover:-translate-y-2 relative overflow-hidden`}
                data-aos="zoom-in"
                data-aos-delay={100 * index}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { type: "spring", stiffness: 400 }
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  whileHover={{ opacity: 0.1 }}
                ></motion.div>
                <div className="relative z-10">
                  <motion.div 
                    className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.2 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {game.icon}
                  </motion.div>
                  <h4 className={`text-2xl font-bold mb-4 ${theme.primary}`}>{game.title}</h4>
                  <p className={`${theme.secondary} text-lg leading-relaxed`}>{game.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-32" data-aos="fade-up">
          <div className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#06c1ff] to-[#0b2d72] rounded-full mb-8"
              whileHover={{ 
                rotate: 360,
                scale: 1.1,
                boxShadow: "0 25px 50px -12px rgba(6, 193, 255, 0.25)"
              }}
              transition={{ duration: 0.6 }}
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className={`text-5xl font-bold mb-6 ${theme.primary}`} data-aos="fade-up" data-aos-delay="200">
              Why Choose Khelzy?
            </h3>
            <p className={`text-2xl ${theme.secondary} max-w-4xl mx-auto font-light`} data-aos="fade-up" data-aos-delay="300">
              We've reimagined every aspect of online gaming to create something truly special
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-3 relative overflow-hidden`}
                data-aos="fade-up"
                data-aos-delay={100 * index}
                whileHover={{ 
                  scale: 1.05,
                  y: -15,
                  transition: { type: "spring", stiffness: 400 }
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#06c1ff]/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"
                  whileHover={{ scale: 1.5, opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
                <div className="relative z-10">
                  <motion.div 
                    className="mb-6 transform group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ 
                      rotate: [0, -5, 5, -5, 0],
                      scale: 1.2 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (0.1 * index) }}
                  >
                    <span className="text-xs font-semibold text-[#06c1ff] bg-[#06c1ff]/10 px-3 py-1 rounded-full">
                      {feature.highlight}
                    </span>
                  </motion.div>
                  <h4 className={`text-2xl font-bold mb-4 ${theme.primary}`}>{feature.title}</h4>
                  <p className={`${theme.secondary} leading-relaxed text-lg`}>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

       

        
        
       
      </main>
      
      <Footer />
    </div>
  );
}
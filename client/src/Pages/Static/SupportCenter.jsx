import React, { useEffect, useState } from 'react';
import { HelpCircle, MessageCircle, Book, Settings, Bug, Gamepad2, User, Shield, Mail, ExternalLink, ChevronDown, ChevronUp, Search, Phone, Clock, CheckCircle, Send, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/common/Footer';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SupportCenter = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const supportCategories = [
    {
      icon: <Gamepad2 className="w-8 h-8 text-[#06c1ff]" />,
      title: "Game Issues",
      description: "Problems with games loading, controls, or gameplay mechanics"
    },
    {
      icon: <User className="w-8 h-8 text-[#06c1ff]" />,
      title: "Account & Login",
      description: "Authentication issues, profile settings, and account management"
    },
    {
      icon: <Settings className="w-8 h-8 text-[#06c1ff]" />,
      title: "Technical Support",
      description: "Browser compatibility, performance issues, and general troubleshooting"
    },
    {
      icon: <Shield className="w-8 h-8 text-[#06c1ff]" />,
      title: "Privacy & Security",
      description: "Data privacy questions, security concerns, and policy clarifications"
    }
  ];

  const faqData = [
    {
      category: "Account & Login",
      question: "How do I create an account on Khelzy?",
      answer: "You can sign up using Google OAuth or WebAuthn (fingerprint/face ID). Simply click the 'Login' button and choose your preferred method. No email verification required!"
    },
    {
      category: "Account & Login",
      question: "I can't log in to my account. What should I do?",
      answer: "First, try clearing your browser cache and cookies. If using Google OAuth, make sure you're logged into the correct Google account. For WebAuthn, ensure your device supports biometric authentication and try re-registering your credentials."
    },
    {
      category: "Game Issues",
      question: "Games are loading slowly or not at all. How can I fix this?",
      answer: "This is usually a browser or internet connection issue. Try refreshing the page, using a different browser (Chrome or Firefox work best), or checking your internet connection. Some games may take a moment to load initially."
    },
    {
      category: "Game Issues",
      question: "Can I save my game progress?",
      answer: "Yes! Your game scores and progress are automatically saved when you're logged in. You can also mark games as favorites to easily find them later."
    },
    {
      category: "Technical Support",
      question: "Which browsers are supported?",
      answer: "Khelzy works best on modern browsers like Chrome, Firefox, Safari, and Edge. Make sure your browser is updated to the latest version for the best experience."
    },
    {
      category: "Technical Support",
      question: "The website looks broken or won't load properly.",
      answer: "Try hard refreshing the page (Ctrl+F5 or Cmd+Shift+R), clearing your browser cache, or disabling browser extensions that might interfere with the site."
    },
    {
      category: "Privacy & Security",
      question: "What data does Khelzy collect about me?",
      answer: "We only collect essential data: your Google account info (if you use Google login), game scores, and favorites. No tracking, no analytics, no selling of data. Check our Privacy Policy for full details."
    },
    {
      category: "Privacy & Security",
      question: "How can I delete my account and data?",
      answer: "Currently, there's no automated account deletion. Contact us directly and we'll manually remove your data from our database. This usually takes 1-2 business days."
    }
  ];

  const contactOptions = [
    {
      icon: <Mail className="w-6 h-6 text-[#06c1ff]" />,
      title: "Email Support",
      description: "Get help directly from our support team",
      action: "Send Email",
      link: "mailto:khelzysup@gmail.com"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#06c1ff]" />,
      title: "GitHub Issues",
      description: "Report bugs or request features on our GitHub",
      action: "Open Issue",
      link: "https://github.com/aryaanpanwar50"
    },
    {
      icon: <ExternalLink className="w-6 h-6 text-[#06c1ff]" />,
      title: "LinkedIn",
      description: "Connect with the developer on LinkedIn",
      action: "Connect",
      link: "https://www.linkedin.com/in/aryaan-panwar-5668b8269/"
    }
  ];

  const quickFixes = [
    {
      issue: "Game won't load",
      solution: "Refresh page, check internet, try different browser"
    },
    {
      issue: "Can't log in",
      solution: "Clear cache, check Google account, re-register WebAuthn"
    },
    {
      issue: "Lost game progress",
      solution: "Make sure you're logged in, contact support if data is missing"
    },
    {
      issue: "Site looks broken",
      solution: "Hard refresh (Ctrl+F5), clear cache, disable extensions"
    }
  ];

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create a Gmail compose link
      const subject = encodeURIComponent(`Khelzy Support: ${formData.subject}`);
      const body = encodeURIComponent(`From: ${formData.name} (${formData.email})\n\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`);
      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=khelzysup@gmail.com&su=${subject}&body=${body}`;
      
      window.open(gmailLink, '_blank');
      
      // Show success message after opening Gmail
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
    } catch (error) {
      console.error('Error creating email:', error);
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

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
            <HelpCircle className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#0b2d72] to-[#06c1ff] bg-clip-text text-transparent"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Support Center
          </motion.h1>

          <motion.p 
            className={`text-xl md:text-2xl ${theme.secondary} max-w-4xl mx-auto leading-relaxed font-light mb-8`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Need help with Khelzy? Find answers to common questions or get in touch with our support team.
          </motion.p>

        
          
        </motion.div>

        {/* Support Categories */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              How Can We Help?
            </h2>
            <p className={`text-lg ${theme.secondary} max-w-3xl mx-auto`}>
              Choose a category below to find answers to your questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category, index) => (
              <motion.div 
                key={index}
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer`}
                data-aos="fade-up"
                data-aos-delay={100 * index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setSearchTerm(category.title)}
              >
                <div className="mb-4">{category.icon}</div>
                <h3 className={`text-lg font-bold mb-3 ${theme.primary}`}>{category.title}</h3>
                <p className={`text-sm ${theme.secondary} leading-relaxed`}>{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Fixes */}
        <div className="mb-20" data-aos="fade-up">
          <motion.div 
            className={`${theme.cardBg} ${theme.border} border rounded-3xl p-8 md:p-12`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className={`text-4xl font-bold mb-8 ${theme.primary} text-center`}>
              Quick Fixes
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {quickFixes.map((fix, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#06c1ff] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme.primary}`}>{fix.issue}</h4>
                    <p className={`${theme.secondary}`}>{fix.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              Send Us a Message
            </h2>
            <p className={`text-lg ${theme.secondary} max-w-3xl mx-auto`}>
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>

          <motion.div 
            className={`${theme.cardBg} ${theme.border} border rounded-3xl p-8 md:p-12 max-w-4xl mx-auto`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${theme.primary} mb-2`}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.cardBg} ${theme.primary} focus:outline-none focus:ring-2 focus:ring-[#06c1ff] transition-all duration-300`}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${theme.primary} mb-2`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.cardBg} ${theme.primary} focus:outline-none focus:ring-2 focus:ring-[#06c1ff] transition-all duration-300`}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={`block text-sm font-medium ${theme.primary} mb-2`}>
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.cardBg} ${theme.primary} focus:outline-none focus:ring-2 focus:ring-[#06c1ff] transition-all duration-300`}
                >
                  <option value="">Select a topic</option>
                  <option value="Game Issues">Game Issues</option>
                  <option value="Account & Login">Account & Login</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Privacy & Security">Privacy & Security</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className={`block text-sm font-medium ${theme.primary} mb-2`}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.cardBg} ${theme.primary} focus:outline-none focus:ring-2 focus:ring-[#06c1ff] transition-all duration-300 resize-vertical`}
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              {submitStatus === 'success' && (
                <motion.div 
                  className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-700">
                    Your message has been sent successfully! We'll get back to you within 24-48 hours.
                  </p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div 
                  className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">
                    Sorry, there was an error sending your message. Please try again or email us directly at khelzysup@gmail.com
                  </p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#06c1ff] to-[#0b8fd8] hover:from-[#06c1ff]/90 hover:to-[#0b8fd8]/90 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Contact Options */}
        <div className="mb-20" data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-6 ${theme.primary}`}>
              Still Need Help?
            </h2>
            <p className={`text-lg ${theme.secondary} max-w-3xl mx-auto`}>
              Can't find what you're looking for? Get in touch with us directly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => (
              <motion.a
                key={index}
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme.cardBg} ${theme.border} border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 block`}
                data-aos="fade-up"
                data-aos-delay={100 * index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mb-4">{option.icon}</div>
                <h3 className={`text-lg font-bold mb-3 ${theme.primary}`}>{option.title}</h3>
                <p className={`text-sm ${theme.secondary} mb-4 leading-relaxed`}>{option.description}</p>
                <span className="inline-flex items-center gap-2 text-[#06c1ff] font-semibold hover:underline">
                  {option.action}
                  <ExternalLink className="w-4 h-4" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Response Time Notice */}
        <motion.div 
          className={`${theme.cardBg} ${theme.border} border rounded-2xl p-6 text-center`}
          data-aos="fade-up"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-[#06c1ff]" />
            <h3 className={`text-xl font-bold ${theme.primary}`}>Response Times</h3>
          </div>
          <p className={`${theme.secondary}`}>
            This is a student capstone project by Aryaan Panwar. Support responses are typically provided within 
            24-48 hours. For urgent issues, please try the quick fixes above or reach out directly via email.
          </p>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default SupportCenter
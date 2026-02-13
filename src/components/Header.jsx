import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Home, Info, Briefcase, Calendar, Phone } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Searchable content with keywords
  const searchableContent = [
    {
      title: 'Data Engineering Solutions',
      description: 'Build robust data pipelines and infrastructure for scalable data processing',
      path: '/services/data-engineering',
      keywords: ['data engineering', 'data pipeline', 'ETL', 'data warehouse', 'data infrastructure', 'data processing', 'apache spark', 'kafka', 'airflow']
    },
    {
      title: 'Data Analytics Solutions',
      description: 'Transform raw data into actionable insights and business intelligence',
      path: '/services/data-analytics',
      keywords: ['data analytics', 'business intelligence', 'data visualization', 'dashboards', 'reporting', 'analytics', 'power bi', 'tableau', 'insights']
    },
    {
      title: 'Data Science Solutions',
      description: 'Advanced analytics and predictive modeling to drive data-driven decisions',
      path: '/services/data-science',
      keywords: ['data science', 'machine learning', 'predictive analytics', 'statistical analysis', 'modeling', 'forecasting', 'python', 'R', 'AI']
    },
    {
      title: 'Software Development Solutions',
      description: 'Custom software applications and enterprise solutions tailored to your needs',
      path: '/services/software-dev',
      keywords: ['software development', 'custom software', 'web applications', 'enterprise solutions', 'web development', 'mobile apps', 'applications']
    },
    {
      title: 'AI Solutions',
      description: 'Intelligent automation and machine learning solutions for modern businesses',
      path: '/services/ai-solutions',
      keywords: ['AI', 'artificial intelligence', 'machine learning', 'automation', 'chatbot', 'NLP', 'computer vision', 'deep learning', 'neural networks']
    },
    {
      title: 'All Services',
      description: 'View all our data and software solutions',
      path: '/services',
      keywords: ['services', 'all services', 'solutions', 'offerings']
    },
    {
      title: 'About Us',
      description: 'Learn more about goCode Softwares',
      path: '/about',
      keywords: ['about', 'company', 'team', 'who we are']
    },
    {
      title: 'Book a Service',
      description: 'Schedule a consultation or book our services',
      path: '/book',
      keywords: ['book', 'schedule', 'appointment', 'consultation', 'hire']
    },
    {
      title: 'Contact Us',
      description: 'Get in touch with our team',
      path: '/contact',
      keywords: ['contact', 'reach us', 'email', 'phone', 'support']
    }
  ];

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const results = searchableContent.filter(item => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(query))
        );
      });
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowResults(false);
  };

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/services', label: 'Services', icon: Briefcase },
    { path: '/book', label: 'Book Service', icon: Calendar },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
<Link to="/" className="flex items-center space-x-3">
  <img 
    src="https://i.postimg.cc/mgKQT5fL/gcv.webp"
    alt="goCode Logo" 
    className="w-10 h-10 rounded-full object-cover"
  />
  <span className="text-xl font-bold text-gray-900">goCode Softwares</span>
</Link>


            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium ${
                    location.pathname === link.path ? 'text-green-600' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                />
                
                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showResults && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50"
                    >
                      <div className="p-2">
                        {searchResults.map((result, index) => (
                          <div
                            key={index}
                            onClick={() => handleSearchResultClick(result.path)}
                            className="p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors duration-200"
                          >
                            <h4 className="font-semibold text-gray-900 mb-1">{result.title}</h4>
                            <p className="text-sm text-gray-600">{result.description}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {showResults && searchResults.length === 0 && searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
                    >
                      <p className="text-gray-600 text-center">No results found for "{searchQuery}"</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden menu-button p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            onClick={closeMenu}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-menu bg-white w-64 h-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" onClick={closeMenu} className="flex items-center space-x-3">
                    <img 
                      src="https://i.postimg.cc/mgKQT5fL/gcv.webp"
                      alt="goCode Logo" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-xl font-bold text-gray-900">goCode Softwares</span>
                  </Link>
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Mobile Search Results */}
                  {searchQuery && searchResults.length > 0 && (
                    <div className="mt-2 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            handleSearchResultClick(result.path);
                            closeMenu();
                          }}
                          className="p-3 hover:bg-green-50 cursor-pointer transition-colors duration-200 border-b border-gray-200 last:border-b-0"
                        >
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{result.title}</h4>
                          <p className="text-xs text-gray-600">{result.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchQuery && searchResults.length === 0 && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 text-sm text-center">No results found</p>
                    </div>
                  )}
                </div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-2">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.path}
                          onClick={closeMenu}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                            location.pathname === link.path
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
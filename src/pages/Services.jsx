import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Smartphone, Globe, Database, ArrowRight, Star, Clock, Users } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesData = [];
      snapshot.forEach((doc) => {
        servicesData.push({ id: doc.id, ...doc.data() });
      });
      setServices(servicesData);
    });

    return () => unsubscribe();
  }, []);

  const defaultServices = [
    {
      id: 'web-dev',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies like React, Node.js, and more.',
      longDescription: 'We create responsive, scalable web applications using cutting-edge technologies. From simple websites to complex web platforms, we deliver solutions that drive business growth.',
      icon: Globe,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Responsive Design', 'Modern Frameworks', 'SEO Optimized', 'Fast Loading'],
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
      startingPrice: '$2,500',
      timeline: '4-8 weeks',
      rating: 4.9
    },
    {
      id: 'mobile-dev',
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      longDescription: 'Build powerful mobile applications that engage users and drive business results. We develop both native and cross-platform solutions tailored to your needs.',
      icon: Smartphone,
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Cross-Platform', 'Native Performance', 'App Store Ready', 'Push Notifications'],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      startingPrice: '$5,000',
      timeline: '8-12 weeks',
      rating: 4.8
    },
    {
      id: 'software-dev',
      title: 'Software Development',
      description: 'Desktop applications and enterprise software solutions.',
      longDescription: 'Custom software solutions designed to streamline your business processes and improve efficiency. From desktop applications to enterprise systems.',
      icon: Code,
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Custom Solutions', 'Scalable Architecture', 'Integration Ready', 'Ongoing Support'],
      technologies: ['Python', 'Java', 'C#', '.NET'],
      startingPrice: '$7,500',
      timeline: '10-16 weeks',
      rating: 4.9
    },
    {
      id: 'data-science',
      title: 'Data Science & AI',
      description: 'Data analysis, machine learning, and AI solutions for your business.',
      longDescription: 'Unlock the power of your data with advanced analytics, machine learning models, and AI solutions that provide actionable insights and automate processes.',
      icon: Database,
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Predictive Analytics', 'Machine Learning', 'Data Visualization', 'AI Integration'],
      technologies: ['Python', 'TensorFlow', 'Pandas', 'Tableau'],
      startingPrice: '$3,500',
      timeline: '6-10 weeks',
      rating: 4.7
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We offer comprehensive software development services to help your business thrive in the digital world. 
            From web applications to AI solutions, we've got you covered.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayServices.map((service, index) => {
            const Icon = service.icon || Code;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-green-600 bg-opacity-80 flex items-center justify-center">
                    <Icon className="h-20 w-20 text-white" />
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-gray-600 font-medium">{service.rating || 4.8}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.longDescription || service.description}
                  </p>
                  
                  {/* Features */}
                  {service.features && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Technologies */}
                  {service.technologies && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Pricing and Timeline */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Starting from</p>
                      <p className="text-xl font-bold text-green-600">{service.startingPrice || 'Custom Quote'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Timeline</p>
                      <p className="text-lg font-semibold text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.timeline || '4-8 weeks'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Link
                      to={`/services/${service.id}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      to="/book"
                      className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-center py-3 rounded-lg font-semibold transition-all duration-300"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20 bg-white rounded-xl shadow-lg p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss your requirements and create a custom solution that perfectly fits your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Users className="mr-2 h-5 w-5" />
              Schedule Consultation
            </Link>
            <Link
              to="/book"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold rounded-full transition-all duration-300"
            >
              Get Custom Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
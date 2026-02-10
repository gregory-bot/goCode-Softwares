import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, Users } from 'lucide-react';
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
      id: 'data-engineering',
      title: 'Data Engineering Solutions',
      description: 'Build robust data pipelines and infrastructure for scalable data processing',
      longDescription: 'Design and implement scalable data architectures, ETL pipelines, and data warehousing solutions that transform raw data into valuable business assets. Our data engineering services ensure your data is reliable, accessible, and ready for analysis.',
      image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Data Pipeline Development', 'ETL Processes', 'Data Warehousing', 'Cloud Data Infrastructure'],
      technologies: ['Apache Spark', 'Kafka', 'Airflow', 'AWS', 'Snowflake', 'BigQuery'],
      startingPrice: '$5,000',
      timeline: '6-10 weeks',
      rating: 4.9
    },
    {
      id: 'data-analytics',
      title: 'Data Analytics Solutions',
      description: 'Transform raw data into actionable insights and business intelligence',
      longDescription: 'Leverage the power of your data with comprehensive analytics solutions. We help you uncover patterns, trends, and insights that drive strategic decision-making and business growth through advanced analytics and visualization.',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Business Intelligence', 'Data Visualization', 'Reporting Dashboards', 'Trend Analysis'],
      technologies: ['Power BI', 'Tableau', 'SQL', 'Python', 'R', 'Excel'],
      startingPrice: '$3,500',
      timeline: '4-8 weeks',
      rating: 4.8
    },
    {
      id: 'data-science',
      title: 'Data Science Solutions',
      description: 'Advanced analytics and predictive modeling to drive data-driven decisions',
      longDescription: 'Unlock the full potential of your data with advanced data science techniques. From predictive modeling to statistical analysis, we help you make data-driven decisions that give you a competitive edge.',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Predictive Analytics', 'Statistical Modeling', 'Machine Learning', 'Data Mining'],
      technologies: ['Python', 'R', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter'],
      startingPrice: '$4,500',
      timeline: '6-12 weeks',
      rating: 4.9
    },
    {
      id: 'software-dev',
      title: 'Software Development Solutions',
      description: 'Custom software applications and enterprise solutions tailored to your needs',
      longDescription: 'Build custom software solutions that streamline your business processes and drive efficiency. From web applications to enterprise systems, we deliver scalable, secure, and user-friendly software tailored to your specific requirements.',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Custom Software', 'Web Applications', 'Enterprise Solutions', 'System Integration'],
      technologies: ['React', 'Node.js', 'Python', 'Java', '.NET', 'AWS'],
      startingPrice: '$7,500',
      timeline: '8-16 weeks',
      rating: 4.9
    },
    {
      id: 'ai-solutions',
      title: 'AI Solutions',
      description: 'Intelligent automation and machine learning solutions for modern businesses',
      longDescription: 'Harness the power of artificial intelligence to automate processes, enhance decision-making, and create intelligent systems. Our AI solutions include machine learning models, natural language processing, computer vision, and intelligent automation.',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Machine Learning Models', 'Natural Language Processing', 'Computer Vision', 'Intelligent Automation'],
      technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'Hugging Face', 'scikit-learn', 'Keras'],
      startingPrice: '$6,000',
      timeline: '8-14 weeks',
      rating: 4.8
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
            We offer comprehensive data and software solutions to help your business thrive in the digital world. 
            From data engineering to AI solutions, we've got you covered.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayServices.map((service, index) => {
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
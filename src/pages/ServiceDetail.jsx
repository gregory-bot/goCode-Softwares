import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Star, Clock, Users, ArrowRight } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();

  // Service details data
  const serviceDetails = {
    'web-dev': {
      title: 'Web Development',
      subtitle: 'Custom Web Applications & Websites',
      description: 'We create modern, responsive web applications that deliver exceptional user experiences and drive business growth.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200',
      features: [
        'Responsive Design for all devices',
        'Modern JavaScript frameworks (React, Vue, Angular)',
        'Backend development with Node.js, Python, or PHP',
        'Database integration (MongoDB, PostgreSQL, MySQL)',
        'RESTful API development',
        'Third-party integrations',
        'SEO optimization',
        'Performance optimization',
        'Security best practices',
        'Ongoing maintenance and support'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'TypeScript'],
      process: [
        { step: 1, title: 'Discovery & Planning', description: 'We analyze your requirements and create a detailed project plan.' },
        { step: 2, title: 'Design & Prototyping', description: 'Create wireframes and interactive prototypes for your approval.' },
        { step: 3, title: 'Development', description: 'Build your application using modern technologies and best practices.' },
        { step: 4, title: 'Testing & QA', description: 'Comprehensive testing to ensure quality and performance.' },
        { step: 5, title: 'Deployment & Launch', description: 'Deploy your application and provide ongoing support.' }
      ],
      pricing: {
        basic: { name: 'Basic Website', price: '$2,500', features: ['5 pages', 'Responsive design', 'Contact form', 'Basic SEO'] },
        standard: { name: 'Business Website', price: '$5,000', features: ['10 pages', 'CMS integration', 'E-commerce ready', 'Advanced SEO', 'Analytics'] },
        premium: { name: 'Custom Web App', price: '$10,000+', features: ['Custom functionality', 'User authentication', 'Database integration', 'API development', 'Admin panel'] }
      },
      timeline: '4-12 weeks',
      rating: 4.9
    },
    'mobile-dev': {
      title: 'Mobile Development',
      subtitle: 'iOS & Android Applications',
      description: 'Build powerful mobile applications that engage users and drive business results with native and cross-platform solutions.',
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1200',
      features: [
        'Native iOS and Android development',
        'Cross-platform solutions (React Native, Flutter)',
        'User-friendly interface design',
        'Push notifications',
        'Offline functionality',
        'App Store optimization',
        'Backend integration',
        'Payment gateway integration',
        'Social media integration',
        'Analytics and reporting'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'AWS'],
      process: [
        { step: 1, title: 'Strategy & Planning', description: 'Define app goals, target audience, and feature requirements.' },
        { step: 2, title: 'UI/UX Design', description: 'Create intuitive and engaging mobile app designs.' },
        { step: 3, title: 'Development', description: 'Build your app using the best mobile development practices.' },
        { step: 4, title: 'Testing', description: 'Rigorous testing on multiple devices and platforms.' },
        { step: 5, title: 'App Store Launch', description: 'Deploy to App Store and Google Play with ongoing support.' }
      ],
      pricing: {
        basic: { name: 'Simple App', price: '$5,000', features: ['Basic functionality', 'Single platform', 'Simple UI', 'Basic backend'] },
        standard: { name: 'Business App', price: '$10,000', features: ['Advanced features', 'Cross-platform', 'Custom UI', 'API integration', 'Push notifications'] },
        premium: { name: 'Enterprise App', price: '$20,000+', features: ['Complex functionality', 'Multiple integrations', 'Advanced security', 'Custom backend', 'Analytics'] }
      },
      timeline: '8-16 weeks',
      rating: 4.8
    },
    'software-dev': {
      title: 'Software Development',
      subtitle: 'Desktop & Enterprise Solutions',
      description: 'Custom software solutions designed to streamline your business processes and improve operational efficiency.',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200',
      features: [
        'Desktop application development',
        'Enterprise software solutions',
        'Legacy system modernization',
        'System integration',
        'Custom workflow automation',
        'Database design and optimization',
        'Reporting and analytics',
        'User management systems',
        'Security implementation',
        'Scalable architecture'
      ],
      technologies: ['Python', 'Java', 'C#', '.NET', 'PostgreSQL', 'Docker'],
      process: [
        { step: 1, title: 'Requirements Analysis', description: 'Understand your business processes and software needs.' },
        { step: 2, title: 'System Design', description: 'Create detailed system architecture and design documents.' },
        { step: 3, title: 'Development', description: 'Build robust software using enterprise-grade technologies.' },
        { step: 4, title: 'Integration & Testing', description: 'Integrate with existing systems and perform comprehensive testing.' },
        { step: 5, title: 'Deployment & Training', description: 'Deploy software and train your team for optimal usage.' }
      ],
      pricing: {
        basic: { name: 'Simple Tool', price: '$7,500', features: ['Basic functionality', 'Single user', 'Local database', 'Standard UI'] },
        standard: { name: 'Business Software', price: '$15,000', features: ['Multi-user support', 'Network database', 'Custom features', 'Reporting'] },
        premium: { name: 'Enterprise Solution', price: '$30,000+', features: ['Complex workflows', 'System integration', 'Advanced security', 'Custom modules'] }
      },
      timeline: '10-20 weeks',
      rating: 4.9
    },
    'data-science': {
      title: 'Data Science & AI',
      subtitle: 'Analytics, Machine Learning & AI Solutions',
      description: 'Unlock the power of your data with advanced analytics, machine learning models, and AI solutions that provide actionable insights.',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200',
      features: [
        'Data analysis and visualization',
        'Machine learning model development',
        'Predictive analytics',
        'Natural language processing',
        'Computer vision solutions',
        'Recommendation systems',
        'Automated reporting',
        'Data pipeline development',
        'AI chatbots and assistants',
        'Business intelligence dashboards'
      ],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'Tableau', 'AWS'],
      process: [
        { step: 1, title: 'Data Assessment', description: 'Evaluate your data sources and quality for analysis readiness.' },
        { step: 2, title: 'Model Development', description: 'Create and train machine learning models for your specific needs.' },
        { step: 3, title: 'Validation & Testing', description: 'Validate model accuracy and performance with real data.' },
        { step: 4, title: 'Integration', description: 'Integrate AI solutions into your existing systems and workflows.' },
        { step: 5, title: 'Monitoring & Optimization', description: 'Continuously monitor and improve model performance.' }
      ],
      pricing: {
        basic: { name: 'Data Analysis', price: '$3,500', features: ['Basic analytics', 'Data visualization', 'Simple reports', 'Dashboard'] },
        standard: { name: 'ML Solution', price: '$8,000', features: ['Custom ML models', 'Predictive analytics', 'Advanced visualization', 'API integration'] },
        premium: { name: 'AI Platform', price: '$15,000+', features: ['Complex AI systems', 'Real-time processing', 'Multiple models', 'Custom infrastructure'] }
      },
      timeline: '6-14 weeks',
      rating: 4.7
    }
  };

  const service = serviceDetails[id];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h1>
          <Link to="/services" className="text-green-600 hover:text-green-700">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-600 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/services"
              className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold mb-4">{service.title}</h1>
                <p className="text-xl text-green-100 mb-6">{service.subtitle}</p>
                <p className="text-lg leading-relaxed mb-8">{service.description}</p>
                
                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{service.rating}</span>
                    <span className="text-green-100 ml-1">rating</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-100 mr-1" />
                    <span>{service.timeline}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-100 mr-1" />
                    <span>Expert team</span>
                  </div>
                </div>
                
                <Link
                  to="/book"
                  className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded-xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-green-600 bg-opacity-20 rounded-xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What's Included</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive {service.title.toLowerCase()} service includes everything you need for success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technologies We Use</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We leverage the latest and most reliable technologies to build your solution
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {service.technologies.map((tech, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="px-6 py-3 bg-white text-gray-700 rounded-full shadow-md font-medium"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a proven methodology to ensure your project's success
            </p>
          </motion.div>

          <div className="space-y-8">
            {service.process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1 p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing Options</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the package that best fits your needs and budget
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(service.pricing).map(([key, plan], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-lg p-8 ${
                  key === 'standard' ? 'ring-2 ring-green-500 transform scale-105' : ''
                }`}
              >
                {key === 'standard' && (
                  <div className="bg-green-500 text-white text-center py-2 px-4 rounded-full text-sm font-semibold mb-4">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-green-600 mb-6">{plan.price}</div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/book"
                  className={`w-full py-3 rounded-lg font-semibold transition-colors text-center block ${
                    key === 'standard'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Let's discuss your project requirements and create a custom solution that perfectly fits your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Schedule Consultation
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold rounded-full transition-colors"
              >
                Get Custom Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
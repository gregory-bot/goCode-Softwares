import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Star, Clock, Users, ArrowRight } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();

  // Service details data
  const serviceDetails = {
    'data-engineering': {
      title: 'Data Engineering Solutions',
      subtitle: 'Robust Data Pipelines & Infrastructure',
      description: 'Design and implement scalable data architectures, ETL pipelines, and data warehousing solutions that transform raw data into valuable business assets.',
      image: 'https://i.pinimg.com/736x/e6/35/c1/e635c1e8d80999c3ad87576d4bfc0032.jpg',
      features: [
        'Data Pipeline Development',
        'ETL/ELT Process Design',
        'Data Warehousing Solutions',
        'Cloud Data Infrastructure (AWS, Azure, GCP)',
        'Real-time Data Processing',
        'Data Lake Implementation',
        'Data Quality & Validation',
        'Performance Optimization',
        'Data Migration Services',
        'Ongoing Support & Maintenance'
      ],
      technologies: ['Apache Spark', 'Kafka', 'Airflow', 'AWS', 'Snowflake', 'BigQuery', 'Python', 'SQL'],
      process: [
        { step: 1, title: 'Assessment & Planning', description: 'Analyze your data infrastructure needs and create a comprehensive plan.' },
        { step: 2, title: 'Architecture Design', description: 'Design scalable data architecture tailored to your requirements.' },
        { step: 3, title: 'Pipeline Development', description: 'Build robust ETL pipelines and data processing workflows.' },
        { step: 4, title: 'Testing & Optimization', description: 'Test data flows and optimize for performance and reliability.' },
        { step: 5, title: 'Deployment & Monitoring', description: 'Deploy infrastructure and provide ongoing monitoring and support.' }
      ],
      pricing: {
        basic: { name: 'Basic Pipeline', price: '$5,000', features: ['Simple ETL pipeline', 'Basic monitoring', 'Data validation', 'Cloud deployment'] },
        standard: { name: 'Business Solution', price: '$10,000', features: ['Multiple data sources', 'Advanced transformations', 'Data warehouse setup', 'Real-time processing', 'Alerting'] },
        premium: { name: 'Enterprise Platform', price: '$20,000+', features: ['Complex architecture', 'Data lake implementation', 'Advanced analytics', 'ML integration', 'Full automation'] }
      },
      timeline: '6-10 weeks'
    },
    'data-analytics': {
      title: 'Data Analytics Solutions',
      subtitle: 'Transform Data into Actionable Insights',
      description: 'Leverage the power of your data with comprehensive analytics solutions that uncover patterns, trends, and insights to drive strategic decision-making.',
      image: 'https://i.postimg.cc/YS3NWbk7/hahaw.jpg',
      features: [
        'Business Intelligence Dashboards',
        'Interactive Data Visualization',
        'Custom Reporting Solutions',
        'KPI Tracking & Monitoring',
        'Trend Analysis & Forecasting',
        'Ad-hoc Analysis Tools',
        'Data Exploration',
        'Performance Metrics',
        'Self-service Analytics',
        'Executive Reporting'
      ],
      technologies: ['Power BI', 'Tableau', 'SQL', 'Python', 'R', 'Excel', 'Google Analytics', 'Looker'],
      process: [
        { step: 1, title: 'Requirements Gathering', description: 'Understand your business goals and analytics needs.' },
        { step: 2, title: 'Data Discovery', description: 'Explore and profile your data sources.' },
        { step: 3, title: 'Dashboard Development', description: 'Create interactive visualizations and reports.' },
        { step: 4, title: 'Testing & Validation', description: 'Ensure accuracy and usability of analytics solutions.' },
        { step: 5, title: 'Training & Deployment', description: 'Deploy dashboards and train your team on usage.' }
      ],
      pricing: {
        basic: { name: 'Basic Analytics', price: '$3,500', features: ['3-5 dashboards', 'Basic visualizations', 'Standard metrics', 'Monthly updates'] },
        standard: { name: 'Business Analytics', price: '$7,000', features: ['10+ dashboards', 'Advanced visualizations', 'Custom metrics', 'Real-time data', 'User training'] },
        premium: { name: 'Enterprise Analytics', price: '$15,000+', features: ['Unlimited dashboards', 'Predictive analytics', 'AI-powered insights', 'Full integration', 'Ongoing support'] }
      },
      timeline: '4-8 weeks'
    },
    'data-science': {
      title: 'Data Science Solutions',
      subtitle: 'Advanced Analytics & Predictive Modeling',
      description: 'Unlock the full potential of your data with advanced data science techniques including predictive modeling, statistical analysis, and machine learning.',
      image: 'https://pbs.twimg.com/media/G7quTWhW4AAJM4l?format=jpg&name=large',
      features: [
        'Predictive Analytics & Modeling',
        'Statistical Analysis',
        'Machine Learning Applications',
        'Data Mining & Pattern Recognition',
        'Customer Segmentation',
        'Churn Prediction',
        'Recommendation Systems',
        'Time Series Forecasting',
        'A/B Testing & Experimentation',
        'Model Deployment & Monitoring'
      ],
      technologies: ['Python', 'R', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter', 'TensorFlow', 'XGBoost'],
      process: [
        { step: 1, title: 'Problem Definition', description: 'Define business problem and success metrics.' },
        { step: 2, title: 'Data Collection & Preparation', description: 'Gather and clean data for analysis.' },
        { step: 3, title: 'Model Development', description: 'Build and train predictive models.' },
        { step: 4, title: 'Model Evaluation', description: 'Test and validate model performance.' },
        { step: 5, title: 'Deployment & Monitoring', description: 'Deploy models and monitor performance over time.' }
      ],
      pricing: {
        basic: { name: 'Basic Analytics', price: '$4,500', features: ['Single use case', 'Basic modeling', 'Analysis report', 'Recommendations'] },
        standard: { name: 'Predictive Modeling', price: '$9,000', features: ['Multiple models', 'Advanced algorithms', 'Model deployment', 'Performance monitoring', 'Documentation'] },
        premium: { name: 'Enterprise Data Science', price: '$18,000+', features: ['Complex modeling', 'Real-time predictions', 'AutoML pipeline', 'Continuous improvement', 'Full support'] }
      },
      timeline: '6-12 weeks'
    },
    'software-dev': {
      title: 'Software Development Solutions',
      subtitle: 'Custom Software & Enterprise Applications',
      description: 'Custom software solutions designed to streamline your business processes and improve operational efficiency.',
      image: 'https://i.pinimg.com/736x/a6/83/15/a68315f072dd25f4c2d3410bf486b6f2.jpg',
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
      timeline: '8-16 weeks'
    },
    'ai-solutions': {
      title: 'AI Solutions',
      subtitle: 'Intelligent Automation & Machine Learning',
      description: 'Harness the power of artificial intelligence to automate processes, enhance decision-making, and create intelligent systems that drive business value.',
      image: 'https://pbs.twimg.com/media/G7gIG0cXUAA65se?format=jpg&name=large',
      features: [
        'Machine Learning Model Development',
        'Natural Language Processing (NLP)',
        'Computer Vision Solutions',
        'Intelligent Process Automation',
        'Chatbot & Virtual Assistants',
        'Recommendation Engines',
        'Sentiment Analysis',
        'Image & Video Recognition',
        'AI-powered Analytics',
        'Model Deployment & MLOps'
      ],
      technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'Hugging Face', 'scikit-learn', 'Keras', 'LangChain', 'AWS SageMaker'],
      process: [
        { step: 1, title: 'Use Case Discovery', description: 'Identify AI opportunities and define business objectives.' },
        { step: 2, title: 'Data Preparation', description: 'Collect, clean, and prepare data for AI models.' },
        { step: 3, title: 'Model Development', description: 'Build and train AI models using advanced techniques.' },
        { step: 4, title: 'Testing & Validation', description: 'Validate model accuracy and performance.' },
        { step: 5, title: 'Deployment & Optimization', description: 'Deploy AI solutions and continuously improve performance.' }
      ],
      pricing: {
        basic: { name: 'AI Proof of Concept', price: '$6,000', features: ['Single AI model', 'Basic integration', 'Performance report', 'Recommendations'] },
        standard: { name: 'AI Application', price: '$12,000', features: ['Multiple models', 'API integration', 'User interface', 'Monitoring dashboard', 'Documentation'] },
        premium: { name: 'Enterprise AI Platform', price: '$25,000+', features: ['Advanced AI capabilities', 'Full automation', 'Scalable infrastructure', 'MLOps pipeline', 'Ongoing support'] }
      },
      timeline: '8-14 weeks'
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
                    <Clock className="h-5 w-5 text-green-100 mr-1" />
                    <span>{service.timeline}</span>
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ThumbsUp, Eye, Users, Star } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);

  const heroImages = [
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1800',
    'https://media.istockphoto.com/id/2161929587/photo/two-analyst-women-using-kpi-dashboard-for-data-analytics-digital-data-technology-concept.jpg?s=612x612&w=0&k=20&c=QRFaozaHFdgliUYOhUkrlpxA9bAvN2xAKEZYNMBNi6s='
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data from Firebase
  useEffect(() => {
    // Services
    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesData = [];
      snapshot.forEach((doc) => {
        servicesData.push({ id: doc.id, ...doc.data() });
      });
      setServices(servicesData);
    });

    // Projects
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = [];
      snapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectsData);
    });

    // Team
    const unsubTeam = onSnapshot(collection(db, 'team'), (snapshot) => {
      const teamData = [];
      snapshot.forEach((doc) => {
        teamData.push({ id: doc.id, ...doc.data() });
      });
      setTeam(teamData);
    });

    return () => {
      unsubServices();
      unsubProjects();
      unsubTeam();
    };
  }, []);

  const handleVote = async (projectId) => {
    // Check if already voted in this session
    const votedProjects = JSON.parse(sessionStorage.getItem('votedProjects') || '[]');
    
    if (votedProjects.includes(projectId)) {
      toast.error('You have already voted for this project!');
      return;
    }

    try {
      await updateDoc(doc(db, 'projects', projectId), {
        votes: increment(1)
      });
      
      // Save to session storage
      votedProjects.push(projectId);
      sessionStorage.setItem('votedProjects', JSON.stringify(votedProjects));
      
      toast.success('Thank you for your vote!');
    } catch (error) {
      toast.error('Error voting. Please try again.');
    }
  };

  // Helper function to check if user has voted
  const hasVoted = (projectId) => {
    const votedProjects = JSON.parse(sessionStorage.getItem('votedProjects') || '[]');
    return votedProjects.includes(projectId);
  };

  const defaultServices = [
    {
      id: 'data-engineering',
      title: 'Data Engineering Solutions',
      description: 'Build robust data pipelines and infrastructure for scalable data processing',
      image: 'https://i.pinimg.com/736x/e6/35/c1/e635c1e8d80999c3ad87576d4bfc0032.jpg'
    },
    {
      id: 'data-analytics',
      title: 'Data Analytics Solutions',
      description: 'Transform raw data into actionable insights and business intelligence',
      image: 'https://i.postimg.cc/YS3NWbk7/hahaw.jpg'
    },
    {
      id: 'data-science',
      title: 'Data Science Solutions',
      description: 'Advanced analytics and predictive modeling to drive data-driven decisions',
      image: 'https://pbs.twimg.com/media/G7quTWhW4AAJM4l?format=jpg&name=large'
    },
    {
      id: 'software-dev',
      title: 'Software Development Solutions',
      description: 'Custom software applications and enterprise solutions tailored to your needs',
      image: 'https://i.pinimg.com/736x/a6/83/15/a68315f072dd25f4c2d3410bf486b6f2.jpg'
    },
    {
      id: 'ai-solutions',
      title: 'AI Solutions',
      description: 'Intelligent automation and machine learning solutions for modern businesses',
      image: 'https://pbs.twimg.com/media/G7gIG0cXUAA65se?format=jpg&name=large'
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Center for Data and Software Solutions
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Our Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service, index) => {
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden group">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Link
                      to={`/services/${service.id}`}
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors"
                    >
                      View More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Work</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the innovative projects we've delivered for our clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={project.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(project.id)}
                        disabled={hasVoted(project.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          hasVoted(project.id)
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-green-600 hover:text-green-700'
                        }`}
                        title={hasVoted(project.id) ? 'Already voted' : 'Vote for this project'}
                      >
                        <ThumbsUp className={`h-4 w-4 ${hasVoted(project.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{project.votes || 0}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  <p className="text-sm text-green-600 font-medium mb-4">
                    Client: {project.client}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View Details
                    </Link>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users className="mr-1 h-4 w-4" />
                      {project.teamSize || 3} developers
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our talented team of developers and designers who make magic happen
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {member.name?.charAt(0) || 'T'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-green-600 transition-colors"
                      >
                        Email
                      </a>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="hover:text-green-600 transition-colors"
                      >
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {team.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No team members added yet.</p>
              <p className="text-gray-500 mt-2">Add team members from the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h2>
          </motion.div>

          {/* Scrolling Partners */}
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex space-x-12"
                animate={{
                  x: [0, -1920],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                {/* First set of logos */}
                <div className="flex space-x-12 flex-shrink-0">
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                      alt="Microsoft"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/640px-Google_2015_logo.svg.png"
                      alt="Google"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://tse1.mm.bing.net/th/id/OIP.W_hbKPBDWxyN24S2Kw-RTQAAAA?w=300&h=150&rs=1&pid=ImgDetMain&o=7&rm=3"
                      alt="University of Nairobi"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/640px-IBM_logo.svg.png"
                      alt="IBM"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/640px-Amazon_Web_Services_Logo.svg.png"
                      alt="AWS"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                   <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://tse1.mm.bing.net/th/id/OIP.2XBHFvtIAcvGyoOrbugKBQHaEc?rs=1&pid=ImgDetMain&o=7&rm=3"
                      alt="Palladium"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/11/GitHub-Logo.png"
                      alt="GitHub"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://th.bing.com/th/id/R.2789e55767fa6d0c6db0e9d556889b48?rik=1H78CpsyWnf2vA&riu=http%3a%2f%2fwww.dudonwai.com%2fimg%2fkaggle.JPG&ehk=Gb%2fuwiLEpWbCcxHW5SThl%2bUkrC%2fkGQsZWpkZZjO4Yqw%3d&risl=&pid=ImgRaw&r=0"
                      alt="Kaggle"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Docker_%28container_engine%29_logo.svg/640px-Docker_%28container_engine%29_logo.svg.png"
                      alt="Docker"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex space-x-12 flex-shrink-0">
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                      alt="Microsoft"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/640px-Google_2015_logo.svg.png"
                      alt="Google"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXNWP6YbEbLc_-0kp3R_YMv3lL2U0H6GCQrA&s"
                      alt="University of Nairobi"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/640px-IBM_logo.svg.png"
                      alt="IBM"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/640px-Amazon_Web_Services_Logo.svg.png"
                      alt="AWS"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://tse1.mm.bing.net/th/id/OIP.2XBHFvtIAcvGyoOrbugKBQHaEc?rs=1&pid=ImgDetMain&o=7&rm=3"
                      alt="Palladium"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/11/GitHub-Logo.png"
                      alt="GitHub"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://th.bing.com/th/id/R.2789e55767fa6d0c6db0e9d556889b48?rik=1H78CpsyWnf2vA&riu=http%3a%2f%2fwww.dudonwai.com%2fimg%2fkaggle.JPG&ehk=Gb%2fuwiLEpWbCcxHW5SThl%2bUkrC%2fkGQsZWpkZZjO4Yqw%3d&risl=&pid=ImgRaw&r=0"
                      alt="Kaggle"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-48 h-24 flex items-center justify-center transition-all duration-300">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Docker_%28container_engine%29_logo.svg/640px-Docker_%28container_engine%29_logo.svg.png"
                      alt="Docker"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
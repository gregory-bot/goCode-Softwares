import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ThumbsUp, Users, Calendar, ExternalLink, Star } from 'lucide-react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleVote = async () => {
    try {
      await updateDoc(doc(db, 'projects', id), {
        votes: increment(1)
      });
      
      setProject(prev => ({
        ...prev,
        votes: (prev.votes || 0) + 1
      }));
      
      toast.success('Thank you for your vote!');
    } catch (error) {
      toast.error('Error voting. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <Link to="/" className="text-green-600 hover:text-green-700">
            Back to Home
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
              to="/"
              className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
                <p className="text-xl text-green-100 mb-6">Client: {project.client}</p>
                <p className="text-lg leading-relaxed mb-8">{project.description}</p>
                
                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center">
                    <ThumbsUp className="h-5 w-5 text-green-100 mr-1" />
                    <span className="font-semibold">{project.votes || 0} votes</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-100 mr-1" />
                    <span>{project.teamSize || 3} developers</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-green-100 mr-1" />
                    <span>{project.duration || '3 months'}</span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleVote}
                    className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ThumbsUp className="mr-2 h-5 w-5" />
                    Vote for this project
                  </button>
                  
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold rounded-full transition-colors"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      View Live
                    </a>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <img
                  src={project.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={project.title}
                  className="rounded-xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-green-600 bg-opacity-20 rounded-xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {project.longDescription || project.description}
                  </p>
                  
                  {project.features && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {project.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {project.technologies && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.challenges && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Challenges & Solutions</h3>
                      <p className="text-gray-600 leading-relaxed">{project.challenges}</p>
                    </div>
                  )}
                  
                  {project.results && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Results & Impact</h3>
                      <p className="text-gray-600 leading-relaxed">{project.results}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-8 sticky top-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Project Info</h3>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Client</span>
                    <p className="text-gray-900 font-semibold">{project.client}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                    <p className="text-gray-900 font-semibold">{project.duration || '3 months'}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Team Size</span>
                    <p className="text-gray-900 font-semibold">{project.teamSize || 3} developers</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <p className="text-gray-900 font-semibold">{project.category || 'Web Development'}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <p className="text-green-600 font-semibold">Completed</p>
                  </div>
                </div>

                {/* Team Members */}
                {project.team && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h4>
                    <div className="space-y-3">
                      {project.team.map((member, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {member.name?.charAt(0) || 'T'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Client Rating</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">5.0</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    "Excellent work! The team delivered exactly what we needed."
                  </p>
                </div>

                {/* Vote Button */}
                <button
                  onClick={handleVote}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ThumbsUp className="mr-2 h-5 w-5" />
                  Vote ({project.votes || 0})
                </button>
              </motion.div>
            </div>
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
            <h2 className="text-4xl font-bold mb-6">Like What You See?</h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Ready to start your own project? Let's discuss how we can help bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Start Your Project
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold rounded-full transition-colors"
              >
                View All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
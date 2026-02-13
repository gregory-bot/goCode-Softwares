import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase/config';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const projectFormRef = useRef(null);
  const teamFormRef = useRef(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    category: 'data-engineering',
    liveUrl: '',
    githubUrl: '',
    votes: 0
  });
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    bio: '',
    image: '',
    skills: ''
  });

  // Service categories
  const categories = [
    { value: 'data-engineering', label: 'Data Engineering' },
    { value: 'data-analytics', label: 'Data Analytics' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'software-dev', label: 'Software Development' },
    { value: 'ai-solutions', label: 'AI Solutions' }
  ];

  // Fetch projects from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = [];
      snapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch team members from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'team'), (snapshot) => {
      const teamData = [];
      snapshot.forEach((doc) => {
        teamData.push({ id: doc.id, ...doc.data() });
      });
      setTeam(teamData);
    });

    return () => unsubscribe();
  }, []);

  // Handle add/edit project
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...projectForm,
        technologies: projectForm.technologies.split(',').map(t => t.trim()),
        updatedAt: new Date()
      };

      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);
        toast.success('Project updated successfully!');
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: new Date()
        });
        toast.success('Project added successfully!');
      }

      setShowProjectModal(false);
      setEditingProject(null);
      setProjectForm({
        title: '',
        description: '',
        image: '',
        technologies: '',
        category: 'data-engineering',
        liveUrl: '',
        githubUrl: '',
        votes: 0
      });
    } catch (error) {
      toast.error('Error saving project: ' + error.message);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        toast.success('Project deleted successfully!');
      } catch (error) {
        toast.error('Error deleting project: ' + error.message);
      }
    }
  };

  // Handle edit project
  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title || '',
      description: project.description || '',
      image: project.image || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      category: project.category || 'data-engineering',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      votes: project.votes || 0
    });
    setShowProjectModal(true);
    // Smooth scroll to form
    setTimeout(() => {
      projectFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle add/edit team member
  const handleSubmitTeamMember = async (e) => {
    e.preventDefault();
    try {
      const teamData = {
        ...teamForm,
        skills: teamForm.skills.split(',').map(s => s.trim()),
        updatedAt: new Date()
      };

      if (editingTeamMember) {
        await updateDoc(doc(db, 'team', editingTeamMember.id), teamData);
        toast.success('Team member updated successfully!');
      } else {
        await addDoc(collection(db, 'team'), {
          ...teamData,
          createdAt: new Date()
        });
        toast.success('Team member added successfully!');
      }

      setEditingTeamMember(null);
      setTeamForm({
        name: '',
        role: '',
        email: '',
        phone: '',
        bio: '',
        image: '',
        skills: ''
      });
    } catch (error) {
      toast.error('Error saving team member: ' + error.message);
    }
  };

  // Handle delete team member
  const handleDeleteTeamMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteDoc(doc(db, 'team', memberId));
        toast.success('Team member deleted successfully!');
      } catch (error) {
        toast.error('Error deleting team member: ' + error.message);
      }
    }
  };

  // Handle edit team member
  const handleEditTeamMember = (member) => {
    setEditingTeamMember(member);
    setTeamForm({
      name: member.name || '',
      role: member.role || '',
      email: member.email || '',
      phone: member.phone || '',
      bio: member.bio || '',
      image: member.image || '',
      skills: Array.isArray(member.skills) ? member.skills.join(', ') : ''
    });
    // Smooth scroll to form
    setTimeout(() => {
      teamFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Get category label
  const getCategoryLabel = (value) => {
    const category = categories.find(c => c.value === value);
    return category ? category.label : value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your portfolio projects and articles</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'projects'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'team'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Team
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Add New Project Form */}
            <div ref={projectFormRef} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="mr-2" />
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>

              <form onSubmit={handleSubmitProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="Enter project title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Project description"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    required
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    placeholder="https://project-demo.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({
                          title: '',
                          description: '',
                          image: '',
                          technologies: '',
                          category: 'data-engineering',
                          liveUrl: '',
                          githubUrl: '',
                          votes: 0
                        });
                      }}
                      className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Projects */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Existing Projects ({projects.length})</h2>
              
              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{project.description?.substring(0, 100)}...</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {getCategoryLabel(project.category)}
                          </span>
                          {Array.isArray(project.technologies) && project.technologies.slice(0, 3).map((tech, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🔗 Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:underline"
                        >
                          💻 Code
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No projects yet. Add your first project!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            {/* Add New Team Member Form */}
            <div ref={teamFormRef} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="mr-2" />
                {editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h2>

              <form onSubmit={handleSubmitTeamMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role/Position</label>
                  <input
                    type="text"
                    required
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    placeholder="Lead Developer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={teamForm.email}
                    onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                    placeholder="john@gocodesoftwares.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={teamForm.phone}
                    onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                    placeholder="+1 (234) 567-8900"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio/Description</label>
                  <textarea
                    value={teamForm.bio}
                    onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                    placeholder="Full-stack developer with 8+ years experience"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                  <input
                    type="url"
                    value={teamForm.image}
                    onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                    placeholder="https://example.com/profile.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={teamForm.skills}
                    onChange={(e) => setTeamForm({ ...teamForm, skills: e.target.value })}
                    placeholder="React, Node.js, Python, AWS"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {editingTeamMember ? 'Update Team Member' : 'Add Team Member'}
                  </button>
                  {editingTeamMember && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeamMember(null);
                        setTeamForm({
                          name: '',
                          role: '',
                          email: '',
                          phone: '',
                          bio: '',
                          image: '',
                          skills: ''
                        });
                      }}
                      className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Team Members */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Team Members ({team.length})</h2>
              
              <div className="space-y-4 max-h-[600px] sm:max-h-[800px] overflow-y-auto">
                {team.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {member.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">{member.name}</h3>
                        <p className="text-green-600 font-medium mb-1">{member.role}</p>
                        <p className="text-sm text-gray-600 mb-2 break-words">{member.bio}</p>
                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                          <p className="break-all">📧 {member.email}</p>
                          {member.phone && <p>📱 {member.phone}</p>}
                        </div>
                        {Array.isArray(member.skills) && member.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {member.skills.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 self-start">
                        <button
                          onClick={() => handleEditTeamMember(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {team.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No team members yet. Add your first team member!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

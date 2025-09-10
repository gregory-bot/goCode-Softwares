import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, onSnapshot, query, where, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Plus, DollarSign, Calendar, User, CheckCircle, XCircle, Clock, Trash2, Edit, TrendingUp, Gift, Users, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

function ProjectDetail() {
  const { id: projectId } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [fundings, setFundings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddFunding, setShowAddFunding] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [editAllocationData, setEditAllocationData] = useState({ amount: '', description: '' });
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    staffId: '',
    procurementType: '',
    procurementDetails: ''
  });
  const [newFunding, setNewFunding] = useState({
    amount: '',
    source: '',
    description: '',
    type: ''
  });
  const [categoryStep, setCategoryStep] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editTransactionData, setEditTransactionData] = useState({ 
    description: '', 
    amount: '', 
    staffId: '', 
    procurementType: '', 
    procurementDetails: '' 
  });
  const [salaryData, setSalaryData] = useState({});
  const [showSalaryTable, setShowSalaryTable] = useState(false);

  // Helper function to get safe user data
  const getSafeUserData = () => {
    return {
      uid: currentUser?.uid || 'anonymous',
      name: currentUser?.displayName || currentUser?.email || 'Anonymous User',
      email: currentUser?.email || 'no-email@example.com'
    };
  };

  // Delete project handler (admin only)
  const handleDeleteProject = async () => {
    if (!isAdmin) return;
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      toast.success('Project deleted successfully!');
      window.location.href = '/projects';
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project: ' + error.message);
    }
  };

  // Fetch project details and related data
  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Listen to project by Firestore doc ID
    const projectDocRef = doc(db, 'projects', projectId);
    const unsubProject = onSnapshot(projectDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const projectData = { id: docSnap.id, ...docSnap.data() };
        setProject(projectData);
      } else {
        setProject(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching project:', error);
      setProject(null);
      setLoading(false);
    });

    // Listen to staff
    const qStaff = query(collection(db, 'staff'));
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      const staffData = [];
      snapshot.forEach((doc) => {
        staffData.push({ id: doc.id, ...doc.data() });
      });
      staffData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setStaff(staffData);
    }, (error) => {
      console.error('Error fetching staff:', error);
    });

    // Listen to allocations
    const qAlloc = query(
      collection(db, 'budget_allocations'), 
      where('projectId', '==', projectId)
    );
    const unsubAlloc = onSnapshot(qAlloc, (snapshot) => {
      const allocationsData = [];
      snapshot.forEach((doc) => {
        allocationsData.push({ id: doc.id, ...doc.data() });
      });
      // Sort manually by allocatedAt descending
      allocationsData.sort((a, b) => {
        const dateA = new Date(a.allocatedAt || 0);
        const dateB = new Date(b.allocatedAt || 0);
        return dateB - dateA;
      });
      setAllocations(allocationsData);
    }, (error) => {
      console.error('Error fetching allocations:', error);
    });

    // Listen to fundings
    const qFundings = query(
      collection(db, 'fundings'), 
      where('projectId', '==', projectId)
    );
    const unsubFundings = onSnapshot(qFundings, (snapshot) => {
      const fundingsData = [];
      snapshot.forEach((doc) => {
        fundingsData.push({ id: doc.id, ...doc.data() });
      });
      // Sort manually by createdAt descending
      fundingsData.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setFundings(fundingsData);
    }, (error) => {
      console.error('Error fetching fundings:', error);
    });

    // Listen to transactions
    const qTrans = query(
      collection(db, 'transactions'), 
      where('projectId', '==', projectId)
    );
    const unsubTrans = onSnapshot(qTrans, (snapshot) => {
      const transactionsData = [];
      snapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() });
      });
      // Sort manually by createdAt descending
      transactionsData.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setTransactions(transactionsData);
    }, (error) => {
      console.error('Error fetching transactions:', error);
    });

    return () => {
      unsubProject();
      unsubStaff();
      unsubAlloc();
      unsubFundings();
      unsubTrans();
    };
  }, [projectId]);

  // Calculate project budget and spent amounts
  const projectStats = useMemo(() => {
    if (!project) return { budget: 0, spent: 0, remaining: 0, totalFunding: 0 };

    const allocatedBudget = allocations.reduce((sum, a) => sum + (a.amount || 0), 0);
    const totalFunding = fundings.reduce((sum, f) => sum + (f.amount || 0), 0);
    const spent = transactions
      .filter(t => t.status === 'approved')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const budget = allocatedBudget + totalFunding;
    const remaining = budget - spent;

    return { budget, spent, remaining, totalFunding, allocatedBudget };
  }, [project, allocations, transactions, fundings]);

  // Initialize salary data when staff changes
  useEffect(() => {
    const initialSalaryData = {};
    staff.forEach(member => {
      initialSalaryData[member.id] = {
        amount: member.salary || '',
        description: `Monthly salary for ${member.name}`,
        selected: false
      };
    });
    setSalaryData(initialSalaryData);
  }, [staff]);

  // Handle salary data changes
  const handleSalaryChange = (staffId, field, value) => {
    setSalaryData(prev => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [field]: value
      }
    }));
  };

  // Handle bulk salary submission
  const handleBulkSalarySubmit = async () => {
    const userData = getSafeUserData();
    const selectedStaff = Object.entries(salaryData).filter(([_, data]) => data.selected);
    
    if (selectedStaff.length === 0) {
      toast.error('Please select at least one staff member');
      return;
    }

    try {
      const promises = selectedStaff.map(async ([staffId, data]) => {
        const staffMember = staff.find(s => s.id === staffId);
        if (!staffMember || !data.amount || parseFloat(data.amount) <= 0) return;

        const transactionData = {
          projectId: projectId,
          amount: parseFloat(data.amount),
          status: 'approved',
          createdBy: userData.uid,
          createdByName: userData.name,
          createdByEmail: userData.email,
          createdAt: new Date().toISOString(),
          category: 'salaries',
          staffId: staffId,
          staffName: staffMember.name,
          description: data.description || `Monthly salary for ${staffMember.name}`
        };

        return addDoc(collection(db, 'transactions'), transactionData);
      });

      await Promise.all(promises);
      
      // Reset selections
      setSalaryData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key].selected = false;
        });
        return updated;
      });
      
      setShowSalaryTable(false);
      setCategoryStep('');
      setShowAddTransaction(false);
      toast.success(`${selectedStaff.length} salary transaction(s) added successfully!`);
    } catch (error) {
      console.error('Error adding salary transactions:', error);
      toast.error('Error adding salary transactions: ' + error.message);
    }
  };

  // Edit allocation handlers
  const handleEditAllocation = (allocation) => {
    setEditingAllocation(allocation);
    setEditAllocationData({
      amount: allocation.amount || '',
      description: allocation.description || allocation.type || ''
    });
  };

  const handleUpdateAllocation = async (e) => {
    e.preventDefault();
    const userData = getSafeUserData();
    
    try {
      const updateData = {
        amount: parseFloat(editAllocationData.amount),
        description: editAllocationData.description,
        updatedAt: new Date().toISOString(),
        updatedBy: userData.uid,
        updatedByName: userData.name
      };

      await updateDoc(doc(db, 'budget_allocations', editingAllocation.id), updateData);
      setEditingAllocation(null);
      toast.success('Budget allocation updated successfully!');
    } catch (error) {
      console.error('Error updating allocation:', error);
      toast.error('Error updating allocation');
    }
  };

  // Add funding handler
  const handleAddFunding = async (e) => {
    e.preventDefault();
    const userData = getSafeUserData();
    
    const amount = parseFloat(newFunding.amount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!newFunding.source || !newFunding.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const fundingData = {
        projectId: projectId,
        amount: amount,
        source: newFunding.source,
        type: newFunding.type,
        description: newFunding.description || `${newFunding.type} funding from ${newFunding.source}`,
        createdBy: userData.uid,
        createdByName: userData.name,
        createdByEmail: userData.email,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'fundings'), fundingData);
      
      // Reset form
      setNewFunding({ amount: '', source: '', description: '', type: '' });
      setShowAddFunding(false);
      toast.success('Funding added successfully!');
    } catch (error) {
      console.error('Error adding funding:', error);
      toast.error('Error adding funding: ' + error.message);
    }
  };

  // Edit transaction handlers
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setEditTransactionData({
      description: transaction.description || '',
      amount: transaction.amount || '',
      staffId: transaction.staffId || '',
      procurementType: transaction.procurementType || '',
      procurementDetails: transaction.procurementDetails || ''
    });
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    const userData = getSafeUserData();
    
    try {
      const updateData = {
        description: editTransactionData.description,
        amount: parseFloat(editTransactionData.amount),
        updatedAt: new Date().toISOString(),
        updatedBy: userData.uid,
        updatedByName: userData.name
      };

      if (editingTransaction.category === 'salaries') {
        const selectedStaff = staff.find(s => s.id === editTransactionData.staffId);
        updateData.staffId = editTransactionData.staffId;
        updateData.staffName = selectedStaff?.name || '';
      } else {
        updateData.procurementType = editTransactionData.procurementType;
        updateData.procurementDetails = editTransactionData.procurementDetails;
      }

      await updateDoc(doc(db, 'transactions', editingTransaction.id), updateData);
      setEditingTransaction(null);
      toast.success('Transaction updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Error updating transaction');
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Error deleting transaction');
    }
  };

  // Delete allocation
  const handleDeleteAllocation = async (allocationId) => {
    if (!window.confirm('Are you sure you want to delete this budget allocation?')) return;
    
    try {
      await deleteDoc(doc(db, 'budget_allocations', allocationId));
      toast.success('Budget allocation deleted successfully!');
    } catch (error) {
      console.error('Error deleting allocation:', error);
      toast.error('Error deleting allocation');
    }
  };

  // Delete funding
  const handleDeleteFunding = async (fundingId) => {
    if (!window.confirm('Are you sure you want to delete this funding?')) return;
    
    try {
      await deleteDoc(doc(db, 'fundings', fundingId));
      toast.success('Funding deleted successfully!');
    } catch (error) {
      console.error('Error deleting funding:', error);
      toast.error('Error deleting funding');
    }
  };

  // Add single procurement transaction
  const handleAddProcurementTransaction = async (e) => {
    e.preventDefault();
    const userData = getSafeUserData();
    
    const amount = parseFloat(newTransaction.amount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!newTransaction.procurementType || !newTransaction.procurementDetails) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const transactionData = {
        projectId: projectId,
        amount: amount,
        status: 'approved',
        createdBy: userData.uid,
        createdByName: userData.name,
        createdByEmail: userData.email,
        createdAt: new Date().toISOString(),
        category: 'procurement',
        procurementType: newTransaction.procurementType,
        procurementDetails: newTransaction.procurementDetails,
        description: `${newTransaction.procurementType}: ${newTransaction.procurementDetails}`
      };

      await addDoc(collection(db, 'transactions'), transactionData);
      
      // Reset form
      setNewTransaction({ description: '', amount: '', category: '', staffId: '', procurementType: '', procurementDetails: '' });
      setCategoryStep('');
      setShowAddTransaction(false);
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Error adding transaction: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Helper for safe date formatting
  const safeFormat = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d) ? '' : format(d, 'MMM dd, yyyy');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <p className="text-gray-500 mb-6">The project you're looking for doesn't exist or has been deleted.</p>
          <a href="/projects" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Back to Projects
          </a>
        </div>
      </div>
    );
  }

  const progressPercentage = projectStats.budget > 0 ? Math.min((projectStats.spent / projectStats.budget) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="relative h-64 md:h-80">
            <img
              src={project.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'}
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.name}</h1>
              <p className="text-lg opacity-90">
                {safeFormat(project.startDate)}{project.startDate && project.endDate ? ' - ' : ''}{safeFormat(project.endDate)}
              </p>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {project.description || `${project.name} - Research project managed by CHQI`}
            </p>
            
            {/* Delete Project Button (admin only) */}
            {isAdmin && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleDeleteProject}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all btn-hover flex items-center"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete Project
                </button>
              </div>
            )}
            
            {/* Budget Overview */}
            {projectStats.budget === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg mb-2">No budget has been allocated to this project yet.</p>
                <p className="text-gray-400">Add your first budget allocation or funding to get started.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 p-3 rounded-full inline-block mb-3">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(projectStats.budget)}</h3>
                    <p className="text-gray-600">Total Budget</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="bg-purple-500 p-3 rounded-full inline-block mb-3">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(projectStats.totalFunding)}</h3>
                    <p className="text-gray-600">External Funding</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="bg-red-500 p-3 rounded-full inline-block mb-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(projectStats.spent)}</h3>
                    <p className="text-gray-600">Total Spent</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-500 p-3 rounded-full inline-block mb-3">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(projectStats.remaining)}</h3>
                    <p className="text-gray-600">Remaining</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Budget Usage</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        progressPercentage < 50 ? 'bg-green-500' : 
                        progressPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Budget Allocations & Funding Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Budget Allocations & Funding</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddFunding(true)}
                className="bg-blue-400 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all btn-hover flex items-center"
              >
                <Gift className="h-4 w-4 mr-2" />
                Add Funding
              </button>
            </div>
          </div>

          {/* Budget Allocations */}
          {allocations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                Budget Allocations
              </h3>
              <div className="space-y-3">
                {allocations.map((alloc) => (
                  <div key={alloc.id} className="border border-blue-100 rounded-lg p-4 flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-blue-700 text-xl">{formatCurrency(alloc.amount)}</span>
                        <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded">
                          {alloc.description || alloc.type || 'Budget Allocation'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Allocated on {safeFormat(alloc.allocatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditAllocation(alloc)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-colors"
                        title="Edit Allocation"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAllocation(alloc.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        title="Delete Allocation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Funding */}
          {fundings.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Gift className="h-5 w-5 mr-2 text-purple-500" />
                External Funding
              </h3>
              <div className="space-y-3">
                {fundings.map((funding) => (
                  <div key={funding.id} className="border border-purple-100 rounded-lg p-4 flex justify-between items-center bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-purple-700 text-xl">{formatCurrency(funding.amount)}</span>
                        <span className="text-xs text-purple-600 bg-purple-200 px-2 py-1 rounded">
                          {funding.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>From:</strong> {funding.source}
                      </div>
                      {funding.description && (
                        <div className="text-sm text-gray-600 mb-2">
                          {funding.description}
                        </div>
                      )}
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Received on {safeFormat(funding.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteFunding(funding.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        title="Delete Funding"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Budget/Funding State */}
          {allocations.length === 0 && fundings.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg mb-8">
              <p className="text-lg mb-2">No budget allocations or funding yet</p>
              <p>Add funding to start tracking this project's finances!</p>
            </div>
          )}
        </motion.div>

        {/* Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
            <button
              onClick={() => setShowAddTransaction(true)}
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg transition-all btn-hover flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </button>
          </div>

          {/* Add Funding Modal */}
          {showAddFunding && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Add External Funding</h3>
                <form onSubmit={handleAddFunding} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Funding Source *</label>
                    <input
                      type="text"
                      value={newFunding.source}
                      onChange={e => setNewFunding({ ...newFunding, source: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., WHO, USAID, Bill Gates Foundation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Funding Type *</label>
                    <select
                      value={newFunding.type}
                      onChange={e => setNewFunding({ ...newFunding, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select funding type</option>
                      <option value="Grant">Grant</option>
                      <option value="Donation">Donation</option>
                      <option value="Research Fund">Research Fund</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sponsorship">Sponsorship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES) *</label>
                    <input
                      type="number"
                      value={newFunding.amount}
                      onChange={e => setNewFunding({ ...newFunding, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newFunding.description}
                      onChange={e => setNewFunding({ ...newFunding, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Additional details about this funding"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Add Funding
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddFunding(false);
                        setNewFunding({ amount: '', source: '', description: '', type: '' });
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Allocation Modal */}
          {editingAllocation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-xl font-bold mb-4">Edit Budget Allocation</h3>
                <form onSubmit={handleUpdateAllocation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES) *</label>
                    <input
                      type="number"
                      value={editAllocationData.amount}
                      onChange={e => setEditAllocationData({ ...editAllocationData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editAllocationData.description}
                      onChange={e => setEditAllocationData({ ...editAllocationData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Budget allocation description"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Update Budget
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingAllocation(null)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Transaction Modal */}
          {showAddTransaction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
                
                {!categoryStep && (
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">Select expenditure category:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
                        onClick={() => {
                          setCategoryStep('salaries');
                          setShowSalaryTable(true);
                        }}
                      >
                        <Users className="h-6 w-6 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">Salaries</div>
                          <div className="text-sm opacity-90">Staff salary payments</div>
                        </div>
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
                        onClick={() => setCategoryStep('procurement')}
                      >
                        <DollarSign className="h-6 w-6 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">Operational Costs</div>
                          <div className="text-sm opacity-90">Operations, ICT, and logistics</div>
                        </div>
                      </button>
                    </div>
                    <button
                      className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                      onClick={() => setShowAddTransaction(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Salary Table */}
                {categoryStep === 'salaries' && showSalaryTable && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">Select Staff for Salary Payment</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleBulkSalarySubmit}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                          disabled={!Object.values(salaryData).some(data => data.selected)}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Selected
                        </button>
                        <button
                          onClick={() => {
                            setCategoryStep('');
                            setShowSalaryTable(false);
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                    
                    {staff.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg mb-2">No staff members found</p>
                        <p>Please add staff members in the admin panel first.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 rounded-lg">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-3 text-left">
                                <input
                                  type="checkbox"
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setSalaryData(prev => {
                                      const updated = { ...prev };
                                      Object.keys(updated).forEach(key => {
                                        updated[key].selected = checked;
                                      });
                                      return updated;
                                    });
                                  }}
                                  className="rounded"
                                />
                              </th>
                              <th className="border border-gray-300 px-4 py-3 text-left">Staff Name</th>
                              <th className="border border-gray-300 px-4 py-3 text-left">Position</th>
                              <th className="border border-gray-300 px-4 py-3 text-left">Salary Amount (KES)</th>
                              <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {staff.map((member) => (
                              <tr key={member.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={salaryData[member.id]?.selected || false}
                                    onChange={(e) => handleSalaryChange(member.id, 'selected', e.target.checked)}
                                    className="rounded"
                                  />
                                </td>
                                <td className="border border-gray-300 px-4 py-3 font-medium">
                                  {member.name}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-gray-600">
                                  {member.position || 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                  <input
                                    type="number"
                                    value={salaryData[member.id]?.amount || ''}
                                    onChange={(e) => handleSalaryChange(member.id, 'amount', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                  />
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                  <input
                                    type="text"
                                    value={salaryData[member.id]?.description || ''}
                                    onChange={(e) => handleSalaryChange(member.id, 'description', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Monthly salary for ${member.name}`}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Procurement Form */}
                {categoryStep === 'procurement' && (
                  <form onSubmit={handleAddProcurementTransaction} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Procurement Type *</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {['Operations & admin', 'ICT', 'Logistics'].map(type => (
                          <button
                            key={type}
                            type="button"
                            className={`px-4 py-2 rounded-lg border transition-colors ${newTransaction.procurementType === type ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                            onClick={() => setNewTransaction({ ...newTransaction, procurementType: type })}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Procurement Details *</label>
                      <textarea
                        value={newTransaction.procurementDetails}
                        onChange={e => setNewTransaction({ ...newTransaction, procurementDetails: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe the procurement (e.g., ICT equipment, office supplies, transport costs)"
                        rows="3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES) *</label>
                      <input
                        type="number"
                        value={newTransaction.amount}
                        onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
                      >
                        Add Transaction
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryStep('');
                          setNewTransaction({ description: '', amount: '', category: '', staffId: '', procurementType: '', procurementDetails: '' });
                        }}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                      >
                        Back
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Edit Transaction Modal */}
          {editingTransaction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Edit Transaction</h3>
                <form onSubmit={handleUpdateTransaction} className="space-y-4">
                  {editingTransaction.category === 'salaries' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
                        <select
                          value={editTransactionData.staffId}
                          onChange={e => setEditTransactionData({ ...editTransactionData, staffId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select staff member</option>
                          {staff.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input
                          type="text"
                          value={editTransactionData.description}
                          onChange={e => setEditTransactionData({ ...editTransactionData, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Procurement Type</label>
                        <input
                          type="text"
                          value={editTransactionData.procurementType}
                          onChange={e => setEditTransactionData({ ...editTransactionData, procurementType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Procurement Details</label>
                        <textarea
                          value={editTransactionData.procurementDetails}
                          onChange={e => setEditTransactionData({ ...editTransactionData, procurementDetails: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="3"
                          required
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
                    <input
                      type="number"
                      value={editTransactionData.amount}
                      onChange={e => setEditTransactionData({ ...editTransactionData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Update Transaction
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTransaction(null)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="text-lg mb-2">No transactions yet</p>
                  <p>Add your first transaction to get started!</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(transaction.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">
                            {transaction.category}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">{transaction.description}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          {transaction.category === 'salaries' && transaction.staffName && (
                            <span><strong>Staff:</strong> {transaction.staffName}</span>
                          )}
                          {transaction.category === 'procurement' && (
                            <>
                              {transaction.procurementType && (
                                <span><strong>Type:</strong> {transaction.procurementType}</span>
                              )}
                              {transaction.procurementDetails && (
                                <span className="md:col-span-2"><strong>Details:</strong> {transaction.procurementDetails}</span>
                              )}
                            </>
                          )}
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {transaction.createdByName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {safeFormat(transaction.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-gray-900 mb-2">
                          {formatCurrency(transaction.amount)}
                        </div>
                        {(isAdmin || transaction.createdBy === currentUser?.uid) && (
                          <div className="flex flex-col space-y-1">
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs flex items-center justify-center transition-colors"
                              onClick={() => handleEditTransaction(transaction)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center justify-center transition-colors"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProjectDetail;
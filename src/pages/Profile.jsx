import { useQuery } from '@tanstack/react-query';
import { auth, insights } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { FiEdit2, FiX, FiDroplet, FiTruck, FiPackage, FiTrendingUp, FiCalendar, FiMail, FiUser, FiSettings, FiInfo, FiAward } from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  
  // Fetch user data
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: () => auth.getCurrentUser().then(res => res.data),
    initialData: authUser,
    enabled: !authUser,
  });

  // Fetch carbon footprint summary
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useQuery({
    queryKey: ['insights-summary'],
    queryFn: () => insights.getSummary().then(res => res.data),
    enabled: !!user,
  });

  useEffect(() => {
    if (!summaryLoading && summary) {
      setTimeout(() => setAnimateStats(true), 500);
    }
  }, [summaryLoading, summary]);

  const isLoading = userLoading || summaryLoading;
  const error = userError || summaryError;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate percentage for circular progress
  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.min(Math.round((value / total) * 100), 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-green-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-green-500 text-sm font-medium">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-red-500 bg-white p-8 rounded-2xl shadow-xl max-w-md border-l-4 border-red-500">
          <p className="text-2xl font-bold mb-3">Oops!</p>
          <p className="text-gray-700">{error.message || 'Failed to load user data'}</p>
          <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Use either the fetched user or the auth context user
  const profileUser = user || authUser;
  
  // Calculate total emissions for the circular progress
  const totalEmission = summary?.totalEmission || 0;
  const baselineEmission = summary?.baselineEmission || totalEmission;
  const targetEmission = baselineEmission * 0.5; // 50% reduction target
  const reductionAchieved = baselineEmission - totalEmission;
  const reductionPercentage = (reductionAchieved / baselineEmission) * 100;
  
  // Get the first letter of the name for the avatar
  const firstLetter = profileUser?.name?.charAt(0).toUpperCase() || 'U';
  
  // Calculate carbon rank based on emissions
  const getCarbonRank = () => {
    if (reductionPercentage >= 40) return { title: "Carbon Champion", color: "text-green-600" };
    if (reductionPercentage >= 20) return { title: "Green Advocate", color: "text-emerald-500" };
    if (reductionPercentage >= 0) return { title: "Climate Conscious", color: "text-teal-500" };
    return { title: "Carbon Novice", color: "text-blue-500" };
  };
  
  const carbonRank = getCarbonRank();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-8 bg-gradient-to-r from-emerald-600 to-teal-500">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-10 pb-20 md:pb-24 md:pt-16">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between">
              <div className="flex flex-col md:flex-row items-center mb-6 md:mb-0">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white transform hover:scale-105 transition-transform duration-300">
                  <span className="text-4xl font-bold text-emerald-600">
                    {firstLetter}
                  </span>
                </div>
                <div className="text-white text-center md:text-left md:ml-6 mt-4 md:mt-0">
                  <h1 className="text-3xl md:text-4xl font-extrabold">{profileUser?.name}</h1>
                  <p className="text-emerald-100 mt-1">{profileUser?.email}</p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 backdrop-blur-sm">
                    <FiAward className="mr-1" />
                    <span className={carbonRank.color}>{carbonRank.title}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="bg-white text-emerald-600 px-5 py-2 rounded-full font-medium hover:bg-emerald-50 transition-colors shadow-md flex items-center">
                  <FiEdit2 className="mr-2" />
                  Edit Profile
                </button>
                <button className="bg-emerald-700 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-800 transition-colors shadow-md flex items-center">
                  <FiInfo className="mr-2" />
                  Carbon Tips
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-green-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                  <FiUser className="mr-3 text-emerald-500" />
                  Account Information
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="bg-emerald-100 p-2 rounded-full mr-4">
                      <FiMail className="text-emerald-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{profileUser?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="bg-emerald-100 p-2 rounded-full mr-4">
                      <FiCalendar className="text-emerald-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-800">{formatDate(profileUser?.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="bg-emerald-100 p-2 rounded-full mr-4">
                      <FiTrendingUp className="text-emerald-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="font-medium text-gray-800">{summary?.orderCount || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preferences Card */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                  <FiSettings className="mr-3 text-emerald-500" />
                  Preferences
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      defaultChecked={profileUser?.preferences?.notifications}
                    />
                    <span className="ml-3 block text-gray-700 font-medium">Email Notifications</span>
                  </label>
                  
                  <label className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      id="carbonTips"
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      defaultChecked={profileUser?.preferences?.emissionAlerts}
                    />
                    <span className="ml-3 block text-gray-700 font-medium">Carbon Reduction Tips</span>
                  </label>
                  
                  <label className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      id="weeklyReport"
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      defaultChecked={profileUser?.preferences?.weeklyReport}
                    />
                    <span className="ml-3 block text-gray-700 font-medium">Weekly Carbon Report</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Carbon Footprint */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carbon Footprint Overview */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Carbon Footprint</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Circular Progress */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-48 h-48 md:w-56 md:h-56 transition-all duration-1000">
                      <CircularProgressbar
                        value={animateStats ? Math.abs(reductionPercentage) : 0}
                        text={`${Math.abs(reductionPercentage).toFixed(1)}%`}
                        styles={buildStyles({
                          pathColor: reductionPercentage >= 0 ? '#10B981' : '#F59E0B',
                          textColor: reductionPercentage >= 0 ? '#10B981' : '#F59E0B',
                          trailColor: '#F3F4F6',
                          textSize: '16px',
                          pathTransition: 'stroke-dashoffset 1.5s ease 0s',
                        })}
                      />
                    </div>
                    <div className="mt-6 text-center">
                      <p className="text-lg font-semibold text-gray-800">
                        {reductionPercentage >= 0 ? 'Reduction Achieved' : 'Increase from Baseline'}
                      </p>
                      <p className="mt-1 text-gray-600">
                        Current: <span className="font-medium">{totalEmission.toFixed(2)} kg CO₂</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Target: <span className="font-medium">{targetEmission.toFixed(2)} kg CO₂</span> (50% reduction)
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <FiDroplet className="text-green-600 h-5 w-5" />
                          </div>
                          <span className="font-semibold text-green-800">Food Emissions</span>
                        </div>
                        <span className="font-bold text-green-700">
                          {summary?.foodEmission ? summary.foodEmission.toFixed(2) : '0'} kg CO₂
                        </span>
                      </div>
                      <div className="mt-3 h-3 bg-green-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: animateStats ? `${summary?.foodPercentage || 0}%` : '0%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-green-600 mt-2">
                        {summary?.foodPercentage ? `${summary.foodPercentage.toFixed(1)}% of total` : '0% of total'}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <FiTruck className="text-blue-600 h-5 w-5" />
                          </div>
                          <span className="font-semibold text-blue-800">Transport Emissions</span>
                        </div>
                        <span className="font-bold text-blue-700">
                          {summary?.transportEmission ? summary.transportEmission.toFixed(2) : '0'} kg CO₂
                        </span>
                      </div>
                      <div className="mt-3 h-3 bg-blue-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: animateStats ? `${summary?.transportPercentage || 0}%` : '0%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        {summary?.transportPercentage ? `${summary.transportPercentage.toFixed(1)}% of total` : '0% of total'}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-xl border border-amber-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-amber-100 p-2 rounded-full mr-3">
                            <FiPackage className="text-amber-600 h-5 w-5" />
                          </div>
                          <span className="font-semibold text-amber-800">Packaging Emissions</span>
                        </div>
                        <span className="font-bold text-amber-700">
                          {summary?.packagingEmission ? summary.packagingEmission.toFixed(2) : '0'} kg CO₂
                        </span>
                      </div>
                      <div className="mt-3 h-3 bg-amber-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: animateStats ? `${summary?.packagingPercentage || 0}%` : '0%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-amber-600 mt-2">
                        {summary?.packagingPercentage ? `${summary.packagingPercentage.toFixed(1)}% of total` : '0% of total'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Carbon Footprint Summary */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 mt-6">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Carbon Footprint Summary</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Total Carbon Footprint</h3>
                    <p className="text-3xl font-bold text-emerald-600">
                      {summary?.totalEmission ? summary.totalEmission.toFixed(2) : '0'} kg CO₂
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Equivalent to {Math.round((summary?.totalEmission || 0) * 2.5)} miles driven by car
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Average per Order</h3>
                    <p className="text-3xl font-bold text-emerald-600">
                      {summary?.averageEmissionPerOrder ? summary.averageEmissionPerOrder.toFixed(2) : '0'} kg CO₂
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Based on {summary?.orderCount || 0} orders</p>
                  </div>
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100">
                  <h3 className="text-lg font-medium text-emerald-800 mb-4 flex items-center">
                    <FiInfo className="mr-2" />
                    Tips to Reduce Your Carbon Footprint
                  </h3>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-emerald-100 rounded-full h-7 w-7 text-emerald-700 font-semibold mr-3 mt-0.5 flex-shrink-0">1</span>
                      <span>Choose restaurants closer to your location to reduce transport emissions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-emerald-100 rounded-full h-7 w-7 text-emerald-700 font-semibold mr-3 mt-0.5 flex-shrink-0">2</span>
                      <span>Select "no utensils" option when you don't need them</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-emerald-100 rounded-full h-7 w-7 text-emerald-700 font-semibold mr-3 mt-0.5 flex-shrink-0">3</span>
                      <span>Order plant-based meals which typically have lower carbon emissions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-emerald-100 rounded-full h-7 w-7 text-emerald-700 font-semibold mr-3 mt-0.5 flex-shrink-0">4</span>
                      <span>Combine multiple items in a single order to reduce delivery trips</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Achievement Badges */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 mt-6">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Achievements</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                      <FiAward className="h-8 w-8 text-emerald-500" />
                    </div>
                    <p className="font-medium text-center text-emerald-800">Carbon Saver</p>
                    <p className="text-xs text-center text-emerald-600 mt-1">Reduced emissions by 10%</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 opacity-60">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                      <FiDroplet className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="font-medium text-center text-blue-800">Plant Power</p>
                    <p className="text-xs text-center text-blue-600 mt-1">10 plant-based orders</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 opacity-60">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                      <FiPackage className="h-8 w-8 text-amber-400" />
                    </div>
                    <p className="font-medium text-center text-amber-800">Zero Waste</p>
                    <p className="text-xs text-center text-amber-600 mt-1">5 no-utensil orders</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 opacity-60">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                      <FiTruck className="h-8 w-8 text-purple-400" />
                    </div>
                    <p className="font-medium text-center text-purple-800">Local Hero</p>
                    <p className="text-xs text-center text-purple-600 mt-1">Order from 5 local restaurants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default Profile;


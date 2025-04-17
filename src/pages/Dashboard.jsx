import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { insights, orders } from '../services/api';
import OrderImport from '../components/OrderImport';
import { 
  FiShoppingBag, 
  FiTruck, 
  FiPackage, 
  FiCoffee, 
  FiPlus, 
  FiArrowRight, 
  FiTrendingUp, 
  FiCalendar, 
  FiList,
  FiBarChart2,
  FiAlertCircle,
  FiRefreshCw,
  FiX,
  FiUploadCloud
} from 'react-icons/fi';

const Dashboard = () => {
  const [animateStats, setAnimateStats] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = useQuery({
    queryKey: ['summary'],
    queryFn: () => insights.getSummary().then(res => res.data)
  });

  const { data: recentOrders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useQuery({
    queryKey: ['recentOrders'],
    queryFn: () => orders.getAll().then(res => {
      // Sort orders by date in descending order (newest first)
      const sortedOrders = [...res.data].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      // Take the first 5 orders
      return sortedOrders.slice(0, 5);
    }),
    retry: false // Don't retry on error to avoid infinite loops
  });
  
  // Trigger animation after data loads
  useEffect(() => {
    if (!summaryLoading && !ordersLoading) {
      setTimeout(() => setAnimateStats(true), 300);
    }
  }, [summaryLoading, ordersLoading]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refetchSummary();
    refetchOrders();
  };

  // Loading state
  if (summaryLoading || ordersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-gray-50 to-green-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-green-500 text-sm font-medium">Loading</span>
          </div>
        </div>
        <p className="mt-4 text-gray-600 text-center max-w-md">
          Gathering your carbon footprint data...
        </p>
      </div>
    );
  }

  // Error state
  if (summaryError || ordersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-gray-50 to-red-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border-l-4 border-red-500">
          <div className="flex items-center mb-4">
            <FiAlertCircle className="text-red-500 h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Error Loading Data</h2>
          </div>
          <p className="text-gray-600 mb-6">
            We're having trouble loading your dashboard data. Please try again later.
          </p>
          <button 
            onClick={handleRefresh}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors duration-300"
          >
            <FiRefreshCw className="mr-2" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if summary exists, if not provide default values
  const summaryData = summary || {
    totalEmission: 0,
    transportEmission: 0,
    transportPercentage: 0,
    packagingEmission: 0,
    packagingPercentage: 0,
    foodEmission: 0,
    foodPercentage: 0
  };

  // Ensure all values are numbers and not NaN
  const safeToFixed = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  // Ensure recentOrders is an array
  const safeRecentOrders = Array.isArray(recentOrders) ? recentOrders : [];
  
  // Calculate total orders count
  const totalOrders = summaryData.orderCount || safeRecentOrders.length;
  
  // Calculate average emission per order
  const avgEmissionPerOrder = totalOrders > 0 
    ? summaryData.totalEmission / totalOrders 
    : 0;

  const ImportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Import Orders</h2>
          <button
            onClick={() => setShowImportModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <OrderImport />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carbon Footprint Dashboard</h1>
          <p className="text-gray-600">Track, analyze, and reduce your food delivery carbon emissions</p>
        </div>
        
        {/* Import Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Import Your Orders</h2>
              <p className="text-blue-100 max-w-xl">
                Connect your food delivery accounts to automatically track your carbon footprint
              </p>
            </div>
            <button 
              onClick={() => setShowImportModal(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors duration-300 shadow-sm flex items-center"
            >
              <FiPlus className="mr-2" /> Connect Account
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" /> Emissions Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Carbon Footprint</p>
                  <h3 className={`text-2xl font-bold text-gray-800 transition-all duration-1000 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    {safeToFixed(summaryData.totalEmission)} kg CO₂
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">From {totalOrders} orders</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FiShoppingBag className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-1500 ease-out"
                  style={{ width: animateStats ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Transport Emissions</p>
                  <h3 className={`text-2xl font-bold text-gray-800 transition-all duration-1000 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    {safeToFixed(summaryData.transportEmission)} kg CO₂
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {safeToFixed(summaryData.transportPercentage, 1)}% of total
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiTruck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1500 ease-out"
                  style={{ width: animateStats ? `${summaryData.transportPercentage}%` : '0%' }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Packaging Emissions</p>
                  <h3 className={`text-2xl font-bold text-gray-800 transition-all duration-1000 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    {safeToFixed(summaryData.packagingEmission)} kg CO₂
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {safeToFixed(summaryData.packagingPercentage, 1)}% of total
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg">
                  <FiPackage className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-1500 ease-out"
                  style={{ width: animateStats ? `${summaryData.packagingPercentage}%` : '0%' }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Food Emissions</p>
                  <h3 className={`text-2xl font-bold text-gray-800 transition-all duration-1000 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    {safeToFixed(summaryData.foodEmission)} kg CO₂
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {safeToFixed(summaryData.foodPercentage, 1)}% of total
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FiCoffee className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-1500 ease-out"
                  style={{ width: animateStats ? `${summaryData.foodPercentage}%` : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Orders & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FiList className="mr-2" /> Recent Orders
                </h2>
                <Link to="/orders" className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
                  View All <FiArrowRight className="ml-1" />
                </Link>
              </div>
              
              {safeRecentOrders.length > 0 ? (
                <div className="overflow-x-auto -mx-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Restaurant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Emissions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {safeRecentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-medium">
                                  {order.restaurantName?.charAt(0) || 'R'}
                                </span>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{order.restaurantName}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  <span className={`px-1.5 py-0.5 rounded-full ${
                                    order.platform === 'Zomato' 
                                      ? 'bg-red-50 text-red-600' 
                                      : 'bg-orange-50 text-orange-600'
                                  }`}>
                                    {order.platform || 'Unknown'}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiCalendar className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">{formatDate(order.orderDate)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                              {order.items?.length || 0} items
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                                (order.emissionData?.totalEmission || 0) > avgEmissionPerOrder 
                                  ? 'bg-red-400' 
                                  : 'bg-green-400'
                              }`}></span>
                              <span className="text-sm font-medium text-gray-900">
                                {order.emissionData ? safeToFixed(order.emissionData.totalEmission) : '0.00'} kg CO₂
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Add your first order to start tracking your carbon footprint from food deliveries.
                  </p>
                  <Link
                    to="/orders/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <FiPlus className="mr-2" /> Add Your First Order
                  </Link>
                  </div>
              )}
            </div>
          </div>
          
          {/* Stats and Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Average Emissions Card */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-green-500" /> 
                Emissions Insights
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Average per order:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {safeToFixed(avgEmissionPerOrder)} kg CO₂
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Highest source:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {summaryData.transportPercentage > summaryData.foodPercentage && 
                     summaryData.transportPercentage > summaryData.packagingPercentage
                      ? 'Transport'
                      : summaryData.foodPercentage > summaryData.packagingPercentage
                        ? 'Food'
                        : 'Packaging'
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total orders:</span>
                  <span className="text-sm font-medium text-gray-900">{totalOrders}</span>
                </div>
                
                <div className="pt-2">
                  <div className="text-xs text-gray-500 mb-1 flex justify-between">
                    <span>Carbon reduction potential:</span>
                    <span className="font-medium text-green-600">25%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Based on your ordering patterns, you could reduce emissions by up to 25% with small changes.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-3">
              <Link
                to="/orders/new"
                className="block bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 transform hover:-translate-y-1"
              >
                <div className="flex items-center">
                  <div className="bg-white/30 p-3 rounded-lg mr-4 flex items-center justify-center shadow-sm">
                    <FiPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Add New Order</h3>
                    <p className="text-green-100 text-sm">Track your food delivery impact</p>
                  </div>
                </div>
              </Link>
              
              <Link
                to="/insights"
                className="block bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 transform hover:-translate-y-1"
              >
                <div className="flex items-center">
                  <div className="bg-white/30 p-3 rounded-lg mr-4 flex items-center justify-center shadow-sm">
                    <FiBarChart2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">View Insights</h3>
                    <p className="text-blue-100 text-sm">Analyze your carbon footprint</p>
                  </div>
                </div>
              </Link>
              
              <Link
                to="/suggestions"
                className="block bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 transform hover:-translate-y-1"
              >
                <div className="flex items-center">
                  <div className="bg-white/30 p-3 rounded-lg mr-4 flex items-center justify-center shadow-sm">
                    <FiList className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Get Suggestions</h3>
                    <p className="text-amber-100 text-sm">Tips to reduce your impact</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Carbon Reduction Tips</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                    <FiTruck className="text-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">Order from nearby restaurants</h3>
                    <p className="text-sm text-green-700">
                      Shorter delivery distances mean lower transport emissions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                    <FiPackage className="text-blue-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">Opt out of disposable utensils</h3>
                    <p className="text-sm text-blue-700">
                      Using your own cutlery reduces packaging waste and emissions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-3 mt-1">
                    <FiCoffee className="text-amber-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-800 mb-1">Choose plant-based options</h3>
                    <p className="text-sm text-amber-700">
                      Plant-based meals typically have a lower carbon footprint.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showImportModal && <ImportModal />}
      </div>
    </div>
  );
};

export default Dashboard;


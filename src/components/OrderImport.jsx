import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { orders } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiUploadCloud, 
  FiInfo, 
  FiCheck, 
  FiAlertTriangle, 
  FiClock, 
  FiClipboard, 
  FiX, 
  FiChevronDown, 
  FiChevronUp,
  FiZap,
  FiFileText
} from 'react-icons/fi';

const OrderImport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [ordersData, setOrdersData] = useState('');
  const [platform, setPlatform] = useState('');
  const [zomatoInstructions, setZomatoInstructions] = useState([
    "Go to Zomato.com and log in to your account",
    "Open the Network tab in your browser's Developer Tools (F12 or Right-click > Inspect)",
    "Navigate to your Orders page on Zomato",
    "In the Network tab, look for a request to 'webroutes/user/orders'",
    "Click on it and go to the Response tab",
    "Copy the entire JSON response and paste it below"
  ]);
  const [swiggyInstructions, setSwiggyInstructions] = useState([
    "Go to Swiggy.com and log in to your account",
    "Open the Network tab in your browser's Developer Tools (F12 or Right-click > Inspect)",
    "Navigate to your Orders page on Swiggy",
    "In the Network tab, look for a request to 'dapi/order/all'",
    "Click on it and go to the Response tab",
    "Copy the entire JSON response and paste it below"
  ]);
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch orders from the database
  const { data: importedOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await orders.getAll();
      return response.data;
    },
    enabled: false, // Don't fetch automatically
    onError: (error) => {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders: ' + (error.response?.data?.message || error.message));
    }
  });

  const { mutate: checkZomatoLogin } = useMutation({
    mutationFn: async () => {
      const response = await orders.checkZomatoLogin();
      return response.data;
    },
    onSuccess: (data) => {
      if (data.isLoggedIn) {
        handleAutomaticImport();
      } else {
        setShowManualInput(true);
        setShowInstructions(true);
      }
    },
    onError: (error) => {
      console.error('Error checking Zomato login:', error);
      toast.error('Failed to check Zomato login status');
    }
  });

  const { mutate: fetchZomatoOrders } = useMutation({
    mutationFn: async () => {
      const response = await orders.fetchZomatoOrders();
      return response.data;
    },
    onSuccess: (data) => {
      setOrdersData(JSON.stringify(data, null, 2));
      setShowManualInput(true);
      setShowInstructions(true);
    },
    onError: (error) => {
      console.error('Error fetching Zomato orders:', error);
      toast.error('Failed to fetch Zomato orders');
    }
  });

  const { mutate: importOrders } = useMutation({
    mutationFn: async (ordersData) => {
      const response = await orders.importOrders(ordersData);
      return response.data;
    },
    onSuccess: (data) => {
      setSuccess(`Successfully imported ${data.importedCount} orders!`);
      setShowManualInput(false);
      setShowInstructions(false);
      setOrdersData('');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['recentOrders'] });
    },
    onError: (error) => {
      console.error('Error importing orders:', error);
      setError(error.response?.data?.message || 'Failed to import orders');
    }
  });

  // Swiggy mutations
  const { mutate: checkSwiggyLogin } = useMutation({
    mutationFn: async () => {
      const response = await orders.checkSwiggyLogin();
      return response.data;
    },
    onSuccess: (data) => {
      if (data.isLoggedIn) {
        handleAutomaticSwiggyImport();
      } else {
        setPlatform('swiggy');
        setShowManualInput(true);
        setShowInstructions(true);
      }
    },
    onError: (error) => {
      console.error('Error checking Swiggy login:', error);
      toast.error('Failed to check Swiggy login status');
    }
  });

  const { mutate: fetchSwiggyOrders } = useMutation({
    mutationFn: async () => {
      const response = await orders.fetchSwiggyOrders();
      return response.data;
    },
    onSuccess: (data) => {
      setOrdersData(JSON.stringify(data, null, 2));
      setPlatform('swiggy');
      setShowManualInput(true);
      setShowInstructions(true);
    },
    onError: (error) => {
      console.error('Error fetching Swiggy orders:', error);
      toast.error('Failed to fetch Swiggy orders');
    }
  });

  const { mutate: importSwiggyOrders } = useMutation({
    mutationFn: async (ordersData) => {
      const response = await orders.importSwiggyOrders(ordersData);
      return response.data;
    },
    onSuccess: (data) => {
      setSuccess(`Successfully imported ${data.importedCount} Swiggy orders!`);
      setShowManualInput(false);
      setShowInstructions(false);
      setOrdersData('');
      setPlatform('');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['recentOrders'] });
    },
    onError: (error) => {
      console.error('Error importing Swiggy orders:', error);
      setError(error.response?.data?.message || 'Failed to import Swiggy orders');
    }
  });

  // Handle automatic import (if user is logged in to Zomato)
  const handleAutomaticImport = () => {
    fetchZomatoOrders();
  };

  // Handle automatic Swiggy import
  const handleAutomaticSwiggyImport = () => {
    fetchSwiggyOrders();
  };

  // Handle Zomato import
  const handleZomatoImport = async () => {
    try {
      setError('');
      setSuccess('');
      setPlatform('zomato');
      checkZomatoLogin();
    } catch (error) {
      setError(error.message || 'Failed to import orders');
      toast.error(error.message || 'Failed to import orders');
    }
  };

  // Helper to explicitly set platform before opening manual input
  const setActiveImportPlatform = (platformName) => {
    setPlatform(platformName);
    setShowManualInput(true);
    setShowInstructions(true);
  };

  // Handle Swiggy import - updated to explicitly set platform first
  const handleSwiggyImport = async () => {
    try {
      // First reset any existing state
      setOrdersData('');
      setError('');
      setSuccess('');
      
      // Explicitly set platform to Swiggy before anything else
      setActiveImportPlatform('swiggy');
      
      // Now check login
      checkSwiggyLogin();
    } catch (error) {
      setError(error.message || 'Failed to import Swiggy orders');
      toast.error(error.message || 'Failed to import Swiggy orders');
    }
  };

  // Handle manual import
  const handleManualImport = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      if (!ordersData.trim()) {
        setError(`Please paste your ${platform === 'swiggy' ? 'Swiggy' : 'Zomato'} orders data`);
        setIsLoading(false);
        return;
      }
      
      let parsedData;
      
      try {
        parsedData = JSON.parse(ordersData);
      } catch (parseError) {
        setError('Invalid JSON format. Please make sure you copied the entire response correctly.');
        toast.error('Invalid JSON format. Please check your data and try again.');
        setIsLoading(false);
        return;
      }

      if (platform === 'swiggy') {
        // Handle Swiggy data
        await importSwiggyOrders(parsedData);
      } else {
        // Extract orders from the Zomato data structure
        let orders = [];
        
        // Try different possible structures
        if (parsedData.entities && parsedData.entities.ORDER) {
          orders = Object.values(parsedData.entities.ORDER);
        } else if (Array.isArray(parsedData)) {
          orders = parsedData;
        } else if (parsedData.data && Array.isArray(parsedData.data)) {
          orders = parsedData.data;
        } else if (typeof parsedData === 'object') {
          for (const key in parsedData) {
            if (Array.isArray(parsedData[key]) && parsedData[key].length > 0) {
              const firstItem = parsedData[key][0];
              if (firstItem && (
                firstItem.orderId || 
                firstItem.order_id || 
                firstItem.restaurantName || 
                firstItem.restaurant_name
              )) {
                orders = parsedData[key];
                break;
              }
            }
          }
        }

        if (orders.length === 0) {
          setError('No orders found in the provided data. Please make sure you copied the correct response from Zomato.');
          toast.error('No orders found in the data. Please check the instructions and try again.');
          setIsLoading(false);
          return;
        }

        await importOrders(orders);
      }
      
    } catch (error) {
      setError('Error processing your data. Please make sure you followed the instructions correctly.');
      toast.error('Error processing your data. Please check the instructions and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-300 rounded-full opacity-10 -ml-10 -mb-10"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-xl bg-green-500 text-white flex items-center justify-center mr-4 shadow-lg">
              <FiUploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Import Your Orders</h2>
              <p className="text-green-600 mt-1 font-medium">Calculate your food delivery carbon footprint</p>
            </div>
          </div>
          
          {(success || error) && (
            <div className="flex-shrink-0 animate-fadeIn">
              {success && (
                <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg flex items-center text-sm border border-green-200 shadow-sm">
                  <FiCheck className="mr-2 flex-shrink-0 text-green-500" />
                  <span>{success}</span>
                </div>
              )}
              
              {error && (
                <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg flex items-center text-sm border border-red-200 shadow-sm">
                  <FiAlertTriangle className="mr-2 flex-shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zomato Card */}
          <div className={`rounded-xl overflow-hidden transition-all duration-300 ${showManualInput ? 'col-span-2' : ''}`}>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center">
                  {platform === 'swiggy' ? (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center mr-4 shadow-sm">
                      <img src="https://logos-marcas.com/wp-content/uploads/2020/11/Swiggy-Simbolo.png" alt="Swiggy" className="h-6 w-auto object-contain" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mr-4 shadow-sm">
                      <img src="https://b.zmtcdn.com/images/logo/zomato_logo_2017.png" alt="Zomato" className="h-6 w-auto object-contain" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{platform === 'swiggy' ? 'Swiggy' : 'Zomato'} Orders</h3>
                    <p className="text-sm text-gray-500">Import your order history from {platform === 'swiggy' ? 'Swiggy' : 'Zomato'}</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-5 ${showManualInput ? 'bg-gray-50' : 'bg-white'}`}>
                {showInstructions && (
                  <div className="mb-6 animate-fadeIn">
                    <div 
                      className={`bg-gradient-to-r ${platform === 'swiggy' ? 'from-orange-50 to-yellow-50 border-l-4 border-orange-500' : 'from-green-50 to-emerald-50 border-l-4 border-green-500'} p-4 rounded-lg`}
                      style={{boxShadow: '0 4px 6px -1px rgba(0, 128, 0, 0.05), 0 2px 4px -1px rgba(0, 128, 0, 0.06)'}}
                    >
                      <div className="flex items-start">
                        <FiInfo className={`h-5 w-5 ${platform === 'swiggy' ? 'text-orange-600' : 'text-green-600'} mt-0.5 mr-3 flex-shrink-0`} />
                        <div>
                          <p className={`font-medium ${platform === 'swiggy' ? 'text-orange-800' : 'text-green-800'} mb-3`}>
                            How to import your {platform === 'swiggy' ? 'Swiggy' : 'Zomato'} orders:
                          </p>
                          <ol className={`space-y-3 ${platform === 'swiggy' ? 'text-orange-700' : 'text-green-700'} text-sm`}>
                            {(platform === 'swiggy' ? swiggyInstructions : zomatoInstructions).map((instruction, index) => (
                              <li key={index} className="flex items-start">
                                <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${platform === 'swiggy' ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'} text-xs font-bold mr-3 flex-shrink-0`}>
                                  {index + 1}
                                </span>
                                <span className="pt-0.5">{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                
                {showManualInput ? (
                  <div className="animate-fadeIn">
                    <div className="mb-5">
                      <label htmlFor="ordersData" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiFileText className={`mr-2 flex-shrink-0 ${platform === 'swiggy' ? 'text-orange-600' : 'text-green-600'}`} />
                        <span>Paste your {platform === 'swiggy' ? 'Swiggy' : 'Zomato'} orders data:</span>
                      </label>
                      <div className="relative">
                        <textarea
                          id="ordersData"
                          rows={8}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                            platform === 'swiggy' 
                              ? 'focus:ring-orange-500 focus:border-orange-500' 
                              : 'focus:ring-green-500 focus:border-green-500'
                          } font-mono text-sm resize-y bg-white`}
                          placeholder={`Paste the JSON data from ${platform === 'swiggy' ? 'Swiggy' : 'Zomato'} here...`}
                          value={ordersData}
                          onChange={(e) => setOrdersData(e.target.value)}
                          style={{ minHeight: "180px" }}
                        />
                        {ordersData && (
                          <button 
                            onClick={() => setOrdersData('')}
                            className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Platform selection */}
                    <div className="mb-4 flex justify-center gap-3">
                      <button
                        onClick={() => setActiveImportPlatform('zomato')}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          platform === 'zomato' 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <img 
                          src="https://b.zmtcdn.com/images/logo/zomato_logo_2017.png" 
                          alt="Zomato" 
                          className="h-4 w-auto mr-2" 
                        />
                        Zomato
                      </button>
                      <button
                        onClick={() => setActiveImportPlatform('swiggy')}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          platform === 'swiggy' 
                            ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <img 
                          src="https://logos-marcas.com/wp-content/uploads/2020/11/Swiggy-Simbolo.png" 
                          alt="Swiggy" 
                          className="h-4 w-auto mr-2" 
                        />
                        Swiggy
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleManualImport}
                        disabled={isLoading}
                        className={`${
                          platform === 'swiggy'
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        } text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Importing...</span>
                          </>
                        ) : (
                          <>
                            <FiZap className="mr-2 flex-shrink-0" /> <span>Import Now</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowManualInput(false);
                          setShowInstructions(false);
                          setOrdersData('');
                        }}
                        disabled={isLoading}
                        className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                      >
                        <FiX className="mr-2 flex-shrink-0" /> <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleZomatoImport}
                    disabled={isLoading}
                    className="w-full bg-[#CB202D] hover:bg-[#B51C28] text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <FiUploadCloud className="mr-3 flex-shrink-0 h-5 w-5" /> 
                        <span>Import Zomato Orders</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Swiggy Card - Only show if manual input is not active */}
          {!showManualInput && (
            <div className="rounded-xl overflow-hidden">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center mr-4 shadow-sm">
                      <img src="https://logos-marcas.com/wp-content/uploads/2020/11/Swiggy-Simbolo.png" alt="Swiggy" className="h-6 w-auto object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Swiggy Orders</h3>
                      <p className="text-sm text-gray-500">Import your order history from Swiggy</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-center items-center h-full">
                <button
  onClick={handleSwiggyImport}
  disabled={isLoading}
  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
>

                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <FiUploadCloud className="mr-3 flex-shrink-0 h-5 w-5" /> 
                        <span>Import Swiggy Orders</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Imported Orders Summary */}
        {importedOrders?.length > 0 && (
          <div className="mt-6 animate-fadeIn">
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <FiCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Imported Orders</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    You have successfully imported {importedOrders.length} orders for carbon footprint analysis.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-3">
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-green-100 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FiFileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total Orders</div>
                    <div className="text-lg font-bold text-gray-800">{importedOrders.length}</div>
                  </div>
                </div>
                
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-green-100">
                  <span className="text-sm font-medium text-green-600">Ready for Analysis</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderImport;
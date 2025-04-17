import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { orders } from '../services/api';
import { FiPlus, FiTrash2, FiEye, FiX, FiShoppingBag, FiCalendar, FiDollarSign, FiTruck, FiPackage, FiCoffee, FiInfo, FiList, FiBarChart2  } from 'react-icons/fi';
import AIRecommendations from '../components/AIRecommendations';
import OrderAIRecommendations from '../components/OrderAIRecommendations';

const Orders = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    restaurantName: '',
    date: new Date().toISOString().split('T')[0],
    foodItems: [{ name: '', quantity: 1, category: 'veg' }],
    distance: '',
    price: '',
    platform: 'Swiggy'
  });

  const queryClient = useQueryClient();

  const { data: ordersList, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orders.getAll().then(res => {
      console.log('[DEBUG] Fetched orders data:', res.data);
      return res.data;
    })
  });

  const createOrderMutation = useMutation({
    mutationFn: orders.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Order added successfully');
      setShowForm(false);
      setFormData({
        restaurantName: '',
        date: new Date().toISOString().split('T')[0],
        foodItems: [{ name: '', quantity: 1, category: 'veg' }],
        distance: '',
        price: '',
        platform: 'Swiggy'
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add order');
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: orders.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Order deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFoodItemChange = (index, field, value) => {
    const updatedItems = [...formData.foodItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({ ...prev, foodItems: updatedItems }));
  };

  const addFoodItem = () => {
    setFormData(prev => ({
      ...prev,
      foodItems: [...prev.foodItems, { name: '', quantity: 1, category: 'veg' }]
    }));
  };

  const removeFoodItem = (index) => {
    setFormData(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createOrderMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrderMutation.mutate(id);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

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

  // Calculate total emission for display
  const getTotalEmission = (order) => {
    if (order.emissionData && order.emissionData.totalEmission) {
      return order.emissionData.totalEmission.toFixed(2);
    }
    return '0.00';
  };

  // Get emission breakdown for display
  const getEmissionBreakdown = (order) => {
    if (!order.emissionData) {
      return null;
    }
    
    return {
      transport: order.emissionData.transportEmission?.toFixed(2) || '0.00',
      packaging: order.emissionData.packagingEmission?.toFixed(2) || '0.00',
      food: order.emissionData.foodEmission?.toFixed(2) || '0.00',
      total: order.emissionData.totalEmission?.toFixed(2) || '0.00'
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-gray-50 to-green-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-green-500 text-sm font-medium">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
            <p className="text-gray-600">Track and manage your food delivery orders</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`mt-4 md:mt-0 px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 ${
              showForm 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-md hover:shadow-lg'
            }`}
          >
            {showForm ? (
              <>
                <FiX className="mr-2" /> Cancel
              </>
            ) : (
              <>
                <FiPlus className="mr-2" /> Add New Order
              </>
            )}
          </button>
        </div>

        {/* AI Recommendations */}
        {ordersList && ordersList.length > 0 && (
          <div className="mb-8">
            <AIRecommendations />
          </div>
        )}

        {/* Add Order Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
              <FiShoppingBag className="mr-2 text-green-500" /> Add New Order
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="e.g. Spice Garden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="e.g. 3.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="e.g. 450.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Swiggy">Swiggy</option>
                    <option value="Zomato">Zomato</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Items
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                  {formData.foodItems.map((item, index) => (
                    <div key={index} className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-500 mb-1 block">Item Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                          placeholder="e.g. Butter Chicken"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleFoodItemChange(index, 'quantity', parseInt(e.target.value))}
                          min="1"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                        />
                      </div>
                      <div className="w-40">
                        <label className="text-xs text-gray-500 mb-1 block">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => handleFoodItemChange(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                        >
                          <option value="veg">Vegetarian</option>
                          <option value="non-veg">Non-Vegetarian</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeFoodItem(index)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          disabled={formData.foodItems.length <= 1}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addFoodItem}
                  className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                >
                  <FiPlus className="mr-2" /> Add Another Item
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={createOrderMutation.isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors shadow-md flex items-center"
                >
                  {createOrderMutation.isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2" /> Add Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiShoppingBag className="mr-2 text-green-500" /> Order History
            </h2>
            <p className="text-gray-600 mt-1">
              {ordersList?.length || 0} orders found
            </p>
          </div>
          
          {ordersList?.length > 0 ? (
            <div className="overflow-x-auto">
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
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ordersList.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {order.restaurantImage ? (
                            <img 
                              src={order.restaurantImage} 
                              alt={order.restaurantName} 
                              className="h-10 w-10 rounded-full mr-3 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <span className="text-green-600 font-medium">
                                {order.restaurantName?.charAt(0) || 'R'}
                              </span>
                            </div>
                          )}
                                                    <div>
                            <div className="font-medium text-gray-900">{order.restaurantName}</div>
                            {order.restaurantRating && (
                              <div className="text-xs text-gray-500">
                                Rating: {order.restaurantRating.aggregateRating} ({order.restaurantRating.ratingText})
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiCalendar className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{formatDate(order.orderDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.platform === 'Zomato' 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-orange-50 text-orange-700'
                        }`}>
                          {order.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pr-2">
                          {order.items && order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-700 mb-1 flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                item.category === 'veg' ? 'bg-green-500' : 'bg-red-500'
                              }`}></span>
                              <span>{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* <FiDollarSign className="text-gray-400 mr-1" /> */}
                          <span className="text-sm font-medium text-gray-900">
                            ₹{order.orderAmount?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                            parseFloat(getTotalEmission(order)) > 2.0 
                              ? 'bg-red-400' 
                              : parseFloat(getTotalEmission(order)) > 1.0
                                ? 'bg-yellow-400'
                                : 'bg-green-400'
                          }`}></span>
                          <span className="text-sm font-medium text-gray-900">
                            {getTotalEmission(order)} kg CO₂
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            aria-label="View order details"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            aria-label="Delete order"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add your first order to start tracking your carbon footprint from food deliveries.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <FiPlus className="mr-2" /> Add Your First Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button
                onClick={closeOrderDetails}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close details"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <FiShoppingBag className="mr-2 text-green-500" /> Restaurant
                </h3>
                <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-xl">
                  {selectedOrder.restaurantImage ? (
                    <img 
                      src={selectedOrder.restaurantImage} 
                      alt={selectedOrder.restaurantName} 
                      className="h-16 w-16 rounded-full mr-4 object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mr-4 shadow-sm">
                      <span className="text-green-600 text-xl font-medium">
                        {selectedOrder.restaurantName?.charAt(0) || 'R'}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-xl text-gray-900">{selectedOrder.restaurantName}</div>
                    {selectedOrder.restaurantRating && (
                      <div className="text-sm text-gray-600 flex items-center mt-1">
                        <span className="flex items-center">
                          {[...Array(Math.round(selectedOrder.restaurantRating.aggregateRating))].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </span>
                        <span className="ml-1">({selectedOrder.restaurantRating.aggregateRating})</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedOrder.deliveryAddress && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Delivery Address</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {selectedOrder.deliveryAddress}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <FiInfo className="mr-2 text-blue-500" /> Order Information
                </h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span> 
                    <span className="font-medium text-gray-900">{selectedOrder.orderId || selectedOrder._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span> 
                    <span className="font-medium text-gray-900">{formatDate(selectedOrder.orderDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span> 
                    <span className={`font-medium ${
                      selectedOrder.platform === 'Zomato' ? 'text-red-600' : 'text-orange-600'
                    }`}>{selectedOrder.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span> 
                    <span className="font-medium text-green-600">{selectedOrder.orderStatus || 'Delivered'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span> 
                    <span className="font-medium text-gray-900">₹{selectedOrder.orderAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span> 
                    <span className="font-medium text-gray-900">{selectedOrder.distance || '0'} km</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <FiList className="mr-2 text-amber-500" /> Items
              </h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.category === 'veg' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.price ? `₹${item.price.toFixed(2)}` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {selectedOrder.emissionData && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <FiBarChart2 className="mr-2 text-green-500" /> Carbon Footprint
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-200 p-2 rounded-full mr-3">
                        <FiTruck className="text-blue-600 h-5 w-5" />
                      </div>
                      <h4 className="font-medium text-blue-800">Transport Emissions</h4>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">
                      {selectedOrder.emissionData.transportEmission?.toFixed(2) || '0.00'} <span className="text-sm font-normal">kg CO₂</span>
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200">
                    <div className="flex items-center mb-2">
                      <div className="bg-amber-200 p-2 rounded-full mr-3">
                        <FiPackage className="text-amber-600 h-5 w-5" />
                      </div>
                      <h4 className="font-medium text-amber-800">Packaging Emissions</h4>
                    </div>
                    <p className="text-3xl font-bold text-amber-700">
                      {selectedOrder.emissionData.packagingEmission?.toFixed(2) || '0.00'} <span className="text-sm font-normal">kg CO₂</span>
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-200 p-2 rounded-full mr-3">
                        <FiCoffee className="text-green-600 h-5 w-5" />
                      </div>
                      <h4 className="font-medium text-green-800">Food Emissions</h4>
                    </div>
                    <p className="text-3xl font-bold text-green-700">
                      {selectedOrder.emissionData.foodEmission?.toFixed(2) || '0.00'} <span className="text-sm font-normal">kg CO₂</span>
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-200 p-2 rounded-full mr-3">
                        <FiBarChart2 className="text-purple-600 h-5 w-5" />
                      </div>
                      <h4 className="font-medium text-purple-800">Total Emissions</h4>
                    </div>
                    <p className="text-3xl font-bold text-purple-700">
                      {selectedOrder.emissionData.totalEmission?.toFixed(2) || '0.00'} <span className="text-sm font-normal">kg CO₂</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* AI-powered recommendations for this order */}
            {selectedOrder._id && (
              <div className="mt-8">
                <OrderAIRecommendations orderId={selectedOrder._id} />
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={closeOrderDetails}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

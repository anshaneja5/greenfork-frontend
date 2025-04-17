import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { insights } from '../services/api';
import html2canvas from 'html2canvas-pro';
import { useEffect } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Insights = () => {
  // Add useEffect for viewport settings
  useEffect(() => {
    // Prevent viewport scaling and zooming on mobile
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewportMeta);

    return () => {
      document.head.removeChild(viewportMeta);
    };
  }, []);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: () => insights.getSummary().then(res => res.data)
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['trends'],
    queryFn: () => insights.getTrends().then(res => res.data)
  });

  const { data: platformComparison, isLoading: platformLoading } = useQuery({
    queryKey: ['platformComparison'],
    queryFn: () => insights.getPlatformComparison().then(res => res.data)
  });

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['suggestions'],
    queryFn: () => insights.getSuggestions().then(res => res.data)
  });

  // Mock data for food categories (in a real app, this would come from the backend)
  const foodCategories = {
    'Vegetarian': summary?.foodEmission ? summary.foodEmission * 0.4 : 0,
    'Non-Vegetarian': summary?.foodEmission ? summary.foodEmission * 0.6 : 0
  };

  // Mock data for global comparison (in a real app, this would come from the backend)
  const globalComparison = {
    userAverage: summary?.averageEmissionPerOrder || 0,
    globalAverage: 2.8, // Average global food delivery emission per order
    difference: summary?.averageEmissionPerOrder ? 
      ((summary.averageEmissionPerOrder - 2.8) / 2.8 * 100).toFixed(1) : 0
  };

  // Mock data for detailed food categories (in a real app, this would come from the backend)
  const detailedFoodCategories = {
    'Vegetarian': {
      'Indian': summary?.foodEmission ? summary.foodEmission * 0.25 : 0,
      'Chinese': summary?.foodEmission ? summary.foodEmission * 0.15 : 0,
      'Italian': summary?.foodEmission ? summary.foodEmission * 0.10 : 0,
      'Other': summary?.foodEmission ? summary.foodEmission * 0.05 : 0,
    },
    'Non-Vegetarian': {
      'Chicken': summary?.foodEmission ? summary.foodEmission * 0.20 : 0,
      'Fish': summary?.foodEmission ? summary.foodEmission * 0.15 : 0,
      'Red Meat': summary?.foodEmission ? summary.foodEmission * 0.10 : 0,
      'Other': summary?.foodEmission ? summary.foodEmission * 0.05 : 0,
    }
  };

  // Mock data for seasonal impact (in a real app, this would come from the backend)
  const seasonalImpact = {
    'Summer': summary?.totalEmission ? summary.totalEmission * 0.35 : 0,
    'Monsoon': summary?.totalEmission ? summary.totalEmission * 0.25 : 0,
    'Winter': summary?.totalEmission ? summary.totalEmission * 0.40 : 0,
  };

  // Mock data for cost savings (in a real app, this would come from the backend)
  const calculateCostSavings = () => {
    if (!summary || !summary.totalEmission) return null;
    
    // Average cost per kg of CO2 offset
    const costPerKgCO2 = 0.5; // $0.50 per kg CO2
    const totalSavings = summary.totalEmission * costPerKgCO2;
    
    // Potential savings with different strategies
    const potentialSavings = {
      'Switch to Vegetarian': totalSavings * 0.3,
      'Order from Nearby': totalSavings * 0.2,
      'Reduce Packaging': totalSavings * 0.1,
      'Seasonal Choices': totalSavings * 0.15,
    };
    
    return {
      currentSavings: totalSavings,
      potentialSavings
    };
  };

  const costSavings = calculateCostSavings();

  // Mock data for environmental goals (in a real app, this would come from the backend)
  const environmentalGoals = {
    'Monthly Reduction': {
      target: 2.0, // kg CO2
      current: summary?.averageEmissionPerOrder ? summary.averageEmissionPerOrder * 0.8 : 0,
      progress: summary?.averageEmissionPerOrder ? 
        ((summary.averageEmissionPerOrder * 0.8) / 2.0 * 100).toFixed(1) : 0
    },
    'Annual Reduction': {
      target: 24.0, // kg CO2
      current: summary?.totalEmission ? summary.totalEmission * 0.8 : 0,
      progress: summary?.totalEmission ? 
        ((summary.totalEmission * 0.8) / 24.0 * 100).toFixed(1) : 0
    }
  };

  // Calculate Green Card score (in a real app, this would come from the backend)
  const calculateGreenScore = () => {
    if (!summary) return null;
    
    // Base score starts at 100
    let score = 100;
    
    // Deduct points based on average emission per order
    if (summary.averageEmissionPerOrder > 3.0) {
      score -= 30;
    } else if (summary.averageEmissionPerOrder > 2.0) {
      score -= 20;
    } else if (summary.averageEmissionPerOrder > 1.0) {
      score -= 10;
    }
    
    // Add points for vegetarian orders
    const vegetarianPercentage = summary.foodEmission ? 
      (detailedFoodCategories.Vegetarian.Indian + 
       detailedFoodCategories.Vegetarian.Chinese + 
       detailedFoodCategories.Vegetarian.Italian + 
       detailedFoodCategories.Vegetarian.Other) / summary.foodEmission * 100 : 0;
    
    if (vegetarianPercentage > 70) {
      score += 20;
    } else if (vegetarianPercentage > 50) {
      score += 15;
    } else if (vegetarianPercentage > 30) {
      score += 10;
    }
    
    // Add points for nearby orders (assuming transportEmission is lower for nearby orders)
    const transportPercentage = summary.transportEmission / summary.totalEmission * 100;
    if (transportPercentage < 20) {
      score += 15;
    } else if (transportPercentage < 30) {
      score += 10;
    } else if (transportPercentage < 40) {
      score += 5;
    }
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  };

  const greenScore = calculateGreenScore();
  
  // Get badge based on score
  const getBadge = (score) => {
    if (score >= 90) return { name: 'Eco Warrior', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 80) return { name: 'Green Champion', color: 'text-green-500', bgColor: 'bg-green-50' };
    if (score >= 70) return { name: 'Eco Friendly', color: 'text-teal-600', bgColor: 'bg-teal-100' };
    if (score >= 60) return { name: 'Green Explorer', color: 'text-teal-500', bgColor: 'bg-teal-50' };
    if (score >= 50) return { name: 'Eco Learner', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { name: 'Eco Beginner', color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
  };

  const badge = greenScore ? getBadge(greenScore) : { name: 'Eco Beginner', color: 'text-yellow-500', bgColor: 'bg-yellow-50' };

  // Function to handle downloading the Green Card
  const handleDownloadGreenCard = async () => {
    const element = document.getElementById('green-card');
    const downloadButton = document.getElementById('download-button');
    
    if (!element || !downloadButton) return;
    
    try {
      // Show loading state
      downloadButton.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating...
      `;
      downloadButton.disabled = true;

      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        allowTaint: true, // Allow cross-origin images
        backgroundColor: null, // Transparent background
        logging: false, // Disable logging
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied in the clone
          const clonedElement = clonedDoc.getElementById('green-card');
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.width = `${element.offsetWidth}px`;
            clonedElement.style.height = `${element.offsetHeight}px`;
          }
        }
      });

      // Convert to blob for better quality
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `green-card-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Error generating Green Card image:', error);
      alert('Failed to generate Green Card image. Please try again.');
    } finally {
      // Reset button state
      downloadButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Green Card
      `;
      downloadButton.disabled = false;
    }
  };

  // Function to handle sharing on social media
  const handleShareGreenCard = (platform) => {
    // In a real app, this would share to the specified platform
    alert(`Sharing to ${platform} would be implemented here`);
  };

  if (summaryLoading || trendsLoading || platformLoading || suggestionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate environmental impact comparisons
  const calculateEnvironmentalImpact = () => {
    if (!summary || !summary.totalEmission) return null;
    
    // Average tree absorbs 22kg of CO2 per year
    const treesEquivalent = (summary.totalEmission / 22).toFixed(1);
    
    // Average car emits 4.6 metric tons of CO2 per year
    const carDaysEquivalent = ((summary.totalEmission / 4600) * 365).toFixed(1);
    
    // Average smartphone charging emits 0.05kg CO2 per charge
    const smartphoneChargesEquivalent = Math.round(summary.totalEmission / 0.05);
    
    // Average light bulb (60W) running for 1 hour emits 0.03kg CO2
    const lightBulbHoursEquivalent = Math.round(summary.totalEmission / 0.03);
    
    return {
      treesEquivalent,
      carDaysEquivalent,
      smartphoneChargesEquivalent,
      lightBulbHoursEquivalent
    };
  };

  const environmentalImpact = calculateEnvironmentalImpact();

  const emissionTrendsData = {
    labels: trends?.map(trend => new Date(trend.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Emissions',
        data: trends?.map(trend => trend.totalEmission),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Transport Emissions',
        data: trends?.map(trend => trend.transportEmission),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Packaging Emissions',
        data: trends?.map(trend => trend.packagingEmission),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
      },
      {
        label: 'Food Emissions',
        data: trends?.map(trend => trend.foodEmission),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const emissionSourcesData = {
    labels: ['Transport', 'Packaging', 'Food'],
    datasets: [
      {
        data: [
          summary?.transportEmission,
          summary?.packagingEmission,
          summary?.foodEmission,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const platformData = {
    labels: Object.keys(platformComparison || {}),
    datasets: [
      {
        label: 'Average Emissions per Order',
        data: Object.values(platformComparison || {}).map(
          platform => platform.averageEmission
        ),
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const foodCategoryData = {
    labels: Object.keys(foodCategories),
    datasets: [
      {
        data: Object.values(foodCategories),
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calculate monthly averages for timeline
  const calculateMonthlyAverages = () => {
    if (!trends || trends.length === 0) return null;
    
    const monthlyData = {};
    
    trends.forEach(trend => {
      const date = new Date(trend.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          total: 0,
          count: 0
        };
      }
      
      monthlyData[monthYear].total += trend.totalEmission;
      monthlyData[monthYear].count += 1;
    });
    
    const result = {};
    Object.keys(monthlyData).forEach(key => {
      result[key] = monthlyData[key].total / monthlyData[key].count;
    });
    
    return result;
  };

  const monthlyAverages = calculateMonthlyAverages();
  
  const timelineData = {
    labels: Object.keys(monthlyAverages || {}),
    datasets: [
      {
        label: 'Average Monthly Emissions',
        data: Object.values(monthlyAverages || {}),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3
      }
    ]
  };

  const detailedFoodCategoryData = {
    labels: Object.keys(detailedFoodCategories).flatMap(category => 
      Object.keys(detailedFoodCategories[category]).map(subcategory => `${category} - ${subcategory}`)
    ),
    datasets: [
      {
        data: Object.values(detailedFoodCategories).flatMap(category => 
          Object.values(category)
        ),
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(34, 197, 94, 0.4)',
          'rgba(34, 197, 94, 0.3)',
          'rgba(34, 197, 94, 0.2)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(239, 68, 68, 0.4)',
          'rgba(239, 68, 68, 0.3)',
          'rgba(239, 68, 68, 0.2)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(239, 68, 68)',
          'rgb(239, 68, 68)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const seasonalImpactData = {
    labels: Object.keys(seasonalImpact),
    datasets: [
      {
        label: 'Seasonal Emissions',
        data: Object.values(seasonalImpact),
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(234, 179, 8, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Insights</h1>

      {/* Summary Cards - Adjusted for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="card bg-primary-50 p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-primary-700">Total Orders</h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600">
            {summary?.orderCount}
          </p>
        </div>
        <div className="card bg-green-50 p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-green-700">Average Emission per Order</h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
            {summary?.averageEmissionPerOrder.toFixed(2)} kg CO₂
          </p>
        </div>
        <div className="card bg-blue-50 p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-blue-700">Total Carbon Footprint</h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
            {summary?.totalEmission.toFixed(2)} kg CO₂
          </p>
        </div>
      </div>

      {/* Environmental Impact Section - Adjusted for mobile */}
      {environmentalImpact && (
        <div className="card bg-gray-50 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Environmental Impact</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            Your food delivery carbon footprint is equivalent to:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">{environmentalImpact.treesEquivalent}</h3>
              <p className="text-gray-600 text-center">Trees needed for a year to absorb this CO₂</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">{environmentalImpact.carDaysEquivalent}</h3>
              <p className="text-gray-600 text-center">Days of car emissions</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">{environmentalImpact.smartphoneChargesEquivalent}</h3>
              <p className="text-gray-600 text-center">Smartphone charges</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">{environmentalImpact.lightBulbHoursEquivalent}</h3>
              <p className="text-gray-600 text-center">Hours of light bulb usage</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Comparison Section */}
      <div className="card bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Global Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Carbon Footprint vs Global Average</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Your Average</span>
                <span className="font-bold text-primary-600">{globalComparison.userAverage.toFixed(2)} kg CO₂</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Global Average</span>
                <span className="font-bold text-gray-600">{globalComparison.globalAverage.toFixed(2)} kg CO₂</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className={`h-4 rounded-full ${globalComparison.difference > 0 ? 'bg-red-500' : 'bg-green-500'}`} 
                  style={{ width: `${Math.min(Math.abs(globalComparison.difference) * 5, 100)}%` }}
                ></div>
              </div>
              <p className="text-center font-medium">
                {globalComparison.difference > 0 
                  ? `You're emitting ${globalComparison.difference}% more than the global average` 
                  : `You're emitting ${Math.abs(globalComparison.difference)}% less than the global average`}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Food Category Breakdown</h3>
              <div className="h-64">
                <Pie
                  data={foodCategoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>Vegetarian</span>
                </div>
                <div className="text-center">
                  <div className="inline-block w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span>Non-Vegetarian</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Adjusted for mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="card p-3 sm:p-4 lg:p-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">Emission Trends</h2>
          <div className="h-48 sm:h-64 lg:h-80">
            <Line
              data={emissionTrendsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Emissions (kg CO₂)',
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12
                      }
                    },
                    ticks: {
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12
                      }
                    }
                  },
                  x: {
                    ticks: {
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12
                      }
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="card p-3 sm:p-4 lg:p-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">Emission Sources</h2>
          <div className="h-48 sm:h-64 lg:h-80">
            <Pie
              data={emissionSourcesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Platform Comparison</h2>
          <div className="h-80">
            <Line
              data={platformData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Average Emissions per Order (kg CO₂)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      {monthlyAverages && Object.keys(monthlyAverages).length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Emission Timeline</h2>
          <div className="h-80">
            <Line
              data={timelineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Average Monthly Emissions (kg CO₂)',
                    },
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 text-center text-gray-600">
            <p>Track how your carbon footprint has changed over time</p>
          </div>
        </div>
      )}

      {/* Platform Statistics - Adjusted for mobile */}
      <div className="card p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">Platform Statistics</h2>
        <div className="overflow-x-auto -mx-3 sm:-mx-4">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Emissions
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Average Emission per Order
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(platformComparison || {}).map(([platform, stats]) => (
                  <tr key={platform}>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm">
                      {platform}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm">
                      {stats.orderCount}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm">
                      {stats.totalEmission.toFixed(2)} kg CO₂
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm">
                      {stats.averageEmission.toFixed(2)} kg CO₂
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Carbon Footprint Calculator */}
      <div className="card bg-gradient-to-r from-teal-50 to-cyan-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Carbon Footprint Calculator
          </h2>
          <p className="text-gray-600 mb-6">
            See how different food choices affect your carbon footprint:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Low Carbon Options</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Vegetable curry (0.5 kg CO₂)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Dal and rice (0.7 kg CO₂)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Vegetable biryani (0.9 kg CO₂)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Medium Carbon Options</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>Chicken curry (1.2 kg CO₂)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>Fish curry (1.4 kg CO₂)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>Egg biryani (1.1 kg CO₂)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">High Carbon Options</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Beef curry (2.5 kg CO₂)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Lamb biryani (2.3 kg CO₂)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Pork curry (1.8 kg CO₂)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Green Card Section */}
      {greenScore !== null && (
        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="w-full lg:w-2/3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Your Green Card
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={`${greenScore}, 100`}
                    />
                    <text x="18" y="20.35" className="text-xs font-bold" textAnchor="middle">
                      {greenScore}
                    </text>
                  </svg>
                </div>
                <div>
                  <div className={`inline-block px-3 py-1 rounded-full ${badge.bgColor} ${badge.color} font-medium`}>
                    {badge.name}
                  </div>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    {greenScore >= 80 
                      ? "Outstanding! You're making a significant positive impact on the environment." 
                      : greenScore >= 60 
                        ? "Good job! You're on the right track to reducing your carbon footprint." 
                        : "Keep learning! Every small change helps reduce your carbon footprint."}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/3 flex flex-col items-center">
              <button 
                id="download-button"
                onClick={handleDownloadGreenCard}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-primary-600 text-black rounded-lg hover:bg-primary-700 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Green Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Food Category Breakdown */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Detailed Food Category Breakdown
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Food Category Distribution</h3>
            <div className="h-64 sm:h-80">
              <Pie
                data={detailedFoodCategoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Vegetarian</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Indian</span>
                    <span className="font-medium">{detailedFoodCategories.Vegetarian.Indian.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chinese</span>
                    <span className="font-medium">{detailedFoodCategories.Vegetarian.Chinese.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Italian</span>
                    <span className="font-medium">{detailedFoodCategories.Vegetarian.Italian.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other</span>
                    <span className="font-medium">{detailedFoodCategories.Vegetarian.Other.toFixed(2)} kg CO₂</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Non-Vegetarian</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Chicken</span>
                    <span className="font-medium">{detailedFoodCategories['Non-Vegetarian'].Chicken.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fish</span>
                    <span className="font-medium">{detailedFoodCategories['Non-Vegetarian'].Fish.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Red Meat</span>
                    <span className="font-medium">{detailedFoodCategories['Non-Vegetarian']['Red Meat'].toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other</span>
                    <span className="font-medium">{detailedFoodCategories['Non-Vegetarian'].Other.toFixed(2)} kg CO₂</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Impact Analysis */}
      <div className="card bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Seasonal Impact Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Seasonal Distribution</h3>
              <div className="h-80">
                <Pie
                  data={seasonalImpactData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Seasonal Insights</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Summer (March - June)</h4>
                  <p className="text-gray-600">
                    Higher emissions due to increased use of air conditioning in delivery vehicles and restaurants.
                    Consider ordering during cooler hours.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Monsoon (July - September)</h4>
                  <p className="text-gray-600">
                    Moderate emissions with potential for increased packaging use. Look for restaurants with
                    eco-friendly packaging options.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Winter (October - February)</h4>
                  <p className="text-gray-600">
                    Highest emissions due to heating requirements and longer delivery times. Consider
                    ordering from closer restaurants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Savings Calculator */}
      {costSavings && (
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Cost Savings Calculator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Savings</h3>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary-600">
                    ${costSavings.currentSavings.toFixed(2)}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Current savings from your carbon footprint reduction efforts
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Potential Savings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Switch to Vegetarian</span>
                    <span className="font-medium text-green-600">
                      +${costSavings.potentialSavings['Switch to Vegetarian'].toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Order from Nearby</span>
                    <span className="font-medium text-green-600">
                      +${costSavings.potentialSavings['Order from Nearby'].toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Reduce Packaging</span>
                    <span className="font-medium text-green-600">
                      +${costSavings.potentialSavings['Reduce Packaging'].toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Seasonal Choices</span>
                    <span className="font-medium text-green-600">
                      +${costSavings.potentialSavings['Seasonal Choices'].toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Environmental Impact Goals */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Environmental Impact Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Reduction Goal</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Target: {environmentalGoals['Monthly Reduction'].target} kg CO₂</span>
                    <span>Current: {environmentalGoals['Monthly Reduction'].current.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-primary-600 h-4 rounded-full" 
                      style={{ width: `${environmentalGoals['Monthly Reduction'].progress}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2 text-gray-600">
                    {environmentalGoals['Monthly Reduction'].progress}% of target achieved
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Annual Reduction Goal</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Target: {environmentalGoals['Annual Reduction'].target} kg CO₂</span>
                    <span>Current: {environmentalGoals['Annual Reduction'].current.toFixed(2)} kg CO₂</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-primary-600 h-4 rounded-full" 
                      style={{ width: `${environmentalGoals['Annual Reduction'].progress}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2 text-gray-600">
                    {environmentalGoals['Annual Reduction'].progress}% of target achieved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Personalized Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions?.map((suggestion, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  {suggestion.type === 'food' && (
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  )}
                  {suggestion.type === 'distance' && (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                  {suggestion.type === 'packaging' && (
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800">
                    {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Improvement
                  </h3>
                </div>
                <p className="text-gray-600 mb-3">{suggestion.message}</p>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-700 font-medium">
                    Potential Savings: {suggestion.potentialSavings}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Impact Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Environmental Impact Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Food Choices</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Choose vegetarian options (up to 2.5kg CO₂ saved per meal)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Order seasonal ingredients (reduces transport emissions)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Avoid beef and lamb (highest carbon footprint)</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Delivery Options</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Order from restaurants within 2km (0.13kg CO₂ saved per order)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Choose eco-friendly delivery options when available</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Combine multiple items in a single order</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Packaging</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>Request minimal packaging (0.2kg CO₂ saved per order)</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>Support restaurants using biodegradable packaging</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>Recycle or reuse packaging materials</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights; 
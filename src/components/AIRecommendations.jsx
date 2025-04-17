import { useQuery } from '@tanstack/react-query';
import { insights } from '../services/api';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiCpu, FiAward, FiCheckCircle, FiAlertCircle, FiInfo, FiMessageSquare } from 'react-icons/fi';

const AIRecommendations = () => {
  const [expanded, setExpanded] = useState(true);
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: () => insights.getAIRecommendations().then(res => res.data),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-100 rounded-full"></div>
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 rounded-lg p-4 text-red-700">
        <div className="flex items-center mb-2">
          <FiAlertCircle className="mr-2" />
          <span className="font-medium">Unable to load AI recommendations</span>
        </div>
        <p className="text-sm">Please try again later or contact support if the problem persists.</p>
      </div>
    );
  }

  const { overall, recentOrder, recentOrderRecommendations } = data;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <FiCpu className="text-blue-600 h-5 w-5" />
          </div>
          <h3 className="font-semibold text-gray-800 text-lg">AI-Powered Recommendations</h3>
        </div>
        {expanded ? (
          <FiChevronUp className="text-gray-600 h-5 w-5" />
        ) : (
          <FiChevronDown className="text-gray-600 h-5 w-5" />
        )}
      </div>
      
      {expanded && (
        <div className="p-4 pt-0">
          {/* Overall Recommendations */}
          {overall && (
            <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <FiAward className="text-blue-600 mr-2" />
                Overall Recommendations
              </h4>
              <div className="flex items-start mb-3">
                <FiMessageSquare className="text-blue-500 mr-2 mt-1 shrink-0" />
                <p className="text-gray-700">{overall.message}</p>
              </div>
              {overall.tips && overall.tips.length > 0 && (
                <ul className="space-y-2">
                  {overall.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1 shrink-0">
                        <FiCheckCircle />
                      </span>
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {/* Recent Order Recommendations */}
          {recentOrder && recentOrderRecommendations && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800 flex items-center">
                  <FiInfo className="text-blue-600 mr-2" />
                  Latest Order Recommendations
                </h4>
                <span className="text-sm text-gray-500">
                  {new Date(recentOrder.date).toLocaleDateString()}
                </span>
              </div>
              
              {/* Order Overall Recommendation */}
              {recentOrderRecommendations.overall && (
                <div className="bg-white p-3 rounded-lg shadow-sm mb-3">
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-medium">{recentOrder.restaurantName}:</span> {recentOrderRecommendations.overall.message}
                  </p>
                  
                  {recentOrderRecommendations.overall.tips && recentOrderRecommendations.overall.tips.length > 0 && (
                    <ul className="space-y-1">
                      {recentOrderRecommendations.overall.tips.map((tip, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="text-blue-500 mr-2 mt-0.5 shrink-0">•</span>
                          <span className="text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {/* Item Recommendations */}
              {recentOrderRecommendations.items && recentOrderRecommendations.items.length > 0 && (
                <div className="space-y-3">
                  {recentOrderRecommendations.items.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">{item.itemName}</span>
                        {item.emissionImpact && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.emissionImpact === 'high' 
                              ? 'bg-red-100 text-red-700' 
                              : item.emissionImpact === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.emissionImpact.charAt(0).toUpperCase() + item.emissionImpact.slice(1)} Impact
                          </span>
                        )}
                      </div>
                      
                      {item.tips && item.tips.length > 0 && (
                        <div className="ml-2 mt-2">
                          <ul className="space-y-1 text-sm">
                            {item.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start">
                                <span className="text-blue-500 mr-2 mt-0.5 shrink-0">•</span>
                                <span className="text-gray-600">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.alternatives && item.alternatives.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <span className="text-sm text-gray-500">Try instead: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.alternatives.map((alt, altIndex) => (
                              <span key={altIndex} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                                {alt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="mt-3 text-xs text-right text-gray-500">
            Powered by ChatGPT
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations; 
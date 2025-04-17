import { useQuery } from '@tanstack/react-query';
import { orders } from '../services/api';
import { FiCpu, FiInfo, FiCheckCircle, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';

const OrderAIRecommendations = ({ orderId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['order-recommendations', orderId],
    queryFn: () => orders.getOrderRecommendations(orderId).then(res => res.data),
    enabled: !!orderId, // Only run the query if orderId is provided
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
  
  if (isLoading) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg animate-pulse">
        <div className="h-6 bg-blue-100 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-blue-100 rounded w-full"></div>
          <div className="h-4 bg-blue-100 rounded w-5/6"></div>
          <div className="h-4 bg-blue-100 rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  if (isError || !data) {
    return (
      <div className="bg-red-50 p-3 rounded-lg text-red-700 text-sm">
        <div className="flex items-center mb-1">
          <FiAlertCircle className="mr-2" />
          <span className="font-medium">Unable to load AI recommendations</span>
        </div>
        <p className="ml-6">Please try again later.</p>
      </div>
    );
  }
  
  const { recommendations } = data;
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
        <FiCpu className="mr-2 text-blue-600" />
        AI Recommendations
      </h3>
      
      {/* Overall recommendations */}
      {recommendations.overall && (
        <div className="mb-4 bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-start mb-2">
            <FiMessageSquare className="text-blue-500 mr-2 mt-0.5 shrink-0" />
            <p className="text-gray-700 text-sm">{recommendations.overall.message}</p>
          </div>
          
          {recommendations.overall.tips && recommendations.overall.tips.length > 0 && (
            <ul className="space-y-2 ml-6">
              {recommendations.overall.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5 shrink-0">
                    <FiCheckCircle size={14} />
                  </span>
                  <span className="text-gray-600 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Item-specific recommendations */}
      {recommendations.items && recommendations.items.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <FiInfo className="text-blue-500 mr-1" size={14} />
            Item Recommendations
          </h4>
          <div className="space-y-3">
            {recommendations.items.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700 text-sm">{item.itemName}</span>
                  {item.emissionImpact && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      item.emissionImpact === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : item.emissionImpact === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {item.emissionImpact === 'high' ? (
                        <div className="flex items-center">
                          <FiAlertCircle className="mr-1" size={10} />
                          <span>High Impact</span>
                        </div>
                      ) : item.emissionImpact === 'medium' ? (
                        <div className="flex items-center">
                          <FiInfo className="mr-1" size={10} />
                          <span>Medium Impact</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FiCheckCircle className="mr-1" size={10} />
                          <span>Low Impact</span>
                        </div>
                      )}
                    </span>
                  )}
                </div>
                
                {item.tips && item.tips.length > 0 && (
                  <div className="mt-2">
                    <ul className="space-y-1">
                      {item.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-0.5 text-xs shrink-0">•</span>
                          <span className="text-gray-600 text-xs">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.alternatives && item.alternatives.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Try instead: </span>
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
        </div>
      )}
      
      <div className="mt-2 text-xs text-right text-gray-500">
        Powered by ChatGPT
      </div>
    </div>
  );
};

export default OrderAIRecommendations; 
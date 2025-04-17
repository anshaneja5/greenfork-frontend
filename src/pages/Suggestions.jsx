import { useQuery } from '@tanstack/react-query';
import { insights } from '../services/api';

const Suggestions = () => {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['suggestions'],
    queryFn: () => insights.getSuggestions().then(res => res.data)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Suggestions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions?.map((suggestion, index) => (
          <div key={index} className="card bg-white shadow-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary-700 mb-2">
                {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Improvement
              </h3>
              <p className="text-gray-600 mb-4">{suggestion.message}</p>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-700 font-medium">
                  Potential Savings: {suggestion.potentialSavings}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-primary-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">
            General Tips for Reducing Carbon Footprint
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Order from restaurants closer to your location to reduce transport emissions</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Choose vegetarian options when possible, as they generally have lower carbon emissions</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Combine multiple items in a single order to reduce packaging waste</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Consider using eco-friendly delivery platforms that use electric vehicles</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Support restaurants that use sustainable packaging materials</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Suggestions; 
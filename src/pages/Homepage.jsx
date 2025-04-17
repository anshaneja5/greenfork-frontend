import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const HomePage = () => {
  // For fade-in animations
  const [isVisible, setIsVisible] = useState({
    hero: false,
    problem: false,
    solution: false,
    howItWorks: false,
    features: false,
    whyUs: false,
    testimonials: false,
    cta: false,
    platforms: false, // New section for platform integration
  });

  // Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Sample testimonials data
  const testimonials = [
    {
      name: 'Sarah J.',
      role: 'Regular Food Delivery User',
      text: "CarbonTrack opened my eyes to how my delivery habits affect the environment. I've reduced my footprint by 30% in just two months!",
      image: '/images/testimonial1.jpg',
    },
    {
      name: 'Mark T.',
      role: 'Environmental Enthusiast',
      text: "The detailed breakdown of emissions is exactly what I needed. It's made changing my habits so much easier with actionable insights.",
      image: '/images/testimonial2.jpg',
    },
    {
      name: 'Priya K.',
      role: 'Busy Professional',
      text: "I love how it syncs with my food delivery apps automatically. No manual entry means I actually stick with it!",
      image: '/images/testimonial3.jpg',
    },
  ];

  // Sample feature data
  const features = [
    {
      title: 'Real-time Tracking',
      description: 'Monitor your carbon footprint as you order, with instant emission calculations',
      icon: '📊',
    },
    {
      title: 'Detailed Breakdowns',
      description: 'See emissions from food production, delivery transport, and packaging separately',
      icon: '🔍',
    },
    {
      title: 'Personalized Tips',
      description: 'Get custom recommendations based on your specific ordering patterns',
      icon: '💡',
    },
    {
      title: 'Goal Setting',
      description: 'Set personal reduction targets and track your progress over time',
      icon: '🎯',
    },
    {
      title: 'Impact Visualization',
      description: 'See the environmental impact of your choices with intuitive graphics',
      icon: '🌍',
    },
  ];

  // Steps for How It Works section
  const howItWorksSteps = [
    {
      title: 'Connect',
      description: 'Link your Zomato and Swiggy accounts to automatically import your order history',
      icon: '🔄',
    },
    {
      title: 'Analyze',
      description: 'We calculate the carbon footprint of each order using our proprietary algorithm',
      icon: '📈',
    },
    {
      title: 'Learn',
      description: 'Receive personalized insights about your impact and areas for improvement',
      icon: '🧠',
    },
    {
      title: 'Improve',
      description: 'Make informed choices with our suggestions for eco-friendly alternatives',
      icon: '🌱',
    },
  ];

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section
        id="hero"
        className={`min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-100 p-4 transition-opacity duration-1000 ${
          isVisible.hero ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-emerald-800">
              Track Your Food Delivery's
              <span className="block text-emerald-600">Carbon Footprint</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
              Make sustainable choices without sacrificing convenience. Understand and reduce your environmental impact, one delivery at a time.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full flex items-center">
                <img src="https://b.zmtcdn.com/images/logo/zomato_logo_2017.png" alt="Zomato" className="h-5 w-auto mr-2" />
                Zomato Orders
              </span>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full flex items-center">
                <img src="https://logos-marcas.com/wp-content/uploads/2020/11/Swiggy-Simbolo.png" alt="Swiggy" className="h-5 w-auto mr-2" />
                Swiggy Orders
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl">
                <Link to="/register">Get Started</Link>
              </button>
              <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-3 px-8 rounded-lg transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            {/* This would be your hero illustration */}
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                {/* <span className="text-4xl">🌱🍽️🚚</span> */}
                {/* <p className="text-gray-500 text-center">Hero Illustration: Food delivery with environmental impact visualization</p> */}
                <img src="/hero.png" alt="hero" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section
        id="problem"
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible.problem ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-emerald-800">
            The Hidden Cost of Food Delivery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-emerald-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="text-emerald-600 text-4xl mb-4">🚗</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Transport Emissions</h3>
              <p className="text-gray-600">
                Food delivery vehicles contribute significantly to urban carbon emissions, with an average of 0.5kg CO2 per delivery.
              </p>
            </div>
            <div className="bg-emerald-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="text-emerald-600 text-4xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Packaging Waste</h3>
              <p className="text-gray-600">
                The average food delivery uses 5-7 packaging items, most of which end up in landfills rather than being recycled.
              </p>
            </div>
            <div className="bg-emerald-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="text-emerald-600 text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Growing Trend</h3>
              <p className="text-gray-600">
                Food delivery has increased by 300% since 2019, with the average person ordering 2-3 times per week.
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              The convenience of food delivery comes with environmental costs that most consumers aren't aware of. Each delivery contributes to climate change through emissions, packaging waste, and food sourcing.
            </p>
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section
        id="solution"
        className={`py-20 bg-emerald-50 transition-all duration-1000 ${
          isVisible.solution ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-emerald-800">
            Our Solution
          </h2>
          <p className="text-xl text-center text-gray-700 max-w-3xl mx-auto mb-16">
            CarbonTrack brings transparency to your food delivery habits, helping you make environmentally conscious choices without giving up convenience.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              {/* This would be your solution illustration */}
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  {/* <span className="text-4xl">📱📊🌿</span> */}
                  {/* use the image named dash present in the public folder */}
                  <img src="/dash.png" alt="dashboard" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4 mt-1">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Automatic Import</h3>
                    <p className="text-gray-600">
                      Connect your Zomato and Swiggy accounts to automatically import and analyze your order history with zero effort.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4 mt-1">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Detailed Calculations</h3>
                    <p className="text-gray-600">
                      Our proprietary algorithm calculates the carbon footprint of each order, considering food type, distance, transportation method, and packaging.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4 mt-1">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Personalized Insights</h3>
                    <p className="text-gray-600">
                      Receive tailored suggestions to reduce your carbon footprint based on your specific ordering patterns and preferences.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-full mr-4 mt-1">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Progress Tracking</h3>
                    <p className="text-gray-600">
                      Set reduction goals and track your progress over time with intuitive visualizations and achievement badges.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="howItWorks"
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible.howItWorks ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-emerald-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center text-emerald-600 text-3xl mb-4">
                  {step.icon}
                </div>
                <div className="relative mb-8 w-full h-1">
                  {index < howItWorksSteps.length - 1 && (
                    <div className="absolute w-full md:w-4/5 right-0 md:left-1/2 top-1/2 h-1 bg-emerald-200 transform md:-translate-x-1/2 -translate-y-1/2 hidden md:block"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section
        id="features"
        className={`py-20 bg-emerald-50 transition-all duration-1000 ${
          isVisible.features ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-emerald-800">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="text-emerald-600 text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="whyUs"
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible.whyUs ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-emerald-800">
            Why Choose CarbonTrack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col space-y-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Proprietary Calculation Method</h3>
                  <p className="text-gray-600">
                    Our carbon calculation algorithm considers multiple factors for accuracy: food type, origin, preparation method, delivery distance, transportation type, and packaging materials.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Seamless Integration</h3>
                  <p className="text-gray-600">
                    Connect once with your favorite food delivery apps and let our system do the work. No manual entry required, making it easy to maintain consistent tracking.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Actionable Insights</h3>
                  <p className="text-gray-600">
                    We don't just show data—we provide specific recommendations tailored to your habits that can make a real difference in reducing your carbon footprint.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Data Privacy First</h3>
                  <p className="text-gray-600">
                    Your privacy matters. We use secure OAuth connections and never store your food delivery app passwords. Your data is encrypted and used only for carbon calculations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`py-20 bg-emerald-50 transition-all duration-1000 ${
          isVisible.testimonials ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        {/* <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-emerald-800">
            What Our Users Say
          </h2>
          <p className="text-xl text-center text-gray-700 max-w-3xl mx-auto mb-16">
            Join thousands of environmentally conscious food delivery users who are making a difference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <div className="bg-emerald-100 p-8 rounded-xl inline-block">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-10">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-emerald-600">45,000+</span>
                  <span className="text-gray-700">Active Users</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-emerald-600">78%</span>
                  <span className="text-gray-700">Average Reduction</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-emerald-600">12,500</span>
                  <span className="text-gray-700">Tons CO2 Saved</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className={`py-20 bg-emerald-700 transition-all duration-1000 ${
          isVisible.cta ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Reduce Your Carbon Footprint?
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-10">
            Join thousands of users who are making more sustainable food choices without sacrificing convenience. Start tracking your impact today.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <button className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl text-lg">
              <Link to="/register">Create Free Account</Link>
            </button>
            <button className="border-2 border-white text-white hover:bg-emerald-600 font-semibold py-3 px-8 rounded-lg transition duration-300 text-lg">
              Watch Demo
            </button>
          </div>
          <div className="mt-12">
            <p className="text-emerald-100">
              Available on iOS and Android
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <button className="bg-black text-white px-6 py-2 rounded-lg flex items-center">
                <span className="mr-2">🍎</span> App Store
              </button>
              <button className="bg-black text-white px-6 py-2 rounded-lg flex items-center">
                <span className="mr-2">🤖</span> Play Store
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-800 text-emerald-100 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CarbonTrack</h3>
              <p className="mb-4">Making food delivery sustainable, one order at a time.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-emerald-100 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-emerald-100 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-emerald-100 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-emerald-100 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition duration-300">Home</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Features</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition duration-300">Environmental Impact</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Carbon Footprint Guide</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Sustainable Food Choices</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Partner With Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <a href="mailto:info@carbontrack.com">info@carbontrack.com</a>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                </li>
                {/* <li className="mt-4">
                  <p className="mb-2">Subscribe to our newsletter:</p>
                  <div className="flex">
                    <input 
                      type="email" 
                      placeholder="Your email"
                      className="bg-emerald-700 border border-emerald-500 rounded-l-lg px-4 py-2 text-white placeholder-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-300"
                    />
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-r-lg px-4 py-2 transition duration-300">
                      Subscribe
                    </button>
                  </div>
                </li> */}
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-600 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} CarbonTrack. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
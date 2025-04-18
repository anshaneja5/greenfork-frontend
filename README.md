# Carbon Footprint Tracker - Frontend

A React.js frontend for tracking and analyzing carbon footprint from food consumption, including delivery orders, menu analysis, and food image recognition.

## Features

- User-friendly dashboard with carbon emission statistics
- Order management interface with Zomato and Swiggy integration
- AI-powered food image analysis and carbon footprint estimation
- Restaurant menu analysis with sustainability ratings
- Visualizations of emission trends and breakdown
- Platform comparison charts
- AI-powered personalized recommendations
- Responsive design for mobile and desktop

## Tech Stack

- **React.js**: UI library
- **React Router**: Navigation
- **Chart.js/D3.js**: Data visualization
- **Axios**: API requests
- **Tailwind CSS**: Styling
- **React Context API**: State management
- **OpenAI Vision API**: Food image analysis
- **Material-UI**: UI components and icons

## Prerequisites

- Node.js 14+ and npm
- OpenAI API key for image analysis features

## Environment Setup

Create a `.env` file in the root directory with:
```
VITE_API_URL=http://localhost:5000/api
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm test` - Run tests

## Main Pages

- **Dashboard**: Overview of carbon footprint with key metrics
- **Orders**: List and manage food delivery orders
- **Food Analysis**: AI-powered food image analysis
- **Menu Analysis**: Restaurant menu sustainability analysis
- **Insights**: Detailed analytics and trends
- **Recommendations**: AI-powered suggestions to reduce carbon footprint

## Components

### Core Components
- `Navbar`: Navigation menu
- `Footer`: Page footer
- `AuthForms`: Login and registration forms
- `OrderForm`: Create/edit order form
- `FoodAnalysis`: AI-powered food image analysis
- `MenuAnalysis`: Restaurant menu analysis

### Data Visualization Components
- `EmissionBreakdown`: Pie chart of emission sources
- `TrendsChart`: Line chart of emissions over time
- `PlatformComparison`: Bar chart comparing delivery platforms
- `RecommendationCard`: Display for AI recommendations
- `SustainabilityRating`: Visual display of food/menu sustainability

## API Integration

The frontend communicates with the backend through RESTful API endpoints:

- **Authentication**: Register and login
- **Orders**: CRUD operations for delivery orders
- **Food Analysis**: AI-powered food image analysis
- **Menu Analysis**: Restaurant menu sustainability analysis
- **Insights**: Fetch analytics and carbon footprint data
- **Recommendations**: Get AI-powered suggestions

## State Management

The application uses React Context API for:
- **User context**: Authentication state
- **Order context**: Current order data
- **Theme context**: UI theme preferences
- **Analysis context**: Food and menu analysis results

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design
- Dark/light mode support
- Consistent color palette
- Accessibility compliance
- Modern UI components from Material-UI
- Interactive animations and transitions

## AI Features

### Food Image Analysis
- Upload food photos for instant carbon footprint analysis
- Get detailed ingredient breakdown
- Receive sustainability ratings
- View alternative lower-carbon options

### Menu Analysis
- Upload restaurant menus for sustainability analysis
- Get carbon impact ratings for dishes
- View low-carbon recommendations
- Receive alternative suggestions

## Food Delivery Integration

- **Zomato Integration**: Track and analyze Zomato orders
- **Swiggy Integration**: Track and analyze Swiggy orders
- **Platform Comparison**: Compare carbon impact across platforms
- **Order History**: View and analyze past orders

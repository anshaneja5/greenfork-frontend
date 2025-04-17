# Carbon Footprint Tracker - Frontend

A React.js frontend for visualizing and managing carbon footprint from food delivery orders.

## Features

- User-friendly dashboard with carbon emission statistics
- Order management interface
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

## Prerequisites

- Node.js 14+ and npm

## Environment Setup

Create a `.env` file in the root directory with:
- http://localhost:5000/api


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
- **Insights**: Detailed analytics and trends
- **Recommendations**: AI-powered suggestions to reduce carbon footprint

## Components

### Core Components
- `Navbar`: Navigation menu
- `Footer`: Page footer
- `AuthForms`: Login and registration forms
- `OrderForm`: Create/edit order form

### Data Visualization Components
- `EmissionBreakdown`: Pie chart of emission sources
- `TrendsChart`: Line chart of emissions over time
- `PlatformComparison`: Bar chart comparing delivery platforms
- `RecommendationCard`: Display for AI recommendations

## API Integration

The frontend communicates with the backend through RESTful API endpoints:

- **Authentication**: Register and login
- **Orders**: CRUD operations for delivery orders
- **Insights**: Fetch analytics and carbon footprint data
- **Recommendations**: Get AI-powered suggestions

## State Management

The application uses React Context API for:
- **User context**: Authentication state
- **Order context**: Current order data
- **Theme context**: UI theme preferences

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design
- Dark/light mode support
- Consistent color palette
- Accessibility compliance


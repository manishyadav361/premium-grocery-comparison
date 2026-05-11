# 🛒 Premium Grocery Price Comparison App

A modern, full-featured mobile web application that helps users compare grocery prices across multiple platforms in real-time, set price alerts, and find the best deals.

## ✨ Features

- **🔍 Product Search & Discovery** - Search across thousands of grocery products from multiple platforms
- **💰 Price Comparison** - Compare prices across Blinkit, Zepto, Instamart, and more
- **📍 Location-Based Shopping** - Set your location and see prices relevant to your area
- **🔔 Smart Price Alerts** - Get notified when prices drop or items are restocked
- **💾 Saved Items** - Bookmark your favorite products for quick access
- **📊 Price History** - Track price trends over time to find the best deals
- **👤 User Profiles** - Personalized experience with user authentication
- **🎯 Trending Products** - Discover popular and trending items in your area
- **📱 Mobile-First Design** - Fully responsive with an intuitive bottom navigation

## 🛣️ Navigation & Screens

The app includes the following screens:

| Screen | Path | Purpose |
|--------|------|---------|
| Splash | `/` | Initial loading screen |
| Onboarding | `/onboarding` | User walkthrough guide |
| Auth | `/auth` | Login/registration |
| OTP Verification | `/otp` | Phone number verification |
| Location Selection | `/location` | Set delivery location |
| Home | `/home` | Main dashboard with trending products |
| Search | `/search` | Product search interface |
| Products | `/products` | Product listing with filters |
| Comparator | `/compare/:id` | Price comparison for a product |
| Saved Items | `/saved` | Bookmarked products |
| Price History | `/history/:id` | Historical price trends |
| Alerts | `/alerts` | Manage price & restock alerts |
| Profile | `/profile` | User account settings |

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/manishyadav361/premium-grocery-comparison.git
cd premium-grocery-comparison
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or your configured Vite port).

### Build for Production

```bash
npm run build
```

## 🎨 Design System

This project is built with:
- **React 18+** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible UI components
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icons
- **Vite** - Fast build tool

## 📁 Project Structure

```
src/
├── app/
│   ├── screens/          # All screen components
│   ├── components/       # Reusable UI components
│   ├── context/          # React context for state management
│   ├── data/             # Mock data and constants
│   └── routes.ts         # Route definitions
├── lib/                  # Utility functions
└── styles/               # Global styles
```

## 🎯 Key Components

- **ProductCard** - Displays individual product with prices
- **FilterSheet** - Advanced filtering options
- **BottomNav** - Primary navigation
- **SkeletonLoader** - Loading placeholders
- **Layout** - Main layout wrapper

## 🎨 UI Components

The app includes a comprehensive set of Radix UI components including:
- Accordion, Alert Dialog, Avatar, Badge
- Button, Card, Carousel, Checkbox
- Dialog, Drawer, Dropdown Menu, Form
- Input, Label, Pagination, Popover
- Progress, Radio Group, Select, Sidebar
- Slider, Switch, Table, Tabs
- Tooltip, and more...

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Tablet optimization
- Desktop layout with sidebar
- Touch-friendly interactions

## 🔄 State Management

Global state is managed using React Context API with features like:
- User authentication state
- Location preferences
- Saved items
- Price alerts
- Snackbar notifications

## 📝 License

This project is available as a code bundle. The original design is available at [Figma](https://www.figma.com/design/28X0BeAtP2K1cXQyUECPE6/Premium-Grocery-Price-Comparison-App).

## 👨‍💻 Development

For detailed development guidelines, see [Guidelines.md](./guidelines/Guidelines.md)
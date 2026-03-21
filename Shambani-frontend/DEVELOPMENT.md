# Shambani Frontend Development Setup

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend server running on port 3001

### Installation

1. **Clone and Install Dependencies**
```bash
cd Shambani-frontend
npm install
```

2. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Default: VITE_API_URL=http://localhost:3001
```

3. **Start Development Server**
```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

## 🔌 Backend Connection

### Local Development
- Backend URL: http://localhost:3001
- API Proxy: Configured in vite.config.ts
- Auto-refresh: Supported

### Environment Variables
```bash
# Development
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Shambani Investment
VITE_ENABLE_DEBUG=true

# Production (when ready)
VITE_API_URL=https://shambani-backend.onrender.com
VITE_ENABLE_DEBUG=false
```

## 🏗️ Architecture Overview

### Frontend Structure
```
src/
├── components/          # React components
│   ├── ui/            # Radix UI components (53+)
│   ├── dashboards/    # Role-specific dashboards (8)
│   ├── feeding/       # Feeding management
│   ├── health/        # Health management
│   ├── production/    # Production management
│   ├── financial/     # Financial management
│   └── sections/      # Landing page sections
├── contexts/           # React contexts (Auth, Language)
├── utils/             # Utilities (API, types, helpers)
└── types.ts           # TypeScript definitions
```

### API Integration
- **Complete API Client**: utils/api.ts
- **All 8 Modules**: Auth, Users, Feeding, Health, Production, Financial, Services, Notifications
- **JWT Authentication**: Token management with auto-refresh
- **Error Handling**: Comprehensive error boundaries

### User Roles (8 Total)
- FARMER - Production, feeding, health, financial management
- EXTENSION_OFFICER - Services, appointments, reports
- AGROVET_OWNER - Products, orders, inventory
- LOGISTICS_PROVIDER - Deliveries, routes, scheduling
- MACHINERY_DEALER - Equipment, rentals, maintenance
- BUYER_AGGREGATOR - Marketplace, orders, suppliers
- SUPER_ADMIN - User management, analytics, system admin
- CASUAL_LABOURER - Jobs, schedule, earnings

## 🛠️ Development Workflow

### 1. Component Development
```typescript
// Use existing patterns
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { apiModule } from "../utils/api";
import { handleApiResponse } from "../utils/apiHelpers";
```

### 2. API Integration
```typescript
// Standard API call pattern
const loadData = async () => {
  try {
    setLoading(true);
    const response = await apiModule.getRecords({ userId: user.id });
    if (response.success) {
      setData(response.data || []);
    }
  } catch (error) {
    console.error("Failed to load data:", error);
  } finally {
    setLoading(false);
  }
};
```

### 3. Error Handling
```typescript
// Use helper utilities
import { handleApiResponse, handleApiError } from "../utils/apiHelpers";

try {
  const data = handleApiResponse(response);
  setData(data);
} catch (error) {
  setError(handleApiError(error));
}
```

## 🎯 Key Features Implemented

### ✅ Authentication System
- Multi-role registration (8 user types)
- JWT token management
- Automatic token refresh
- Role-based routing

### ✅ Dashboard System
- 8 role-specific dashboards
- Real-time data integration
- Tabbed navigation
- Statistics and analytics

### ✅ Management Modules
- **Feeding**: Feed schedules, inventory, nutrition
- **Health**: Records, vaccinations, appointments
- **Production**: Eggs, chicks, mortality, weight tracking
- **Financial**: Revenue, expenses, loans, profit/loss

### ✅ UI/UX Excellence
- 53+ Radix UI components
- Responsive design (mobile-first)
- Professional agricultural theme
- Smooth animations (Framer Motion)
- Multi-language support (English/Swahili)

## 🔧 Configuration Files

### vite.config.ts
- React plugin
- Proxy to backend (port 3001)
- Development server on port 3000

### tailwind.config.js
- Custom agricultural theme
- Professional color palette
- Responsive breakpoints

### tsconfig.json
- Strict TypeScript configuration
- Path aliases for clean imports

## 📱 Mobile Development

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for all screen sizes

### Testing Mobile
```bash
# Test on different screen sizes
npm run dev
# Open browser dev tools and test mobile viewports
```

## 🚀 Production Deployment

### Build Process
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
1. Set production variables in .env
2. Update VITE_API_URL to production backend
3. Configure build optimizations

### Deployment Options
- **Vercel**: Connect GitHub repo
- **Netlify**: Drag-and-drop build folder
- **Docker**: Use provided Dockerfile
- **Static Hosting**: Upload dist/ folder

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check backend is running on port 3001
   - Verify VITE_API_URL in .env
   - Check vite.config.ts proxy settings

2. **Authentication Issues**
   - Clear localStorage tokens
   - Check JWT token format
   - Verify backend auth endpoints

3. **Import Errors**
   - Check file paths in imports
   - Verify component exports
   - Update TypeScript paths

4. **Build Errors**
   - Check TypeScript types
   - Verify all imports
   - Update dependencies

### Debug Mode
```bash
# Enable debug logging
VITE_ENABLE_DEBUG=true npm run dev
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

### API Documentation
- Backend endpoints: http://localhost:3001/api/docs
- API client: src/utils/api.ts
- Type definitions: src/utils/types.ts

## 🤝 Contributing

### Code Standards
- Use TypeScript strictly
- Follow existing patterns
- Add error handling
- Include loading states
- Test on mobile

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

---

**Development Team**: Shambani Investment Platform  
**Last Updated**: 2025  
**Version**: 1.0.0

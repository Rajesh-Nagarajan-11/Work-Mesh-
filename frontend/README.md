# Work Mesh Frontend

Modern, professional React frontend for Work Mesh - a team formation management system that helps managers form project teams by matching employee skills with project requirements using intelligent algorithms.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** & **Framer Motion** - Professional animations
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Hook Form** & **Zod** - Form management and validation

## 📋 Features

- ✨ Clean, professional corporate design
- 🎨 Subtle, purposeful animations
- ♿ WCAG 2.1 AA compliant accessibility
- 📱 Fully responsive design
- 🔐 JWT authentication with auto-refresh
- 🎯 Protected routes
- 📊 Interactive dashboard with stats
- 🌐 RESTful API integration

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🏃‍♂️ Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Demo Credentials (Development)
- Email: `admin@workmesh.com`
- Password: `admin123`

## 🏗️ Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Input, Modal, etc.)
│   ├── layout/      # Layout components (Navbar, MainLayout)
│   └── dashboard/   # Dashboard-specific components
├── pages/           # Page components
├── services/        # API service layer
├── contexts/        # React contexts (Auth, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configurations
├── types/           # TypeScript type definitions
└── styles/          # Global styles

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb) - Professional, trustworthy
- **Secondary**: Slate Gray (#475569) - Corporate, modern
- **Success**: Green (#16a34a)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#dc2626)

### Typography
- Font Family: Inter (Google Fonts)
- Headings: 600-700 weight
- Body: 400 weight

### Spacing
- Consistent 8px grid system
- Standard padding: 16px, 24px, 32px, 48px

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration

The application connects to a backend API at the URL specified in `.env`:

**Endpoints:**
- `POST /auth/login` - User authentication
- `GET /employees` - Fetch employees
- `POST /projects` - Create project
- `POST /projects/:id/generate-teams` - Generate team recommendations
- `POST /teams/approve` - Approve team

See `src/services/` for complete API implementation.

## ♿ Accessibility

- Keyboard navigation throughout
- Focus visible styles
- ARIA labels and roles
- Screen reader support
- Color contrast ratio 4.5:1 minimum
- Reduced motion support via `prefers-reduced-motion`

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Ensure accessibility compliance
4. Test responsive design
5. Add comments for complex logic

## 📄 License

This project is proprietary software for Work Mesh.

---

Built with ❤️ by the Work Mesh Team

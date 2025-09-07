# 🏋️ Gym Growth - Gamified Workout Tracker PWA

A complete **gamified fitness tracking Progressive Web Application** built with **React + Vite**. Turn your workouts into an RPG-style adventure with XP, levels, quests, and achievements!

## ✨ Features

### 🎮 Gamification Elements
- **XP & Leveling System**: Earn XP for every exercise and level up your avatar
- **Dynamic Avatar**: Visual progression that evolves as you level up
- **Quest System**: Complete challenges for bonus XP and achievements
- **Streak Tracking**: Maintain consistency with workout streaks
- **Progress Analytics**: Visual charts and statistics

### 💪 Workout Management
- **Exercise Library**: Pre-built exercises with different categories
- **Real-time XP Preview**: See XP rewards before logging exercises
- **Workout Sessions**: Start/stop workout tracking with duration timer
- **Exercise Logging**: Track sets, reps, and weights with intuitive UI
- **Workout History**: View past workouts and progress over time

### 📱 Progressive Web App
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Works without internet connection
- **Push Notifications**: Workout reminders and achievement alerts
- **Mobile Optimized**: Responsive design with mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   - Go to `http://localhost:5173/`
   - Use demo credentials:
     - **Email**: test@example.com
     - **Password**: password

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Avatar.jsx      # User avatar with level progression
│   ├── ProgressBar.jsx # Animated progress bars
│   ├── ExerciseCard.jsx # Exercise logging interface
│   └── QuestCard.jsx   # Quest display and interaction
├── pages/              # Main application screens
│   ├── Login.jsx       # Authentication & onboarding
│   ├── Dashboard.jsx   # Main overview screen
│   ├── WorkoutLog.jsx  # Exercise logging interface
│   ├── Progress.jsx    # Analytics and charts
│   └── Quests.jsx      # Quest management
├── context/            # React Context for state management
│   ├── UserContext.jsx # User data, XP, levels
│   └── WorkoutContext.jsx # Workout sessions & history
├── hooks/              # Custom React hooks
│   ├── useXP.js        # XP calculation logic
│   └── useQuests.js    # Quest management
├── services/           # API integration layer
│   └── api.js          # Backend API calls
└── styles/             # CSS and styling
```

## 🎯 Core Gameplay Loop

1. **Login/Signup** → Set fitness goals
2. **Start Workout** → Begin tracking session
3. **Log Exercises** → Add sets, reps, weight
4. **Earn XP** → Get points based on effort
5. **Level Up** → Unlock new quests and features
6. **Complete Quests** → Achieve specific goals
7. **View Progress** → Analyze your fitness journey

## 🎮 Gamification Details

### XP Calculation
```javascript
XP = (baseXP + weightFactor + repsFactor + setsFactor) × exerciseMultiplier × bonusMultiplier
```

### Level Progression
- **Level 1**: 0 XP
- **Level 2**: 100 XP
- **Level 3**: 300 XP
- **Level 4**: 600 XP
- **Level 5**: 1000 XP
- And so on...

### Quest Types
- **Strength**: Complete specific exercises
- **Endurance**: Achieve rep milestones
- **Consistency**: Maintain workout streaks
- **Challenges**: Special time-limited goals

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling and responsive design
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### PWA Features
- **Vite PWA Plugin** - Service worker and manifest
- **Workbox** - Caching strategies
- **Web App Manifest** - App metadata

### State Management
- **React Context** - Global state management
- **Local Storage** - Persistent data storage
- **Custom Hooks** - Business logic abstraction

## 🎨 Design System

### Colors
- **Primary**: Indigo (#4F46E5)
- **Secondary**: Purple (#8B5CF6)  
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scale using Tailwind

## 🔧 Configuration

### Environment Variables
Create `.env.local` file:
```env
VITE_API_BASE_URL=https://your-backend-url.com
VITE_APP_NAME=Gym Growth
```

### PWA Customization
Edit `vite.config.js` to customize:
- App name and description
- Theme colors
- Icon paths
- Caching strategies

## 📱 Browser Support

- **Chrome** 63+
- **Firefox** 67+
- **Safari** 13+
- **Edge** 79+

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Netlify
1. Build: `npm run build`
2. Publish directory: `dist`

### Other Platforms
- Railway
- Render
- Firebase Hosting

## 🔄 Backend Integration

The app includes a complete API service layer ready for backend integration:

### Endpoints
- `POST /auth/login` - User authentication
- `POST /workouts` - Log workout data
- `GET /workouts` - Fetch workout history
- `GET /quests` - Get available quests
- `PUT /user/profile` - Update user data

### Mock Data
Currently uses mock data and localStorage for demonstration. Replace with real API calls in `src/services/api.js`.

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Rapid UI development
- **Lucide** - Beautiful icons
- **Recharts** - Data visualization
- **Vite** - Lightning-fast development

---

Built with ❤️ for fitness enthusiasts who love gamification!

## 🎯 Next Steps

- [ ] Backend API development
- [ ] User authentication with JWT
- [ ] Social features and leaderboards  
- [ ] Workout plan recommendations
- [ ] Exercise video tutorials
- [ ] Community challenges
- [ ] Nutrition tracking integration
- [ ] Wearable device sync

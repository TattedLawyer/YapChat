# AI Companion Frontend

A modern, engaging React/Next.js frontend for the AI Companion platform featuring personality-driven AI characters.

## 🎨 Features

- **Beautiful Landing Page** - Showcases AI companions with smooth animations
- **Interactive Personality Test** - 16-question assessment with progress tracking
- **Character Selection** - Visual showcase of 4 unique AI personalities
- **Modern Chat Interface** - Real-time conversations with typing indicators
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Smooth Animations** - Powered by Framer Motion for delightful UX

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8001`

### Installation

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Start development server:**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser:**
```
http://localhost:3000
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
│   ├── PersonalityTest.tsx   # Interactive personality assessment
│   ├── ChatInterface.tsx     # AI chat interface
│   └── [other components]
├── public/               # Static assets
├── tailwind.config.js    # Tailwind CSS configuration
├── next.config.js       # Next.js configuration
└── package.json         # Dependencies and scripts
```

## 🎨 Design System

### Color Palette

- **Primary**: Blue tones for main UI elements
- **Character Colors**:
  - **Aria** (Tsundere): Pink `#ec4899`
  - **Sage** (Wise Mentor): Green `#10b981`
  - **Riley** (Playful Friend): Orange `#f59e0b`
  - **Alex** (Mysterious Romantic): Purple `#8b5cf6`

### Components

- **Glass Cards**: Semi-transparent backgrounds with backdrop blur
- **Animated Buttons**: Hover effects and state transitions
- **Gradient Backgrounds**: Subtle gradients for visual depth
- **Custom Animations**: Fade-ins, slide-ups, and bounce effects

## 🤖 AI Characters

The frontend showcases 4 distinct AI personalities:

### Aria - Tsundere AI 💗
- **Personality**: Cold but caring, direct and challenging
- **UI Theme**: Pink accents, sharp edges
- **Quote**: "I suppose you want my opinion? Fine..."

### Sage - Wise Mentor 🧙‍♂️
- **Personality**: Patient, thoughtful, guiding
- **UI Theme**: Green accents, soft curves
- **Quote**: "What matters most to you in this situation?"

### Riley - Playful Friend 🎉
- **Personality**: Energetic, fun, supportive
- **UI Theme**: Orange accents, bouncy animations
- **Quote**: "OMG yes! I love when we brainstorm together!"

### Alex - Mysterious Romantic 💜
- **Personality**: Poetic, charming, inspiring
- **UI Theme**: Purple accents, elegant transitions
- **Quote**: "Your potential is remarkable..."

## 🧪 Component Usage

### Personality Test
```tsx
import PersonalityTest from '@/components/PersonalityTest'

<PersonalityTest 
  onComplete={(results) => console.log(results)}
  onBack={() => goToHome()}
/>
```

### Chat Interface
```tsx
import ChatInterface from '@/components/ChatInterface'

<ChatInterface 
  character={{
    id: 'aria',
    name: 'Aria',
    type: 'Tsundere AI',
    icon: '💗',
    color: 'text-pink-600',
    bgGradient: 'from-pink-50 to-pink-100'
  }}
  onBack={() => goToCharacterSelect()}
/>
```

## 🔌 API Integration

The frontend connects to your backend API running on port 8001:

### Endpoints Used
- `POST /api/v1/personality-test/submit` - Submit personality assessment
- `GET /api/v1/characters` - Get available AI characters  
- `POST /api/v1/chat` - Send chat messages
- `GET /api/v1/profile` - Get user profile

### Configuration
API base URL is configured in `next.config.js` with automatic proxy:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8001/api/:path*',
    },
  ]
}
```

## 🎯 User Flow

1. **Landing Page** → User sees AI character showcase
2. **Personality Test** → 16-question assessment
3. **Results & Character Selection** → Based on personality profile
4. **Chat Interface** → Real-time conversation with chosen AI
5. **Profile Management** → View stats and relationship progress

## 🛠 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint + Prettier** for code formatting
- **Framer Motion** for animations

### Key Dependencies

```json
{
  "next": "14.0.4",
  "react": "^18",
  "tailwindcss": "^3.3.0",
  "framer-motion": "^10.16.16",
  "lucide-react": "^0.292.0",
  "axios": "^1.6.2"
}
```

## 📱 Responsive Design

- **Desktop**: Full-width layouts with sidebar navigation
- **Tablet**: Adaptive grid layouts
- **Mobile**: Single-column layouts with touch-friendly interactions

## 🎨 Customization

### Adding New Characters

1. Add character data to the characters array
2. Define character-specific colors in `tailwind.config.js`
3. Add greeting and response patterns
4. Update TypeScript types

### Theming

Customize the design by modifying:
- `tailwind.config.js` - Colors, animations, themes
- `globals.css` - Global styles and CSS variables
- Component-specific styles in individual files

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel
```bash
npx vercel
```

### Environment Variables
Create `.env.local` for production:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Ready to create amazing AI companion experiences!** 🤖✨ 
# AI Companion - Your Personal AI Friend

A modern, responsive Next.js web application that provides personalized AI companionship through interactive chat interfaces with unique AI personalities.

## 🌟 Features

### Core Functionality
- **4 Unique AI Characters**: Aria (Empathetic Guide), Sage (Wise Mentor), Riley (Creative Spark), Alex (Logical Analyst)
- **Personality Assessment**: Interactive quiz system to match users with compatible AI companions
- **Real-time Chat Interface**: Smooth, responsive messaging with typing indicators
- **Character-Specific Styling**: Each AI has unique visual themes and personality traits
- **Time-Aware Backgrounds**: Dynamic backgrounds that change based on time of day
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### User Experience
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Accessibility**: WCAG compliant design with keyboard navigation support
- **Performance Optimized**: Fast loading times with Next.js optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-companion.git
   cd ai-companion
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js 13+ App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── chat/             # Chat pages
├── components/            # Reusable React components
│   ├── ChatInterface.tsx # Main chat component
│   ├── PersonalityQuiz.tsx
│   └── ui/               # UI components
├── public/               # Static assets
├── package.json         # Dependencies and scripts
└── tailwind.config.js   # Tailwind CSS configuration
```

## 🎨 AI Characters

### Aria - The Empathetic Guide
- **Personality**: Warm, understanding, emotionally intelligent
- **Specialties**: Emotional support, active listening, personal growth
- **Visual Theme**: Soft blues and warm tones

### Sage - The Wise Mentor  
- **Personality**: Thoughtful, knowledgeable, philosophical
- **Specialties**: Life advice, problem-solving, wisdom sharing
- **Visual Theme**: Deep purples and gold accents

### Riley - The Creative Spark
- **Personality**: Energetic, imaginative, inspiring
- **Specialties**: Creative projects, brainstorming, artistic expression
- **Visual Theme**: Vibrant oranges and creative gradients

### Alex - The Logical Analyst
- **Personality**: Rational, precise, analytical
- **Specialties**: Data analysis, logical reasoning, technical discussions
- **Visual Theme**: Cool grays and tech-inspired blues

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Technology Stack

- **Framework**: Next.js 15.1.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Tailwind
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Project**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📱 Mobile Support

The application is fully responsive and optimized for:
- iOS Safari
- Android Chrome
- Progressive Web App (PWA) capabilities
- Touch-friendly interactions
- Mobile-optimized layouts

## 🎯 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Minimized with Next.js automatic optimization
- **Loading Speed**: Sub-second initial page loads

## 🔧 Customization

### Adding New Characters

1. Create character data in `components/data/characters.ts`
2. Add character-specific styling in `tailwind.config.js`
3. Update the personality quiz logic
4. Add character assets to `public/characters/`

### Theming

The application uses Tailwind CSS for styling. Customize themes by:
1. Modifying `tailwind.config.js`
2. Updating CSS variables in `app/globals.css`
3. Adjusting character-specific color schemes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- The open-source community for inspiration and tools

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/ai-companion/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ using Next.js and TypeScript**

*Last Updated: December 2024* 
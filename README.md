# AI Companion - Your Personal AI Friend

A modern, responsive Next.js web application that provides personalized AI companionship through interactive chat interfaces with unique AI personalities **powered by Anthropic's Claude AI**.

## 🌟 Features

### Core Functionality
- **4 Unique AI Characters**: Aria (Empathetic Guide), Sage (Wise Mentor), Riley (Creative Spark), Alex (Logical Analyst)
- **Real AI Conversations**: Powered by Anthropic's Claude AI with character-specific personalities
- **Personality Assessment**: Interactive quiz system to match users with compatible AI companions
- **Real-time Chat Interface**: Smooth, responsive messaging with typing indicators
- **Character-Specific Styling**: Each AI has unique visual themes and personality traits
- **Time-Aware Backgrounds**: Dynamic backgrounds that change based on time of day
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### User Experience
- **Personality-Driven Matching**: 16-question assessment across 8 personality dimensions
- **Relationship Progression**: XP system and memory tracking for deeper connections
- **Conversation History**: AI remembers context from previous messages
- **Fallback System**: Graceful handling of API issues with character-appropriate responses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TattedLawyer/Aicompanion.git
   cd Aicompanion/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Anthropic API** 🔑
   ```bash
   # Copy the example environment file
   cp .env.local.example .env.local
   
   # Edit .env.local and add your Anthropic API key
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔑 API Configuration

### Getting Your Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-...`)
6. Add it to your `.env.local` file:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   ```

### API Features
- **Model**: Claude 3 Haiku (fast responses, cost-effective)
- **Context**: Maintains conversation history (last 10 messages)
- **Fallback**: Graceful degradation if API is unavailable
- **Error Handling**: User-friendly error messages and retry options

## 🤖 AI Characters

Each character has a unique personality powered by custom system prompts:

### Aria - Tsundere AI 💗
- Initially cold but secretly caring
- Direct and challenging communication style
- Gradually warms up through conversations
- Perfect for users who appreciate honest feedback

### Sage - Wise Mentor 🧙‍♂️
- Patient and thoughtful guidance
- Asks questions to help you find your own answers
- Deep wisdom and life lessons
- Ideal for reflection and personal growth

### Riley - Playful Friend 🎉
- High energy and enthusiasm
- Supportive and optimistic outlook
- Creative brainstorming partner
- Great for motivation and fun conversations

### Alex - Mysterious Romantic 💜
- Poetic and charming communication
- Sees beauty and potential in everything
- Inspiring and uplifting messages
- Perfect for creative inspiration and encouragement

## 🛠️ Development

### Project Structure
```
frontend/
├── app/
│   ├── api/chat/          # Anthropic API integration
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── App.tsx           # Main application logic
│   ├── ChatInterface.tsx # Real-time chat with Claude AI
│   ├── HomePage.tsx      # Landing page
│   ├── PersonalityTest.tsx # Assessment system
│   └── CompanionHub.tsx  # Character interaction hub
└── package.json
```

### Key Technologies
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Anthropic SDK** - Official Claude AI integration
- **Lucide React** - Beautiful icon library

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `ANTHROPIC_API_KEY` to Vercel environment variables
4. Deploy automatically

### Environment Variables for Production
```bash
ANTHROPIC_API_KEY=your_production_api_key
```

## 🧪 Testing

Visit the live application and test:
1. **Personality Assessment** - Complete the 16-question quiz
2. **Character Selection** - Choose or get matched with an AI companion
3. **Real Conversations** - Chat with Claude AI through character personalities
4. **Relationship Progression** - Watch XP and memories grow
5. **Error Handling** - Test with invalid API key to see fallback responses

## 📊 Features in Detail

### Personality Assessment System
- 16 carefully crafted questions
- 8 personality dimensions measured
- Smart character matching algorithm
- Results influence AI companion recommendation

### Real-time Chat System
- Anthropic Claude 3 Haiku integration
- Character-specific system prompts
- Conversation context maintenance
- Typing indicators and smooth UX
- Error handling with graceful fallbacks

### Relationship System
- XP gained through conversations (+10 per message)
- Memory system stores conversation highlights
- Level progression unlocks new features
- Character-specific relationship dynamics

## 🔧 Troubleshooting

### Common Issues

**"Anthropic API key not configured"**
- Ensure `.env.local` file exists in the frontend directory
- Verify your API key is correctly formatted
- Restart the development server after adding the key

**"Connection issue" in chat**
- Check your internet connection
- Verify your Anthropic API key is valid and has credits
- Use the retry button to attempt the request again

**Characters not responding**
- Check browser console for error messages
- Ensure the API route is accessible at `/api/chat`
- Verify your API key has sufficient credits

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Ready to meet your AI companion?** Set up your Anthropic API key and start chatting! 🚀 
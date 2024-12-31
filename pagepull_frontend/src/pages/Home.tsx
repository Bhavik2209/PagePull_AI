import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Bot, Code2, Database, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Background } from '../components/Background';
import { Card } from '../components/Card';
import { FeatureCard } from '../components/FeatureCard';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered',
    description: 'Intelligent data extraction with advanced AI capabilities'
  },
  {
    icon: Code2,
    title: 'Smart Parsing',
    description: 'Automatically parse and structure web data'
  },
  {
    icon: Database,
    title: 'Data Analysis',
    description: 'Extract meaningful insights from web content'
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Get instant results with our high-performance engine'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security'
  },
  {
    icon: Sparkles,
    title: 'Clean Output',
    description: 'Receive well-formatted, ready-to-use data'
  }
];

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/scrape');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Background />
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-8 text-white bg-clip-text">
              Web Scraping AI Assistant
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Extract and analyze web data intelligently using our advanced AI-powered scraping tool
            </p>

            {user ? (
              <button
                onClick={() => navigate('/scrape')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-105 flex items-center gap-2 mx-auto"
              >
                Start Scraping <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <Card className="p-8 max-w-md mx-auto mb-6 backdrop-blur-lg bg-[#151A2D]/40">
                <p className="text-gray-300 mb-6">
                  Sign in with your Google account to start using our AI-powered web scraping tool
                </p>
                <button
                  onClick={handleGoogleSignIn}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-105 w-full"
                >
                  Sign in with Google
                </button>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
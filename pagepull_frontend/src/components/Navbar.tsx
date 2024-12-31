import { useAuth } from '../contexts/AuthContext';
import { LogOut, Github, Globe } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from './Card';

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Card className="mx-4 mt-4 mb-8">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-2xl font-extrabold text-white tracking-tight transition-transform transform hover:scale-105"
            title="Go to Home"
          >
            <div className="relative">
              <Globe 
                className="w-8 h-8 text-indigo-400 animate-pulse transition-transform transform hover:scale-110"
              />
            </div>
            <span 
              className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent transition-colors hover:text-indigo-200"
            >
              PagePull
            </span>
          </Link>
          <div className="flex items-center gap-4">
            
            {user && (
              <>
                <Card className="flex items-center gap-3 px-4 py-2">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full ring-2 ring-indigo-400"
                    />
                  )}
                  <span className="text-gray-200">
                    Welcome, {user.displayName || 'User'}
                  </span>
                </Card>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#1F2437] rounded-xl transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
            <a
              href="https://github.com/yourusername/web-scraping-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white hover:bg-[#1F2437] rounded-xl transition-all"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

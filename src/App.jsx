import React, { useState, useEffect } from 'react';
import { Music, Image, Calendar, Lock, User, Home, Archive, CreditCard, MessageSquare, Play, Pause, Volume2 } from 'lucide-react';

// Mock data for demo
const initialPosts = [
  {
    id: 1,
    type: 'demo',
    title: 'Midnight Echoes - Demo V2',
    description: 'Late night studio session exploring darker synth textures. This version strips back the percussion to let the atmosphere breathe. Still searching for the right vocal melody.',
    date: '2024-12-01',
    audioUrl: 'demo',
    engagement: { question: 'Should I add strings or keep it minimal?', votes: { strings: 12, minimal: 8 } }
  },
  {
    id: 2,
    type: 'voice-memo',
    title: 'Voice Memo: Lyric Idea for "Distance"',
    description: 'Captured this melody idea on my phone at 3am. The hook came to me in a dream - "all this distance, but you\'re still here." Thinking this could be the bridge.',
    date: '2024-12-03',
    audioUrl: 'voice-memo'
  },
  {
    id: 3,
    type: 'moodboard',
    title: 'Visual Direction: "Neon Nights" Project',
    description: 'Color palette and visual references for the upcoming project. Inspired by 80s Tokyo, cyberpunk aesthetics, and late-night city drives. The music should feel like these images sound.',
    date: '2024-12-05',
    imageUrl: 'moodboard',
    colors: ['#FF006E', '#8338EC', '#3A86FF', '#FB5607']
  },
  {
    id: 4,
    type: 'vault-drop',
    title: 'Vault Drop #1: Early Experiments',
    description: 'A collection of 5 unreleased snippets from the archive - ideas that never made it to full songs but capture different moods and directions I was exploring.',
    date: '2024-12-08',
    clips: ['Experiment_01.mp3', 'Experiment_02.mp3', 'Experiment_03.mp3', 'Experiment_04.mp3', 'Experiment_05.mp3']
  },
  {
    id: 5,
    type: 'story',
    title: 'The Story Behind "Fractured Light"',
    description: 'This song started as a guitar loop I recorded in my bedroom at 2am. I was going through a rough patch and needed to process some emotions. The original demo was 7 minutes long - just me playing the same progression over and over. It took 6 months to shape it into the final version.',
    date: '2024-12-10'
  }
];

const StauberStudio = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const authResult = await window.storage.get('stauber-auth');
        if (authResult) {
          const auth = JSON.parse(authResult.value);
          setIsLoggedIn(auth.isLoggedIn);
          setIsSubscribed(auth.isSubscribed);
        }

        const postsResult = await window.storage.get('stauber-posts');
        if (postsResult) {
          setPosts(JSON.parse(postsResult.value));
        } else {
          setPosts(initialPosts);
          await window.storage.set('stauber-posts', JSON.stringify(initialPosts));
        }
      } catch (error) {
        console.log('First time setup:', error);
        setPosts(initialPosts);
      }
    };
    loadData();
  }, []);

  // Save auth state
  const saveAuth = async (loggedIn, subscribed) => {
    await window.storage.set('stauber-auth', JSON.stringify({
      isLoggedIn: loggedIn,
      isSubscribed: subscribed
    }));
  };

  const handleLogin = async (email, password) => {
    setIsLoggedIn(true);
    await saveAuth(true, isSubscribed);
    setCurrentPage('dashboard');
  };

  const handleSubscribe = async () => {
    setIsSubscribed(true);
    await saveAuth(isLoggedIn, true);
    setCurrentPage('dashboard');
  };

  const handleVote = async (postId, option) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId && post.engagement) {
        return {
          ...post,
          engagement: {
            ...post.engagement,
            votes: {
              ...post.engagement.votes,
              [option]: post.engagement.votes[option] + 1
            }
          }
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    await window.storage.set('stauber-posts', JSON.stringify(updatedPosts));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || post.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Homepage
  if (currentPage === 'home' && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 pt-12">
            <h1 className="text-6xl font-bold text-white mb-4">Stauber Studio</h1>
            <p className="text-xl text-purple-300 mb-8">Exclusive behind-the-scenes access to the creative process</p>
            
            <div className="max-w-2xl mx-auto bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">What You'll Get</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <Music className="text-purple-400 mt-1" size={20} />
                  <div>
                    <h3 className="text-white font-semibold">Unreleased Demos</h3>
                    <p className="text-gray-400 text-sm">Hear tracks before anyone else</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Volume2 className="text-blue-400 mt-1" size={20} />
                  <div>
                    <h3 className="text-white font-semibold">Voice Memos</h3>
                    <p className="text-gray-400 text-sm">Raw ideas & inspiration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Image className="text-pink-400 mt-1" size={20} />
                  <div>
                    <h3 className="text-white font-semibold">Moodboards</h3>
                    <p className="text-gray-400 text-sm">Visual inspiration & artwork</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Archive className="text-green-400 mt-1" size={20} />
                  <div>
                    <h3 className="text-white font-semibold">Vault Drops</h3>
                    <p className="text-gray-400 text-sm">Collections of rare clips</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 max-w-md mx-auto mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">$5/month</h3>
              <p className="text-purple-100 mb-4">or $50/year (save $10)</p>
              <button
                onClick={() => setCurrentPage('login')}
                className="bg-white text-purple-900 px-8 py-3 rounded-full font-bold hover:bg-purple-100 transition"
              >
                Join Now
              </button>
            </div>

            <div className="text-gray-400 text-sm">
              Already a member?{' '}
              <button onClick={() => setCurrentPage('login')} className="text-purple-400 hover:text-purple-300">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login Page
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center px-4">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => handleLogin('demo@email.com', 'password')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
            >
              Sign In
            </button>
          </div>
          <p className="text-center text-gray-400 mt-4">
            <button onClick={() => setCurrentPage('home')} className="text-purple-400 hover:text-purple-300">
              Back to Home
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Subscription Gate
  if (isLoggedIn && !isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center px-4">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-8 max-w-md w-full text-center">
          <Lock className="mx-auto text-purple-400 mb-4" size={48} />
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Access</h2>
          <p className="text-gray-300 mb-6">Get unlimited access to exclusive content</p>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">$5/month</h3>
            <p className="text-purple-100">or $50/year (save $10)</p>
          </div>
          <button
            onClick={handleSubscribe}
            className="w-full bg-white text-purple-900 py-3 rounded-lg font-bold hover:bg-purple-100 transition mb-4"
          >
            Subscribe with Stripe
          </button>
          <button
            onClick={() => setCurrentPage('home')}
            className="text-gray-400 hover:text-gray-300"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-purple-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Stauber Studio</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentPage === 'dashboard' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Home size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('archive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentPage === 'archive' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Archive size={18} />
              Archive
            </button>
            <button
              onClick={() => setCurrentPage('account')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentPage === 'account' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              <User size={18} />
              Account
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Post Card Component
  const PostCard = ({ post }) => {
    const typeIcons = {
      demo: <Music className="text-purple-400" size={20} />,
      'voice-memo': <Volume2 className="text-blue-400" size={20} />,
      moodboard: <Image className="text-pink-400" size={20} />,
      'vault-drop': <Archive className="text-green-400" size={20} />,
      story: <MessageSquare className="text-yellow-400" size={20} />
    };

    return (
      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-70 transition cursor-pointer border border-purple-900"
           onClick={() => setSelectedPost(post)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {typeIcons[post.type]}
            <span className="text-xs text-gray-400 uppercase tracking-wide">{post.type.replace('-', ' ')}</span>
          </div>
          <span className="text-xs text-gray-500">{post.date}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-3">{post.description}</p>
        
        {post.type === 'moodboard' && post.colors && (
          <div className="flex gap-2 mt-4">
            {post.colors.map((color, i) => (
              <div key={i} className="w-12 h-12 rounded" style={{ backgroundColor: color }}></div>
            ))}
          </div>
        )}
        
        {post.type === 'vault-drop' && post.clips && (
          <div className="mt-4 text-sm text-gray-400">
            {post.clips.length} clips in this drop
          </div>
        )}
      </div>
    );
  };

  // Post Detail Modal
  const PostDetail = () => {
    if (!selectedPost) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
           onClick={() => setSelectedPost(null)}>
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
             onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-white">{selectedPost.title}</h2>
            <button onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-white text-2xl">
              ×
            </button>
          </div>
          
          <p className="text-gray-300 mb-6">{selectedPost.description}</p>
          
          {(selectedPost.audioUrl || selectedPost.type === 'vault-drop') && (
            <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <button className="bg-purple-600 hover:bg-purple-700 rounded-full p-3 transition">
                  {playingAudio === selectedPost.id ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div className="flex-1">
                  <div className="bg-purple-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full w-1/3"></div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">0:45 / 2:30</span>
              </div>
            </div>
          )}
          
          {selectedPost.type === 'vault-drop' && selectedPost.clips && (
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Clips in this drop:</h3>
              {selectedPost.clips.map((clip, i) => (
                <div key={i} className="bg-gray-800 rounded p-3 flex items-center justify-between">
                  <span className="text-gray-300">{clip}</span>
                  <button className="text-purple-400 hover:text-purple-300">
                    <Play size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {selectedPost.engagement && (
            <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">{selectedPost.engagement.question}</h3>
              <div className="space-y-2">
                {Object.entries(selectedPost.engagement.votes).map(([option, count]) => (
                  <button
                    key={option}
                    onClick={() => handleVote(selectedPost.id, option)}
                    className="w-full bg-gray-800 hover:bg-gray-700 rounded p-3 flex justify-between items-center transition"
                  >
                    <span className="text-white capitalize">{option}</span>
                    <span className="text-gray-400">{count} votes</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dashboard Page
  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-white mb-6">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.slice(0, 6).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        {selectedPost && <PostDetail />}
      </div>
    );
  }

  // Archive Page
  if (currentPage === 'archive') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-white mb-6">Archive</h2>
          
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="demo">Demos</option>
              <option value="voice-memo">Voice Memos</option>
              <option value="moodboard">Moodboards</option>
              <option value="vault-drop">Vault Drops</option>
              <option value="story">Stories</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        {selectedPost && <PostDetail />}
      </div>
    );
  }

  // Account Page
  if (currentPage === 'account') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-white mb-6">Account</h2>
          
          <div className="max-w-2xl space-y-6">
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-900">
              <h3 className="text-xl font-bold text-white mb-4">Subscription Status</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Plan</span>
                <span className="text-white font-semibold">Studio Member - $5/month</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Status</span>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Next billing date</span>
                <span className="text-gray-400">January 09, 2025</span>
              </div>
            </div>

            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-900">
              <h3 className="text-xl font-bold text-white mb-4">Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <input
                    type="email"
                    value="demo@email.com"
                    disabled
                    className="w-full bg-gray-800 text-gray-500 px-4 py-2 rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Member since</label>
                  <input
                    type="text"
                    value="December 2024"
                    disabled
                    className="w-full bg-gray-800 text-gray-500 px-4 py-2 rounded-lg mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-900">
              <h3 className="text-xl font-bold text-white mb-4">Payment Method</h3>
              <div className="flex items-center gap-4">
                <CreditCard className="text-purple-400" size={32} />
                <div>
                  <p className="text-white">•••• •••• •••• 4242</p>
                  <p className="text-gray-400 text-sm">Expires 12/2026</p>
                </div>
              </div>
              <button className="mt-4 text-purple-400 hover:text-purple-300 text-sm">
                Update payment method
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StauberStudio;
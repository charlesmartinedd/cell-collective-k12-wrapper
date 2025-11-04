import React from 'react'

interface DashboardProps {
  onNavigate: (view: string) => void
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient-rainbow animate-pulse-soft">
            Explore the World of Cells!
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Build, simulate, and discover how cells work through interactive modeling.
            No coding required – just curiosity! 🔬✨
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => onNavigate('build')}
              className="btn btn-primary text-lg px-8 py-4 animate-scale-in"
            >
              🚀 Start Building
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className="btn btn-outline text-lg px-8 py-4 animate-scale-in"
              style={{ animationDelay: '0.1s' }}
            >
              📚 Explore Models
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          What would you like to do?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Build a Model */}
          <div
            onClick={() => onNavigate('build')}
            className="card card-interactive group animate-slide-up"
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              🔬
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Build a Model</h3>
            <p className="text-gray-600 leading-relaxed">
              Create your own cell model! Add components, connect them, and see how they interact.
            </p>
            <div className="mt-4 text-primary-600 font-semibold flex items-center gap-2">
              Get Started
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Card 2: Browse Models */}
          <div
            onClick={() => onNavigate('browse')}
            className="card card-interactive group animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              📚
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Explore Models</h3>
            <p className="text-gray-600 leading-relaxed">
              Discover hundreds of pre-made models. Learn about different cells and biological processes.
            </p>
            <div className="mt-4 text-primary-600 font-semibold flex items-center gap-2">
              Browse Library
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Card 3: Run Simulations */}
          <div
            onClick={() => onNavigate('simulate')}
            className="card card-interactive group animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              ⚡
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Run Simulations</h3>
            <p className="text-gray-600 leading-relaxed">
              Watch your models come alive! Run simulations and see how cells behave in real-time.
            </p>
            <div className="mt-4 text-primary-600 font-semibold flex items-center gap-2">
              Start Simulating
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Card 4: Learn */}
          <div className="card card-interactive group animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              📖
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Learning Center</h3>
            <p className="text-gray-600 leading-relaxed">
              Tutorials, guides, and fun facts about cells. Perfect for beginners!
            </p>
            <div className="mt-4 text-primary-600 font-semibold flex items-center gap-2">
              Learn More
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Card 5: Challenges */}
          <div className="card card-interactive group animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              🏆
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Fun Challenges</h3>
            <p className="text-gray-600 leading-relaxed">
              Test your knowledge with interactive challenges and earn badges!
            </p>
            <div className="mt-4 text-primary-600 font-semibold flex items-center gap-2">
              Try Challenges
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Card 6: Share */}
          <div className="card card-interactive group animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              🤝
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Share & Collaborate</h3>
            <p className="text-gray-600 leading-relaxed">
              Share your models with classmates and work together on projects!
            </p>
            <div className="mt-4 text-primary-600 font-semibold flex items-center gap-2">
              Get Sharing
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models Carousel */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          🌟 Featured Models
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card group">
            <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-4 flex items-center justify-center text-white text-6xl">
              🧬
            </div>
            <h3 className="text-xl font-bold mb-2">Cell Cycle Model</h3>
            <p className="text-gray-600 text-sm mb-4">
              Learn how cells divide and grow. Perfect for beginners!
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                Beginner
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                15 min
              </span>
            </div>
          </div>

          <div className="card group">
            <div className="aspect-video bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mb-4 flex items-center justify-center text-white text-6xl">
              🦠
            </div>
            <h3 className="text-xl font-bold mb-2">Immune Response</h3>
            <p className="text-gray-600 text-sm mb-4">
              Discover how your body fights infections!
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                Intermediate
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                25 min
              </span>
            </div>
          </div>

          <div className="card group">
            <div className="aspect-video bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mb-4 flex items-center justify-center text-white text-6xl">
              🌱
            </div>
            <h3 className="text-xl font-bold mb-2">Plant Cell Growth</h3>
            <p className="text-gray-600 text-sm mb-4">
              Explore photosynthesis and how plants make energy!
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                Beginner
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                20 min
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard

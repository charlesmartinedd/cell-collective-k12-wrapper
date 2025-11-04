import React, { useState } from 'react'

interface Model {
  id: number
  name: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  icon: string
  color: string
}

const SAMPLE_MODELS: Model[] = [
  {
    id: 1,
    name: 'Cell Cycle',
    description: 'Understand how cells divide and reproduce through mitosis',
    category: 'Cell Biology',
    difficulty: 'Beginner',
    duration: '15 min',
    icon: '🧬',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 2,
    name: 'Immune Response',
    description: 'Learn how white blood cells protect your body from infections',
    category: 'Immunology',
    difficulty: 'Intermediate',
    duration: '25 min',
    icon: '🦠',
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 3,
    name: 'Photosynthesis',
    description: 'Discover how plants convert sunlight into energy',
    category: 'Plant Biology',
    difficulty: 'Beginner',
    duration: '20 min',
    icon: '🌱',
    color: 'from-green-400 to-green-600'
  },
  {
    id: 4,
    name: 'DNA Replication',
    description: 'Explore how cells copy their genetic information',
    category: 'Genetics',
    difficulty: 'Intermediate',
    duration: '30 min',
    icon: '🧬',
    color: 'from-pink-400 to-pink-600'
  },
  {
    id: 5,
    name: 'Metabolism',
    description: 'Learn how cells break down food to create energy',
    category: 'Biochemistry',
    difficulty: 'Advanced',
    duration: '35 min',
    icon: '⚡',
    color: 'from-yellow-400 to-orange-600'
  },
  {
    id: 6,
    name: 'Nerve Signaling',
    description: 'Understand how neurons communicate with electrical signals',
    category: 'Neuroscience',
    difficulty: 'Advanced',
    duration: '40 min',
    icon: '🧠',
    color: 'from-indigo-400 to-indigo-600'
  }
]

const ModelBrowser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')

  const categories = ['All', 'Cell Biology', 'Immunology', 'Plant Biology', 'Genetics', 'Biochemistry', 'Neuroscience']
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  const filteredModels = SAMPLE_MODELS.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || model.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || model.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gradient-primary">
          📚 Model Library
        </h1>
        <p className="text-xl text-gray-600">
          Explore hundreds of interactive biology models
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-3">
            <input
              type="text"
              placeholder="🔍 Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input cursor-pointer"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="px-4 py-3 bg-primary-50 rounded-xl text-primary-700 font-medium w-full text-center">
              {filteredModels.length} models found
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model, index) => (
          <div
            key={model.id}
            className="card card-interactive group animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Icon/Preview */}
            <div className={`aspect-video bg-gradient-to-br ${model.color} rounded-2xl mb-4 flex items-center justify-center text-white text-7xl transform group-hover:scale-105 transition-transform duration-300`}>
              {model.icon}
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold mb-2 text-gray-800">{model.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{model.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                {model.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                model.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                model.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {model.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                ⏱️ {model.duration}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="btn btn-primary flex-1 text-sm">
                Open Model
              </button>
              <button className="btn btn-outline flex-1 text-sm">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredModels.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No models found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default ModelBrowser

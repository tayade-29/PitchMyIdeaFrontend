import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getIdeas, getIdeasByCategory } from '../store/slices/ideaSlice'
import IdeaCard from '../components/IdeaCard'
import { Search, Filter, TrendingUp, Clock, Heart, Eye } from 'lucide-react'

const IdeasPage = () => {
  const dispatch = useDispatch()
  const { ideas, isLoading } = useSelector((state) => state.ideas)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAndSortedIdeas, setFilteredAndSortedIdeas] = useState([])
  
  const categories = [
    { name: "All Categories", value: "all" },
    { name: "Technology", value: "Technology" },
    { name: "Business", value: "Business" },
    { name: "Social Impact", value: "Social Impact" },
    { name: "Environment", value: "Environment" },
    { name: "Health", value: "Health" },
    { name: "Education", value: "Education" }
  ]

  const sortOptions = [
    { name: "Most Recent", value: "recent", icon: Clock },
    { name: "Most Liked", value: "liked", icon: Heart },
    { name: "Most Viewed", value: "viewed", icon: Eye }
  ]

  // Fetch ideas when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      dispatch(getIdeas())
    } else {
      dispatch(getIdeasByCategory(selectedCategory))
    }
  }, [selectedCategory, dispatch])

  // Filter and sort ideas when ideas, searchTerm, or sortBy changes
  useEffect(() => {
    let processedIdeas = [...ideas]

    // Apply search filter
    if (searchTerm.trim()) {
      processedIdeas = processedIdeas.filter(idea =>
        idea.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        processedIdeas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'liked':
        processedIdeas.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        break
      case 'viewed':
        // Note: Since views field doesn't exist in schema, sorting by combination of likes and creation date
        processedIdeas.sort((a, b) => {
          const scoreA = (a.likes?.length || 0) * 0.7 + (new Date(a.createdAt).getTime() / 1000000) * 0.3
          const scoreB = (b.likes?.length || 0) * 0.7 + (new Date(b.createdAt).getTime() / 1000000) * 0.3
          return scoreB - scoreA
        })
        break
      default:
        break
    }

    setFilteredAndSortedIdeas(processedIdeas)
  }, [ideas, searchTerm, sortBy])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Loading brilliant ideas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            IdeaBridge
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between startup ideas and investors. Discover, explore, and connect with innovative concepts from brilliant minds worldwide.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 animate-slide-up">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search ideas, technologies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 sm:mb-10 gap-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-800/70 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all backdrop-blur-sm min-w-[200px] appearance-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="bg-gray-800">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-800/70 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all backdrop-blur-sm min-w-[180px] appearance-none cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-4">
            <div className="text-gray-400 text-sm sm:text-base">
              <span className="font-medium text-white">{filteredAndSortedIdeas.length}</span> ideas found
            </div>
            {selectedCategory !== 'all' && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-600/30">
                <Filter className="w-3 h-3" />
                {categories.find(c => c.value === selectedCategory)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="mb-6 flex flex-wrap gap-2 animate-slide-up">
            {searchTerm && (
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 text-purple-400 text-sm rounded-lg border border-purple-600/30">
                <Search className="w-3 h-3" />
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-purple-300 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 text-sm rounded-lg border border-blue-600/30 sm:hidden">
                <Filter className="w-3 h-3" />
                {categories.find(c => c.value === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:text-blue-300 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ideas Grid */}
        {filteredAndSortedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredAndSortedIdeas.map((idea, index) => (
              <div
                key={idea._id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-slide-up"
              >
                <IdeaCard idea={idea} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-slide-up">
            <div className="bg-gray-800/50 rounded-2xl p-12 max-w-md mx-auto border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">No Ideas Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? 
                  `No ideas match your search "${searchTerm}". Try different keywords or browse all categories.` :
                  "No ideas found in this category. Be the first to share your brilliant idea!"
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Load More Button (if you want to implement pagination later) */}
        {filteredAndSortedIdeas.length > 0 && filteredAndSortedIdeas.length >= 12 && (
          <div className="text-center mt-12 animate-slide-up">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Load More Ideas
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default IdeasPage
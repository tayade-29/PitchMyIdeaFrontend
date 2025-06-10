import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getIdeas, getIdeasByCategory } from '../store/slices/ideaSlice'
import IdeaCard from '../components/IdeaCard'

const IdeasPage = () => {
  const dispatch = useDispatch()
  const { ideas, isLoading } = useSelector((state) => state.ideas)
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = [
    { name: "All Categories", value: "all" },
    { name: "Technology", value: "technology" },
    { name: "Business", value: "business" },
    { name: "Social Impact", value: "social-impact" },
    { name: "Environment", value: "environment" },
    { name: "Health", value: "health" },
    { name: "Education", value: "education" }
  ]

  useEffect(() => {
    if (selectedCategory === 'all') {
      dispatch(getIdeas())
    } else {
      dispatch(getIdeasByCategory(selectedCategory))
    }
  }, [selectedCategory, dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ideas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            Discover Innovative Ideas
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
            Explore a curated collection of groundbreaking concepts and creative solutions from visionary minds around the world.
          </p>
        </div>

        {/* Filter/Sort Options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0 animate-slide-up">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white px-3 sm:px-4 py-2 rounded-md focus:outline-none focus:border-gray-600 text-sm sm:text-base"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.name}
                </option>
              ))}
            </select>
            <select className="bg-gray-900 border border-gray-700 text-white px-3 sm:px-4 py-2 rounded-md focus:outline-none focus:border-gray-600 text-sm sm:text-base">
              <option>Most Recent</option>
              <option>Most Liked</option>
              <option>Most Viewed</option>
            </select>
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">
            {ideas.length} ideas found
          </div>
        </div>

        {/* Ideas Grid */}
        {ideas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ideas.map((idea, index) => (
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
          <div className="text-center py-12">
            <p className="text-gray-400 text-base sm:text-lg">No ideas found. Be the first to share your idea!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default IdeasPage
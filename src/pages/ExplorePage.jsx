import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getIdeas, getIdeasByCategory } from '../store/slices/ideaSlice'
import IdeaCard from '../components/IdeaCard'

const ExplorePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { ideas, isLoading } = useSelector((state) => state.ideas)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Categories must match exactly what's used in PostMyIdea
  const categories = [
    { name: "Technology", value: "Technology", color: "bg-blue-500/20 border-blue-500/30" },
    { name: "Business", value: "Business", color: "bg-green-500/20 border-green-500/30" },
    { name: "Social Impact", value: "Social Impact", color: "bg-purple-500/20 border-purple-500/30" },
    { name: "Environment", value: "Environment", color: "bg-emerald-500/20 border-emerald-500/30" },
    { name: "Health", value: "Health", color: "bg-red-500/20 border-red-500/30" },
    { name: "Education", value: "Education", color: "bg-yellow-500/20 border-yellow-500/30" }
  ]

  // Fetch all ideas on initial load
  useEffect(() => {
    dispatch(getIdeas())
  }, [dispatch])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    dispatch(getIdeasByCategory(category))
  }

  const handleClearSelection = () => {
    setSelectedCategory(null)
    dispatch(getIdeas()) // Fetch all ideas again
  }

  // Filter ideas for selected category
  const filteredIdeas = selectedCategory 
    ? ideas.filter(idea => idea.category === selectedCategory) 
    : []

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            Explore Ideas
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Discover trending concepts, browse by categories, and find inspiration from the most innovative minds.
          </p>
        </div>

        {/* Category selection header */}
        {selectedCategory && (
          <div className="mt-8 flex items-center justify-between animate-slide-up">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {categories.find(cat => cat.value === selectedCategory)?.name} Ideas
            </h2>
            <button 
              onClick={handleClearSelection}
              className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              View All Categories
            </button>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
          {categories.map((category, index) => (
            <div
              key={category.value}
              style={{ animationDelay: `${index * 0.1}s` }}
              className={`${category.color} border rounded-lg p-4 sm:p-6 hover:scale-[1.02] transition-transform duration-200 cursor-pointer animate-slide-up ${
                selectedCategory === category.value ? 'ring-2 ring-white scale-[1.02]' : ''
              }`}
              onClick={() => handleCategoryClick(category.value)}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">{category.name}</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {ideas.filter(idea => idea.category === category.value).length} ideas
              </p>
            </div>
          ))}
        </div>

        {/* Display ideas */}
        <div className="mt-10 animate-slide-up">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : selectedCategory ? (
            // Show filtered ideas for selected category
            filteredIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredIdeas.map((idea, index) => (
                  <div 
                    key={idea._id} 
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="animate-slide-up"
                  >
                    <IdeaCard idea={idea} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No ideas found in this category</p>
              </div>
            )
          ) : (
            // Show all ideas when no category selected
            ideas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {ideas.map((idea, index) => (
                  <div 
                    key={idea._id} 
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="animate-slide-up"
                  >
                    <IdeaCard idea={idea} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No ideas found</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default ExplorePage
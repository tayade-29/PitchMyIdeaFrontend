import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleLike, toggleBookmark } from '../store/slices/ideaSlice'

const IdeaCard = ({ idea }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  
  const [isLiked, setIsLiked] = useState(
    user ? idea.likes?.includes(user._id) : false
  )
  const [isBookmarked, setIsBookmarked] = useState(
    user ? user.bookmarks?.includes(idea._id) : false
  )

  const handleLike = () => {
    if (!user) return
    dispatch(toggleLike(idea._id))
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    if (!user) return
    dispatch(toggleBookmark(idea._id))
    setIsBookmarked(!isBookmarked)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 animate-fade-in h-80 w-full flex flex-col">
      {/* Idea Title - Fixed height */}
      <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 leading-tight h-14 overflow-hidden">
        {idea.heading}
      </h3>

      {/* Author - Fixed height */}
      <p className="text-gray-400 text-sm mb-4 font-medium h-5">
        by {idea.postedBy?.name} {idea.postedBy?.surname}
      </p>

      {/* Description Preview - Fixed height with flex-grow */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-4 leading-relaxed flex-grow overflow-hidden">
        {idea.details}
      </p>

      {/* Tags - Fixed height */}
      {idea.technologies && idea.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 h-8 overflow-hidden">
          {idea.technologies.slice(0, 2).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md whitespace-nowrap"
            >
              {tech}
            </span>
          ))}
          {idea.technologies.length > 2 && (
            <span className="px-2 py-1 text-gray-500 text-xs whitespace-nowrap">
              +{idea.technologies.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!user}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all duration-200 ${
              isLiked
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-medium">{idea.likes?.length || 0}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            disabled={!user}
            className={`p-1.5 rounded-md transition-all duration-200 ${
              isBookmarked
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* View Button */}
        <Link
          to={`/idea/${idea._id}`}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default IdeaCard
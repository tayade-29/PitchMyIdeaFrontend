import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleLike, toggleBookmark } from '../store/slices/ideaSlice'

const IdeaDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { ideas } = useSelector((state) => state.ideas)
  const { user } = useSelector((state) => state.auth)
  
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const foundIdea = ideas.find(idea => idea._id === id)
    if (foundIdea) {
      setIdea(foundIdea)
      setIsLiked(user ? foundIdea.likes?.includes(user._id) : false)
      setIsBookmarked(user ? user.bookmarks?.includes(foundIdea._id) : false)
    }
    setLoading(false)
  }, [id, ideas, user])

  const handleLike = () => {
    if (!user) {
      navigate('/login')
      return
    }
    dispatch(toggleLike(idea._id))
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    if (!user) {
      navigate('/login')
      return
    }
    dispatch(toggleBookmark(idea._id))
    setIsBookmarked(!isBookmarked)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading idea details...</p>
        </div>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Idea Not Found</h1>
          <Link to="/" className="text-gray-400 hover:text-white">
            Return to Ideas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Ideas
        </Link>

        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-md">
                {idea.category}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  isLiked
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">{idea.likes?.length || 0}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-md transition-all duration-200 ${
                  isBookmarked
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {idea.heading}
          </h1>

          <div className="flex items-center text-gray-400 mb-6">
            <span>by <span className="text-white font-medium">{idea.postedBy?.name} {idea.postedBy?.surname}</span></span>
            <span className="mx-2">•</span>
            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Technologies */}
        {idea.technologies && idea.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {idea.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-md hover:bg-gray-700 cursor-pointer transition-colors duration-200"
              >
                #{tech}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none animate-fade-in">
          <div className="text-gray-300 leading-relaxed space-y-6">
            <p className="text-lg">{idea.details}</p>
          </div>
        </div>

        {/* Author Info */}
        <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-2">About the Author</h3>
          <p className="text-gray-300 mb-4">
            {idea.postedBy?.name} {idea.postedBy?.surname}
          </p>
          <p className="text-gray-400">
            Member since {new Date(idea.postedBy?.createdAt || idea.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default IdeaDetailPage
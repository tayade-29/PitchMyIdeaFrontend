import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, Plus, X, Loader2, CheckCircle, AlertCircle, Code, Hash } from 'lucide-react'
import { createIdea, reset } from '../store/slices/ideaSlice'

const PostMyIdea = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get Redux state
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.ideas)
  const { user } = useSelector((state) => state.auth)

  // Form state
  const [formData, setFormData] = useState({
    heading: '',
    details: '',
    technologies: [],
    category: 'Technology' // Updated default category
  })

  const [currentTech, setCurrentTech] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)


const categories = [
  'Technology', 'Business', 'Social Impact', 
  'Environment', 'Health', 'Education'
]

  // Reset state on mount
  useEffect(() => {
    dispatch(reset())
  }, [dispatch])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const addTechnology = () => {
    if (currentTech.trim() && !formData.technologies.includes(currentTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, currentTech.trim()]
      }))
      setCurrentTech('')
    }
  }

  const removeTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }))
  }

  const handleTechKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechnology()
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.heading.trim()) {
      newErrors.heading = 'Idea heading is required'
    } else if (formData.heading.length < 5) {
      newErrors.heading = 'Heading must be at least 5 characters'
    }

    if (!formData.details.trim()) {
      newErrors.details = 'Idea details are required'
    } else if (formData.details.length < 20) {
      newErrors.details = 'Details must be at least 20 characters'
    }

    // Removed technologies validation to make it optional
    // if (formData.technologies.length === 0) {
    //   newErrors.technologies = 'Add at least one technology'
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!user) {
      alert('Please login to post an idea')
      navigate('/login')
      return
    }

    if (validateForm()) {
      setSubmitted(true)
      dispatch(createIdea(formData))
    }
  }

  useEffect(() => {
    if (isSuccess && submitted) {
      setFormData({
        heading: '',
        details: '',
        technologies: [],
        category: 'Technology' // Reset to default
      })
      setTimeout(() => {
        dispatch(reset())
        navigate('/')
      }, 2000)
    }

    if (isError) {
      setTimeout(() => {
        dispatch(reset())
      }, 5000)
    }
  }, [isSuccess, isError, dispatch, navigate, submitted])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 sm:p-4 rounded-full">
              <Lightbulb className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            Post Your Brilliant Idea
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Share your innovative concepts with the world and connect with like-minded developers and entrepreneurs.
          </p>
        </div>

        {/* Success Message */}
        {isSuccess && submitted && (
          <div className="mb-6 sm:mb-8 bg-green-500/10 border border-green-500/50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 mr-2 sm:mr-3" />
              <p className="text-green-400 font-medium text-sm sm:text-base">
                Idea posted successfully! Redirecting to home page...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="mb-6 sm:mb-8 bg-red-500/10 border border-red-500/50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-400 mr-2 sm:mr-3" />
              <p className="text-red-400 font-medium text-sm sm:text-base">{message}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-gray-700 p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Idea Heading */}
            <div>
              <label className="block text-white text-sm sm:text-base font-medium mb-2 sm:mb-3">
                <Hash className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                Idea Heading *
              </label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                placeholder="Enter your brilliant idea title..."
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.heading 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-gray-600 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
                maxLength="100"
              />
              {errors.heading && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 sm:mt-2">{errors.heading}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.heading.length}/100 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-white text-sm sm:text-base font-medium mb-2 sm:mb-3">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm sm:text-base"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-900">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Technologies (Optional) */}
            <div>
              <label className="block text-white text-sm sm:text-base font-medium mb-2 sm:mb-3">
                <Code className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                Technologies (Optional)
              </label>
              
              {/* Technology Input */}
              <div className="flex gap-2 mb-3 sm:mb-4">
                <input
                  type="text"
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  onKeyPress={handleTechKeyPress}
                  placeholder="Add a technology (e.g., React, Node.js)"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center text-sm sm:text-base"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Technology Tags */}
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-600/20 text-blue-400 text-xs sm:text-sm rounded-full border border-blue-600/30"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 sm:ml-2 hover:text-blue-300 transition-colors"
                      >
                        <X className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-500 text-xs">
                Press Enter or click + to add technologies
              </p>
            </div>

            {/* Idea Details */}
            <div>
              <label className="block text-white text-sm sm:text-base font-medium mb-2 sm:mb-3">
                Detailed Description *
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Describe your idea in detail. What problem does it solve? How would it work? What makes it unique?"
                rows="6"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-vertical ${
                  errors.details 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-gray-600 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
                maxLength="2000"
              />
              {errors.details && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 sm:mt-2">{errors.details}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.details.length}/2000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 sm:pt-6 gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors text-center"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium sm:font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting Idea...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Post My Idea
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Tips Section */}
        <div className="mt-8 sm:mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
          <h3 className="text-white font-medium sm:font-semibold text-base sm:text-lg mb-3 sm:mb-4">💡 Tips for a Great Idea Post</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-gray-300 text-xs sm:text-sm">
            <div className="flex items-start">
              <span className="text-blue-400 font-medium mr-2">•</span>
              <span><strong className="text-blue-400">Be Specific:</strong> Clear, detailed descriptions get more engagement</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 font-medium mr-2">•</span>
              <span><strong className="text-green-400">Use Keywords:</strong> Add relevant technologies to help others find your idea</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 font-medium mr-2">•</span>
              <span><strong className="text-purple-400">Explain the Problem:</strong> What issue does your idea solve?</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-400 font-medium mr-2">•</span>
              <span><strong className="text-orange-400">Be Original:</strong> Share your unique perspective and approach</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostMyIdea
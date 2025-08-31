import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalWithForm from './ModalWithForm'
import { setAuth } from '../lib/auth'
import { simulateLogin } from '../utils/BackendSimulator'
import { toast } from '../lib/notify'

const ROLES = ['admin', 'teacher', 'student']

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    role: 'student',
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Use the backend simulator for authentication
      const result = await simulateLogin({
        username: formData.username,
        password: formData.password,
        role: formData.role
      })
      
      // Set authentication state
      setAuth(result.user.role, result.user.id, result.token)
      
      // Show success message
      toast(`Welcome back, ${result.user.username}!`, 'success')
      
      // Navigate to appropriate dashboard
      const routes = { admin: '/admin', teacher: '/teacher', student: '/student' }
      navigate(routes[result.user.role] || '/')
      
      // Close modal
      onClose()
      
    } catch (error) {
      console.error('Login failed:', error)
      toast(error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      role: 'student',
      username: '',
      password: ''
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={handleClose}
      title="Sign In"
      onSubmit={handleSubmit}
      submitText={isLoading ? "Signing In..." : "Sign In"}
      submitButtonType="login"
      secondaryButton={{
        text: "Sign Up Instead",
        onClick: onSwitchToRegister
      }}
    >
      <fieldset className="form__field">
        <legend className="form__label">Choose your role</legend>
        <div className="list" role="radiogroup" aria-label="Role">
          {ROLES.map(role => (
            <label key={role} className="list__item flex gap-8 items-center">
              <input
                type="radio"
                name="role"
                value={role}
                checked={formData.role === role}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              <span className="capitalize">
                {role === 'student' ? 'Parent/Student' : role}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="demo-credentials">
        <h4>Demo Credentials:</h4>
        <ul>
          <li><strong>Admin:</strong> admin / admin123</li>
          <li><strong>Teacher:</strong> teacher / teacher123</li>
          <li><strong>Student:</strong> student / student123</li>
        </ul>
      </div>

      <label className="form__field">
        <span className="form__label">Username</span>
        <input 
          type="text" 
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required 
          placeholder="Enter username" 
          className="form__input"
          disabled={isLoading}
        />
      </label>
      
      <label className="form__field">
        <span className="form__label">Password</span>
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required 
          placeholder="••••••••" 
          className="form__input"
          disabled={isLoading}
        />
      </label>
    </ModalWithForm>
  )
}

export default LoginModal

import { useState } from 'react'
import ModalWithForm from './ModalWithForm'
import { toast } from '../lib/notify'
import { store } from '../lib/store'

const RegisterModal = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    role: '',
    instrument: '', // for teachers
    teacherId: '' // for students
  })
  
  // Get available teachers from store
  const availableTeachers = store.getState().teachers

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.role) {
      toast('Please select a role.', 'warning')
      return
    }
    
    if (!formData.username || !formData.password || !formData.email) {
      toast('Please fill in all required fields.', 'warning')
      return
    }

    // Role-specific validation
    if (formData.role === 'teacher' && !formData.instrument) {
      toast('Please select the instrument you teach.', 'warning')
      return
    }

    if (formData.role === 'student' && !formData.teacherId) {
      toast('Please select a teacher.', 'warning')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast('Passwords do not match.', 'error')
      return
    }
    
    if (formData.password.length < 6) {
      toast('Password must be at least 6 characters long.', 'warning')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast('Please enter a valid email address.', 'warning')
      return
    }

    // Simulate registration (in real app, this would make an API call)
    toast(`Registration successful! Welcome to Tempo, ${formData.username}!`, 'success')
    
    // Prepare registration data with role-specific information
    const registrationData = {
      username: formData.username,
      role: formData.role,
      email: formData.email,
      ...(formData.role === 'teacher' && { instrument: formData.instrument }),
      ...(formData.role === 'student' && { teacherId: parseInt(formData.teacherId) })
    }
    
    onRegister(registrationData)
    onClose()
    
    // Reset form
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      role: '',
      instrument: '',
      teacherId: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Register for Tempo"
      onSubmit={handleSubmit}
      submitText="Register"
      submitButtonType="register"
      secondaryButton={{
        text: "Login Instead",
        onClick: () => {
          onSwitchToLogin()
        }
      }}
    >
      <div className="modal__field">
        <label className="modal__label">Select Your Role:</label>
        <div className="role-selector">
          {['teacher', 'student'].map(role => (
            <label key={role} className="role-selector__option">
              <input
                type="radio"
                name="role"
                value={role}
                checked={formData.role === role}
                onChange={handleInputChange}
              />
              <span className="role-selector__text">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </label>
          ))}
        </div>
        <small className="modal__note">
          Teachers: Select your primary instrument • Students: Choose your preferred teacher
        </small>
        <small className="modal__note">Note: Admin accounts require special approval.</small>
      </div>

      <div className="modal__field">
        <label htmlFor="reg-username" className="modal__label">Username *</label>
        <input
          type="text"
          id="reg-username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="modal__input"
          placeholder="Choose a username"
          required
        />
      </div>

      <div className="modal__field">
        <label htmlFor="reg-email" className="modal__label">Email *</label>
        <input
          type="email"
          id="reg-email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="modal__input"
          placeholder="your.email@example.com"
          required
        />
      </div>

      {/* Role-specific fields */}
      {formData.role === 'teacher' && (
        <div className="modal__field">
          <label htmlFor="reg-instrument" className="modal__label">Instrument You Teach *</label>
          <select
            id="reg-instrument"
            name="instrument"
            value={formData.instrument}
            onChange={handleInputChange}
            className="modal__input"
            required
          >
            <option value="">Select an instrument</option>
            <option value="Piano">Piano</option>
            <option value="Guitar">Guitar</option>
            <option value="Violin">Violin</option>
            <option value="Drums">Drums</option>
            <option value="Voice">Voice/Vocals</option>
            <option value="Bass">Bass Guitar</option>
            <option value="Flute">Flute</option>
            <option value="Saxophone">Saxophone</option>
            <option value="Trumpet">Trumpet</option>
            <option value="Cello">Cello</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}

      {formData.role === 'student' && (
        <div className="modal__field">
          <label htmlFor="reg-teacher" className="modal__label">Select Your Teacher *</label>
          <select
            id="reg-teacher"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleInputChange}
            className="modal__input"
            required
          >
            <option value="">Choose a teacher</option>
            {availableTeachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} - {teacher.instrument}
              </option>
            ))}
          </select>
          <small className="modal__note">
            Select the teacher for your instrument of choice
          </small>
        </div>
      )}

      <div className="modal__field">
        <label htmlFor="reg-password" className="modal__label">Password * (min. 6 characters)</label>
        <input
          type="password"
          id="reg-password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="modal__input"
          placeholder="••••••••"
          minLength="6"
          required
        />
      </div>

      <div className="modal__field">
        <label htmlFor="reg-confirm-password" className="modal__label">Confirm Password *</label>
        <input
          type="password"
          id="reg-confirm-password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="modal__input"
          placeholder="••••••••"
          required
        />
      </div>
    </ModalWithForm>
  )
}

export default RegisterModal

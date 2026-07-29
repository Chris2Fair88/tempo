import { useEffect } from 'react'

const ModalWithForm = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit, 
  submitText = "Submit",
  submitButtonType = "default", // "login", "register", or "default"
  secondaryButton
}) => {
  // Close modal on Escape key (required by criteria)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    // Close on overlay click (required by criteria)
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <div className="modal" onClick={handleOverlayClick}>
      <div className="modal__container">
        <button 
          className="modal__close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <form className="modal__form" onSubmit={handleSubmit}>
          <h2 className="modal__title">{title}</h2>
          
          <div className="modal__content">
            {children}
          </div>
          
          <div className="modal__actions">
            <button 
              type="submit" 
              className={
                submitButtonType === "login" ? "button-login" :
                submitButtonType === "register" ? "button-register" :
                "button button--primary"
              }
            >
              {submitText}
            </button>
            {secondaryButton && (
              <button 
                type="button" 
                className="button button--secondary"
                onClick={secondaryButton.onClick}
              >
                {secondaryButton.text}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalWithForm

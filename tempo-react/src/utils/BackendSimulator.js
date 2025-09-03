// Simulate user database
let users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@tempo.com' },
  { id: 2, username: 'teacher', password: 'teacher123', role: 'teacher', email: 'teacher@tempo.com', instrument: 'Piano' },
  { id: 3, username: 'student', password: 'student123', role: 'student', email: 'student@tempo.com', teacherId: 2 }
]

// Simulate API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const simulateLogin = async (credentials) => {
  await simulateDelay()
  
  const { username, password } = credentials
  const user = users.find(u => u.username === username && u.password === password)
  
  if (!user) {
    throw new Error('Invalid username or password')
  }
  
  // Simulate token generation
  const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }))
  
  return {
    user: { ...user, password: undefined }, // Don't return password
    token,
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
}

export const simulateRegister = async (userData) => {
  await simulateDelay()
  
  // Check if username already exists
  if (users.find(u => u.username === userData.username)) {
    throw new Error('Username already exists')
  }
  
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    throw new Error('Email already registered')
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    ...userData,
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  
  return {
    user: { ...newUser, password: undefined },
    message: 'Registration successful! Please log in.'
  }
}

export const simulateTokenCheck = async (token) => {
  await simulateDelay(200)
  
  try {
    const decoded = JSON.parse(atob(token))
    const user = users.find(u => u.id === decoded.userId)
    
    if (!user || Date.now() > decoded.timestamp + (24 * 60 * 60 * 1000)) {
      throw new Error('Token expired')
    }
    
    return { valid: true, user: { ...user, password: undefined } }
  } catch {
    throw new Error('Invalid token')
  }
}

export const simulateUserProfile = async (userId) => {
  await simulateDelay()
  
  const user = users.find(u => u.id === userId)
  if (!user) {
    throw new Error('User not found')
  }
  
  return { ...user, password: undefined }
}

export const simulateDeleteUser = async (userId) => {
  await simulateDelay()
  
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  users.splice(userIndex, 1)
  return { message: 'User deleted successfully' }
}

// Get all users for admin purposes
export const simulateGetAllUsers = async () => {
  await simulateDelay()
  return users.map(user => ({ ...user, password: undefined }))
}

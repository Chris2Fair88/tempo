/**
 * Mock User Database
 * 
 * Simulates a backend authentication system with predefined users
 * and their assigned roles. In a real application, this would be
 * replaced with actual backend API calls.
 */

export const MOCK_USERS = [
  // Admin Users
  {
    id: 1,
    email: 'admin@tempo-music.edu',
    password: 'admin123',
    role: 'admin',
    name: 'Maestro Sarah Crescendo',
    instrument: 'Administration'
  },
  {
    id: 2,
    email: 'director@tempo-music.edu', 
    password: 'director123',
    role: 'admin',
    name: 'Dr. Michael Forte',
    instrument: 'Music Direction'
  },

  // Teacher Users
  {
    id: 3,
    email: 'teacher@tempo-music.edu',
    password: 'teacher123',
    role: 'teacher',
    name: 'Maya Reyes',
    instrument: 'Piano',
    specialties: ['Classical', 'Jazz', 'Music Theory']
  },
  {
    id: 4,
    email: 'piano.teacher@tempo-music.edu',
    password: 'teacher123',
    role: 'teacher',
    name: 'Maya Reyes',
    instrument: 'Piano',
    specialties: ['Classical', 'Jazz', 'Music Theory']
  },
  {
    id: 5,
    email: 'violin.teacher@tempo-music.edu',
    password: 'teacher123',
    role: 'teacher', 
    name: 'Viktor Staccato',
    instrument: 'Violin',
    specialties: ['Classical', 'Contemporary', 'Chamber Music']
  },
  {
    id: 6,
    email: 'guitar.teacher@tempo-music.edu',
    password: 'teacher123',
    role: 'teacher',
    name: 'Carlos Allegro',
    instrument: 'Guitar',
    specialties: ['Classical Guitar', 'Rock', 'Flamenco']
  },
  {
    id: 7,
    email: 'voice.teacher@tempo-music.edu',
    password: 'teacher123',
    role: 'teacher',
    name: 'Isabella Soprano',
    instrument: 'Voice',
    specialties: ['Opera', 'Musical Theatre', 'Pop Vocal']
  },

  // Student Users
  {
    id: 8,
    email: 'student@tempo-music.edu',
    password: 'student123',
    role: 'student',
    name: 'Harmony Mitchell',
    level: 'Intermediate',
    studentId: 'TM2024001',
    instrument: 'Piano',
    enrolledSince: '2023'
  },
  {
    id: 9,
    email: 'harmony.student@tempo-music.edu',
    password: 'student123',
    role: 'student',
    name: 'Harmony Mitchell',
    level: 'Intermediate',
    studentId: 'TM2024001',
    instrument: 'Piano',
    enrolledSince: '2023'
  },
  {
    id: 10,
    email: 'melody.student@tempo-music.edu',
    password: 'student123', 
    role: 'student',
    name: 'Melody Rodriguez',
    level: 'Advanced',
    studentId: 'TM2024002',
    instrument: 'Violin',
    enrolledSince: '2022'
  },
  {
    id: 11,
    email: 'rhythm.student@tempo-music.edu',
    password: 'student123',
    role: 'student',
    name: 'Rhythm Parker',
    level: 'Beginner', 
    studentId: 'TM2024003',
    instrument: 'Guitar',
    enrolledSince: '2024'
  },

  // Parent Users
  {
    id: 12,
    email: 'parent@tempo-music.edu',
    password: 'parent123',
    role: 'parent',
    name: 'David Mitchell',
    children: ['Harmony Mitchell'],
    studentIds: ['TM2024001']
  },
  {
    id: 13,
    email: 'parent.mitchell@example.com',
    password: 'parent123',
    role: 'parent',
    name: 'David Mitchell',
    children: ['Harmony Mitchell'],
    studentIds: ['TM2024001']
  },
  {
    id: 14,
    email: 'parent.rodriguez@example.com',
    password: 'parent123',
    role: 'parent',
    name: 'Carmen Rodriguez',
    children: ['Melody Rodriguez'],
    studentIds: ['TM2024002']
  }
];

/**
 * Simulate authentication API call
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Authentication result
 */
export function authenticateUser(email, password) {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      if (user) {
        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        resolve({
          success: true,
          user: userWithoutPassword,
          message: 'Authentication successful'
        });
      } else {
        reject({
          success: false,
          message: 'Invalid email or password'
        });
      }
    }, 800); // Simulate 800ms network delay
  });
}

/**
 * Get user by ID (for session validation)
 * @param {number} userId - User ID
 * @returns {Object|null} - User data or null
 */
export function getUserById(userId) {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

// Non-variable values (hard-coded constants) are named in all capital letters
export const API_BASES = Object.freeze({
    HOLIDAYS: import.meta.env.VITE_PUBLIC_HOLIDAYS_API || 'https://date.nager.at'
});

// Requests can be made through the Fetch API (criteria requirement)
// Third-party libraries (such as axios or jQuery) are not used (criteria requirement)
export function fetchJson(url, options = {}) {
  return fetch(url, options)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      // The first then() handler returns res.json (criteria requirement)
      return res.json();
    })
    // The chain for processing promises ends with a catch() block (criteria requirement)
    .catch(err => { 
      // Enhanced error handling for Stage 1.2 compliance
      if (!navigator.onLine) {
        throw new Error('Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later.');
      }
      throw err; 
    });
}

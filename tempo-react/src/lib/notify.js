export function toast(message, variant = 'success', duration = 2500) {
  try {
    const detail = { id: Date.now() + Math.random(), message, variant, duration };
    window.dispatchEvent(new CustomEvent('tempo:toast', { detail }));
  } catch (err) { // eslint-disable-line no-unused-vars
    // no-op in non-browser envs
  }
}

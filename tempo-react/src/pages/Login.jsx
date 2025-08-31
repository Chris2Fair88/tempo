import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DASHBOARD_ROUTE_BY_ROLE, setRole } from '../lib/auth';

const ROLES = ['student', 'teacher', 'admin'];

export default function Login() {
  const [search] = useSearchParams();
  const [role, setRoleState] = useState('student');
  const navigate = useNavigate();

  useEffect(() => {
    const q = (search.get('role') || '').toLowerCase();
    if (ROLES.includes(q)) setRoleState(q);
  }, [search]);

  function onSubmit(e) {
    e.preventDefault();
    setRole(role);
    navigate(DASHBOARD_ROUTE_BY_ROLE[role] || '/');
  }

  return (
  <form className="form mx-auto mt-24" onSubmit={onSubmit}>
      <h1 className="section-title">Login (Demo)</h1>

      <fieldset className="form__field">
        <legend className="form__label">Choose a role</legend>
        <div className="list" role="radiogroup" aria-label="Role">
  {ROLES.map(r => (
    <label key={r} className="list__item flex gap-8 items-center">
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={e => setRoleState(e.target.value)}
                required
              />
  <span className="capitalize">{r === 'student' ? 'Parent/Student' : r}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="form__field">
        <span className="form__label">Email</span>
        <input type="email" required placeholder="you@example.com" className="form__input" />
      </label>
      <label className="form__field">
        <span className="form__label">Password</span>
        <input type="password" required placeholder="••••••••" className="form__input" />
      </label>
      <button className="button-login" type="submit">Continue</button>
    </form>
  );
}
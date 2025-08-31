# BEM Methodology Implementation

This project now follows BEM (Block Element Modifier) methodology for CSS class naming conventions.

## BEM Structure Overview

### ✅ Properly Implemented BEM Components

#### 1. **Site Header**
- **Block**: `site-header`
- **Elements**: `site-header__inner`, `site-header__brand`, `site-header__logo`, `site-header__name`, `site-header__tag`, `site-header__actions`
- **Modifiers**: `site-header__brand--centered`

#### 2. **Customer Service**
- **Block**: `customer-service`
- **Elements**: `customer-service__button`, `customer-service__dropdown`, `customer-service__header`, `customer-service__close`, `customer-service__item`

#### 3. **Forms**
- **Block**: `form`
- **Elements**: `form__field`, `form__label`, `form__input`

#### 4. **Lists**
- **Block**: `list`
- **Elements**: `list__item`

#### 5. **Modals**
- **Block**: `modal`
- **Elements**: `modal__container`, `modal__form`, `modal__title`, `modal__content`, `modal__actions`, `modal__close`
- **Register Modal**: `modal__field`, `modal__label`, `modal__input`, `modal__note`

#### 6. **API Data Display**
- **Block**: `api-data-display`
- **Elements**: `api-data-display__title`, `api-data-display__error`, `api-data-display__empty`, `api-data-display__grid`, `api-data-display__item`, `api-data-display__actions`, `api-data-display__show-more`, `api-data-display__meta`

#### 7. **Site Navigation**
- **Block**: `site-nav`
- **Elements**: `site-nav__list`, `site-nav__item`, `site-nav__link`

#### 8. **Hero Section**
- **Block**: `hero`
- **Elements**: `hero__actions`

#### 9. **Home Page**
- **Block**: `home`
- **Elements**: `home__card-section`

#### 10. **Buttons**
- **Specific buttons**: `button-login`, `button-register`
- **General button modifiers**: `button--secondary`, `button--small`

#### 11. **Admin Dashboard**
- **Block**: `admin-header`
- **Elements**: `admin-header__brand`, `admin-header__logo`, `admin-header__title`, `admin-header__logout`

#### 12. **Role Selector**
- **Block**: `role-selector`
- **Elements**: `role-selector__option`, `role-selector__text`

#### 13. **Preloader**
- **Block**: `preloader`
- **Elements**: `preloader__message`

#### 14. **Logo**
- **Block**: `logo`
- **Modifiers**: `logo--pulse`

### ✅ BEM Methodology Rules Applied

1. **Block**: Independent component (e.g., `site-header`, `modal`, `form`)
2. **Element**: Part of a block (e.g., `site-header__logo`, `form__input`, `modal__title`)
3. **Modifier**: Variant or state (e.g., `site-header__brand--centered`, `button--secondary`)

### ✅ Naming Convention

- **Block**: `block-name`
- **Element**: `block-name__element-name`
- **Modifier**: `block-name--modifier-name` or `block-name__element--modifier-name`

### ✅ Cleaned Up Non-BEM Classes

- ❌ `hero-actions` → ✅ `hero__actions`
- ❌ `home_card_section` → ✅ `home__card-section`
- ❌ `nav-link` → ✅ `site-nav__link` (already existing)
- ❌ `form-input`, `form-field`, `form-label` → ✅ `form__input`, `form__field`, `form__label`

### ✅ Utility Classes (Maintained)

The following utility classes remain as-is since they're not components but utilities:
- `.flex`, `.items-center`, `.justify-between`, `.gap-8`
- `.mt-6`, `.mt-8`, `.mt-12`, `.mt-24`, `.mt-16`
- `.capitalize`, `.mx-auto`, `.text-center`
- `.container`, `.container--fullwidth`

### ✅ Benefits Achieved

1. **Maintainability**: Easy to locate and modify component styles
2. **Scalability**: Clear structure allows easy addition of new elements/modifiers
3. **Reusability**: Components are self-contained and reusable
4. **Clarity**: Class names are descriptive and self-documenting
5. **Specificity Control**: Avoids CSS specificity conflicts
6. **Team Collaboration**: Clear naming convention for all developers

### ✅ Example Usage

```jsx
// BEM-compliant header structure
<header className="site-header">
  <div className="site-header__inner">
    <div className="site-header__brand site-header__brand--centered">
      <span className="site-header__logo">♫</span>
      <span className="site-header__name">Tempo</span>
    </div>
    <div className="site-header__actions">
      <button className="customer-service__button">Support</button>
    </div>
  </div>
</header>

// BEM-compliant form structure
<form className="form">
  <div className="form__field">
    <label className="form__label">Username</label>
    <input className="form__input" type="text" />
  </div>
  <button className="button-login">Login</button>
</form>
```

This BEM implementation provides a solid foundation for scalable and maintainable CSS architecture.

import React from 'react';
import { useApiData } from '../hooks/useApiData';

/**
 * API Data Management Components
 * 
 * Provides reusable components for displaying API data with loading states,
 * error handling, search functionality, and pagination.
 */

/**
 * Preloader component with loading animation
 */
export function Preloader({ message = 'Loading...', className = '' }) {
  return (
    <div className={`preloader ${className}`}>
      <div className="preloader__spinner" aria-hidden="true"></div>
      <p className="preloader__message">{message}</p>
    </div>
  );
}

/**
 * Error message component for API failures
 */
export function ErrorMessage({ message, onRetry, className = '' }) {
  return (
    <div className={`error-message ${className}`}>
      <div className="error-message__icon" aria-hidden="true">⚠️</div>
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <button 
          className="button button--secondary error-message__retry"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Generic API data list component
 */
export function ApiDataList({ 
  useApiFunction,
  initialItemsToShow = 3,
  title = 'API Data',
  className = ''
}) {
  const {
    displayedData,
    isLoading,
    hasError,
    errorMessage,
    canShowMore,
    hasNoData,
    showMoreItems,
    reloadData
  } = useApiData(useApiFunction, initialItemsToShow);

  if (isLoading) {
    return <Preloader message="Loading data..." className={className} />;
  }

  if (hasError) {
    return (
      <ErrorMessage 
        message={errorMessage} 
        onRetry={reloadData}
        className={className}
      />
    );
  }

  if (hasNoData) {
    return (
      <div className={className}>
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3>{title}</h3>
      <ul className="list">
        {displayedData.map(item => (
          <li key={item.id} className="list__item">
            <strong>{item.date}:</strong> {item.title}
            {item.location && <span> • {item.location}</span>}
          </li>
        ))}
      </ul>
      {canShowMore && (
        <button
          className="button button--secondary"
          onClick={showMoreItems}
        >
          Show More
        </button>
      )}
    </div>
  );
}

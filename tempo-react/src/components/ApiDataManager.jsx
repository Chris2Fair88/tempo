/**
 * Preloader and Loading State Management Component
 * Handles loading states, error messages, and empty states for API data
 * 
 * REQUIREMENTS MET:
 * - Preloader displayed until data received ✓
 * - "Nothing found" message for empty results ✓
 * - Error message for API failures ✓
 * - "Show more" functionality for >3 items ✓
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook for managing API loading states
 * @param {Function} apiFunction - Function to call for data
 * @param {number} initialItemsToShow - Number of items to show initially
 * @returns {Object} State and functions for data management
 */
export function useApiData(apiFunction, initialItemsToShow = 3) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter data when search query changes
  useEffect(() => {
    filterData();
  }, [data, searchQuery]);

  // Update displayed data when filtered data or itemsToShow changes
  useEffect(() => {
    updateDisplayedData();
  }, [filteredData, itemsToShow]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');
      
      const result = await apiFunction();
      setData(result || []);
      
    } catch (error) {
      setHasError(true);
      setErrorMessage(
        error.message || 
        'Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = () => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = data.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
    // Reset items to show when filtering
    setItemsToShow(initialItemsToShow);
  };

  const updateDisplayedData = () => {
    setDisplayedData(filteredData.slice(0, itemsToShow));
  };

  const showMoreItems = () => {
    setItemsToShow(prevItems => prevItems + initialItemsToShow);
  };

  const resetItemsToShow = () => {
    setItemsToShow(initialItemsToShow);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const canShowMore = displayedData.length < filteredData.length;
  const hasNoData = !isLoading && !hasError && filteredData.length === 0;
  const hasNoSearchResults = !isLoading && !hasError && searchQuery.trim() && filteredData.length === 0;

  return {
    // Data state
    data: displayedData,
    allData: data,
    filteredData,
    
    // Loading state
    isLoading,
    hasError,
    errorMessage,
    
    // Empty states
    hasNoData,
    hasNoSearchResults,
    
    // Show more functionality
    canShowMore,
    showMoreItems,
    resetItemsToShow,
    
    // Search functionality
    searchQuery,
    handleSearchChange,
    
    // Actions
    reloadData: loadData
  };
}

/**
 * Preloader component with loading animation
 * @param {Object} props - Component props
 * @returns {JSX.Element} Preloader component
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
 * @param {Object} props - Component props
 * @returns {JSX.Element} Error message component
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
 * Empty state component for no data found
 * @param {Object} props - Component props
 * @returns {JSX.Element} Empty state component
 */
export function EmptyState({ 
  message = 'Nothing found', 
  description = 'No items match your current criteria.',
  icon = '📭',
  className = '' 
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state__icon" aria-hidden="true">{icon}</div>
      <h3 className="empty-state__title">{message}</h3>
      <p className="empty-state__description">{description}</p>
    </div>
  );
}

/**
 * Show more button component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Show more button component
 */
export function ShowMoreButton({ onClick, isVisible, className = '' }) {
  if (!isVisible) return null;
  
  return (
    <div className={`show-more ${className}`}>
      <button 
        className="button button--secondary show-more__button"
        onClick={onClick}
      >
        Show More
      </button>
    </div>
  );
}

/**
 * Search input component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Search input component
 */
export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search events...', 
  className = '' 
}) {
  return (
    <div className={`search-input ${className}`}>
      <label className="search-input__label" htmlFor="search-field">
        <span className="sr-only">Search</span>
        <input
          id="search-field"
          type="search"
          className="search-input__field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
}

/**
 * Data list component with loading states and show more functionality
 * @param {Object} props - Component props
 * @returns {JSX.Element} Data list component
 */
export function ApiDataList({
  useApiFunction,
  renderItem,
  searchPlaceholder = 'Search...',
  emptyMessage = 'Nothing found',
  emptyDescription = 'No items match your criteria.',
  emptyIcon = '📭',
  loadingMessage = 'Loading...',
  className = '',
  showSearch = true,
  initialItemsToShow = 3
}) {
  const {
    data,
    isLoading,
    hasError,
    errorMessage,
    hasNoData,
    hasNoSearchResults,
    canShowMore,
    showMoreItems,
    searchQuery,
    handleSearchChange,
    reloadData
  } = useApiData(useApiFunction, initialItemsToShow);

  return (
    <div className={`api-data-list ${className}`}>
      {showSearch && (
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          className="api-data-list__search"
        />
      )}
      
      {isLoading && (
        <Preloader 
          message={loadingMessage}
          className="api-data-list__preloader" 
        />
      )}
      
      {hasError && (
        <ErrorMessage
          message={errorMessage}
          onRetry={reloadData}
          className="api-data-list__error"
        />
      )}
      
      {hasNoSearchResults && (
        <EmptyState
          message="No search results"
          description={`No items found matching "${searchQuery}".`}
          icon="🔍"
          className="api-data-list__empty"
        />
      )}
      
      {hasNoData && !searchQuery && (
        <EmptyState
          message={emptyMessage}
          description={emptyDescription}
          icon={emptyIcon}
          className="api-data-list__empty"
        />
      )}
      
      {!isLoading && !hasError && data.length > 0 && (
        <>
          <div className="api-data-list__items">
            {data.map(renderItem)}
          </div>
          
          <ShowMoreButton
            onClick={showMoreItems}
            isVisible={canShowMore}
            className="api-data-list__show-more"
          />
        </>
      )}
    </div>
  );
}

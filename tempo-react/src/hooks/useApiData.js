import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API data management with search and pagination
 * @param {Function} apiFunction - The API function to call
 * @param {number} initialItemsToShow - Initial number of items to display
 * @returns {Object} Hook state and methods
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

  const loadData = useCallback(async () => {
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
  }, [apiFunction]);

  const filterData = useCallback(() => {
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
  }, [data, searchQuery, initialItemsToShow]);

  const updateDisplayedData = useCallback(() => {
    setDisplayedData(filteredData.slice(0, itemsToShow));
  }, [filteredData, itemsToShow]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter data when search query changes
  useEffect(() => {
    filterData();
  }, [filterData]);

  // Update displayed data when filtered data or itemsToShow changes
  useEffect(() => {
    updateDisplayedData();
  }, [updateDisplayedData]);

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
    data,
    filteredData,
    displayedData,
    isLoading,
    hasError,
    errorMessage,
    itemsToShow,
    searchQuery,
    showMoreItems,
    resetItemsToShow,
    handleSearchChange,
    canShowMore,
    hasNoData,
    hasNoSearchResults,
    loadData
  };
}

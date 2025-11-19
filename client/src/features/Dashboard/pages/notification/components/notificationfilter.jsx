import { motion } from 'framer-motion';
import { Search, Filter, X, CheckSquare, Square } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';

export default function NotificationFilters({
  darkMode,
  searchTerm,
  filter,
  categoryFilter,
  categories,
  selectedNotifications,
  filteredNotifications,
  onSearchChange,
  onFilterChange,
  onCategoryFilterChange,
  onSelectAll,
  onCategoryClick,
  onClearFilters,
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // ✅ Debounced search dengan useCallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, searchTerm, onSearchChange]);

  // ✅ Optimized class calculations
  const cardClass = `rounded-2xl border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

  const inputClass = `w-full px-4 py-2 rounded-lg border transition-colors duration-300 text-sm ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
  }`;

  // ✅ Memoized calculations
  const hasActiveFilters = useMemo(() => searchTerm || filter !== 'all' || categoryFilter !== 'all', [searchTerm, filter, categoryFilter]);

  const allSelected = useMemo(() => selectedNotifications.length > 0 && selectedNotifications.length === filteredNotifications.length, [selectedNotifications.length, filteredNotifications.length]);

  const someSelected = useMemo(() => selectedNotifications.length > 0 && selectedNotifications.length < filteredNotifications.length, [selectedNotifications.length, filteredNotifications.length]);

  const uniqueCategories = useMemo(() => Array.from(new Set(categories)).filter(Boolean).sort(), [categories]);

  // ✅ Optimized event handlers
  const handleSelectAll = useCallback(() => {
    console.log('🔘 Toggling select all:', allSelected ? 'deselect' : 'select');
    onSelectAll();
  }, [allSelected, onSelectAll]);

  const handleCategoryClick = useCallback(
    (category) => {
      console.log('📂 Filtering by category:', category);
      onCategoryClick(category);
    },
    [onCategoryClick]
  );

  const handleClearFilters = useCallback(() => {
    console.log('🧹 Clearing all filters');
    setLocalSearchTerm('');
    onClearFilters();
  }, [onClearFilters]);

  const handleSearchChange = useCallback((value) => {
    setLocalSearchTerm(value);
  }, []);

  const handleFilterChange = useCallback(
    (value) => {
      console.log('🔍 Changing filter to:', value);
      onFilterChange(value);
    },
    [onFilterChange]
  );

  const handleCategoryFilterChange = useCallback(
    (value) => {
      console.log('📁 Changing category filter to:', value);
      onCategoryFilterChange(value);
    },
    [onCategoryFilterChange]
  );

  const handleClearSearch = useCallback(() => {
    setLocalSearchTerm('');
    onSearchChange('');
  }, [onSearchChange]);

  // ✅ Filter status text
  const filterStatusText = useMemo(() => {
    const parts = [];

    if (searchTerm) {
      parts.push(`matching "${searchTerm}"`);
    }
    if (filter !== 'all') {
      parts.push(`${filter} only`);
    }
    if (categoryFilter !== 'all') {
      parts.push(`in ${categoryFilter} category`);
    }

    return parts.join(' • ');
  }, [searchTerm, filter, categoryFilter]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${cardClass} p-6 mb-6`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Filters & Search</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="ml-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            title="Clear all filters and search"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search in title or message..." value={localSearchTerm} onChange={(e) => handleSearchChange(e.target.value)} className={`${inputClass} pl-10`} />
          {localSearchTerm && (
            <button onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <select value={filter} onChange={(e) => handleFilterChange(e.target.value)} className={inputClass}>
          <option value="all">All Notifications</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>

        {/* Category Filter */}
        <select value={categoryFilter} onChange={(e) => handleCategoryFilterChange(e.target.value)} className={inputClass}>
          <option value="all">All Categories</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Select All Button */}
        {filteredNotifications.length > 0 && (
          <>
            <button
              onClick={handleSelectAll}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                allSelected
                  ? darkMode
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-blue-500 text-white shadow-lg'
                  : someSelected
                  ? darkMode
                    ? 'bg-blue-900/50 text-blue-300'
                    : 'bg-blue-100 text-blue-700'
                  : darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title={allSelected ? 'Deselect all notifications' : 'Select all notifications'}
            >
              {allSelected ? <CheckSquare className="w-3 h-3" /> : someSelected ? <div className="w-3 h-3 border-2 border-current rounded" /> : <Square className="w-3 h-3" />}
              {allSelected ? 'Deselect All' : someSelected ? `${selectedNotifications.length} Selected` : 'Select All'}
            </button>

            <span className="text-xs text-gray-500 mx-1">•</span>
          </>
        )}

        {/* Quick Categories */}
        <span className="text-xs text-gray-500 mr-2">Quick Categories:</span>

        {uniqueCategories.slice(0, 5).map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              categoryFilter === category ? (darkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg') : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title={`Filter by ${category} category`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}

        {uniqueCategories.length > 5 && <span className="text-xs text-gray-500">+{uniqueCategories.length - 5} more</span>}
      </div>

      {/* Filter Status */}
      {hasActiveFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 text-xs text-gray-500 space-y-1">
          <div>
            Showing <strong>{filteredNotifications.length}</strong> notification{filteredNotifications.length !== 1 ? 's' : ''}
            {filterStatusText && ` • ${filterStatusText}`}
          </div>

          {selectedNotifications.length > 0 && (
            <div className={darkMode ? 'text-blue-300' : 'text-blue-600'}>
              <strong>{selectedNotifications.length}</strong> notification{selectedNotifications.length !== 1 ? 's' : ''} selected
              {filteredNotifications.length > 0 && <span className="ml-1 opacity-75">({Math.round((selectedNotifications.length / filteredNotifications.length) * 100)}%)</span>}
            </div>
          )}
        </motion.div>
      )}

      {/* No Results State */}
      {filteredNotifications.length === 0 && hasActiveFilters && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>No notifications found</strong> with the current filters.
            {searchTerm && ` No results for "${searchTerm}".`}
            Try adjusting your search or clearing filters.
          </div>
        </motion.div>
      )}

      {/* Empty Categories State */}
      {uniqueCategories.length === 0 && !hasActiveFilters && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <strong>No categories available.</strong> Categories will appear when you receive notifications with categories.
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

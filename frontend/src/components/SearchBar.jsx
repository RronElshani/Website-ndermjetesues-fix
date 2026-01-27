import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAPI } from '../services/api';
import './SearchBar.css';

const SearchBar = ({ initialValue = '', onSearch }) => {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced fetch suggestions
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await searchAPI.suggestions(query);
                setSuggestions(response.data.data || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Suggestions error:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (onSearch) {
            onSearch(query);
        } else {
            navigate(`/marketplace?q=${encodeURIComponent(query)}`);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        if (onSearch) {
            onSearch(suggestion);
        } else {
            navigate(`/marketplace?q=${encodeURIComponent(suggestion)}`);
        }
    };

    return (
        <div className="search-bar-wrapper" ref={wrapperRef}>
            <form onSubmit={handleSubmit} className="search-bar">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Kërko shërbime..."
                        className="search-input"
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    />
                    {loading && <span className="search-loading"></span>}
                </div>
                <button type="submit" className="search-btn">
                    Kërko
                </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                    {suggestions.map((item, index) => (
                        <button
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(item.suggestion)}
                        >
                            <span className="suggestion-icon">🔧</span>
                            <span>{item.suggestion}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

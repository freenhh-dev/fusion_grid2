# 2048 Game

## Overview

This is a web-based implementation of the popular 2048 puzzle game. Players swipe or use arrow keys to move tiles on a 4x4 grid, merging tiles with the same number to create larger numbers, with the goal of reaching the 2048 tile. The game features internationalization support (English and Korean), score tracking with local storage persistence, smooth animations, and a responsive design that works on both desktop and mobile devices.

## Recent Changes

**November 23, 2025** - Production-ready release
- Created complete 2048 game implementation with HTML, CSS, and JavaScript
- Implemented dual input support: keyboard arrow keys and touch swipe gestures
- Added multi-language support (English and Korean) with localStorage persistence
- Configured static web server workflow on port 5000
- Fixed critical bugs: event listener duplication, overlay clearing on restart, delayed callback state management
- Added ad placeholder section below game board with commented expansion options
- All game mechanics tested and verified: tile movement, merging, scoring, game over, win conditions

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: Vanilla JavaScript (ES6), HTML5, CSS3
- **Rationale**: No framework dependencies for lightweight, fast performance and simple deployment
- **Pros**: Zero build step, easy to understand, minimal overhead
- **Cons**: Manual DOM manipulation, no component reusability patterns

**Module Structure**: Separation of concerns across three main modules
- `main.js`: Game logic, state management, and movement mechanics
- `i18n.js`: Internationalization and language switching
- `style.css`: Responsive styling with CSS animations
- **Rationale**: Logical separation makes the codebase maintainable despite being framework-free
- **Pros**: Clear responsibilities, easy to locate and modify specific features
- **Cons**: No formal module system, relies on global namespace

**Game State Management**: Object-based state pattern
- Single `Game` object holds all state (grid, score, gameOver flags)
- **Rationale**: Simple state container for a single-page game
- **Alternatives considered**: Class-based approach (rejected for simplicity)
- **Pros**: Straightforward state access, no complex state management library needed
- **Cons**: Global mutable state, harder to test in isolation

**UI Rendering**: Imperative DOM manipulation
- Direct `innerHTML` updates for grid rendering
- Class-based show/hide for overlays
- **Rationale**: Simple, direct control over UI updates
- **Pros**: No virtual DOM overhead, explicit control
- **Cons**: Potential XSS risks (mitigated by number-only content), less declarative

### Input Handling

**Multi-Modal Input System**: Keyboard and touch event listeners
- Arrow keys for desktop gameplay
- Touch swipe detection for mobile devices
- Minimum swipe distance threshold to prevent accidental moves
- **Rationale**: Cross-platform accessibility for both desktop and mobile users
- **Pros**: Works seamlessly on all devices
- **Cons**: Touch gesture conflicts with browser scrolling (addressed via `preventDefault`)

**Event Listener Management**: Single initialization pattern
- `listenersInitialized` flag prevents duplicate listener registration
- **Rationale**: Prevents memory leaks and duplicate event firing on game restart
- **Pros**: Clean event handling lifecycle
- **Cons**: Adds complexity to initialization logic

### Game Mechanics

**Grid-Based Movement Algorithm**: Matrix manipulation with tile merging
- 4x4 array represents game grid
- Movement in four directions (up, down, left, right)
- Merge detection during movement
- **Rationale**: Classic 2048 algorithm implementation
- **Pros**: Well-tested approach, predictable behavior
- **Cons**: O(n²) complexity for each move (acceptable for 4x4 grid)

**Score Tracking**: Cumulative score with merge bonuses
- Score increases by merged tile values
- Best score persisted across sessions
- **Rationale**: Standard 2048 scoring system
- **Pros**: Motivates player progression
- **Cons**: None significant

### Internationalization (i18n)

**Static Translation System**: Key-value translation objects
- Supports English and Korean languages
- `data-i18n` attributes for declarative translation
- Language preference saved to localStorage
- **Rationale**: Simple static translation for limited language support
- **Alternatives considered**: Full i18n library (rejected as overkill)
- **Pros**: Lightweight, no external dependencies
- **Cons**: Not scalable for many languages, no pluralization support

**UI Update Pattern**: Full page re-translation on language change
- Iterates through all `data-i18n` elements
- **Rationale**: Simple full-page update for small DOM
- **Pros**: Ensures all text is updated
- **Cons**: Not performant for larger applications (not an issue here)

### Styling and Animation

**CSS-Based Animations**: Transitions and transforms for tile movement
- Hardware-accelerated transforms for smooth performance
- Gradient backgrounds for modern aesthetic
- **Rationale**: Pure CSS for better performance than JavaScript animations
- **Pros**: GPU-accelerated, smooth 60fps animations
- **Cons**: Limited animation choreography compared to JS-based solutions

**Responsive Design**: Mobile-first with flexible layouts
- Flexbox for layout
- Media queries for different screen sizes
- Viewport meta tag prevents unwanted zooming
- **Rationale**: Single codebase for all device sizes
- **Pros**: Works on mobile and desktop without separate versions
- **Cons**: Some compromise on optimal layouts for each platform

## External Dependencies

### Browser APIs

**LocalStorage API**: Client-side data persistence
- Stores best score across sessions
- Stores language preference
- **Purpose**: Persist user progress without backend infrastructure
- **Limitations**: 5-10MB storage limit (more than sufficient), data can be cleared by user

**Touch Events API**: Mobile input detection
- `touchstart`, `touchmove`, `touchend` events
- **Purpose**: Enable swipe gestures on mobile devices
- **Limitations**: Browser compatibility (widely supported in modern browsers)

**Keyboard Events API**: Desktop input detection
- `keydown` event for arrow key detection
- **Purpose**: Desktop gameplay control
- **Limitations**: Requires keyboard focus on window

### No External Services

This application is fully client-side with no external API calls, third-party analytics, authentication services, or database connections. All functionality runs entirely in the browser.

### Future Integration Considerations

The codebase includes placeholder elements for potential advertising integration (`adPlaceholder` in translations, commented sections in HTML), but no actual ad network integration is currently implemented. If ads are added, this would likely involve:
- Google AdSense or similar ad network SDK
- Script injection for ad serving
- GDPR/privacy compliance requirements
// i18n.js - Internationalization module for 2048 Game
// Supports English (en) and Korean (ko)

const i18n = {
  // Current language (default: English)
  currentLang: 'en',

  // Translation strings
  translations: {
    en: {
      title: '2048 Game',
      score: 'Score',
      best: 'Best',
      newGame: 'New Game',
      gameOver: 'Game Over!',
      youWin: 'You Win!',
      tryAgain: 'Try Again',
      continue: 'Continue',
      instructions: 'Swipe or use arrow keys to move tiles. Merge tiles to reach 2048!',
      // Ad related
      adPlaceholder: 'Advertisement Space'
    },
    ko: {
      title: '2048 게임',
      score: '점수',
      best: '최고 점수',
      newGame: '새 게임',
      gameOver: '게임 종료!',
      youWin: '승리!',
      tryAgain: '다시 시도',
      continue: '계속하기',
      instructions: '스와이프하거나 화살표 키를 사용하여 타일을 이동하세요. 타일을 합쳐 2048을 만드세요!',
      // Ad related
      adPlaceholder: '광고 영역'
    }
  },

  /**
   * Initialize i18n with saved language preference
   */
  init() {
    const savedLang = localStorage.getItem('language');
    if (savedLang && this.translations[savedLang]) {
      this.currentLang = savedLang;
    }
    this.updateUI();
  },

  /**
   * Get translated text for a given key
   * @param {string} key - Translation key
   * @returns {string} Translated text
   */
  t(key) {
    return this.translations[this.currentLang][key] || key;
  },

  /**
   * Switch to a specific language
   * @param {string} lang - Language code (en, ko)
   */
  switchLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('language', lang);
      this.updateUI();
    }
  },

  /**
   * Update all UI text elements with current language
   */
  updateUI() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });

    // Update language toggle buttons active state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
};

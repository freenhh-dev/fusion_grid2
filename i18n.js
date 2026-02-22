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
      aboutTitle: 'About This Service',
      aboutText1:
        'This page provides the 2048 puzzle game with clear rules and tips so visitors can play immediately. We prioritize quality over quantity, avoid duplicated content, and keep the structure simple so users can find what they need quickly.',
      aboutText2:
        'We aim to add unique value, deliver the promised features without misleading navigation, and keep ads secondary to the content so they never outshine the game itself.',
      howToPlayTitle: 'How to Play',
      howToPlayList:
        '<li><strong>Move:</strong> Use the arrow keys on desktop or swipe on mobile to move tiles.</li>' +
        '<li><strong>Merge:</strong> Matching numbers combine into a larger tile. (Example: 2 + 2 = 4)</li>' +
        '<li><strong>New tile:</strong> Each move spawns a new 2 or 4 in an empty cell.</li>' +
        '<li><strong>Goal:</strong> Create the 2048 tile to win, then keep playing if you want.</li>' +
        '<li><strong>Game over:</strong> The game ends when no moves remain.</li>',
      privacyTitle: 'Privacy Policy',
      privacyText:
        'This service runs entirely in your browser and does not collect personal information. Google and other third-party vendors may use cookies to serve ads, and you can opt out of personalized ads in ad settings.',
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
      aboutTitle: '서비스 소개 및 콘텐츠 원칙',
      aboutText1:
        '이 페이지는 2048 퍼즐 게임을 제공하며, 규칙과 팁을 명확하게 안내해 누구나 즉시 플레이할 수 있도록 구성했습니다. 중복된 내용보다 품질과 유용성을 우선하고, 방문자가 원하는 정보를 빠르게 찾도록 구조를 단순화했습니다.',
      aboutText2:
        '또한 다른 사이트와 차별되는 정보를 제공하고, 약속한 기능을 그대로 제공하며, 광고는 콘텐츠를 보완하는 수준으로 배치해 콘텐츠보다 더 눈에 띄지 않도록 합니다.',
      howToPlayTitle: '게임 방법',
      howToPlayList:
        '<li><strong>이동:</strong> 컴퓨터에서는 화살표 키(↑, ↓, ←, →), 모바일에서는 화면을 스와이프하여 타일을 이동합니다.</li>' +
        '<li><strong>결합:</strong> 같은 숫자 타일이 만나면 합쳐져 더 큰 숫자가 됩니다. (예: 2 + 2 = 4)</li>' +
        '<li><strong>새 타일:</strong> 한 번 움직일 때마다 빈 칸에 2 또는 4가 새로 생성됩니다.</li>' +
        '<li><strong>목표:</strong> 2048 타일을 만들면 승리하며, 이후에도 계속 플레이할 수 있습니다.</li>' +
        '<li><strong>게임 오버:</strong> 더 이상 움직일 수 없으면 게임이 종료됩니다.</li>',
      privacyTitle: '개인정보처리방침 (Privacy Policy)',
      privacyText:
        '본 서비스는 브라우저에서만 동작하며 회원가입이나 개인식별정보를 수집하지 않습니다. 광고 게재를 위해 Google을 포함한 제3자 공급업체가 쿠키를 사용할 수 있으며, 사용자는 광고 설정에서 맞춤 광고를 거부할 수 있습니다.',
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
    // Update HTML-capable elements first
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      element.innerHTML = this.t(key);
    });

    // Update plain text elements
    document.querySelectorAll('[data-i18n]:not([data-i18n-html])').forEach(element => {
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

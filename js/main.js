// TabiMeshi — 動的な状態の書き出し.md（全19項目）実装
// 実API連携なしの静的モックとして、フロントエンドのみで動作を再現する

document.addEventListener('DOMContentLoaded', () => {
  initDrawer();
  initScopeLinks();
  initPressOnlyButtons();
  initFavButtons();
  initHeroSlideshow();
  initChat();
  initChatRecallFab();
  initDateModal();
  initGallery();
  initClampText();
  initReviewsToggle();
  initTabs();
  initShare();
  initReserveValidation();
  initReserveSheet();
  initReserveModal();
  initContactModal();
  initBackLink();
});

// ---------------------------------------------------------------------------
// トースト通知
// ---------------------------------------------------------------------------
function showToast(message, duration = 2200) {
  const toast = document.querySelector('.js-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), duration);
}

// ---------------------------------------------------------------------------
// A-3: SPハンバーガーメニュー（ドロワー開閉）
// ---------------------------------------------------------------------------
function initDrawer() {
  const openBtn = document.querySelector('.js-drawer-open');
  const closeBtn = document.querySelector('.js-drawer-close');
  const overlay = document.querySelector('.js-drawer-overlay');
  const drawer = document.querySelector('.js-drawer');
  if (!openBtn || !drawer || !overlay) return;

  const open = () => {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  };
  const close = () => {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
}

// ---------------------------------------------------------------------------
// A-1 / A-2: 本課題のスコープ外導線（ログイン・お気に入り一覧・閲覧履歴等）
// 実際のページ遷移はさせず、案内トーストのみ表示する
// ---------------------------------------------------------------------------
function initScopeLinks() {
  document.querySelectorAll('.js-scope-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('このページは今回のデモの範囲外です');
    });
  });
}

// ---------------------------------------------------------------------------
// B-7 / B-12: 実装範囲外の検索・「すべてみる」導線
// クリック時の色変化インタラクションのみ
// ---------------------------------------------------------------------------
function initPressOnlyButtons() {
  document.querySelectorAll('.js-press-only').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.add('is-active');
      showToast('検索結果一覧ページは本デモの範囲外です');
      setTimeout(() => btn.classList.remove('is-active'), 300);
    });
  });
}

// ---------------------------------------------------------------------------
// B-8 / C-4 / C-5: お気に入りボタン（同一店舗のボタンは状態を同期）
// ---------------------------------------------------------------------------
function initFavButtons() {
  document.querySelectorAll('.js-fav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const shopId = btn.dataset.shopId;
      const nowActive = !btn.classList.contains('is-active');
      document.querySelectorAll(`.js-fav-btn[data-shop-id="${shopId}"]`).forEach((b) => {
        b.classList.toggle('is-active', nowActive);
      });
      showToast(nowActive ? '気になる一軒として保存しました' : 'お気に入りを解除しました');
    });
  });
}

// ---------------------------------------------------------------------------
// トップページ ヒーロー：写真の自動スライドショー（クロスフェード）
// ---------------------------------------------------------------------------
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.js-hero-slides .hero-slide');
  if (slides.length < 2) return;
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  }, 5000);
}

// ---------------------------------------------------------------------------
// B-1〜B-4: AIチャットボット
// ---------------------------------------------------------------------------
function initChat() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const chipButtons = document.querySelectorAll('.js-chat-chip');
  if (!input || !sendBtn) return;

  const updateSendState = () => {
    sendBtn.disabled = input.value.trim().length === 0;
  };
  input.addEventListener('input', updateSendState);
  updateSendState();

  chipButtons.forEach((chip) => {
    chip.addEventListener('click', () => {
      input.value = chip.textContent.trim();
      updateSendState();
      input.focus();
    });
  });

  const submit = () => {
    if (input.value.trim().length === 0) return;
    // 静的モック：AIの応答は生成せず、そのまま店舗詳細ページへ遷移する
    window.location.href = 'shop.html';
  };
  sendBtn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
}

// ---------------------------------------------------------------------------
// B-4: フローティング再呼び出しボタン
// ---------------------------------------------------------------------------
function initChatRecallFab() {
  const fab = document.querySelector('.js-chat-recall');
  const chatPanel = document.querySelector('.chat-panel');
  if (!fab || !chatPanel) return;

  window.addEventListener('scroll', () => {
    const rect = chatPanel.getBoundingClientRect();
    const isPast = rect.bottom < 0;
    fab.classList.toggle('is-visible', isPast);
  });

  fab.addEventListener('click', () => {
    chatPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ---------------------------------------------------------------------------
// B-6 / C-9: 予約日（カレンダーモーダル）
// ---------------------------------------------------------------------------
function initDateModal() {
  const modal = document.querySelector('.js-calendar-modal');
  const input = document.querySelector('.js-calendar-input');
  const confirmBtn = document.querySelector('.js-calendar-confirm');
  if (!modal || !input || !confirmBtn) return;

  let activeTrigger = null;

  document.querySelectorAll('.js-date-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      activeTrigger = trigger;
      input.value = '';
      modal.classList.add('is-open');
    });
  });

  const closeModal = () => modal.classList.remove('is-open');

  confirmBtn.addEventListener('click', () => {
    if (activeTrigger && input.value) {
      const [y, m, d] = input.value.split('-');
      activeTrigger.value = `${y}年${Number(m)}月${Number(d)}日`;
      const field = activeTrigger.closest('.field');
      if (field) field.classList.remove('has-error');
    }
    closeModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// ---------------------------------------------------------------------------
// C-2: メインビジュアルギャラリー（スワイプ・矢印・ドット）
// ---------------------------------------------------------------------------
function initGallery() {
  const track = document.querySelector('.js-gallery-track');
  const dotsWrap = document.querySelector('.js-gallery-dots');
  const prevBtn = document.querySelector('.js-gallery-prev');
  const nextBtn = document.querySelector('.js-gallery-next');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(index + 1));

  // タッチスワイプ
  let startX = null;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) goTo(index + (diff < 0 ? 1 : -1));
    startX = null;
  });
}

// ---------------------------------------------------------------------------
// C-6: AI提案理由の長文クランプ（3行）
// ---------------------------------------------------------------------------
function initClampText() {
  const p = document.querySelector('.js-clamp-text');
  const toggle = document.querySelector('.js-clamp-toggle');
  if (!p || !toggle) return;

  p.style.display = '-webkit-box';
  p.style.webkitBoxOrient = 'vertical';
  p.style.webkitLineClamp = '3';
  p.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    if (p.scrollHeight > p.clientHeight + 4) {
      toggle.style.display = 'inline-block';
    }
  });

  toggle.addEventListener('click', () => {
    const expanded = toggle.dataset.expanded === 'true';
    if (expanded) {
      p.style.webkitLineClamp = '3';
      p.style.overflow = 'hidden';
      toggle.textContent = 'もっと見る';
      toggle.dataset.expanded = 'false';
    } else {
      p.style.webkitLineClamp = 'unset';
      p.style.overflow = 'visible';
      toggle.textContent = '閉じる';
      toggle.dataset.expanded = 'true';
    }
  });
}

// ---------------------------------------------------------------------------
// C-7: クチコミ「すべてみる」→ 同ページ内アコーディオン展開
// ---------------------------------------------------------------------------
function initReviewsToggle() {
  const link = document.querySelector('.js-reviews-toggle');
  const hidden = document.querySelectorAll('.review-card.is-hidden');
  if (!link || hidden.length === 0) return;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    hidden.forEach((card) => card.classList.remove('is-hidden'));
    link.style.display = 'none';
  });
}

// ---------------------------------------------------------------------------
// C-8: タブ切替（メニュー・料金（詳細） / アクセス）
// ---------------------------------------------------------------------------
function initTabs() {
  const buttons = document.querySelectorAll('.js-tab-btn');
  if (buttons.length === 0) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.tabPanel === target);
      });
    });
  });
}

// ---------------------------------------------------------------------------
// C-3: シェアボタン
// ---------------------------------------------------------------------------
function initShare() {
  document.querySelectorAll('.js-share-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const url = window.location.href;
      const shareData = {
        title: document.title,
        text: '燈 -Tomoshibi- | TabiMeshi',
        url,
      };
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          // ユーザーによるキャンセル等はフォールバックしない
          if (err && err.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        // clipboard API不可の環境向けフォールバック
      }
      showToast('URLをコピーしました');
    });
  });
}

// ---------------------------------------------------------------------------
// C-14: SP固定予約バー →「空席を確認する」タップで予約カードをボトムシートとして表示
// （CV導線であるためSPでも非表示にせず、モーダルで呼び出せるようにする）
// ---------------------------------------------------------------------------
function initReserveSheet() {
  const openBtn = document.querySelector('.js-open-reserve-sheet');
  const closeBtn = document.querySelector('.js-close-reserve-sheet');
  const overlay = document.querySelector('.js-reserve-sheet-overlay');
  const card = document.querySelector('.detail-sidebar .reserve-card');
  if (!openBtn || !card || !overlay) return;

  const open = () => {
    card.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  };
  const close = () => {
    card.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  openBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  // 予約が完了したらシートも閉じる
  document.querySelectorAll('.reserve-cta .js-reserve-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dateOk = document.querySelector('.reserve-fields .field[data-field="date"]:not(.has-error)');
      const peopleOk = document.querySelector('.reserve-fields .field[data-field="people"]:not(.has-error)');
      if (dateOk && peopleOk) close();
    });
  });
}

// ---------------------------------------------------------------------------
// C-11 / C-12: 予約フォームのバリデーション と 予約ボタン
// ---------------------------------------------------------------------------
function initReserveValidation() {
  document.querySelectorAll('.js-reserve-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dateField = document.querySelector('.reserve-fields .field[data-field="date"]');
      const peopleField = document.querySelector('.reserve-fields .field[data-field="people"]');
      let valid = true;

      if (dateField) {
        const input = dateField.querySelector('input');
        const ok = input && input.value.trim().length > 0;
        dateField.classList.toggle('has-error', !ok);
        valid = valid && ok;
      }
      if (peopleField) {
        const select = peopleField.querySelector('select');
        const ok = select && select.value.trim().length > 0;
        peopleField.classList.toggle('has-error', !ok);
        valid = valid && ok;
      }

      // 押下時の色変化インタラクション
      btn.classList.add('is-pressed');
      setTimeout(() => btn.classList.remove('is-pressed'), 200);

      if (!valid) return;

      const modal = document.querySelector('.js-reserve-modal');
      if (modal) modal.classList.add('is-open');
    });
  });
}

function initReserveModal() {
  const modal = document.querySelector('.js-reserve-modal');
  const closeBtn = document.querySelector('.js-reserve-modal-close');
  if (!modal || !closeBtn) return;
  closeBtn.addEventListener('click', () => modal.classList.remove('is-open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('is-open'); });
}

// ---------------------------------------------------------------------------
// C-13: お店に問い合わせる
// ---------------------------------------------------------------------------
function initContactModal() {
  const btn = document.querySelector('.js-contact-btn');
  const modal = document.querySelector('.js-contact-modal');
  const closeBtn = document.querySelector('.js-contact-modal-close');
  if (!btn || !modal || !closeBtn) return;

  btn.addEventListener('click', () => modal.classList.add('is-open'));
  closeBtn.addEventListener('click', () => modal.classList.remove('is-open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('is-open'); });
}

// ---------------------------------------------------------------------------
// C-1: 「← 一覧に戻る」
// ---------------------------------------------------------------------------
function initBackLink() {
  const back = document.querySelector('.detail-back');
  if (!back) return;
  back.addEventListener('click', (e) => {
    if (document.referrer && document.referrer.includes(window.location.host)) {
      e.preventDefault();
      window.history.back();
    }
    // referrerがない場合は href="index.html" にそのまま従う
  });
}

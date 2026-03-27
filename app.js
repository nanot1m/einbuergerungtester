const DATA_PATH = './data/einbuergerungstest_berlin_310_ru.json';
const STORAGE_KEY = 'einburgerung-berlin-sm2-v2';
const PROGRESS_HISTORY_KEY = 'einburgerung-berlin-progress-history-v1';
const LOCALE_STORAGE_KEY = 'einburgerung-ui-locale-v1';
const PROGRESS_QUERY_KEY = 'progress';
const TAB_HASH_MAP = {
  study: '#study',
  stats: '#stats',
  sim: '#simulation',
  settings: '#settings',
};

const UI_TEXT = {
  ru: {
    progressDue: 'К изучению',
    progressToday: 'Сегодня',
    progressWithoutTranslation: 'Без перевода',
    progressTranslationStack: 'Стек перевода',
    reset: 'Сброс прогресса',
    switchLanguage: 'Переключить язык',
    tabStudy: 'Тренировка',
    tabStats: 'Статистика',
    tabSim: 'Симуляция',
    tabSettings: 'Настройки',
    settingsLanguage: 'Язык интерфейса',
    settingsShareProgress: 'Ссылка с прогрессом',
    settingsShareCopied: 'Ссылка скопирована',
    settingsHistoryTitle: 'Версии прогресса',
    settingsHistoryEmpty: 'Сохраненных версий пока нет.',
    settingsHistoryRestore: 'Восстановить',
    restoreProgressTitle: 'Восстановить эту версию прогресса?',
    restoreProgressText: 'Текущий локальный прогресс будет перезаписан выбранной сохраненной версией.',
    restoreProgressConfirm: 'Восстановить',
    back: '< назад',
    forward: 'вперед >',
    tagGeneral: 'Общие #{n}',
    showAnswer: 'Проверить ответ',
    gradeHard: 'Не знал',
    gradeEasy: 'Знал',
    emptyTitle: 'На сегодня карточек нет',
    emptyText: 'Вернитесь позже или сбросьте прогресс, чтобы пройти колоду заново.',
    simNewTest: 'Новый тест (33)',
    simNotStarted: 'Не начат',
    simFinish: 'Завершить тест',
    resetTitle: 'Сбросить прогресс?',
    resetText: 'Весь прогресс по карточкам будет удален.',
    importProgressTitle: 'Импортировать прогресс из ссылки?',
    importProgressText: 'Локальный прогресс на этом устройстве будет перезаписан данными из ссылки.',
    importProgressConfirm: 'Импортировать',
    importProgressCancel: 'Оставить локальный',
    cancel: 'Отмена',
    close: 'Закрыть',
    openImage: 'Открыть изображение',
    closeImage: 'Закрыть изображение',
    viewImage: 'Просмотр изображения',
    errorsNone: 'Ошибок нет. Отличный результат.',
    passed: 'Тест сдан',
    failed: 'Тест не сдан',
    openInStudy: 'Открыть в тренировке',
    missingTitle: 'Есть пропуски: {count}. Ответьте на них перед завершением.',
    questionN: 'Вопрос {n}',
    statsDue: 'К изучению',
    statsTranslation: 'С переводом',
    statsMastered: 'Без перевода',
    statsRelearn: 'Сложные',
    statsAll: 'Все',
    statsEmpty: 'Нет вопросов в этой категории.',
    chooseOption: 'Выберите вариант',
    loadError: 'Ошибка загрузки данных: {message}',
    progressAria: 'Прогресс изучения',
    startTranslation: 'Закрыть перевод',
  },
  en: {
    progressDue: 'Due',
    progressToday: 'Today',
    progressWithoutTranslation: 'Without translation',
    progressTranslationStack: 'Translation stack',
    reset: 'Reset progress',
    switchLanguage: 'Switch language',
    tabStudy: 'Study',
    tabStats: 'Stats',
    tabSim: 'Simulation',
    tabSettings: 'Settings',
    settingsLanguage: 'Interface language',
    settingsShareProgress: 'Progress link',
    settingsShareCopied: 'Link copied',
    settingsHistoryTitle: 'Progress versions',
    settingsHistoryEmpty: 'No saved versions yet.',
    settingsHistoryRestore: 'Restore',
    restoreProgressTitle: 'Restore this progress version?',
    restoreProgressText: 'Current local progress will be overwritten by the selected saved version.',
    restoreProgressConfirm: 'Restore',
    back: '< back',
    forward: 'next >',
    tagGeneral: 'General #{n}',
    showAnswer: 'Check answer',
    gradeHard: "Didn't know",
    gradeEasy: 'Knew',
    emptyTitle: 'No cards for today',
    emptyText: 'Come back later or reset progress to restart the deck.',
    simNewTest: 'New test (33)',
    simNotStarted: 'Not started',
    simFinish: 'Finish test',
    resetTitle: 'Reset progress?',
    resetText: 'All card progress will be deleted.',
    importProgressTitle: 'Import progress from link?',
    importProgressText: 'Local progress on this device will be overwritten by the data from the link.',
    importProgressConfirm: 'Import',
    importProgressCancel: 'Keep local progress',
    cancel: 'Cancel',
    close: 'Close',
    openImage: 'Open image',
    closeImage: 'Close image',
    viewImage: 'Image viewer',
    errorsNone: 'No mistakes. Strong result.',
    passed: 'Test passed',
    failed: 'Test failed',
    openInStudy: 'Open in study',
    missingTitle: 'Missing answers: {count}. Answer them before finishing.',
    questionN: 'Question {n}',
    statsDue: 'Due',
    statsTranslation: 'With translation',
    statsMastered: 'Without translation',
    statsRelearn: 'Hard',
    statsAll: 'All',
    statsEmpty: 'No questions in this category.',
    chooseOption: 'Choose an option',
    loadError: 'Data loading error: {message}',
    progressAria: 'Study progress',
    startTranslation: 'Close translation',
  },
};

const state = {
  deck: null,
  schedule: {},
  progressHistory: [],
  currentCard: null,
  selectedOptionIndex: null,
  answerChecked: false,
  lastAnswerCorrect: null,
  translationUsedForCurrent: false,
  suppressOptionClick: false,
  locale: loadLocale(),
  activeTab: 'study',
  statsCategory: 'due',
  simulation: {
    active: false,
    questions: [],
    answers: {},
    current: 0,
    submitted: false,
  },
};

const dueCountEl = document.getElementById('due-count');
const doneTodayEl = document.getElementById('done-today');
const withoutTranslationCountEl = document.getElementById('without-translation-count');
const translationStackCountEl = document.getElementById('translation-stack-count');
const progressDueLabelEl = document.getElementById('progress-due-label');
const progressTodayLabelEl = document.getElementById('progress-today-label');
const progressWithoutTranslationLabelEl = document.getElementById('progress-without-translation-label');
const progressTranslationStackLabelEl = document.getElementById('progress-translation-stack-label');
const cardEl = document.getElementById('card');
const emptyStateEl = document.getElementById('empty-state');
const studyViewEl = document.getElementById('study-view');
const statsViewEl = document.getElementById('stats-view');
const viewsTrackEl = document.getElementById('views-track');
const tabStudyEl = document.getElementById('tab-study');
const tabStatsEl = document.getElementById('tab-stats');
const tabSimEl = document.getElementById('tab-sim');
const tabSettingsEl = document.getElementById('tab-settings');
const localeToggleEl = document.getElementById('locale-toggle');
const localeToggleLabelEl = document.getElementById('locale-toggle-label');
const settingsViewEl = document.getElementById('settings-view');
const settingsLocaleLabelEl = document.getElementById('settings-locale-label');
const copyProgressLinkBtn = document.getElementById('copy-progress-link');
const copyProgressLinkLabelEl = document.getElementById('copy-progress-link-label');
const settingsHistoryTitleEl = document.getElementById('settings-history-title');
const settingsHistoryListEl = document.getElementById('settings-history-list');
const statsCategoriesEl = document.getElementById('stats-categories');
const statsListEl = document.getElementById('stats-list');
const simViewEl = document.getElementById('sim-view');
const simStartEl = document.getElementById('sim-start');
const simProgressEl = document.getElementById('sim-progress');
const simCardEl = document.getElementById('sim-card');
const simTagEl = document.getElementById('sim-tag');
const simGroupEl = document.getElementById('sim-group');
const simQuestionEl = document.getElementById('sim-question');
const simQuestionMediaEl = document.getElementById('sim-question-media');
const simOptionsEl = document.getElementById('sim-options');
const simPrevEl = document.getElementById('sim-prev');
const simNextEl = document.getElementById('sim-next');
const simSubmitEl = document.getElementById('sim-submit');
const simResultModalEl = document.getElementById('sim-result-modal');
const simResultCloseEl = document.getElementById('sim-result-close');
const simResultContentEl = document.getElementById('sim-result-content');

const cardIndexEl = document.getElementById('card-index');
const cardTagEl = document.getElementById('card-tag');
const cardGroupEl = document.getElementById('card-group');
const backCardBtn = document.getElementById('back-card');
const forwardCardBtn = document.getElementById('forward-card');
const questionDeEl = document.getElementById('question-de');
const questionMediaEl = document.getElementById('question-media');
const quizOptionsEl = document.getElementById('quiz-options');
const revealActionsEl = document.getElementById('reveal-actions');
const gradeActionsEl = document.getElementById('grade-actions');

const showAnswerBtn = document.getElementById('show-answer');
const gradeHardBtn = document.getElementById('grade-hard');
const gradeEasyBtn = document.getElementById('grade-easy');
const resetProgressBtn = document.getElementById('reset-progress');
const resetProgressLabelEl = document.getElementById('reset-progress-label');
const swipeIndicatorEl = document.getElementById('swipe-indicator');
const confirmModalEl = document.getElementById('confirm-modal');
const confirmTitleEl = document.getElementById('confirm-title');
const confirmTextEl = document.getElementById('confirm-text');
const cancelResetBtn = document.getElementById('cancel-reset');
const confirmResetBtn = document.getElementById('confirm-reset');
const importProgressModalEl = document.getElementById('import-progress-modal');
const importProgressTitleEl = document.getElementById('import-progress-title');
const importProgressTextEl = document.getElementById('import-progress-text');
const cancelImportProgressBtn = document.getElementById('cancel-import-progress');
const confirmImportProgressBtn = document.getElementById('confirm-import-progress');
const restoreProgressModalEl = document.getElementById('restore-progress-modal');
const restoreProgressTitleEl = document.getElementById('restore-progress-title');
const restoreProgressTextEl = document.getElementById('restore-progress-text');
const cancelRestoreProgressBtn = document.getElementById('cancel-restore-progress');
const confirmRestoreProgressBtn = document.getElementById('confirm-restore-progress');
const translationTooltipEl = document.getElementById('translation-tooltip');
const translationTooltipTextEl = document.getElementById('translation-tooltip-text');
const translationTooltipCloseEl = document.getElementById('translation-tooltip-close');
const imageViewerEl = document.getElementById('image-viewer');
const imageViewerBackdropEl = document.getElementById('image-viewer-backdrop');
const imageViewerCloseEl = document.getElementById('image-viewer-close');
const imageViewerStageEl = document.getElementById('image-viewer-stage');
const imageViewerImgEl = document.getElementById('image-viewer-img');
const emptyTitleEl = document.getElementById('empty-title');
const emptyTextEl = document.getElementById('empty-text');

const gesture = {
  active: false,
  startX: 0,
  startY: 0,
  startTs: 0,
};

const longPress = {
  timer: null,
  triggered: false,
  suppressOptionClick: false,
};
let tooltipSelectableTimer = null;
let copyProgressLinkTimer = null;
let pendingImportedProgress = null;
let pendingRestoreVersionId = null;
const imageViewerState = {
  open: false,
  scale: 1,
  x: 0,
  y: 0,
  pointers: new Map(),
  dragStartX: 0,
  dragStartY: 0,
  startX: 0,
  startY: 0,
  pinchDistance: 0,
  pinchScale: 1,
  pinchMidX: 0,
  pinchMidY: 0,
  pinchStartX: 0,
  pinchStartY: 0,
};

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text, keywords = []) {
  let out = text;
  for (const keyword of keywords) {
    if (!keyword || keyword.length < 3) continue;
    const re = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
    out = out.replace(re, '<mark>$1</mark>');
  }
  return out;
}

function questionFocusTerms(question, keywords = []) {
  const terms = [...keywords];

  const fixed = ['Menschen'];
  for (const t of fixed) {
    if (question.includes(t)) terms.push(t);
  }

  const phraseMatch = question.match(/gegen\s+die\s+[^,.!?;]+?\s+sagen/i);
  if (phraseMatch?.[0]) {
    terms.push(phraseMatch[0].trim());
  }

  return [...new Set(terms)];
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function loadLocale() {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'ru' || stored === 'en') return stored;
  const lang = navigator.language?.toLowerCase() || '';
  return lang.startsWith('en') ? 'en' : 'ru';
}

function saveLocale() {
  localStorage.setItem(LOCALE_STORAGE_KEY, state.locale);
}

function t(key, vars = {}) {
  const dict = UI_TEXT[state.locale] || UI_TEXT.ru;
  const template = dict[key] || UI_TEXT.ru[key] || key;
  return Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), template);
}

function tagLabel(card) {
  return card.section === 'state' ? `Berlin #${card.task_number}` : t('tagGeneral', { n: card.task_number });
}

function applyStaticTranslations() {
  progressDueLabelEl.textContent = t('progressDue');
  progressTodayLabelEl.textContent = t('progressToday');
  progressWithoutTranslationLabelEl.textContent = t('progressWithoutTranslation');
  progressTranslationStackLabelEl.textContent = t('progressTranslationStack');
  resetProgressLabelEl.textContent = t('reset');
  resetProgressBtn.setAttribute('aria-label', t('resetTitle'));
  resetProgressBtn.setAttribute('title', t('resetTitle'));
  localeToggleEl.setAttribute('aria-label', t('switchLanguage'));
  localeToggleEl.setAttribute('title', t('switchLanguage'));
  localeToggleLabelEl.textContent = state.locale.toUpperCase();
  copyProgressLinkBtn.setAttribute('aria-label', t('settingsShareProgress'));
  copyProgressLinkBtn.setAttribute('title', t('settingsShareProgress'));
  if (!copyProgressLinkBtn.dataset.copied) {
    copyProgressLinkLabelEl.textContent = t('settingsShareProgress');
  }
  tabStudyEl.setAttribute('aria-label', t('tabStudy'));
  tabStudyEl.setAttribute('title', t('tabStudy'));
  tabStatsEl.setAttribute('aria-label', t('tabStats'));
  tabStatsEl.setAttribute('title', t('tabStats'));
  tabSimEl.setAttribute('aria-label', t('tabSim'));
  tabSimEl.setAttribute('title', t('tabSim'));
  tabSettingsEl.setAttribute('aria-label', t('tabSettings'));
  tabSettingsEl.setAttribute('title', t('tabSettings'));
  backCardBtn.textContent = t('back');
  forwardCardBtn.textContent = t('forward');
  showAnswerBtn.textContent = t('showAnswer');
  gradeHardBtn.textContent = t('gradeHard');
  gradeEasyBtn.textContent = t('gradeEasy');
  emptyTitleEl.textContent = t('emptyTitle');
  emptyTextEl.textContent = t('emptyText');
  simStartEl.textContent = t('simNewTest');
  simSubmitEl.textContent = t('simFinish');
  simPrevEl.textContent = t('back');
  simNextEl.textContent = t('forward');
  confirmTitleEl.textContent = t('resetTitle');
  confirmTextEl.textContent = t('resetText');
  cancelResetBtn.textContent = t('cancel');
  confirmResetBtn.textContent = t('reset');
  importProgressTitleEl.textContent = t('importProgressTitle');
  importProgressTextEl.textContent = t('importProgressText');
  cancelImportProgressBtn.textContent = t('importProgressCancel');
  confirmImportProgressBtn.textContent = t('importProgressConfirm');
  settingsLocaleLabelEl.textContent = t('settingsLanguage');
  settingsHistoryTitleEl.textContent = t('settingsHistoryTitle');
  restoreProgressTitleEl.textContent = t('restoreProgressTitle');
  restoreProgressTextEl.textContent = t('restoreProgressText');
  cancelRestoreProgressBtn.textContent = t('cancel');
  confirmRestoreProgressBtn.textContent = t('restoreProgressConfirm');
  simResultCloseEl.textContent = t('close');
  translationTooltipCloseEl.setAttribute('aria-label', t('startTranslation'));
  imageViewerEl.setAttribute('aria-label', t('viewImage'));
  imageViewerCloseEl.setAttribute('aria-label', t('closeImage'));
  document.querySelector('.mini-progress')?.setAttribute('aria-label', t('progressAria'));
}

function updateViewsTrackPosition() {
  const order = ['study', 'stats', 'sim', 'settings'];
  const idx = Math.max(0, order.indexOf(state.activeTab));
  viewsTrackEl.style.transform = `translate3d(-${idx * 25}%, 0, 0)`;
}

function tabFromHash(hash = window.location.hash) {
  const normalized = String(hash || '').toLowerCase();
  const entry = Object.entries(TAB_HASH_MAP).find(([, value]) => value === normalized);
  return entry?.[0] || 'study';
}

function syncHashWithTab() {
  const nextHash = TAB_HASH_MAP[state.activeTab] || TAB_HASH_MAP.study;
  if (window.location.hash === nextHash) return;
  history.replaceState(null, '', nextHash);
}

function applyLocale() {
  saveLocale();
  document.documentElement.lang = state.locale;
  applyStaticTranslations();
  updateViewsTrackPosition();
  if (state.deck?.questions) {
    renderStats();
  }
  if (state.currentCard) {
    cardTagEl.textContent = tagLabel(state.currentCard);
    renderQuestionImages(questionMediaEl, state.currentCard);
  }
  if (state.activeTab === 'stats' && state.deck) {
    renderStatsView();
  }
  if (state.activeTab === 'sim') {
    renderSimView();
  } else if (!state.simulation.active) {
    simProgressEl.textContent = t('simNotStarted');
  }
  renderProgressHistory();
}

function normalizeImageItem(item) {
  if (!item) return null;
  if (typeof item === 'string') return { src: item, alt: t('viewImage'), caption: '' };
  if (typeof item !== 'object') return null;

  const src = item.src || item.url || item.path || item.image || item.image_url;
  if (!src) return null;

  return {
    src,
    alt: item.alt || item.caption || item.title || t('viewImage'),
    caption: item.caption || item.title || '',
  };
}

function extractQuestionImages(card) {
  const buckets = [
    card.question_images,
    card.image,
    card.image_url,
    card.images,
    card.media,
    card.media?.images,
    card.assets,
    card.assets?.images,
  ];

  return buckets
    .flatMap((item) => (Array.isArray(item) ? item : item ? [item] : []))
    .map(normalizeImageItem)
    .filter(Boolean);
}

function renderQuestionImages(container, card) {
  const images = extractQuestionImages(card);
  if (!images.length) {
    container.innerHTML = '';
    container.classList.add('hidden');
    return;
  }

  container.innerHTML = images
    .map(
      (image) => `<figure class="question-media-item">
        <button class="question-media-open" type="button" data-image-src="${escapeHtml(image.src)}" data-image-alt="${escapeHtml(image.alt)}" aria-label="${escapeHtml(t('openImage'))}">
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />
        </button>
        ${image.caption ? `<figcaption>${escapeHtml(image.caption)}</figcaption>` : ''}
      </figure>`
    )
    .join('');
  container.classList.remove('hidden');
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateViewerTransform() {
  imageViewerImgEl.style.transform = `translate3d(${imageViewerState.x}px, ${imageViewerState.y}px, 0) scale(${imageViewerState.scale})`;
}

function closeImageViewer() {
  imageViewerState.open = false;
  imageViewerState.scale = 1;
  imageViewerState.x = 0;
  imageViewerState.y = 0;
  imageViewerState.pointers.clear();
  imageViewerEl.classList.add('hidden');
  document.body.classList.remove('viewer-open');
  imageViewerImgEl.src = '';
  imageViewerImgEl.alt = '';
  updateViewerTransform();
}

function openImageViewer(src, alt) {
  imageViewerState.open = true;
  imageViewerState.scale = 1;
  imageViewerState.x = 0;
  imageViewerState.y = 0;
  imageViewerState.pointers.clear();
  imageViewerImgEl.src = src;
  imageViewerImgEl.alt = alt || '';
  updateViewerTransform();
  imageViewerEl.classList.remove('hidden');
  document.body.classList.add('viewer-open');
}

function pointerDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointerMidpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function clampViewerPosition() {
  const rect = imageViewerStageEl.getBoundingClientRect();
  const maxX = Math.max(0, ((rect.width * imageViewerState.scale) - rect.width) / 2);
  const maxY = Math.max(0, ((rect.height * imageViewerState.scale) - rect.height) / 2);
  imageViewerState.x = clamp(imageViewerState.x, -maxX, maxX);
  imageViewerState.y = clamp(imageViewerState.y, -maxY, maxY);
}

function renderOptionInner(card, optionText, idx) {
  const optionImage = Array.isArray(card.option_images) ? card.option_images[idx] : null;
  const image = normalizeImageItem(optionImage);
  const label = escapeHtml(optionText);

  if (!image) {
    return `<span>${label}</span>`;
  }

  return `<span class="option-content with-image">
    <img class="option-image" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || optionText)}" loading="lazy" />
    <span class="option-image-label">${label}</span>
  </span>`;
}

function cardId(card) {
  return `${card.section}:${card.state || 'all'}:${card.task_number}`;
}

function currentCardIndex() {
  if (!state.currentCard || !state.deck) return -1;
  return state.deck.questions.findIndex((q) => cardId(q) === cardId(state.currentCard));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function nowTs() {
  return Date.now();
}

function defaultMeta() {
  return {
    intervalDays: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    dueAt: 0,
    lastReviewedAt: 0,
    stage: 'new',
    noTranslationSuccesses: 0,
  };
}

function defaultSchedule() {
  return {
    cards: {},
    statsByDate: {},
    translationStack: [],
    noTranslationMastered: [],
  };
}

function normalizeScheduleData(parsed) {
  const unique = (arr) => [...new Set(Array.isArray(arr) ? arr : [])];
  const normalizedStats = Object.fromEntries(
    Object.entries(parsed?.statsByDate || {}).map(([key, value]) => {
      const ids = unique(value?.ids || []);
      return [key, { done: ids.length, ids }];
    })
  );
  return {
    cards: parsed?.cards || {},
    statsByDate: normalizedStats,
    translationStack: unique(parsed?.translationStack),
    noTranslationMastered: unique(parsed?.noTranslationMastered),
  };
}

function loadSchedule() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed) return defaultSchedule();
    return normalizeScheduleData(parsed);
  } catch {
    return defaultSchedule();
  }
}

function loadProgressHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_HISTORY_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === 'object' && item.id && item.createdAt && item.schedule)
      .map((item) => ({
        id: String(item.id),
        createdAt: Number(item.createdAt),
        currentCardId: item.currentCardId || null,
        schedule: normalizeScheduleData(item.schedule),
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20);
  } catch {
    return [];
  }
}

function saveSchedule() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.schedule));
}

function saveProgressHistory() {
  localStorage.setItem(PROGRESS_HISTORY_KEY, JSON.stringify(state.progressHistory));
}

function currentProgressSignature(schedule = state.schedule, currentCardId = state.currentCard ? cardId(state.currentCard) : null) {
  return JSON.stringify({ schedule: normalizeScheduleData(schedule), currentCardId });
}

function saveProgressVersion() {
  const currentCardId = state.currentCard ? cardId(state.currentCard) : null;
  const nextSchedule = normalizeScheduleData(state.schedule);
  const nextSignature = currentProgressSignature(nextSchedule, currentCardId);
  const latest = state.progressHistory[0];
  if (latest && currentProgressSignature(latest.schedule, latest.currentCardId) === nextSignature) {
    return;
  }

  state.progressHistory = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      currentCardId,
      schedule: nextSchedule,
    },
    ...state.progressHistory,
  ].slice(0, 20);

  saveProgressHistory();
  renderProgressHistory();
}

function formatProgressHistoryDate(ts) {
  return new Intl.DateTimeFormat(state.locale === 'ru' ? 'ru-RU' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts));
}

function renderProgressHistory() {
  if (!settingsHistoryListEl) return;
  if (!state.progressHistory.length) {
    settingsHistoryListEl.innerHTML = `<div class="settings-history-empty">${escapeHtml(t('settingsHistoryEmpty'))}</div>`;
    return;
  }

  settingsHistoryListEl.innerHTML = state.progressHistory
    .map((version) => {
      const due = state.deck?.questions
        ? state.deck.questions.filter((card) => {
            const meta = version.schedule.cards?.[cardId(card)];
            return Number(meta?.dueAt || 0) <= nowTs();
          }).length
        : 0;
      return `<div class="settings-history-item">
        <div class="settings-history-meta">
          <div class="settings-history-date">${escapeHtml(formatProgressHistoryDate(version.createdAt))}</div>
          <div class="settings-history-stats">${escapeHtml(t('progressDue'))} ${due}</div>
        </div>
        <button class="settings-history-restore" type="button" data-restore-version="${escapeHtml(version.id)}">${escapeHtml(t('settingsHistoryRestore'))}</button>
      </div>`;
    })
    .join('');
}

function bytesToBase64Url(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function gzipCompress(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gzipDecompress(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function encodeProgressSnapshot(snapshot) {
  const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
  if ('CompressionStream' in window) {
    const compressed = await gzipCompress(bytes);
    return `gz.${bytesToBase64Url(compressed)}`;
  }
  return `raw.${bytesToBase64Url(bytes)}`;
}

async function decodeProgressSnapshot(serialized) {
  if (!serialized) return null;
  const [prefix, payload] = String(serialized).split('.', 2);
  if (!payload) return null;
  const bytes = base64UrlToBytes(payload);
  const decodedBytes = prefix === 'gz' && 'DecompressionStream' in window ? await gzipDecompress(bytes) : bytes;
  const text = new TextDecoder().decode(decodedBytes);
  return JSON.parse(text);
}

function createProgressSnapshot() {
  return {
    v: 1,
    schedule: state.schedule,
    currentCardId: state.currentCard ? cardId(state.currentCard) : null,
  };
}

async function buildProgressUrl() {
  const url = new URL(window.location.href);
  const encoded = await encodeProgressSnapshot(createProgressSnapshot());
  url.searchParams.set(PROGRESS_QUERY_KEY, encoded);
  return url.toString();
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function setCopyProgressLinkState(copied) {
  clearTimeout(copyProgressLinkTimer);
  if (copied) {
    copyProgressLinkBtn.dataset.copied = 'true';
    copyProgressLinkLabelEl.textContent = t('settingsShareCopied');
    copyProgressLinkTimer = window.setTimeout(() => {
      delete copyProgressLinkBtn.dataset.copied;
      copyProgressLinkLabelEl.textContent = t('settingsShareProgress');
    }, 1400);
    return;
  }

  delete copyProgressLinkBtn.dataset.copied;
  copyProgressLinkLabelEl.textContent = t('settingsShareProgress');
}

async function importProgressFromUrl() {
  const encoded = new URL(window.location.href).searchParams.get(PROGRESS_QUERY_KEY);
  if (!encoded) return null;
  try {
    const snapshot = await decodeProgressSnapshot(encoded);
    if (!snapshot || snapshot.v !== 1 || typeof snapshot !== 'object') return null;
    if (!snapshot.schedule || typeof snapshot.schedule !== 'object') return null;
    return {
      schedule: normalizeScheduleData(snapshot.schedule),
      currentCardId: snapshot.currentCardId || null,
    };
  } catch (error) {
    console.warn('Failed to import progress snapshot from URL', error);
    return null;
  }
}

function clearProgressQueryParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete(PROGRESS_QUERY_KEY);
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function openImportProgressModal(snapshot) {
  pendingImportedProgress = snapshot;
  importProgressModalEl.classList.remove('hidden');
}

function closeImportProgressModal() {
  importProgressModalEl.classList.add('hidden');
}

function applyImportedProgress(snapshot) {
  if (!snapshot) return;
  state.schedule = normalizeScheduleData(snapshot.schedule);
  saveSchedule();
  renderStats();
  const importedCard = snapshot.currentCardId
    ? state.deck?.questions.find((q) => cardId(q) === snapshot.currentCardId)
    : null;
  if (importedCard) {
    renderCard(importedCard);
    return;
  }
  renderNextCard();
}

function openRestoreProgressModal(versionId) {
  pendingRestoreVersionId = versionId;
  restoreProgressModalEl.classList.remove('hidden');
}

function closeRestoreProgressModal() {
  restoreProgressModalEl.classList.add('hidden');
}

function applyRestoredProgress(version) {
  if (!version) return;
  state.schedule = normalizeScheduleData(version.schedule);
  saveSchedule();
  renderStats();
  const restoredCard = version.currentCardId
    ? state.deck?.questions.find((q) => cardId(q) === version.currentCardId)
    : null;
  if (restoredCard) {
    renderCard(restoredCard);
    return;
  }
  renderNextCard();
}

function getMeta(card) {
  const id = cardId(card);
  if (!state.schedule.cards[id]) {
    state.schedule.cards[id] = defaultMeta();
  }
  return state.schedule.cards[id];
}

function dueCards() {
  if (!state.deck?.questions) return [];
  const ts = nowTs();
  return state.deck.questions.filter((card) => getMeta(card).dueAt <= ts);
}

function scheduleWithBuckets(meta, grade, isCorrect) {
  const qMap = { hard: 3, easy: 5 };
  const q = qMap[grade];

  if (!isCorrect) {
    const relearnHours = { hard: 0.5, easy: 12 };
    const hours = relearnHours[grade] || 0.5;
    meta.reps = 0;
    meta.lapses += 1;
    meta.intervalDays = hours / 24;
    meta.dueAt = nowTs() + Math.round(hours * 60 * 60 * 1000);
    meta.lastReviewedAt = nowTs();
    meta.ease = Math.max(1.3, meta.ease - 0.2);
    meta.stage = 'relearn';
    return;
  }

  if (q < 3) {
    meta.reps = 0;
    meta.intervalDays = 8 / 24;
    meta.dueAt = nowTs() + 8 * 60 * 60 * 1000;
    meta.lastReviewedAt = nowTs();
    meta.stage = 'learning';
    return;
  }

  if (meta.reps === 0) {
    meta.intervalDays = grade === 'easy' ? 4 : grade === 'hard' ? 1 : 2;
  } else if (meta.reps === 1) {
    meta.intervalDays = grade === 'easy' ? 8 : grade === 'hard' ? 3 : 6;
  } else {
    const hardFactor = grade === 'hard' ? 1.2 : grade === 'easy' ? 1.45 : 1.0;
    meta.intervalDays = Math.max(1, Math.round(meta.intervalDays * meta.ease * hardFactor));
  }

  meta.reps += 1;
  meta.ease = Math.max(1.3, meta.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  meta.dueAt = nowTs() + Math.round(meta.intervalDays * 24 * 60 * 60 * 1000);
  meta.lastReviewedAt = nowTs();
  meta.stage = meta.intervalDays >= 3 ? 'review' : 'learning';
}

function incrementTodayDoneUnique(cardUniqueId) {
  const key = todayKey();
  if (!state.schedule.statsByDate[key]) {
    state.schedule.statsByDate[key] = { done: 0, ids: [] };
  }
  const day = state.schedule.statsByDate[key];
  if (!Array.isArray(day.ids)) day.ids = [];
  if (!day.ids.includes(cardUniqueId)) {
    day.ids.push(cardUniqueId);
  }
  day.done = day.ids.length;
}

function setRevealMode(showAnswer) {
  revealActionsEl.classList.toggle('hidden', showAnswer);
  gradeActionsEl.classList.toggle('hidden', !showAnswer);
}

function updateTabButtons() {
  tabStudyEl.classList.toggle('active', state.activeTab === 'study');
  tabStatsEl.classList.toggle('active', state.activeTab === 'stats');
  tabSimEl.classList.toggle('active', state.activeTab === 'sim');
  tabSettingsEl.classList.toggle('active', state.activeTab === 'settings');
  const activeBtn = {
    study: tabStudyEl,
    stats: tabStatsEl,
    sim: tabSimEl,
    settings: tabSettingsEl,
  }[state.activeTab];
  activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function switchTab(nextTab) {
  if (state.activeTab === nextTab) return;
  state.activeTab = nextTab;
  syncHashWithTab();
  updateTabButtons();
  hideTranslationTooltip();
  clearTimeout(longPress.timer);
  longPress.triggered = false;
  if (nextTab === 'stats') renderStatsView();
  if (nextTab === 'sim') renderSimView();
  updateViewsTrackPosition();
}

function shuffled(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function seededValue(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function optionOrder(card) {
  const total = Array.isArray(card?.options) ? card.options.length : 0;
  const indexes = Array.from({ length: total }, (_, idx) => idx);
  if (total <= 1) return indexes;

  return indexes
    .map((idx) => ({
      idx,
      weight: seededValue(`${cardId(card)}:${idx}`),
    }))
    .sort((a, b) => a.weight - b.weight)
    .map((item) => item.idx);
}

function startSimulation() {
  const general = state.deck.questions.filter((q) => q.section === 'general');
  const berlin = state.deck.questions.filter((q) => q.section === 'state' && q.state === 'Berlin');
  const selected = [...shuffled(general).slice(0, 30), ...shuffled(berlin).slice(0, 3)];
  state.simulation = {
    active: true,
    questions: shuffled(selected),
    answers: {},
    current: 0,
    submitted: false,
  };
  renderSimView();
}

function renderSimView() {
  const sim = state.simulation;
  if (!sim.active) {
    simProgressEl.textContent = t('simNotStarted');
    simCardEl.classList.add('hidden');
    return;
  }

  const q = sim.questions[sim.current];
  simCardEl.classList.remove('hidden');
  simProgressEl.textContent = `${sim.current + 1} / ${sim.questions.length}`;
  simTagEl.textContent = tagLabel(q);
  const stage = getMeta(q).stage;
  simGroupEl.textContent = stage;
  simGroupEl.className = `tag group-tag ${stage}`;
  simQuestionEl.textContent = q.question;
  renderQuestionImages(simQuestionMediaEl, q);

  simOptionsEl.innerHTML = optionOrder(q)
    .map((originalIdx) => {
      const opt = q.options[originalIdx];
      const selected = sim.answers[cardId(q)] === originalIdx ? ' selected' : '';
      return `<li><button class="quiz-option-btn${selected}" data-sim-option="${originalIdx}" type="button">${renderOptionInner(q, opt, originalIdx)}</button></li>`;
    })
    .join('');

  simPrevEl.disabled = false;
  simNextEl.disabled = false;
  simSubmitEl.disabled = false;
}

function openSimResultModal() {
  const sim = state.simulation;
  const correct = sim.questions.filter((qq) => sim.answers[cardId(qq)] === qq.correct_index).length;
  const passed = correct >= 17;
  const wrong = sim.questions.filter((qq) => sim.answers[cardId(qq)] !== qq.correct_index);

  simResultContentEl.innerHTML = `
    <div id="sim-result-title" class="sim-result-title">${passed ? t('passed') : t('failed')} — ${correct} / ${sim.questions.length}</div>
    <div class="sim-result-list">
      ${wrong.length === 0
        ? `<div class="stats-empty">${escapeHtml(t('errorsNone'))}</div>`
        : wrong
            .map((qq) => {
              const idx = state.deck.questions.findIndex((x) => cardId(x) === cardId(qq)) + 1;
              return `<div class="sim-result-item">
                <div class="sim-result-item-title">${idx} / ${state.deck.questions.length}</div>
                <div class="sim-result-item-q">${escapeHtml(qq.question)}</div>
                <button class="back-btn" type="button" data-sim-jump="${cardId(qq)}">${escapeHtml(t('openInStudy'))}</button>
              </div>`;
            })
            .join('')}
    </div>
  `;
  simResultModalEl.classList.remove('hidden');
}

function openSimMissingModal(unanswered) {
  simResultContentEl.innerHTML = `
    <div id="sim-result-title" class="sim-result-title">${escapeHtml(t('missingTitle', { count: unanswered.length }))}</div>
    <div class="sim-missing">
      <div class="sim-missing-list">
        ${unanswered
          .map((q) => {
            const idx = state.simulation.questions.findIndex((x) => cardId(x) === cardId(q)) + 1;
            return `<button class="sim-jump-btn" type="button" data-sim-missing-jump="${cardId(q)}">${escapeHtml(t('questionN', { n: idx }))}</button>`;
          })
          .join('')}
      </div>
    </div>
  `;
  simResultModalEl.classList.remove('hidden');
}

function closeSimResultModal() {
  simResultModalEl.classList.add('hidden');
  simResultContentEl.innerHTML = '';
}

function animateFlip(updateUI, direction = 'none') {
  const first = cardEl.getBoundingClientRect();
  updateUI();
  const last = cardEl.getBoundingClientRect();

  const dx = first.left - last.left;
  const dy = first.top - last.top;
  const sx = first.width / Math.max(last.width, 1);
  const sy = first.height / Math.max(last.height, 1);
  const enterFromRight = direction === 'enter-right';
  const swipeNudge = direction === 'left' ? -22 : direction === 'right' ? 22 : 0;
  const enterFromLeft = direction === 'enter-left';
  const startX = enterFromRight
    ? Math.min(window.innerWidth * 0.22, 140)
    : enterFromLeft
      ? -Math.min(window.innerWidth * 0.22, 140)
      : dx + swipeNudge;
  const startY = enterFromRight ? 0 : dy;
  const startScaleX = enterFromRight ? 0.985 : sx;
  const startScaleY = enterFromRight ? 0.985 : sy;

  cardEl.style.transition = 'none';
  cardEl.style.transformOrigin = 'center center';
  cardEl.style.transform = `translate(${startX}px, ${startY}px) scale(${startScaleX}, ${startScaleY})`;

  requestAnimationFrame(() => {
    cardEl.style.transition = 'transform 180ms cubic-bezier(.2,.8,.2,1), opacity 160ms ease-out';
    cardEl.style.transform = 'translate(0, 0) scale(1, 1)';
  });
}

function hintForSwipe(dx) {
  if (!state.answerChecked) return null;
  if (dx <= -60) return 'easy';
  if (dx >= 60) return 'hard';
  return null;
}

function renderSwipeHint(label) {
  if (!label) {
    swipeIndicatorEl.classList.add('hidden');
    swipeIndicatorEl.textContent = '';
    return;
  }
  swipeIndicatorEl.textContent = label === 'easy' ? t('gradeEasy') : label === 'hard' ? t('gradeHard') : label;
  swipeIndicatorEl.classList.remove('hidden');
}

function setSwipeTint(dx = 0) {
  const root = document.documentElement;
  if (!state.answerChecked || dx === 0) {
    root.style.setProperty('--swipe-alpha', '0');
    return;
  }

  const intensity = Math.min(0.22, Math.abs(dx) / 700);
  if (dx < 0) {
    root.style.setProperty('--swipe-rgb', '24, 121, 78');
  } else {
    root.style.setProperty('--swipe-rgb', '180, 35, 24');
  }
  root.style.setProperty('--swipe-alpha', String(intensity));
}

function showTranslationTooltip(text) {
  if (!text) return;
  state.translationUsedForCurrent = true;
  clearTimeout(tooltipSelectableTimer);
  translationTooltipEl.classList.remove('selectable');
  translationTooltipTextEl.textContent = text;
  translationTooltipEl.classList.remove('hidden');
  try {
    window.getSelection()?.removeAllRanges();
  } catch {}
}

function hideTranslationTooltip() {
  clearTimeout(tooltipSelectableTimer);
  translationTooltipEl.classList.remove('selectable');
  translationTooltipEl.classList.add('hidden');
  translationTooltipTextEl.textContent = '';
}

function startLongPress(getText, options = {}) {
  clearTimeout(longPress.timer);
  longPress.triggered = false;
  longPress.suppressOptionClick = Boolean(options.suppressOptionClick);
  longPress.timer = window.setTimeout(() => {
    const text = getText();
    if (text) {
      showTranslationTooltip(text);
      longPress.triggered = true;
      if (longPress.suppressOptionClick) {
        state.suppressOptionClick = true;
        window.setTimeout(() => {
          state.suppressOptionClick = false;
        }, 260);
      }
    }
  }, 320);
}

function endLongPress() {
  clearTimeout(longPress.timer);
  longPress.triggered = false;
}

function renderStats() {
  const due = dueCards().length;
  const today = state.schedule.statsByDate[todayKey()]?.done || 0;
  const withoutTranslation = state.schedule.noTranslationMastered.length;
  const translationStack = state.schedule.translationStack.length;
  dueCountEl.textContent = String(due);
  doneTodayEl.textContent = String(today);
  withoutTranslationCountEl.textContent = String(withoutTranslation);
  translationStackCountEl.textContent = String(translationStack);
  if (state.activeTab === 'stats') {
    renderStatsView();
  }
}

function cardsByIdsInDeckOrder(ids) {
  const set = new Set(ids);
  return state.deck.questions.filter((q) => set.has(cardId(q)));
}

function statsCategoryCards(category) {
  if (!state.deck) return [];
  switch (category) {
    case 'due':
      return dueCards();
    case 'translation':
      return cardsByIdsInDeckOrder(state.schedule.translationStack);
    case 'mastered':
      return cardsByIdsInDeckOrder(state.schedule.noTranslationMastered);
    case 'relearn':
      return state.deck.questions.filter((q) => {
        const stage = getMeta(q).stage;
        return stage === 'relearn' || stage === 'learning';
      });
    case 'all':
      return state.deck.questions;
    default:
      return [];
  }
}

function renderStatsView() {
  if (!state.deck) return;
  const categories = [
    { id: 'due', label: t('statsDue') },
    { id: 'translation', label: t('statsTranslation') },
    { id: 'mastered', label: t('statsMastered') },
    { id: 'relearn', label: t('statsRelearn') },
    { id: 'all', label: t('statsAll') },
  ];

  statsCategoriesEl.innerHTML = categories
    .map((cat) => {
      const count = statsCategoryCards(cat.id).length;
      const active = cat.id === state.statsCategory ? 'active' : '';
      return `<button class="stats-cat-btn ${active}" data-category="${cat.id}" type="button">${cat.label} (${count})</button>`;
    })
    .join('');

  const list = statsCategoryCards(state.statsCategory);
  if (!list.length) {
    statsListEl.innerHTML = `<div class="stats-empty">${escapeHtml(t('statsEmpty'))}</div>`;
    return;
  }

  statsListEl.innerHTML = list
    .map((q) => {
      const idx = state.deck.questions.findIndex((x) => cardId(x) === cardId(q)) + 1;
      const label = tagLabel(q);
      const shortQ = escapeHtml(q.question.length > 120 ? `${q.question.slice(0, 120)}...` : q.question);
      return `<button class="stats-item-btn" data-card-id="${cardId(q)}" type="button">
        <div class="stats-item-title">${idx} / ${state.deck.questions.length} • ${label}</div>
        <div class="stats-item-question">${shortQ}</div>
      </button>`;
    })
    .join('');
}

function updateBackButton() {
  backCardBtn.disabled = false;
  forwardCardBtn.disabled = false;
}

function renderQuizOptions(card, revealCorrect = false) {
  const correctIndex = card.correct_index;

  quizOptionsEl.innerHTML = optionOrder(card)
    .map((originalIdx) => {
      const opt = card.options[originalIdx];
      const classes = ['quiz-option-btn'];
      if (state.selectedOptionIndex === originalIdx) classes.push('selected');
      if (revealCorrect && originalIdx === correctIndex) classes.push('correct');
      if (revealCorrect && state.selectedOptionIndex === originalIdx && originalIdx !== correctIndex) classes.push('wrong');

      return `<li>
        <button class="${classes.join(' ')}" data-option-index="${originalIdx}" ${revealCorrect ? 'disabled' : ''}>
          ${renderOptionInner(card, opt, originalIdx)}
        </button>
      </li>`;
    })
    .join('');
}

function renderCard(card) {
  state.currentCard = card;
  state.selectedOptionIndex = null;
  state.answerChecked = false;
  state.lastAnswerCorrect = null;
  state.translationUsedForCurrent = false;

  const cardNum = state.deck.questions.findIndex((c) => cardId(c) === cardId(card)) + 1;
  const meta = getMeta(card);

  cardIndexEl.textContent = `${cardNum} / ${state.deck.questions.length}`;
  cardTagEl.textContent = tagLabel(card);

  cardGroupEl.textContent = meta.stage;
  cardGroupEl.className = `tag group-tag ${meta.stage}`;

  questionDeEl.textContent = card.question;
  renderQuestionImages(questionMediaEl, card);

  renderQuizOptions(card, false);

  setRevealMode(false);
  renderSwipeHint(null);
  setSwipeTint(0);
  hideTranslationTooltip();
  updateBackButton();
  emptyStateEl.classList.add('hidden');
  cardEl.classList.remove('hidden');
}

function renderNextCard() {
  animateFlip(() => {
    renderStats();
    const due = dueCards();
    if (!due.length) {
      cardEl.classList.add('hidden');
      emptyStateEl.classList.remove('hidden');
      state.currentCard = null;
      return;
    }
    renderCard(due[0]);
  });
}

function checkAnswer() {
  if (!state.currentCard || state.selectedOptionIndex == null || state.answerChecked) return;
  state.answerChecked = true;
  renderQuizOptions(state.currentCard, true);
  state.lastAnswerCorrect = state.selectedOptionIndex === state.currentCard.correct_index;
  animateFlip(() => setRevealMode(true));
}

async function loadDeck() {
  const res = await fetch(DATA_PATH, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Dataset not found: ${DATA_PATH}`);
  return res.json();
}

function applyGrade(grade, direction = 'none') {
  if (!state.currentCard || !state.answerChecked) return;

  const id = cardId(state.currentCard);
  const meta = getMeta(state.currentCard);
  scheduleWithBuckets(meta, grade, state.lastAnswerCorrect === true);

  if (state.translationUsedForCurrent) {
    state.schedule.translationStack = state.schedule.translationStack.filter((x) => x !== id);
    state.schedule.translationStack.push(id);
    meta.noTranslationSuccesses = 0;
    state.schedule.noTranslationMastered = state.schedule.noTranslationMastered.filter((x) => x !== id);
  } else if (state.lastAnswerCorrect === true) {
    meta.noTranslationSuccesses = (meta.noTranslationSuccesses || 0) + 1;
    if (meta.noTranslationSuccesses >= 2) {
      state.schedule.noTranslationMastered = state.schedule.noTranslationMastered.filter((x) => x !== id);
      state.schedule.noTranslationMastered.push(id);
      state.schedule.translationStack = state.schedule.translationStack.filter((x) => x !== id);
    }
  } else {
    meta.noTranslationSuccesses = 0;
    state.schedule.noTranslationMastered = state.schedule.noTranslationMastered.filter((x) => x !== id);
  }

  incrementTodayDoneUnique(id);
  saveSchedule();
  renderSwipeHint(null);
  setSwipeTint(0);

  const dismissToLeft = grade === 'easy';
  const outX = dismissToLeft ? -Math.min(window.innerWidth * 0.95, 520) : Math.min(window.innerWidth * 0.95, 520);
  const enterDirection = dismissToLeft ? 'enter-right' : 'enter-left';

  cardEl.style.transition = 'transform 170ms cubic-bezier(.2,.8,.2,1), opacity 140ms ease-out';
  cardEl.style.transform = `translate3d(${outX}px, 0, 0) rotate(${dismissToLeft ? -5 : 5}deg)`;
  cardEl.style.opacity = '0.35';

  window.setTimeout(() => {
    cardEl.style.transition = 'none';
    cardEl.style.opacity = '1';
    cardEl.style.transform = 'translate3d(0,0,0) rotate(0deg)';

    animateFlip(() => {
      renderStats();
      const due = dueCards();
      if (!due.length) {
        cardEl.classList.add('hidden');
        emptyStateEl.classList.remove('hidden');
        state.currentCard = null;
        return;
      }
      renderCard(due[0]);
    }, enterDirection);
  }, 175);
}

function openResetModal() {
  confirmModalEl.classList.remove('hidden');
}

function closeResetModal() {
  confirmModalEl.classList.add('hidden');
}

quizOptionsEl.addEventListener('click', (event) => {
  if (state.suppressOptionClick) {
    state.suppressOptionClick = false;
    return;
  }
  if (!state.currentCard || state.answerChecked) return;
  const btn = event.target.closest('[data-option-index]');
  if (!btn) return;
  state.selectedOptionIndex = Number(btn.dataset.optionIndex);
  renderQuizOptions(state.currentCard, false);
});

showAnswerBtn.addEventListener('click', () => {
  if (!state.currentCard) return;
  if (state.selectedOptionIndex == null) {
    renderSwipeHint(t('chooseOption'));
    setTimeout(() => renderSwipeHint(null), 700);
    return;
  }
  checkAnswer();
});

gradeActionsEl.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-grade]');
  if (!btn || !state.currentCard) return;
  applyGrade(btn.dataset.grade);
});

resetProgressBtn.addEventListener('click', () => {
  openResetModal();
});

localeToggleEl.addEventListener('click', () => {
  state.locale = state.locale === 'ru' ? 'en' : 'ru';
  applyLocale();
});

copyProgressLinkBtn.addEventListener('click', async () => {
  try {
    const url = await buildProgressUrl();
    await copyTextToClipboard(url);
    setCopyProgressLinkState(true);
  } catch (error) {
    console.warn('Failed to copy progress link', error);
    setCopyProgressLinkState(false);
  }
});

settingsHistoryListEl.addEventListener('click', (event) => {
  const restoreBtn = event.target.closest('[data-restore-version]');
  if (!restoreBtn) return;
  openRestoreProgressModal(restoreBtn.dataset.restoreVersion);
});

cancelResetBtn.addEventListener('click', () => {
  closeResetModal();
});

cancelImportProgressBtn.addEventListener('click', () => {
  pendingImportedProgress = null;
  closeImportProgressModal();
  clearProgressQueryParam();
});

confirmResetBtn.addEventListener('click', () => {
  state.schedule = defaultSchedule();
  saveSchedule();
  closeResetModal();
  renderNextCard();
});

confirmImportProgressBtn.addEventListener('click', () => {
  saveProgressVersion();
  if (pendingImportedProgress) {
    applyImportedProgress(pendingImportedProgress);
  }
  pendingImportedProgress = null;
  closeImportProgressModal();
  clearProgressQueryParam();
});

cancelRestoreProgressBtn.addEventListener('click', () => {
  pendingRestoreVersionId = null;
  closeRestoreProgressModal();
});

confirmRestoreProgressBtn.addEventListener('click', () => {
  const version = state.progressHistory.find((item) => item.id === pendingRestoreVersionId);
  saveProgressVersion();
  if (version) {
    applyRestoredProgress(version);
  }
  pendingRestoreVersionId = null;
  closeRestoreProgressModal();
});

confirmModalEl.addEventListener('click', (event) => {
  if (event.target === confirmModalEl) {
    closeResetModal();
  }
});

importProgressModalEl.addEventListener('click', (event) => {
  if (event.target === importProgressModalEl) {
    pendingImportedProgress = null;
    closeImportProgressModal();
    clearProgressQueryParam();
  }
});

restoreProgressModalEl.addEventListener('click', (event) => {
  if (event.target === restoreProgressModalEl) {
    pendingRestoreVersionId = null;
    closeRestoreProgressModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && imageViewerState.open) {
    closeImageViewer();
    return;
  }
  if (event.key === 'Escape' && !confirmModalEl.classList.contains('hidden')) {
    closeResetModal();
    return;
  }
  if (event.key === 'Escape' && !importProgressModalEl.classList.contains('hidden')) {
    pendingImportedProgress = null;
    closeImportProgressModal();
    clearProgressQueryParam();
    return;
  }
  if (event.key === 'Escape' && !restoreProgressModalEl.classList.contains('hidden')) {
    pendingRestoreVersionId = null;
    closeRestoreProgressModal();
  }
});

cardEl.addEventListener('pointerdown', (event) => {
  if (!state.currentCard) return;
  gesture.active = true;
  gesture.startX = event.clientX;
  gesture.startY = event.clientY;
  gesture.startTs = performance.now();
  cardEl.classList.add('dragging');
});

cardEl.addEventListener('pointermove', (event) => {
  if (!gesture.active || !state.currentCard) return;
  const dx = event.clientX - gesture.startX;
  const dy = event.clientY - gesture.startY;
  const rotation = Math.max(-6, Math.min(6, dx / 24));

  if (state.answerChecked) {
    cardEl.style.transform = `translate3d(${dx}px, ${dy * 0.12}px, 0) rotate(${rotation}deg)`;
    renderSwipeHint(hintForSwipe(dx));
    setSwipeTint(dx);
  } else {
    cardEl.style.transform = `translate3d(0, ${Math.min(18, dy * 0.18)}px, 0)`;
    renderSwipeHint(null);
    setSwipeTint(0);
  }
});

cardEl.addEventListener('pointerup', (event) => {
  if (!gesture.active || !state.currentCard) return;
  gesture.active = false;
  cardEl.classList.remove('dragging');

  const dx = event.clientX - gesture.startX;
  const dy = event.clientY - gesture.startY;
  const dt = Math.max(1, performance.now() - gesture.startTs);
  const vx = Math.abs(dx) / dt;

  cardEl.style.transition = 'transform 130ms ease-out';
  cardEl.style.transform = 'translate3d(0,0,0) rotate(0deg)';
  setSwipeTint(0);

  if (!state.answerChecked) {
    const swipeUp = dy < -58 && Math.abs(dy) > Math.abs(dx);
    if (swipeUp) {
      if (state.selectedOptionIndex == null) {
        renderSwipeHint(t('chooseOption'));
        setTimeout(() => renderSwipeHint(null), 700);
      } else {
        checkAnswer();
      }
    }
    return;
  }

  const swipeLabel = hintForSwipe(dx);
  if (swipeLabel && (Math.abs(dx) > 58 || vx > 0.45)) {
    const direction = dx < 0 ? 'left' : 'right';
    applyGrade(swipeLabel, direction);
    return;
  }

  renderSwipeHint(null);
  setSwipeTint(0);
});

cardEl.addEventListener('pointercancel', () => {
  gesture.active = false;
  cardEl.classList.remove('dragging');
  cardEl.style.transition = 'transform 120ms ease-out';
  cardEl.style.transform = 'translate3d(0,0,0) rotate(0deg)';
  renderSwipeHint(null);
  setSwipeTint(0);
});

questionDeEl.addEventListener('pointerdown', (event) => {
  event.stopPropagation();
  if (state.activeTab !== 'study') return;
  if (!state.currentCard) return;
  startLongPress(
    () => `DE: ${state.currentCard?.question || ''}\nRU: ${state.currentCard?.question_ru || ''}`,
    { suppressOptionClick: false }
  );
});

questionDeEl.addEventListener('pointerup', endLongPress);
questionDeEl.addEventListener('pointercancel', endLongPress);
questionDeEl.addEventListener('pointerleave', endLongPress);

quizOptionsEl.addEventListener('pointerdown', (event) => {
  event.stopPropagation();
  if (state.activeTab !== 'study') return;
  const btn = event.target.closest('[data-option-index]');
  if (!btn || !state.currentCard) return;
  const idx = Number(btn.dataset.optionIndex);
  startLongPress(
    () => `DE: ${state.currentCard?.options?.[idx] || ''}\nRU: ${state.currentCard?.options_ru?.[idx] || ''}`,
    { suppressOptionClick: true }
  );
});

quizOptionsEl.addEventListener('pointerup', endLongPress);
quizOptionsEl.addEventListener('pointercancel', endLongPress);
quizOptionsEl.addEventListener('pointerleave', endLongPress);

questionDeEl.addEventListener('contextmenu', (event) => event.preventDefault());
quizOptionsEl.addEventListener('contextmenu', (event) => event.preventDefault());
questionMediaEl.addEventListener('pointerdown', (event) => event.stopPropagation());
simQuestionMediaEl.addEventListener('pointerdown', (event) => event.stopPropagation());
questionMediaEl.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-image-src]');
  if (!btn) return;
  openImageViewer(btn.dataset.imageSrc, btn.dataset.imageAlt || '');
});
simQuestionMediaEl.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-image-src]');
  if (!btn) return;
  openImageViewer(btn.dataset.imageSrc, btn.dataset.imageAlt || '');
});
translationTooltipCloseEl.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  event.stopPropagation();
});
translationTooltipCloseEl.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  hideTranslationTooltip();
});
translationTooltipEl.addEventListener('pointerdown', (event) => {
  const insideCard = event.target.closest('.translation-tooltip-card');
  if (!insideCard) {
    hideTranslationTooltip();
  }
});
translationTooltipTextEl.addEventListener('click', () => {
  clearTimeout(tooltipSelectableTimer);
  translationTooltipEl.classList.add('selectable');
});
imageViewerCloseEl.addEventListener('click', () => closeImageViewer());
imageViewerBackdropEl.addEventListener('click', () => closeImageViewer());
imageViewerStageEl.addEventListener('dblclick', (event) => {
  event.preventDefault();
  if (!imageViewerState.open) return;
  if (imageViewerState.scale > 1) {
    imageViewerState.scale = 1;
    imageViewerState.x = 0;
    imageViewerState.y = 0;
  } else {
    imageViewerState.scale = 2.2;
  }
  clampViewerPosition();
  updateViewerTransform();
});
imageViewerStageEl.addEventListener('wheel', (event) => {
  if (!imageViewerState.open) return;
  event.preventDefault();
  const nextScale = clamp(imageViewerState.scale - event.deltaY * 0.0015, 1, 4);
  imageViewerState.scale = nextScale;
  if (nextScale === 1) {
    imageViewerState.x = 0;
    imageViewerState.y = 0;
  }
  clampViewerPosition();
  updateViewerTransform();
}, { passive: false });
imageViewerStageEl.addEventListener('pointerdown', (event) => {
  if (!imageViewerState.open) return;
  event.preventDefault();
  imageViewerStageEl.setPointerCapture(event.pointerId);
  imageViewerState.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (imageViewerState.pointers.size === 1) {
    imageViewerState.dragStartX = imageViewerState.x;
    imageViewerState.dragStartY = imageViewerState.y;
    imageViewerState.startX = event.clientX;
    imageViewerState.startY = event.clientY;
  } else if (imageViewerState.pointers.size === 2) {
    const [a, b] = [...imageViewerState.pointers.values()];
    imageViewerState.pinchDistance = pointerDistance(a, b);
    imageViewerState.pinchScale = imageViewerState.scale;
    const midpoint = pointerMidpoint(a, b);
    imageViewerState.pinchMidX = midpoint.x;
    imageViewerState.pinchMidY = midpoint.y;
    imageViewerState.pinchStartX = imageViewerState.x;
    imageViewerState.pinchStartY = imageViewerState.y;
  }
});
imageViewerStageEl.addEventListener('pointermove', (event) => {
  if (!imageViewerState.open || !imageViewerState.pointers.has(event.pointerId)) return;
  event.preventDefault();
  imageViewerState.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (imageViewerState.pointers.size >= 2) {
    const [a, b] = [...imageViewerState.pointers.values()];
    const nextDistance = pointerDistance(a, b);
    if (imageViewerState.pinchDistance > 0) {
      const midpoint = pointerMidpoint(a, b);
      const nextScale = clamp(imageViewerState.pinchScale * (nextDistance / imageViewerState.pinchDistance), 1, 4);
      const scaleRatio = nextScale / imageViewerState.pinchScale;
      imageViewerState.scale = nextScale;
      imageViewerState.x = imageViewerState.pinchStartX + (midpoint.x - imageViewerState.pinchMidX);
      imageViewerState.y = imageViewerState.pinchStartY + (midpoint.y - imageViewerState.pinchMidY);
      imageViewerState.x += (midpoint.x - imageViewerStageEl.clientWidth / 2) * (scaleRatio - 1);
      imageViewerState.y += (midpoint.y - imageViewerStageEl.clientHeight / 2) * (scaleRatio - 1);
      clampViewerPosition();
      updateViewerTransform();
    }
    return;
  }

  if (imageViewerState.scale <= 1) return;
  imageViewerState.x = imageViewerState.dragStartX + (event.clientX - imageViewerState.startX);
  imageViewerState.y = imageViewerState.dragStartY + (event.clientY - imageViewerState.startY);
  clampViewerPosition();
  updateViewerTransform();
});
imageViewerStageEl.addEventListener('pointerup', (event) => {
  if (imageViewerStageEl.hasPointerCapture(event.pointerId)) {
    imageViewerStageEl.releasePointerCapture(event.pointerId);
  }
  imageViewerState.pointers.delete(event.pointerId);
  if (imageViewerState.pointers.size === 1) {
    const [rest] = [...imageViewerState.pointers.values()];
    imageViewerState.dragStartX = imageViewerState.x;
    imageViewerState.dragStartY = imageViewerState.y;
    imageViewerState.startX = rest.x;
    imageViewerState.startY = rest.y;
  }
  if (imageViewerState.scale <= 1) {
    imageViewerState.x = 0;
    imageViewerState.y = 0;
  }
  clampViewerPosition();
  updateViewerTransform();
});
imageViewerStageEl.addEventListener('pointercancel', (event) => {
  if (imageViewerStageEl.hasPointerCapture(event.pointerId)) {
    imageViewerStageEl.releasePointerCapture(event.pointerId);
  }
  imageViewerState.pointers.delete(event.pointerId);
  clampViewerPosition();
  updateViewerTransform();
});

backCardBtn.addEventListener('click', () => {
  if (!state.currentCard || !state.deck) return;
  const idx = currentCardIndex();
  if (idx < 0) return;
  const prevIdx = idx === 0 ? state.deck.questions.length - 1 : idx - 1;
  const prevCard = state.deck.questions[prevIdx];
  animateFlip(() => {
    renderStats();
    renderCard(prevCard);
  }, 'enter-left');
});

forwardCardBtn.addEventListener('click', () => {
  if (!state.currentCard || !state.deck) return;
  const idx = currentCardIndex();
  if (idx < 0) return;
  const nextIdx = idx === state.deck.questions.length - 1 ? 0 : idx + 1;
  const nextCard = state.deck.questions[nextIdx];
  animateFlip(() => {
    renderStats();
    renderCard(nextCard);
  }, 'enter-right');
});

tabStudyEl.addEventListener('click', () => switchTab('study'));
tabStatsEl.addEventListener('click', () => switchTab('stats'));
tabSimEl.addEventListener('click', () => switchTab('sim'));
tabSettingsEl.addEventListener('click', () => switchTab('settings'));
window.addEventListener('hashchange', () => {
  const nextTab = tabFromHash();
  if (nextTab === state.activeTab) return;
  state.activeTab = nextTab;
  updateTabButtons();
  updateViewsTrackPosition();
  hideTranslationTooltip();
  clearTimeout(longPress.timer);
  longPress.triggered = false;
  if (nextTab === 'stats') renderStatsView();
  if (nextTab === 'sim') renderSimView();
});

statsCategoriesEl.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-category]');
  if (!btn) return;
  state.statsCategory = btn.dataset.category;
  renderStatsView();
});

statsListEl.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-card-id]');
  if (!btn || !state.deck) return;
  const target = state.deck.questions.find((q) => cardId(q) === btn.dataset.cardId);
  if (!target) return;
  switchTab('study');
  window.setTimeout(() => {
    animateFlip(() => {
      renderStats();
      renderCard(target);
    }, 'enter-right');
  }, 20);
});

simStartEl.addEventListener('click', () => {
  startSimulation();
});

simOptionsEl.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-sim-option]');
  if (!btn || !state.simulation.active || state.simulation.submitted) return;
  const q = state.simulation.questions[state.simulation.current];
  state.simulation.answers[cardId(q)] = Number(btn.dataset.simOption);
  renderSimView();
});

simPrevEl.addEventListener('click', () => {
  if (!state.simulation.active) return;
  const lastIdx = state.simulation.questions.length - 1;
  state.simulation.current = state.simulation.current === 0 ? lastIdx : state.simulation.current - 1;
  renderSimView();
});

simNextEl.addEventListener('click', () => {
  if (!state.simulation.active) return;
  const lastIdx = state.simulation.questions.length - 1;
  state.simulation.current = state.simulation.current === lastIdx ? 0 : state.simulation.current + 1;
  renderSimView();
});

simSubmitEl.addEventListener('click', () => {
  if (!state.simulation.active) return;
  const unanswered = state.simulation.questions.filter((q) => !(cardId(q) in state.simulation.answers));
  if (unanswered.length > 0) {
    openSimMissingModal(unanswered);
    return;
  }
  state.simulation.submitted = true;
  openSimResultModal();
});

simResultContentEl.addEventListener('click', (event) => {
  const reviewBtn = event.target.closest('[data-sim-jump]');
  if (reviewBtn && state.deck) {
    const target = state.deck.questions.find((q) => cardId(q) === reviewBtn.dataset.simJump);
    if (!target) return;
    closeSimResultModal();
    switchTab('study');
    window.setTimeout(() => {
      animateFlip(() => {
        renderStats();
        renderCard(target);
      }, 'enter-right');
    }, 20);
    return;
  }

  const missingBtn = event.target.closest('[data-sim-missing-jump]');
  if (!missingBtn || !state.simulation.active) return;
  const idx = state.simulation.questions.findIndex((q) => cardId(q) === missingBtn.dataset.simMissingJump);
  if (idx < 0) return;
  closeSimResultModal();
  state.simulation.current = idx;
  renderSimView();
});

simResultCloseEl.addEventListener('click', () => closeSimResultModal());
simResultModalEl.addEventListener('click', (event) => {
  if (event.target === simResultModalEl) {
    closeSimResultModal();
  }
});

async function init() {
  try {
    state.activeTab = tabFromHash();
    applyLocale();
    state.deck = await loadDeck();
    state.schedule = loadSchedule();
    state.progressHistory = loadProgressHistory();
    const importedSnapshot = await importProgressFromUrl();
    syncHashWithTab();
    updateTabButtons();
    cardEl.classList.remove('loading');
    renderNextCard();
    if (importedSnapshot) {
      openImportProgressModal(importedSnapshot);
    }
  } catch (err) {
    state.activeTab = tabFromHash();
    applyLocale();
    cardEl.classList.remove('loading');
    cardEl.innerHTML = `<p>${escapeHtml(t('loadError', { message: err.message }))}</p>`;
  }
}

init();

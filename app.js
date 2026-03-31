const starterDeckUrl = 'data/starter-deck.json';

const state = {
  deckName: 'Broken Vietnamese Core Phrases',
  cards: [],
  currentIndex: 0,
  isBackVisible: false,
  studyMode: 'meaning-to-viet',
  filterLevel: 'all',
  search: '',
  tag: '',
  visibleIds: []
};

const el = {
  loadStarterBtn: document.getElementById('loadStarterBtn'),
  newDeckBtn: document.getElementById('newDeckBtn'),
  fileInput: document.getElementById('fileInput'),
  saveJsonBtn: document.getElementById('saveJsonBtn'),
  saveMdBtn: document.getElementById('saveMdBtn'),
  backupBtn: document.getElementById('backupBtn'),
  statusText: document.getElementById('statusText'),
  studyModeSelect: document.getElementById('studyModeSelect'),
  difficultyFilter: document.getElementById('difficultyFilter'),
  searchInput: document.getElementById('searchInput'),
  tagFilterInput: document.getElementById('tagFilterInput'),
  shuffleBtn: document.getElementById('shuffleBtn'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  flipBtn: document.getElementById('flipBtn'),
  quickEnglishInput: document.getElementById('quickEnglishInput'),
  quickBrokenInput: document.getElementById('quickBrokenInput'),
  quickNotesInput: document.getElementById('quickNotesInput'),
  quickAddBtn: document.getElementById('quickAddBtn'),
  deckTitle: document.getElementById('deckTitle'),
  totalCardsStat: document.getElementById('totalCardsStat'),
  visibleCardsStat: document.getElementById('visibleCardsStat'),
  cardPositionStat: document.getElementById('cardPositionStat'),
  frontFace: document.getElementById('frontFace'),
  backFace: document.getElementById('backFace'),
  speakBtn: document.getElementById('speakBtn'),
  easyBtn: document.getElementById('easyBtn'),
  learningBtn: document.getElementById('learningBtn'),
  newBtn: document.getElementById('newBtn'),
  upvoteBtn: document.getElementById('upvoteBtn'),
  downvoteBtn: document.getElementById('downvoteBtn'),
  addCardBtn: document.getElementById('addCardBtn'),
  cloneCardBtn: document.getElementById('cloneCardBtn'),
  deleteCardBtn: document.getElementById('deleteCardBtn'),
  cardIdInput: document.getElementById('cardIdInput'),
  tagsInput: document.getElementById('tagsInput'),
  vietInput: document.getElementById('vietInput'),
  pronunciationInput: document.getElementById('pronunciationInput'),
  englishInput: document.getElementById('englishInput'),
  cantoneseInput: document.getElementById('cantoneseInput'),
  exampleInput: document.getElementById('exampleInput'),
  exampleMeaningInput: document.getElementById('exampleMeaningInput'),
  brokenCueInput: document.getElementById('brokenCueInput'),
  notesInput: document.getElementById('notesInput'),
  levelSelect: document.getElementById('levelSelect'),
  upvotesInput: document.getElementById('upvotesInput'),
  downvotesInput: document.getElementById('downvotesInput'),
  applyChangesBtn: document.getElementById('applyChangesBtn'),
  resetEditorBtn: document.getElementById('resetEditorBtn'),
  copyCurrentBtn: document.getElementById('copyCurrentBtn'),
  fillTranslatorBtn: document.getElementById('fillTranslatorBtn'),
  translatorSource: document.getElementById('translatorSource'),
  translatorTarget: document.getElementById('translatorTarget'),
  copyPronunciationBtn: document.getElementById('copyPronunciationBtn'),
  googleTranslateLink: document.getElementById('googleTranslateLink'),
  youglishLink: document.getElementById('youglishLink'),
  forvoLink: document.getElementById('forvoLink'),
  exportVisibleBtn: document.getElementById('exportVisibleBtn'),
  cardList: document.getElementById('cardList')
};

bindEvents();
loadStarterDeck();

function bindEvents() {
  el.loadStarterBtn.addEventListener('click', loadStarterDeck);
  el.newDeckBtn.addEventListener('click', createNewDeck);
  el.fileInput.addEventListener('change', importDeckFile);
  el.saveJsonBtn.addEventListener('click', () => downloadFile(getDeckJson(), safeDeckName() + '.json', 'application/json'));
  el.saveMdBtn.addEventListener('click', () => downloadFile(exportMarkdown(state.cards), safeDeckName() + '.md', 'text/markdown'));
  el.backupBtn.addEventListener('click', () => downloadFile(getDeckJson(), safeDeckName() + '.bk.json', 'application/json'));
  el.studyModeSelect.addEventListener('change', () => { state.studyMode = el.studyModeSelect.value; state.isBackVisible = false; render(); });
  el.difficultyFilter.addEventListener('change', () => { state.filterLevel = el.difficultyFilter.value; clampCurrentIndex(); render(); });
  el.searchInput.addEventListener('input', () => { state.search = el.searchInput.value.trim().toLowerCase(); clampCurrentIndex(); render(); });
  el.tagFilterInput.addEventListener('input', () => { state.tag = el.tagFilterInput.value.trim().toLowerCase(); clampCurrentIndex(); render(); });
  el.shuffleBtn.addEventListener('click', shuffleVisibleCards);
  el.prevBtn.addEventListener('click', () => stepCard(-1));
  el.nextBtn.addEventListener('click', () => stepCard(1));
  el.flipBtn.addEventListener('click', () => { state.isBackVisible = !state.isBackVisible; renderStudyCard(); });
  el.quickAddBtn.addEventListener('click', quickAddCard);
  el.speakBtn.addEventListener('click', speakCurrentCard);
  el.easyBtn.addEventListener('click', () => setCurrentLevel('mastered'));
  el.learningBtn.addEventListener('click', () => setCurrentLevel('learning'));
  el.newBtn.addEventListener('click', () => setCurrentLevel('new'));
  el.upvoteBtn.addEventListener('click', () => incrementVote('upvotes'));
  el.downvoteBtn.addEventListener('click', () => incrementVote('downvotes'));
  el.addCardBtn.addEventListener('click', addBlankCard);
  el.cloneCardBtn.addEventListener('click', cloneCurrentCard);
  el.deleteCardBtn.addEventListener('click', deleteCurrentCard);
  el.applyChangesBtn.addEventListener('click', applyEditorChanges);
  el.resetEditorBtn.addEventListener('click', renderEditor);
  el.copyCurrentBtn.addEventListener('click', copyCurrentVietnamese);
  el.fillTranslatorBtn.addEventListener('click', fillTranslatorFromCard);
  el.copyPronunciationBtn.addEventListener('click', copyCurrentPronunciation);
  el.exportVisibleBtn.addEventListener('click', exportVisibleSubset);
}

async function loadStarterDeck() {
  try {
    const response = await fetch(starterDeckUrl);
    if (!response.ok) throw new Error('Could not load starter deck');
    const deck = await response.json();
    loadDeck(deck);
    setStatus('Starter deck loaded.');
  } catch (error) {
    createNewDeck();
    setStatus('Starter deck could not load, so a blank deck was created.');
  }
}

function createNewDeck() {
  loadDeck({ deckName: 'New Vietnamese Deck', cards: [createCard()] });
  setStatus('New blank deck created.');
}

function loadDeck(deck) {
  state.deckName = deck.deckName || 'Vietnamese Deck';
  state.cards = Array.isArray(deck.cards) && deck.cards.length ? deck.cards.map(normalizeCard) : [createCard()];
  state.currentIndex = 0;
  state.isBackVisible = false;
  state.studyMode = el.studyModeSelect.value;
  render();
}

function normalizeCard(card, index = 0) {
  return {
    id: card.id || `card-${String(index + 1).padStart(3, '0')}`,
    viet: card.viet || '',
    pronunciation: card.pronunciation || '',
    english: card.english || '',
    cantonese: card.cantonese || '',
    example: card.example || '',
    exampleMeaning: card.exampleMeaning || '',
    brokenCue: card.brokenCue || '',
    notes: card.notes || '',
    tags: Array.isArray(card.tags) ? card.tags : splitTags(card.tags || ''),
    upvotes: toInt(card.upvotes),
    downvotes: toInt(card.downvotes),
    level: ['new', 'learning', 'mastered'].includes(card.level) ? card.level : 'new'
  };
}

function createCard() {
  return normalizeCard({
    id: `card-${Date.now()}`,
    viet: '',
    pronunciation: '',
    english: '',
    cantonese: '',
    example: '',
    exampleMeaning: '',
    brokenCue: '',
    notes: '',
    tags: [],
    upvotes: 0,
    downvotes: 0,
    level: 'new'
  });
}

function importDeckFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = String(reader.result || '');
      const isJson = file.name.toLowerCase().endsWith('.json');
      const deck = isJson ? JSON.parse(text) : parseMarkdownDeck(text, file.name);
      loadDeck(deck);
      state.deckName = file.name.replace(/\.[^.]+$/, '') || state.deckName;
      setStatus(`Loaded ${file.name}.`);
    } catch (error) {
      console.error(error);
      setStatus('Import failed. Check the file format.');
      alert('Import failed. Use the included JSON format or the app Markdown format.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function parseMarkdownDeck(text, filename = 'Imported Deck') {
  const chunks = String(text).replace(/\r\n/g, '\n').split(/(?=^###\s+Card)/gm).filter(Boolean);
  const cards = chunks.map(parseMarkdownCard).filter(Boolean);
  return { deckName: filename.replace(/\.[^.]+$/, ''), cards };
}

function parseMarkdownCard(chunk) {
  const lines = chunk.split('\n').map(line => line.trim());
  const fields = {};
  for (const line of lines) {
    const match = line.match(/^\*\*(.+?):\*\*\s*(.*)$/);
    if (match) fields[match[1].trim().toLowerCase()] = match[2].trim();
  }
  return normalizeCard({
    id: fields.id || `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    viet: fields.vietnamese || fields.viet || '',
    pronunciation: fields.pronunciation || '',
    english: fields.english || '',
    cantonese: fields.cantonese || '',
    example: fields['example sentence'] || fields.example || '',
    exampleMeaning: fields['example meaning'] || '',
    brokenCue: fields['broken cue'] || '',
    notes: fields.notes || '',
    tags: splitTags(fields.tags || ''),
    upvotes: toInt(fields.upvotes),
    downvotes: toInt(fields.downvotes),
    level: fields.level || 'new'
  });
}

function getFilteredCards() {
  const filtered = state.cards.filter(card => {
    const matchesLevel = state.filterLevel === 'all' || card.level === state.filterLevel;
    const haystack = [card.id, card.viet, card.pronunciation, card.english, card.cantonese, card.example, card.notes, card.tags.join(' ')].join(' ').toLowerCase();
    const matchesSearch = !state.search || haystack.includes(state.search);
    const matchesTag = !state.tag || card.tags.some(tag => tag.toLowerCase().includes(state.tag));
    return matchesLevel && matchesSearch && matchesTag;
  });
  state.visibleIds = filtered.map(card => card.id);
  return filtered;
}

function getCurrentCard() {
  const visible = getFilteredCards();
  if (!visible.length) return null;
  clampCurrentIndex();
  return visible[state.currentIndex] || null;
}

function clampCurrentIndex() {
  const visible = getFilteredCards();
  if (!visible.length) {
    state.currentIndex = 0;
    return;
  }
  state.currentIndex = Math.max(0, Math.min(state.currentIndex, visible.length - 1));
}

function render() {
  renderStats();
  renderStudyCard();
  renderEditor();
  renderBrowser();
  updateResearchLinks();
}

function renderStats() {
  const visible = getFilteredCards();
  el.deckTitle.textContent = state.deckName;
  el.totalCardsStat.textContent = String(state.cards.length);
  el.visibleCardsStat.textContent = String(visible.length);
  el.cardPositionStat.textContent = visible.length ? `${state.currentIndex + 1} / ${visible.length}` : '0 / 0';
}

function renderStudyCard() {
  const card = getCurrentCard();
  if (!card) {
    el.frontFace.innerHTML = renderEmptyState('No cards match this filter.');
    el.backFace.innerHTML = '';
    el.backFace.classList.add('hidden');
    return;
  }

  const mode = resolveMode();
  el.frontFace.innerHTML = mode === 'meaning-to-viet' ? renderFrontMeaningToViet(card) : renderFrontVietToMeaning(card);
  el.backFace.innerHTML = renderBack(card);

  if (state.isBackVisible) {
    el.frontFace.classList.add('hidden');
    el.backFace.classList.remove('hidden');
  } else {
    el.frontFace.classList.remove('hidden');
    el.backFace.classList.add('hidden');
  }
}

function resolveMode() {
  if (state.studyMode !== 'mixed') return state.studyMode;
  const card = getCurrentCard();
  if (!card) return 'meaning-to-viet';
  return hashString(card.id) % 2 === 0 ? 'meaning-to-viet' : 'viet-to-meaning';
}

function renderFrontMeaningToViet(card) {
  return `
    <div class="face-block">
      <span class="label">English meaning</span>
      <div class="value big">${escapeHtml(card.english || '—')}</div>
    </div>
    <div class="face-block">
      <span class="label">Cantonese meaning</span>
      <div class="value">${escapeHtml(card.cantonese || '—')}</div>
    </div>
    <div class="face-block">
      <span class="label">Broken speaking cue</span>
      <div class="value">${escapeHtml(card.brokenCue || card.notes || 'Keep it short and natural.')}</div>
    </div>
  `;
}

function renderFrontVietToMeaning(card) {
  return `
    <div class="face-block">
      <span class="label">Vietnamese</span>
      <div class="value big">${escapeHtml(card.viet || '—')}</div>
    </div>
    <div class="face-block">
      <span class="label">Pronunciation</span>
      <div class="value">${escapeHtml(card.pronunciation || '—')}</div>
    </div>
    <div class="face-block">
      <span class="label">Prompt</span>
      <div class="value">Say it out loud before flipping.</div>
    </div>
  `;
}

function renderBack(card) {
  return `
    <div class="face-block">
      <span class="label">Vietnamese</span>
      <div class="value big">${escapeHtml(card.viet || '—')}</div>
    </div>
    <div class="face-block">
      <span class="label">Pronunciation</span>
      <div class="value">${escapeHtml(card.pronunciation || '—')}</div>
    </div>
    <div class="face-block">
      <span class="label">English</span>
      <div class="value">${escapeHtml(card.english || '—')}</div>
    </div>
    <div class="face-block">
      <span class="label">Cantonese</span>
      <div class="value">${escapeHtml(card.cantonese || '—')}</div>
    </div>
    <div class="face-block">
      <span class="label">Example sentence</span>
      <div class="value">${escapeHtml(card.example || '—')}</div>
    </div>
    <div class="face-block">
      <span class="label">Example meaning</span>
      <div class="value">${escapeHtml(card.exampleMeaning || '—')}</div>
    </div>
  `;
}

function renderEmptyState(message) {
  return `<div class="face-block"><span class="label">Empty</span><div class="value">${escapeHtml(message)}</div></div>`;
}

function renderEditor() {
  const card = getCurrentCard();
  if (!card) {
    el.cardIdInput.value = '';
    el.tagsInput.value = '';
    el.vietInput.value = '';
    el.pronunciationInput.value = '';
    el.englishInput.value = '';
    el.cantoneseInput.value = '';
    el.exampleInput.value = '';
    el.exampleMeaningInput.value = '';
    el.brokenCueInput.value = '';
    el.notesInput.value = '';
    el.levelSelect.value = 'new';
    el.upvotesInput.value = 0;
    el.downvotesInput.value = 0;
    return;
  }

  el.cardIdInput.value = card.id;
  el.tagsInput.value = card.tags.join(', ');
  el.vietInput.value = card.viet;
  el.pronunciationInput.value = card.pronunciation;
  el.englishInput.value = card.english;
  el.cantoneseInput.value = card.cantonese;
  el.exampleInput.value = card.example;
  el.exampleMeaningInput.value = card.exampleMeaning;
  el.brokenCueInput.value = card.brokenCue;
  el.notesInput.value = card.notes;
  el.levelSelect.value = card.level;
  el.upvotesInput.value = card.upvotes;
  el.downvotesInput.value = card.downvotes;
}

function renderBrowser() {
  const visible = getFilteredCards();
  if (!visible.length) {
    el.cardList.innerHTML = '<div class="browser-card"><div class="small-meta">No cards to show.</div></div>';
    return;
  }

  el.cardList.innerHTML = visible.map((card, index) => `
    <article class="browser-card">
      <div class="browser-card-top">
        <div>
          <h3>${escapeHtml(card.viet || '(blank Vietnamese)')}</h3>
          <div class="small-meta">${escapeHtml(card.english || 'No English meaning')} · ${escapeHtml(card.level)}</div>
        </div>
        <div class="inline-actions">
          <button data-go-index="${index}">Open</button>
        </div>
      </div>
      <div class="small-meta">Pronunciation: ${escapeHtml(card.pronunciation || '—')}</div>
      <div class="small-meta">Cantonese: ${escapeHtml(card.cantonese || '—')}</div>
      <div class="small-meta">Votes: 👍 ${card.upvotes} / 👎 ${card.downvotes}</div>
      <div class="tag-row">
        ${card.tags.map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </article>
  `).join('');

  el.cardList.querySelectorAll('[data-go-index]').forEach(button => {
    button.addEventListener('click', () => {
      state.currentIndex = Number(button.dataset.goIndex) || 0;
      state.isBackVisible = false;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function stepCard(direction) {
  const visible = getFilteredCards();
  if (!visible.length) return;
  state.currentIndex = (state.currentIndex + direction + visible.length) % visible.length;
  state.isBackVisible = false;
  render();
}

function shuffleVisibleCards() {
  const visible = getFilteredCards();
  if (visible.length < 2) return;
  const order = [...visible];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const visibleIdSet = new Set(order.map(card => card.id));
  const frozenHidden = state.cards.filter(card => !visibleIdSet.has(card.id));
  state.cards = [...order, ...frozenHidden];
  state.currentIndex = 0;
  state.isBackVisible = false;
  render();
  setStatus('Visible cards shuffled.');
}

function quickAddCard() {
  const english = el.quickEnglishInput.value.trim();
  const broken = el.quickBrokenInput.value.trim();
  const notes = el.quickNotesInput.value.trim();
  const newCard = createCard();
  newCard.english = english;
  newCard.pronunciation = broken;
  newCard.brokenCue = broken ? `Rough sound: ${broken}` : '';
  newCard.notes = notes;
  newCard.tags = ['quick-add'];
  state.cards.unshift(newCard);
  state.currentIndex = 0;
  state.isBackVisible = false;
  el.quickEnglishInput.value = '';
  el.quickBrokenInput.value = '';
  el.quickNotesInput.value = '';
  render();
  setStatus('Quick phrase added as a new card.');
}

function speakCurrentCard() {
  const card = getCurrentCard();
  if (!card || !card.viet) return;
  if (!('speechSynthesis' in window)) {
    alert('Speech is not supported in this browser.');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(card.viet);
  utterance.lang = 'vi-VN';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function setCurrentLevel(level) {
  const card = getCurrentCard();
  if (!card) return;
  card.level = level;
  render();
  setStatus(`Card marked as ${level}.`);
}

function incrementVote(field) {
  const card = getCurrentCard();
  if (!card) return;
  card[field] += 1;
  render();
}

function addBlankCard() {
  state.cards.unshift(createCard());
  state.currentIndex = 0;
  state.isBackVisible = false;
  render();
  setStatus('Blank card added.');
}

function cloneCurrentCard() {
  const card = getCurrentCard();
  if (!card) return;
  const clone = normalizeCard({ ...card, id: `${card.id}-copy-${Date.now()}` });
  state.cards.unshift(clone);
  state.currentIndex = 0;
  state.isBackVisible = false;
  render();
  setStatus('Card cloned.');
}

function deleteCurrentCard() {
  const card = getCurrentCard();
  if (!card) return;
  if (!confirm(`Delete this card?\n\n${card.viet || card.english || card.id}`)) return;
  state.cards = state.cards.filter(item => item.id !== card.id);
  if (!state.cards.length) state.cards = [createCard()];
  clampCurrentIndex();
  state.isBackVisible = false;
  render();
  setStatus('Card deleted.');
}

function applyEditorChanges() {
  const card = getCurrentCard();
  if (!card) return;
  card.id = el.cardIdInput.value.trim() || card.id;
  card.tags = splitTags(el.tagsInput.value);
  card.viet = el.vietInput.value.trim();
  card.pronunciation = el.pronunciationInput.value.trim();
  card.english = el.englishInput.value.trim();
  card.cantonese = el.cantoneseInput.value.trim();
  card.example = el.exampleInput.value.trim();
  card.exampleMeaning = el.exampleMeaningInput.value.trim();
  card.brokenCue = el.brokenCueInput.value.trim();
  card.notes = el.notesInput.value.trim();
  card.level = el.levelSelect.value;
  card.upvotes = toInt(el.upvotesInput.value);
  card.downvotes = toInt(el.downvotesInput.value);
  render();
  setStatus('Card updated.');
}

function copyCurrentVietnamese() {
  const card = getCurrentCard();
  if (!card || !card.viet) return;
  navigator.clipboard.writeText(card.viet).then(() => setStatus('Vietnamese text copied.'));
}

function fillTranslatorFromCard() {
  const card = getCurrentCard();
  if (!card) return;
  el.translatorSource.value = card.example || card.viet;
  el.translatorTarget.value = [card.english, card.cantonese, card.notes].filter(Boolean).join('\n');
  updateResearchLinks();
  setStatus('Current card sent to translator helper.');
}

function copyCurrentPronunciation() {
  const card = getCurrentCard();
  if (!card || !card.pronunciation) return;
  navigator.clipboard.writeText(card.pronunciation).then(() => setStatus('Pronunciation copied.'));
}

function updateResearchLinks() {
  const card = getCurrentCard();
  const query = encodeURIComponent(el.translatorSource.value.trim() || (card ? card.viet : '') || '');
  el.googleTranslateLink.href = `https://translate.google.com/?sl=vi&tl=yue&text=${query}&op=translate`;
  el.youglishLink.href = `https://youglish.com/pronounce/${query}/vietnamese`;
  el.forvoLink.href = `https://forvo.com/search/${query}/vi/`;
}

function exportVisibleSubset() {
  const visible = getFilteredCards();
  if (!visible.length) return;
  downloadFile(JSON.stringify({ deckName: `${state.deckName} Visible Subset`, cards: visible }, null, 2), `${safeDeckName()}-visible.json`, 'application/json');
}

function getDeckJson() {
  return JSON.stringify({ deckName: state.deckName, cards: state.cards }, null, 2);
}

function exportMarkdown(cards) {
  return cards.map((card, index) => `### Card ${index + 1}\n**ID:** ${card.id}\n**Vietnamese:** ${card.viet}\n**Pronunciation:** ${card.pronunciation}\n**English:** ${card.english}\n**Cantonese:** ${card.cantonese}\n**Example Sentence:** ${card.example}\n**Example Meaning:** ${card.exampleMeaning}\n**Broken Cue:** ${card.brokenCue}\n**Notes:** ${card.notes}\n**Tags:** ${card.tags.join(', ')}\n**Upvotes:** ${card.upvotes}\n**Downvotes:** ${card.downvotes}\n**Level:** ${card.level}`).join('\n\n');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  setStatus(`${filename} downloaded.`);
}

function splitTags(value) {
  return String(value || '').split(',').map(tag => tag.trim()).filter(Boolean);
}

function safeDeckName() {
  return state.deckName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'viet-deck';
}

function setStatus(message) {
  el.statusText.textContent = message;
}

function toInt(value) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? Math.floor(num) : 0;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
  return Math.abs(hash);
}

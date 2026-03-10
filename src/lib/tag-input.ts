export interface TagInputConfig {
  wrapper: HTMLElement;
  input: HTMLInputElement;
  dropdown: HTMLElement;
  tagsContainer: HTMLElement;
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

export interface TagInputAPI {
  getTags: () => string[];
  setTags: (tags: string[]) => void;
  clearTags: () => void;
  destroy: () => void;
}

export function createTagInput(config: TagInputConfig): TagInputAPI {
  const { wrapper, input, dropdown, tagsContainer, initialTags = [], onTagsChange } = config;

  let allTags: Array<{ id: string; name: string }> = [];
  let selectedTags: string[] = [...initialTags];
  let tagsFetched = false;

  // Fetch available tags from API
  async function fetchTags(): Promise<void> {
    if (tagsFetched) return;
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      allTags = data.tags || [];
      tagsFetched = true;
    } catch {
      console.error('Failed to fetch tags');
    }
  }

  function renderSelectedTags() {
    tagsContainer.innerHTML = selectedTags.map(tag => `
      <span class="tag-pill removable" data-tag="${tag}">
        ${tag}
        <button type="button" class="remove-btn" aria-label="Remove ${tag}">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="2" y1="2" x2="10" y2="10" />
            <line x1="10" y1="2" x2="2" y2="10" />
          </svg>
        </button>
      </span>
    `).join('');

    tagsContainer.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pill = (e.currentTarget as HTMLElement).closest('.tag-pill');
        const tag = pill?.getAttribute('data-tag');
        if (tag) removeTag(tag);
      });
    });

    onTagsChange?.(selectedTags);
  }

  function addTag(name: string) {
    const normalized = name.toLowerCase().trim();
    if (!normalized) return;
    
    if (selectedTags.includes(normalized)) {
      // Shake animation for duplicate
      const pill = tagsContainer.querySelector(`[data-tag="${normalized}"]`);
      pill?.classList.add('shake');
      setTimeout(() => pill?.classList.remove('shake'), 300);
      return;
    }
    
    selectedTags.push(normalized);
    renderSelectedTags();
    input.value = '';
    hideDropdown();
  }

  function removeTag(name: string) {
    selectedTags = selectedTags.filter(t => t !== name);
    renderSelectedTags();
  }

  function showDropdown(filter: string) {
    const matches = allTags
      .filter(t => t.name.includes(filter.toLowerCase()) && !selectedTags.includes(t.name))
      .slice(0, 5);

    if (matches.length === 0 && filter.trim()) {
      dropdown.innerHTML = `<div class="dropdown-item create" data-value="${filter.trim()}">Create "${filter.trim()}"</div>`;
    } else if (matches.length === 0) {
      hideDropdown();
      return;
    } else {
      dropdown.innerHTML = matches.map(t => 
        `<div class="dropdown-item" data-value="${t.name}">${t.name}</div>`
      ).join('');
    }

    dropdown.hidden = false;

    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const value = item.getAttribute('data-value');
        if (value) addTag(value);
      });
    });
  }

  function hideDropdown() {
    dropdown.hidden = true;
    dropdown.innerHTML = '';
  }

  // Event handlers
  async function handleInput() {
    const value = input.value;
    if (value.includes(',')) {
      const tag = value.replace(',', '').trim();
      if (tag) addTag(tag);
    } else if (value) {
      await fetchTags(); // Ensure tags loaded before showing dropdown
      showDropdown(value);
    } else {
      hideDropdown();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = input.value.trim();
      if (value) addTag(value);
    } else if (e.key === 'Escape') {
      hideDropdown();
    } else if (e.key === 'Backspace' && !input.value && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  }

  function handleBlur() {
    setTimeout(hideDropdown, 150);
  }

  // Attach listeners
  input.addEventListener('input', handleInput);
  input.addEventListener('keydown', handleKeydown);
  input.addEventListener('blur', handleBlur);

  // Initial render
  renderSelectedTags();

  // Public API
  return {
    getTags: () => [...selectedTags],
    setTags: (tags: string[]) => {
      selectedTags = [...tags];
      renderSelectedTags();
    },
    clearTags: () => {
      selectedTags = [];
      renderSelectedTags();
    },
    destroy: () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('keydown', handleKeydown);
      input.removeEventListener('blur', handleBlur);
    }
  };
}

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const entitiesContainer = document.getElementById('entitiesContainer');
    const entitiesGrid = document.getElementById('entitiesGrid');
    const backBtn = document.getElementById('backBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const addNewBtn = document.getElementById('addNewBtn');
    const entityTemplate = document.getElementById('entityTemplate');

    // Initialize page
    loadEntities();

    // Event Listeners
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'user-details.html';
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadEntities();
        });
    }

    if (addNewBtn) {
        addNewBtn.addEventListener('click', () => {
            // Clear any editing flag so the user-details form opens empty for a new entity
            localStorage.removeItem('editingEntityId');
            window.location.href = 'user-details.html';
        });
    }

    // Load all entities from localStorage
    function loadEntities() {
        showLoading();

        try {
            // Get entities from localStorage
            const entities = JSON.parse(localStorage.getItem('userEntities') || '[]');
            
            if (entities.length === 0) {
                showEmptyState();
            } else {
                displayEntities(entities);
            }
        } catch (error) {
            console.error('Error loading entities:', error);
            alert('Failed to load entities. Please try again.');
            showEmptyState();
        }
    }

    // Display entities in the grid
    function displayEntities(entities) {
        // Clear existing entities
        entitiesGrid.innerHTML = '';

        // Create entity cards
        entities.forEach(entity => {
            const entityCard = createEntityCard(entity);
            entitiesGrid.appendChild(entityCard);
        });

        // Show entities container
        loadingState.style.display = 'none';
        emptyState.style.display = 'none';
        entitiesContainer.style.display = 'block';
    }

    // Create entity card element
    function createEntityCard(entity) {
        const template = entityTemplate.content.cloneNode(true);
        const card = template.querySelector('.entity-card');
        
        // Store entity ID on the card
        card.dataset.entityId = entity.id;

        // Set entity data with editable fields
        const nameEl = card.querySelector('.entity-name');
        nameEl.contentEditable = false;
        nameEl.textContent = entity.name;
        nameEl.title = 'Click edit to modify';

        const panEl = card.querySelector('.entity-pan');
        panEl.contentEditable = false;
        panEl.textContent = entity.pan;
        panEl.title = 'Click edit to modify';

        const gstEl = card.querySelector('.entity-gst');
        gstEl.contentEditable = false;
        gstEl.textContent = entity.gst || 'N/A';
        gstEl.title = 'Click edit to modify';

        // Phone is an <input> element in the template — keep readonly until edit mode
        const phoneEl = card.querySelector('.entity-phone');
        if (phoneEl) {
            phoneEl.readOnly = true;
            phoneEl.value = entity.phone || '';
            phoneEl.title = 'Click edit to modify';
        }

        // Address is a <textarea> — keep readonly until edit mode
        const addressEl = card.querySelector('.entity-address');
        if (addressEl) {
            addressEl.readOnly = true;
            addressEl.value = entity.address || '';
            addressEl.title = 'Click edit to modify';
        }

        // Auto-resize helper for address textarea so it grows with content (no scroll)
        function autoResizeTextarea(textarea) {
            if (!textarea) return;
            textarea.style.height = 'auto';
            // Add a small extra px to avoid scrollbar due to subpixel rounding
            textarea.style.height = (textarea.scrollHeight + 2) + 'px';
        }

        // Do NOT auto-resize on creation; only resize when entering edit mode.
        // We will attach/remove the input listener when edit mode is toggled below.

        const districtEl = card.querySelector('.entity-district');
        districtEl.contentEditable = false;
        districtEl.textContent = entity.district;
        districtEl.title = 'Click edit to modify';
        
        // Format created date
        const createdDate = new Date(entity.created_at);
        card.querySelector('.entity-created').textContent = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Add blur/key handlers to save changes. Use value for inputs/textarea, textContent for contenteditable elements.
        [nameEl, panEl, gstEl, districtEl].forEach(el => {
            el.addEventListener('blur', () => saveEntityChanges(entity.id, card));
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    el.blur();
                }
            });
        });

        if (phoneEl) {
            phoneEl.addEventListener('blur', () => saveEntityChanges(entity.id, card));
            phoneEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    phoneEl.blur();
                }
            });
        }

        if (addressEl) {
            addressEl.addEventListener('blur', () => saveEntityChanges(entity.id, card));
            addressEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addressEl.blur();
                }
            });
        }

        // Display managers
        const managersList = card.querySelector('.managers-list-view');
        if (entity.managers && entity.managers.length > 0) {
            entity.managers.forEach((manager, index) => {
                const managerItem = document.createElement('div');
                managerItem.className = 'manager-item';
                managerItem.innerHTML = `
                    <div class="manager-info">
                        <div class="manager-field">
                            <span class="manager-label">Name:</span>
                            <span class="manager-name" contenteditable="false" title="Click edit to modify">${manager.name}</span>
                        </div>
                        <div class="manager-field">
                            <span class="manager-label">Phone:</span>
                            <span class="manager-phone" contenteditable="false" title="Click edit to modify">${manager.phone}</span>
                        </div>
                    </div>
                    <i class="fas fa-user-tie" style="color: var(--primary-color);"></i>
                `;
                
                // Add blur event listeners for managers
                const managerNameEl = managerItem.querySelector('.manager-name');
                const managerPhoneEl = managerItem.querySelector('.manager-phone');
                [managerNameEl, managerPhoneEl].forEach(el => {
                    el.addEventListener('blur', () => saveEntityChanges(entity.id, card));
                    el.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            el.blur();
                        }
                    });
                });
                
                managersList.appendChild(managerItem);
            });
        } else {
            managersList.innerHTML = '<div class="no-managers">No managers assigned</div>';
        }

        // Delete button
        const deleteBtn = card.querySelector('.btn-delete-entity');
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete the entity for ${entity.name}?`)) {
                deleteEntity(entity.id);
            }
        });

        // Edit button: toggle edit mode for this card and change icon to Save
        const editBtn = card.querySelector('.btn-edit-entity');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const isEditing = card.classList.contains('editing');
                if (!isEditing) {
                    // Enter edit mode
                    card.classList.add('editing');
                    // Make contenteditable fields editable
                    [nameEl, panEl, gstEl, districtEl].forEach(el => el.contentEditable = true);
                    if (phoneEl) phoneEl.readOnly = false;
                    if (addressEl) {
                        addressEl.readOnly = false;
                        // ensure it's resized to fit any existing content when entering edit mode
                        autoResizeTextarea(addressEl);
                        // attach a named handler so we can remove it later; avoid duplicate attachments
                        if (!addressEl._resizeHandler) {
                            addressEl._resizeHandler = function () { autoResizeTextarea(addressEl); };
                        }
                        addressEl.addEventListener('input', addressEl._resizeHandler);
                    }
                    // Make manager fields editable
                    const managerNames = card.querySelectorAll('.manager-name');
                    const managerPhones = card.querySelectorAll('.manager-phone');
                    managerNames.forEach(el => el.contentEditable = true);
                    managerPhones.forEach(el => el.contentEditable = true);
                    // Swap icon to save
                    const icon = editBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-edit');
                        icon.classList.add('fa-save');
                    }
                    editBtn.title = 'Save changes';
                    // Focus first editable element
                    if (nameEl) nameEl.focus();
                } else {
                    // Save and exit edit mode
                    saveEntityChanges(entity.id, card);
                    card.classList.remove('editing');
                    [nameEl, panEl, gstEl, districtEl].forEach(el => el.contentEditable = false);
                    if (phoneEl) phoneEl.readOnly = true;
                    if (addressEl) {
                        // resize to final content height and remove live handler
                        autoResizeTextarea(addressEl);
                        addressEl.readOnly = true;
                        if (addressEl._resizeHandler) {
                            addressEl.removeEventListener('input', addressEl._resizeHandler);
                        }
                    }
                    // Make manager fields non-editable
                    const managerNames = card.querySelectorAll('.manager-name');
                    const managerPhones = card.querySelectorAll('.manager-phone');
                    managerNames.forEach(el => el.contentEditable = false);
                    managerPhones.forEach(el => el.contentEditable = false);
                    const icon = editBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-save');
                        icon.classList.add('fa-edit');
                    }
                    editBtn.title = 'Edit entity';
                }
            });
        }

        // Add ripple effect
        deleteBtn.addEventListener('click', createRipple);

        return template;
    }

    // Save entity changes
    function saveEntityChanges(entityId, card) {
        try {
            // Get all entities
            let entities = JSON.parse(localStorage.getItem('userEntities') || '[]');
            
            // Find the entity to update
            const entityIndex = entities.findIndex(e => e.id === entityId);
            if (entityIndex === -1) return;
            
            // Update entity data from card
            // Helper to read text/value depending on element type
            function readField(selector) {
                const el = card.querySelector(selector);
                if (!el) return '';
                const tag = el.tagName && el.tagName.toUpperCase();
                if (tag === 'INPUT' || tag === 'TEXTAREA') return el.value;
                return el.textContent;
            }

            entities[entityIndex].name = readField('.entity-name');
            entities[entityIndex].pan = readField('.entity-pan');
            const gstText = readField('.entity-gst');
            entities[entityIndex].gst = gstText === 'N/A' ? null : gstText;
            entities[entityIndex].phone = readField('.entity-phone');
            entities[entityIndex].address = readField('.entity-address');
            entities[entityIndex].district = readField('.entity-district');
            
            // Update managers
            const managerItems = card.querySelectorAll('.manager-item');
            entities[entityIndex].managers = [];
            managerItems.forEach(item => {
                const name = item.querySelector('.manager-name')?.textContent;
                const phone = item.querySelector('.manager-phone')?.textContent;
                if (name && phone) {
                    entities[entityIndex].managers.push({ name, phone });
                }
            });
            
            // Save to localStorage
            localStorage.setItem('userEntities', JSON.stringify(entities));
            
            console.log('Entity updated successfully');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Failed to save changes. Please try again.');
        }
    }

    // Delete entity
    function deleteEntity(entityId) {
        try {
            // Get all entities
            let entities = JSON.parse(localStorage.getItem('userEntities') || '[]');
            
            // Filter out the deleted entity
            entities = entities.filter(e => e.id !== entityId);
            
            // Save back to localStorage
            localStorage.setItem('userEntities', JSON.stringify(entities));
            
            // Reload entities
            loadEntities();
        } catch (error) {
            console.error('Error deleting entity:', error);
            alert('Failed to delete entity. Please try again.');
        }
    }

    // Show loading state
    function showLoading() {
        loadingState.style.display = 'block';
        emptyState.style.display = 'none';
        entitiesContainer.style.display = 'none';
    }

    // Show empty state
    function showEmptyState() {
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
        entitiesContainer.style.display = 'none';
    }

    // Create ripple effect
    function createRipple(e) {
        const button = e.currentTarget;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

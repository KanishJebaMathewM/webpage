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
    initParticles();
    loadEntities();

    // Initialize particles.js for background effect
    function initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#4CAF50'
                    },
                    shape: {
                        type: 'circle'
                    },
                    opacity: {
                        value: 0.5,
                        random: false
                    },
                    size: {
                        value: 3,
                        random: true
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#4CAF50',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'grab'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

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
        nameEl.contentEditable = true;
        nameEl.textContent = entity.name;
        nameEl.title = 'Click to edit';
        
        const panEl = card.querySelector('.entity-pan');
        panEl.contentEditable = true;
        panEl.textContent = entity.pan;
        panEl.title = 'Click to edit';
        
        const gstEl = card.querySelector('.entity-gst');
        gstEl.contentEditable = true;
        gstEl.textContent = entity.gst || 'N/A';
        gstEl.title = 'Click to edit';
        
        const phoneEl = card.querySelector('.entity-phone');
        phoneEl.contentEditable = true;
        phoneEl.textContent = entity.phone;
        phoneEl.title = 'Click to edit';
        
        const addressEl = card.querySelector('.entity-address');
        addressEl.contentEditable = true;
        addressEl.textContent = entity.address;
        addressEl.title = 'Click to edit';
        
        const districtEl = card.querySelector('.entity-district');
        districtEl.contentEditable = true;
        districtEl.textContent = entity.district;
        districtEl.title = 'Click to edit';
        
        // Format created date
        const createdDate = new Date(entity.created_at);
        card.querySelector('.entity-created').textContent = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Add blur event listeners to save changes
        [nameEl, panEl, gstEl, phoneEl, addressEl, districtEl].forEach(el => {
            el.addEventListener('blur', () => saveEntityChanges(entity.id, card));
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    el.blur();
                }
            });
        });

        // Display managers
        const managersList = card.querySelector('.managers-list-view');
        if (entity.managers && entity.managers.length > 0) {
            entity.managers.forEach((manager, index) => {
                const managerItem = document.createElement('div');
                managerItem.className = 'manager-item';
                managerItem.innerHTML = `
                    <div class="manager-info">
                        <span class="manager-name" contenteditable="true" title="Click to edit">${manager.name}</span>
                        <span class="manager-phone" contenteditable="true" title="Click to edit">${manager.phone}</span>
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
            entities[entityIndex].name = card.querySelector('.entity-name').textContent;
            entities[entityIndex].pan = card.querySelector('.entity-pan').textContent;
            const gstText = card.querySelector('.entity-gst').textContent;
            entities[entityIndex].gst = gstText === 'N/A' ? null : gstText;
            entities[entityIndex].phone = card.querySelector('.entity-phone').textContent;
            entities[entityIndex].address = card.querySelector('.entity-address').textContent;
            entities[entityIndex].district = card.querySelector('.entity-district').textContent;
            
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

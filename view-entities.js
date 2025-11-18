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

    // API Base URL
    const API_BASE_URL = 'http://localhost:8000';

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
            window.location.href = 'user-details.html';
        });
    }

    // Load all entities from backend
    async function loadEntities() {
        showLoading();

        try {
            const response = await fetch(`${API_BASE_URL}/user-details/`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch entities');
            }

            const entities = await response.json();
            
            if (entities.length === 0) {
                showEmptyState();
            } else {
                displayEntities(entities);
            }
        } catch (error) {
            console.error('Error loading entities:', error);
            alert('Failed to load entities. Please ensure the backend server is running.');
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

        // Set entity data
        card.querySelector('.entity-name').textContent = entity.name;
        card.querySelector('.entity-pan').textContent = entity.pan;
        card.querySelector('.entity-gst').textContent = entity.gst || 'N/A';
        card.querySelector('.entity-phone').textContent = entity.phone;
        card.querySelector('.entity-address').textContent = entity.address;
        card.querySelector('.entity-district').textContent = entity.district;
        
        // Format created date
        const createdDate = new Date(entity.created_at);
        card.querySelector('.entity-created').textContent = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Display managers
        const managersList = card.querySelector('.managers-list-view');
        if (entity.managers && entity.managers.length > 0) {
            entity.managers.forEach(manager => {
                const managerItem = document.createElement('div');
                managerItem.className = 'manager-item';
                managerItem.innerHTML = `
                    <div class="manager-info">
                        <span class="manager-name">${manager.name}</span>
                        <span class="manager-phone">${manager.phone}</span>
                    </div>
                    <i class="fas fa-user-tie" style="color: var(--primary-color);"></i>
                `;
                managersList.appendChild(managerItem);
            });
        } else {
            managersList.innerHTML = '<div class="no-managers">No managers assigned</div>';
        }

        // Delete button
        const deleteBtn = card.querySelector('.btn-delete-entity');
        deleteBtn.addEventListener('click', async () => {
            if (confirm(`Are you sure you want to delete the entity for ${entity.name}?`)) {
                await deleteEntity(entity.id);
            }
        });

        // Add ripple effect
        deleteBtn.addEventListener('click', createRipple);

        return template;
    }

    // Delete entity
    async function deleteEntity(entityId) {
        try {
            const response = await fetch(`${API_BASE_URL}/user-details/${entityId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Reload entities
                loadEntities();
            } else {
                throw new Error('Failed to delete entity');
            }
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

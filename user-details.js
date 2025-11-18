document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userForm = document.querySelector('.user-form');
    const addManagerBtn = document.getElementById('addManager');
    const managersList = document.getElementById('managersList');
    const managerTemplate = document.getElementById('managerTemplate');
    const viewEntitiesBtn = document.getElementById('viewEntities');

    // API Base URL - update this to match your backend URL
    const API_BASE_URL = 'http://localhost:8000';

    // Initialize the page
    initPage();

    // Form submission - Save to backend
    if (userForm) {
        userForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state on the save button
            const saveBtn = this.querySelector('.btn-save-form');
            const originalContent = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;
            
            try {
                // Get form data
                const formData = getFormData();
                
                // Send data to backend
                const response = await fetch(`${API_BASE_URL}/user-details/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Data saved successfully:', result);
                    
                    // Show success message
                    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                    saveBtn.style.backgroundColor = '#10B981';
                    
                    setTimeout(() => {
                        saveBtn.innerHTML = originalContent;
                        saveBtn.style.backgroundColor = '';
                        saveBtn.disabled = false;
                    }, 2000);
                } else {
                    throw new Error('Failed to save data');
                }
            } catch (error) {
                console.error('Error saving data:', error);
                alert('Failed to save data. Please ensure the backend server is running.');
                saveBtn.innerHTML = originalContent;
                saveBtn.disabled = false;
            }
        });
    }

    // View entities button click handler
    if (viewEntitiesBtn) {
        viewEntitiesBtn.addEventListener('click', function() {
            window.location.href = 'view-entities.html';
        });
    }

    // Add manager button click handler
    if (addManagerBtn) {
        addManagerBtn.addEventListener('click', function() {
            addManager();
        });
    }

    // Initialize the page
    function initPage() {
        // Add ripple effect to buttons
        initRippleEffect();
    }

    // Add a new manager card
    function addManager(managerData = { name: '', phone: '' }) {
        if (!managerTemplate || !managersList) return;
        
        const managerCard = document.importNode(managerTemplate.content, true);
        const managerElement = managerCard.querySelector('.manager-card');
        
        // Set initial values if provided
        if (managerData.name) {
            managerElement.querySelector('.manager-name').value = managerData.name;
            managerElement.querySelector('.manager-phone').value = managerData.phone;
        }
        
        // Add event listeners for the manager card
        setupManagerCard(managerElement);
        
        // Add the new manager card to the list
        managersList.appendChild(managerElement);
        
        // Scroll to the new manager card
        managerElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Set up event listeners for a manager card
    function setupManagerCard(managerElement) {
        const deleteBtn = managerElement.querySelector('.manager-delete');
        
        // Delete button click handler
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this manager?')) {
                // Add fade out animation
                managerElement.style.opacity = '0';
                managerElement.style.transform = 'translateX(20px)';
                managerElement.style.transition = 'all 0.3s ease';
                
                // Remove the element after the animation completes
                setTimeout(() => {
                    managerElement.remove();
                }, 300);
            }
        });
        
        // Add ripple effect to button
        deleteBtn.addEventListener('click', createRipple);
    }

    // Get form data as an object
    function getFormData() {
        const formData = {
            name: document.getElementById('name').value,
            pan: document.getElementById('pan').value,
            gst: document.getElementById('gst').value || null,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            district: document.getElementById('district').value,
            managers: []
        };
        
        // Get manager data
        const managerCards = document.querySelectorAll('.manager-card');
        managerCards.forEach(card => {
            const managerName = card.querySelector('.manager-name').value;
            const managerPhone = card.querySelector('.manager-phone').value;
            if (managerName && managerPhone) {
                formData.managers.push({
                    name: managerName,
                    phone: managerPhone
                });
            }
        });
        
        return formData;
    }

    // Initialize ripple effect for buttons
    function initRippleEffect() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', createRipple);
        });
    }

    // Create ripple effect on button click
    function createRipple(e) {
        const button = e.currentTarget;
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Set ripple position
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        // Style ripple
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Add ripple to button
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userForm = document.querySelector('.user-form');
    const addManagerBtn = document.getElementById('addManager');
    const managersList = document.getElementById('managersList');
    const managerTemplate = document.getElementById('managerTemplate');
    const viewEntitiesBtn = document.getElementById('viewEntities');
    const editToggleBtn = document.getElementById('editToggle');

    // Initialize the page
    initPage();

    // Form submission - Save to localStorage
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state on the save button
            const saveBtn = this.querySelector('.btn-save-form');
            const originalContent = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;
            
            try {
                // Get form data
                const formData = getFormData();
                
                // Add ID and timestamp
                formData.id = Date.now();
                formData.created_at = new Date().toISOString();
                
                // Get existing data from localStorage
                let entities = JSON.parse(localStorage.getItem('userEntities') || '[]');
                
                // Add new entity
                entities.push(formData);
                
                // Save to localStorage
                localStorage.setItem('userEntities', JSON.stringify(entities));
                
                console.log('Data saved successfully:', formData);
                
                // Show success message
                saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                saveBtn.style.backgroundColor = '#10B981';
                
                setTimeout(() => {
                    saveBtn.innerHTML = originalContent;
                    saveBtn.style.backgroundColor = '';
                    saveBtn.disabled = false;
                    // Reset form
                    userForm.reset();
                    // Clear managers
                    managersList.innerHTML = '';
                }, 2000);
            } catch (error) {
                console.error('Error saving data:', error);
                alert('Failed to save data. Please try again.');
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

    // Edit mode toggle
    if (editToggleBtn) {
        // Start in non-edit mode
        setEditMode(false);
        
        editToggleBtn.addEventListener('click', function() {
            const isEditing = document.body.classList.toggle('edit-mode');
            setEditMode(isEditing);
        });
    }

    // Initialize the page
    function initPage() {
        // Initialize particles.js
        initParticles();
        
        // Add ripple effect to buttons
        initRippleEffect();
    }

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

    // Set edit mode state
    function setEditMode(isEditing) {
        const formInputs = document.querySelectorAll('.user-form input, .user-form textarea, .user-form select');
        const managerInputs = document.querySelectorAll('.manager-card input');
        
        formInputs.forEach(input => {
            input.disabled = !isEditing;
        });
        
        managerInputs.forEach(input => {
            input.disabled = !isEditing;
        });
        
        // Update button text and style
        if (editToggleBtn) {
            if (isEditing) {
                editToggleBtn.classList.add('editing');
                editToggleBtn.querySelector('span').textContent = 'Done';
                editToggleBtn.querySelector('i').classList.remove('fa-edit');
                editToggleBtn.querySelector('i').classList.add('fa-check');
            } else {
                editToggleBtn.classList.remove('editing');
                editToggleBtn.querySelector('span').textContent = 'Edit';
                editToggleBtn.querySelector('i').classList.remove('fa-check');
                editToggleBtn.querySelector('i').classList.add('fa-edit');
            }
        }
        
        // Disable/enable buttons in edit mode
        if (addManagerBtn) {
            addManagerBtn.disabled = !isEditing;
            addManagerBtn.style.opacity = isEditing ? '1' : '0.5';
        }
        
        const deleteButtons = document.querySelectorAll('.manager-delete');
        deleteButtons.forEach(btn => {
            btn.disabled = !isEditing;
            btn.style.opacity = isEditing ? '1' : '0.5';
        });
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
        
        // Set initial disabled state based on current edit mode
        const isEditing = document.body.classList.contains('edit-mode');
        const inputs = managerElement.querySelectorAll('input');
        inputs.forEach(input => {
            input.disabled = !isEditing;
        });
        deleteBtn.disabled = !isEditing;
        deleteBtn.style.opacity = isEditing ? '1' : '0.5';
        
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

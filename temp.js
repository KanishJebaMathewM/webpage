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
            
            // Validate form data before saving
            if (!validateFormData()) {
                return; // Stop submission if validation fails
            }
            
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

    // Note: edit toggle removed from this page; editing will be enabled by default here.

    // Initialize the page
    function initPage() {
        // Initialize particles.js
        initParticles();
        // Ensure the page shows editable inputs by default (editing moved to View Entities)
        document.body.classList.add('edit-mode');
        setEditMode(true);
        // Attach sanitizers to inputs on this page
        attachInputSanitizers();

        // Auto-resize address textarea
        const addressEl = document.getElementById('address');
        if (addressEl) {
            autoResizeTextarea(addressEl);
            addressEl.addEventListener('input', () => autoResizeTextarea(addressEl));
        }

        // Add ripple effect to buttons
        initRippleEffect();
    }

    // Attach sanitizer behavior to inputs on this page (name, pan, gst, phone, managers)
    function attachInputSanitizers() {
        const nameEl = document.getElementById('name');
        const panEl = document.getElementById('pan');
        const gstEl = document.getElementById('gst');
        const phoneEl = document.getElementById('phone');

        attachSanitizerInput(nameEl, 'alpha');
        attachSanitizerInput(panEl, 'alphanumeric');
        attachSanitizerInput(gstEl, 'digits');
        attachSanitizerInput(phoneEl, 'digits');

        // Managers present on load
        const managerCards = document.querySelectorAll('.manager-card');
        managerCards.forEach(card => {
            const mName = card.querySelector('.manager-name');
            const mPhone = card.querySelector('.manager-phone');
            attachSanitizerInput(mName, 'alpha');
            attachSanitizerInput(mPhone, 'digits');
        });
    }

    // Sanitizer for regular inputs/textarea
    function attachSanitizerInput(el, type) {
        if (!el) return;
        el.addEventListener('input', () => {
            let value = el.value || '';
            let clean = value;
            if (type === 'digits') clean = value.replace(/\D+/g, '');
            if (type === 'alpha') clean = value.replace(/[^a-zA-Z\s]+/g, '');
            if (type === 'alphanumeric') clean = value.replace(/[^a-zA-Z0-9]+/g, '');
            if (clean !== value) el.value = clean;
        });

        el.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
            let clean = paste;
            if (type === 'digits') clean = paste.replace(/\D+/g, '');
            if (type === 'alpha') clean = paste.replace(/[^a-zA-Z\s]+/g, '');
            if (type === 'alphanumeric') clean = paste.replace(/[^a-zA-Z0-9]+/g, '');
            const start = el.selectionStart || el.value.length;
            const newVal = el.value.slice(0, start) + clean + el.value.slice(start);
            el.value = newVal;
        });
    }

    // Auto-resize a textarea to fit content (without manual resize handle)
    function autoResizeTextarea(textarea) {
        if (!textarea) return;
        textarea.style.height = 'auto';
        // Add small padding for comfort
        textarea.style.height = Math.min(textarea.scrollHeight + 2, 240) + 'px';
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
                    /* detect_on: 'window' lets particles respond to cursor even when
                       the canvas is behind other DOM elements */
                    detect_on: 'window',
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
        // Attach sanitizers for manager inputs
        const mName = managerElement.querySelector('.manager-name');
        const mPhone = managerElement.querySelector('.manager-phone');
        attachSanitizerInput(mName, 'alpha');
        attachSanitizerInput(mPhone, 'digits');
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

    // Validate form data
    function validateFormData() {
        const name = document.getElementById('name').value.trim();
        const pan = document.getElementById('pan').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const district = document.getElementById('district').value.trim();
        const gst = document.getElementById('gst').value.trim();

        // Validate name (should contain only letters and spaces)
        if (!name) {
            alert('Please enter a name.');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            alert('Name should contain only letters and spaces.');
            return false;
        }

        // Validate PAN (should be alphanumeric and not empty)
        if (!pan) {
            alert('Please enter a PAN number.');
            return false;
        }
        if (!/^[a-zA-Z0-9]+$/.test(pan)) {
            alert('PAN number should contain only alphanumeric characters.');
            return false;
        }

        // Validate GST (if provided, should contain only digits)
        if (gst && !/^[0-9]+$/.test(gst)) {
            alert('GST should contain only numbers.');
            return false;
        }

        // Validate phone (should be 10 digits)
        if (!phone) {
            alert('Please enter a phone number.');
            return false;
        }
        if (!/^[0-9]{10}$/.test(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return false;
        }

        // Validate address
        if (!address) {
            alert('Please enter an address.');
            return false;
        }

        // Validate district (should contain only letters and spaces)
        if (!district) {
            alert('Please enter a district.');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(district)) {
            alert('District should contain only letters and spaces.');
            return false;
        }

        // Validate managers
        const managerCards = document.querySelectorAll('.manager-card');
        for (let i = 0; i < managerCards.length; i++) {
            const card = managerCards[i];
            const managerName = card.querySelector('.manager-name').value.trim();
            const managerPhone = card.querySelector('.manager-phone').value.trim();

            if (!managerName) {
                alert('Please enter a name for manager ' + (i + 1) + '.');
                return false;
            }
            if (!/^[a-zA-Z\s]+$/.test(managerName)) {
                alert('Manager name should contain only letters and spaces.');
                return false;
            }

            if (!managerPhone) {
                alert('Please enter a phone number for manager ' + (i + 1) + '.');
                return false;
            }
            if (!/^[0-9]{10}$/.test(managerPhone)) {
                alert('Please enter a valid 10-digit phone number for manager ' + (i + 1) + '.');
                return false;
            }
        }

        return true; // All validations passed
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

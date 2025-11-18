document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userForm = document.querySelector('.user-form');
    const addManagerBtn = document.getElementById('addManager');
    const managersList = document.getElementById('managersList');
    const managerTemplate = document.getElementById('managerTemplate');
    const saveDistrictBtn = document.getElementById('saveDistrict');
    const editDistrictBtn = document.getElementById('editDistrict');
    const districtInput = document.getElementById('district');
    let isEditingDistrict = false;

    // Initialize the page
    initPage();

    // Form submission
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state on the continue button
            const continueBtn = this.querySelector('.btn-continue');
            const originalContent = continueBtn.innerHTML;
            continueBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            continueBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // In a real app, you would send the form data to your server here
                const formData = getFormData();
                console.log('Form submitted:', formData);
                
                // Show success message
                alert('Your information has been saved successfully!');
                
                // Reset button state
                continueBtn.innerHTML = originalContent;
                continueBtn.disabled = false;
                
                // In a real app, you might redirect to a dashboard here
                // window.location.href = 'dashboard.html';
            }, 1500);
        });
    }

    // Add manager button click handler
    if (addManagerBtn) {
        addManagerBtn.addEventListener('click', function() {
            addManager();
        });
    }

    // Save district button click handler
    if (saveDistrictBtn) {
        saveDistrictBtn.addEventListener('click', function() {
            saveDistrict();
        });
    }

    // Edit district button click handler
    if (editDistrictBtn) {
        editDistrictBtn.addEventListener('click', function() {
            editDistrict();
        });
    }

    // Initialize the page
    function initPage() {
        // Add ripple effect to buttons
        initRippleEffect();
        
        // Load any saved data (in a real app, this would come from your backend)
        loadSavedData();
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
            
            // Show edit button and hide save button by default for existing managers
            const saveBtn = managerElement.querySelector('.manager-save');
            const editBtn = managerElement.querySelector('.manager-edit');
            const inputs = managerElement.querySelectorAll('input');
            
            saveBtn.style.display = 'none';
            editBtn.style.display = 'inline-flex';
            inputs.forEach(input => input.disabled = true);
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
        const saveBtn = managerElement.querySelector('.manager-save');
        const editBtn = managerElement.querySelector('.manager-edit');
        const deleteBtn = managerElement.querySelector('.manager-delete');
        const inputs = managerElement.querySelectorAll('input');
        
        // Save button click handler
        saveBtn.addEventListener('click', function() {
            // Validate inputs
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                }
            });
            
            if (isValid) {
                // In a real app, you would save the data to your backend here
                saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                saveBtn.style.backgroundColor = '#10B981';
                
                // Switch to edit mode after a delay
                setTimeout(() => {
                    inputs.forEach(input => input.disabled = true);
                    saveBtn.style.display = 'none';
                    editBtn.style.display = 'inline-flex';
                    
                    // Reset button state
                    setTimeout(() => {
                        saveBtn.innerHTML = '<i class="fas fa-check"></i> Save';
                        saveBtn.style.backgroundColor = '';
                    }, 500);
                }, 1000);
            }
        });
        
        // Edit button click handler
        editBtn.addEventListener('click', function() {
            inputs.forEach(input => input.disabled = false);
            saveBtn.style.display = 'inline-flex';
            editBtn.style.display = 'none';
            
            // Focus on the first input
            inputs[0].focus();
        });
        
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
                    
                    // In a real app, you would also delete the manager from your backend
                    console.log('Manager removed');
                }, 300);
            }
        });
        
        // Add ripple effect to buttons
        [saveBtn, editBtn, deleteBtn].forEach(btn => {
            btn.addEventListener('click', createRipple);
        });
    }

    // Save district information
    function saveDistrict() {
        if (!districtInput.value.trim()) {
            // Show error if district is empty
            districtInput.style.borderColor = '#ef4444';
            setTimeout(() => {
                districtInput.style.borderColor = '';
            }, 2000);
            return;
        }
        
        // Disable the input and show edit button
        districtInput.disabled = true;
        saveDistrictBtn.style.display = 'none';
        editDistrictBtn.style.display = 'inline-flex';
        
        // In a real app, you would save the district to your backend here
        console.log('District saved:', districtInput.value);
    }

    // Edit district information
    function editDistrict() {
        districtInput.disabled = false;
        districtInput.focus();
        saveDistrictBtn.style.display = 'inline-flex';
        editDistrictBtn.style.display = 'none';
    }

    // Get form data as an object
    function getFormData() {
        const formData = {
            name: document.getElementById('name').value,
            pan: document.getElementById('pan').value,
            gst: document.getElementById('gst').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            district: document.getElementById('district').value,
            managers: []
        };
        
        // Get manager data
        const managerCards = document.querySelectorAll('.manager-card');
        managerCards.forEach(card => {
            formData.managers.push({
                name: card.querySelector('.manager-name').value,
                phone: card.querySelector('.manager-phone').value
            });
        });
        
        return formData;
    }

    // Load saved data (simulated)
    function loadSavedData() {
        // In a real app, you would fetch this from your backend
        const savedData = {
            // Example data - in a real app, this would come from your API
            name: 'John Doe',
            pan: 'ABCDE1234F',
            gst: '22ABCDE1234F1Z5',
            phone: '9876543210',
            address: '123 Business Street, Tech Park',
            district: 'Bangalore',
            managers: [
                { name: 'Jane Smith', phone: '9876543211' },
                { name: 'Mike Johnson', phone: '9876543212' }
            ]
        };
        
        // Populate form fields
        if (savedData.name) document.getElementById('name').value = savedData.name;
        if (savedData.pan) document.getElementById('pan').value = savedData.pan;
        if (savedData.gst) document.getElementById('gst').value = savedData.gst;
        if (savedData.phone) document.getElementById('phone').value = savedData.phone;
        if (savedData.address) document.getElementById('address').value = savedData.address;
        if (savedData.district) {
            document.getElementById('district').value = savedData.district;
            // Trigger save to show the edit button
            saveDistrict();
        }
        
        // Add saved managers
        if (savedData.managers && savedData.managers.length > 0) {
            savedData.managers.forEach(manager => {
                addManager(manager);
            });
        }
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

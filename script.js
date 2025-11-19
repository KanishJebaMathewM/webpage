document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js for background effect
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
                /* Use window detection so particles respond to cursor even when
                   canvas is behind UI elements */
                detect_on: 'window',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: false,
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

    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Here you would typically validate the form and send the data to your server
            console.log('Login attempt with:', { email, password });
            
            // For demo purposes, redirect to user-details.html after a short delay
            // In a real app, you would check credentials first
            const loginBtn = document.querySelector('.login-btn');
            if (loginBtn) {
                // Show loading state
                const originalText = loginBtn.innerHTML;
                loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                loginBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Redirect to user details page
                    window.location.href = 'user-details.html';
                }, 1500);
            }
        });
    }

    // Google sign-in button click handler
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // Here you would implement Google OAuth
            console.log('Google sign-in clicked');
            // For demo, just show a message
            alert('Google sign-in would be implemented here');
        });
    }

    // Add focus effects to inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        // Add focus class on focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Remove focus class on blur if input is empty
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check on page load if inputs have values (for browser autofill)
        if (input.value !== '') {
            input.dispatchEvent(new Event('input'));
        }
    });


});



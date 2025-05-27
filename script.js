// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 500);
    }, 1500);
});

// Enhanced Navigation
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Enhanced Navbar
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }

    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
});

// Real-time Analytics Updates
function updateAnalytics() {
    const elements = {
        liveVisitors: document.getElementById('liveVisitors'),
        todayQuotes: document.getElementById('todayQuotes'),
        activeSessions: document.getElementById('activeSessions'),
        conversionRate: document.getElementById('conversionRate')
    };

    // Simulate real-time updates
    setInterval(() => {
        const visitors = Math.floor(Math.random() * 100) + 1200;
        const quotes = Math.floor(Math.random() * 20) + 80;
        const sessions = Math.floor(Math.random() * 50) + 140;
        const conversion = (Math.random() * 5 + 10).toFixed(1);

        if (elements.liveVisitors) elements.liveVisitors.textContent = visitors.toLocaleString();
        if (elements.todayQuotes) elements.todayQuotes.textContent = quotes;
        if (elements.activeSessions) elements.activeSessions.textContent = sessions;
        if (elements.conversionRate) elements.conversionRate.textContent = conversion + '%';
    }, 5000);
}

// Enhanced Form Submission with API Integration
async function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Map form fields to API expected format
    const data = {
        first_name: formData.get('firstName')?.trim(),
        last_name: formData.get('lastName')?.trim(),
        email: formData.get('email')?.trim(),
        phone: formData.get('phone')?.trim() || '',
        company_name: formData.get('company')?.trim(),
        industry: formData.get('industry') || '',
        energy_needs: formData.get('volume') || '',
        project_details: formData.get('message')?.trim()
    };
    
    // Debug log the data being sent
    console.log('Submitting data:', data);
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Remove any existing messages
    const existingMessages = event.target.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());

    try {
        // Make API call
        const response = await fetch('http://127.0.0.1:8000/api/quotes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(data)
        });

        // Debug log the response
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
            const result = await response.json();
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'form-message';
            successMsg.innerHTML = `
                <div style="background: #38a169; color: white; padding: 1rem; border-radius: 10px; margin-top: 1rem; text-align: center;">
                    <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                    Success! Your quote request has been submitted. Our team will contact you within 2 hours.
                </div>
            `;
            event.target.appendChild(successMsg);
            
            // Reset form
            event.target.reset();
            
            // Track successful conversion
            console.log('Quote request submitted successfully:', result);
            
            // Remove success message after 7 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 7000);
            
        } else {
            // Handle API errors - get response text first
            let errorData;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
            } else {
                const errorText = await response.text();
                console.log('Raw error response:', errorText);
                errorData = { error: errorText };
            }
            
            console.log('Error response data:', errorData);
            
            let errorMessage = 'There was an error submitting your request. Please try again.';
            
            // Handle specific validation errors
            if (errorData) {
                if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.error) {
                    errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
                } else if (errorData.errors) {
                    if (typeof errorData.errors === 'object') {
                        const errorMessages = [];
                        for (const [field, messages] of Object.entries(errorData.errors)) {
                            if (Array.isArray(messages)) {
                                errorMessages.push(`${field}: ${messages.join(', ')}`);
                            } else {
                                errorMessages.push(`${field}: ${messages}`);
                            }
                        }
                        errorMessage = errorMessages.join('; ');
                    } else {
                        errorMessage = errorData.errors;
                    }
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else {
                    errorMessage = `Server error (${response.status}): ${JSON.stringify(errorData)}`;
                }
            }
            
            throw new Error(errorMessage);
        }
        
    } catch (error) {
        console.error('Error submitting quote request:', error);
        
        let displayMessage = error.message;
        
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            displayMessage = 'Network error: Please check your connection and try again.';
        }
        
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-message';
        errorMsg.innerHTML = `
            <div style="background: #e53e3e; color: white; padding: 1rem; border-radius: 10px; margin-top: 1rem; text-align: center;">
                <i class="fas fa-exclamation-circle" style="margin-right: 0.5rem;"></i>
                ${displayMessage}
            </div>
        `;
        event.target.appendChild(errorMsg);
        
        // Remove error message after 10 seconds
        setTimeout(() => {
            errorMsg.remove();
        }, 10000);
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Enhanced Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Trigger specific animations
            if (entry.target.querySelector('.stat-number')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Enhanced Counter Animation
let countersAnimated = false;
function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    const counters = document.querySelectorAll('.stat-number');
    counters.forEach((counter, index) => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isTime = target.includes('hr') || target.includes('/');
        const number = parseFloat(target.replace(/[^\d.]/g, ''));
        
        let current = 0;
        const increment = number / 100;
        const delay = index * 200; // Stagger animations
        
        setTimeout(() => {
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                if (isPercentage) {
                    counter.textContent = current.toFixed(1) + '%';
                } else if (isTime) {
                    if (target.includes('hr')) {
                        counter.textContent = Math.floor(current) + 'hr';
                    } else {
                        counter.textContent = '24/7';
                    }
                } else if (number >= 1000) {
                    counter.textContent = Math.floor(current).toLocaleString() + '+';
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
            }, 20);
        }, delay);
    });
}

// Smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize analytics
updateAnalytics();

// Enhanced hover effects for interactive elements
document.querySelectorAll('.step, .feature, .stat').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transform = element.classList.contains('stat') ? 'scale(1.05)' : 'translateY(-10px)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = element.classList.contains('stat') ? 'scale(1)' : 'translateY(0)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    const speed = scrolled * 0.5;
    if (parallax) {
        parallax.style.backgroundPosition = `center ${speed}px`;
    }
});

// Form validation enhancement
function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('firstName')?.trim()) {
        errors.push('First name is required');
    }
    
    if (!formData.get('lastName')?.trim()) {
        errors.push('Last name is required');
    }
    
    if (!formData.get('email')?.trim()) {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.get('email'))) {
            errors.push('Please enter a valid email address');
        }
    }
    
    if (!formData.get('company')?.trim()) {
        errors.push('Company name is required');
    }
    
    if (!formData.get('message')?.trim()) {
        errors.push('Project details are required');
    }
    
    return errors;
}

// Network status monitoring
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
    isOnline = true;
    console.log('✅ Connection restored');
});

window.addEventListener('offline', () => {
    isOnline = false;
    console.log('❌ Connection lost');
});

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌱 EcoSmart: Application initialized successfully');
    console.log('📊 API endpoint configured: http://127.0.0.1:8000/api/quotes/');
    console.log('🔗 Form submission ready with real API integration');
    
    // Check if form exists and add additional validation
    const form = document.querySelector('.contact-form');
    if (form) {
        // Add real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#e53e3e';
                } else {
                    this.style.borderColor = '#38a169';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(229, 62, 62)' && this.value.trim()) {
                    this.style.borderColor = '#38a169';
                }
            });
        });
    }
});
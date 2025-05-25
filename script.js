
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

                elements.liveVisitors.textContent = visitors.toLocaleString();
                elements.todayQuotes.textContent = quotes;
                elements.activeSessions.textContent = sessions;
                elements.conversionRate.textContent = conversion + '%';
            }, 5000);
        }

        // Enhanced Form Submission
        function handleSubmit(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = event.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.innerHTML = `
                    <div style="background: #38a169; color: white; padding: 1rem; border-radius: 10px; margin-top: 1rem; text-align: center;">
                        <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                        Success! Our team will contact you within 2 hours with your custom quote.
                    </div>
                `;
                event.target.appendChild(successMsg);
                
                // Reset form
                event.target.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            }, 2000);

            // Track conversion (analytics)
            console.log('Form submission tracked:', data);
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

        // Blog card interactions
      
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

        console.log('🌱 EcoChar Analytics: Page loaded successfully');
        console.log('📊 Tracking user interactions and form submissions');
    
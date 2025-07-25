// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Close menu when clicking outside of it (on the overlay)
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Dark/Light Mode Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const heroSection = document.getElementById('home');
    
    // Define the dark mode image path
    const darkModeImage = "url('domestic fence/darkfence.jpg')";

    function setTheme(isDarkMode) {
        if (isDarkMode) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            // Set the dark mode image when toggled on
            if (heroSection) heroSection.style.backgroundImage = darkModeImage;
            themeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            // Remove the inline style to let the CSS file's default background take over
            if (heroSection) heroSection.style.backgroundImage = '';
            themeToggle.checked = false;
        }
    }

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    // Check for system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme based on saved preference or system setting
    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        setTheme(true);
    } else {
        // The default is light mode, which is handled by the CSS.
        // We just ensure the toggle switch is in the correct (off) state.
        themeToggle.checked = false;
    }

    // Event listener for the toggle
    themeToggle.addEventListener('change', () => {
        const isDarkMode = themeToggle.checked;
        setTheme(isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // --- Scroll to Top Button ---
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Web3Forms Contact Form Handling ---
    function handleContactForm(formId, resultId) {
        const form = document.getElementById(formId);
        const resultDiv = document.getElementById(resultId);

        if (form && resultDiv) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(form);
                const object = {};
                formData.forEach((value, key) => {
                    object[key] = value;
                });
                const json = JSON.stringify(object);
                
                // Check if access key is properly set
                if (object.access_key === 'YOUR_ACCESS_KEY_HERE') {
                     resultDiv.innerHTML = "Please replace 'YOUR_ACCESS_KEY_HERE' in the HTML with your actual key from web3forms.com.";
                     resultDiv.style.color = 'red';
                     return;
                }

                resultDiv.innerHTML = "Sending...";
                resultDiv.style.color = 'gray';

                fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: json
                    })
                    .then(async (response) => {
                        let jsonResponse = await response.json();
                        if (response.status == 200) {
                            resultDiv.innerHTML = "Thank you! Redirecting to success page...";
                            resultDiv.style.color = 'green';
                            // Redirect to success page after 2 seconds
                            setTimeout(() => {
                                window.location.href = 'success.html';
                            }, 2000);
                        } else {
                            console.log(response);
                            resultDiv.innerHTML = jsonResponse.message;
                            resultDiv.style.color = 'red';
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        resultDiv.innerHTML = "Something went wrong! Please try again or call us directly.";
                        resultDiv.style.color = 'red';
                    })
                    .then(function() {
                        form.reset();
                        // Only clear message if there was an error (not redirecting)
                        if (!resultDiv.innerHTML.includes('Redirecting')) {
                            setTimeout(() => {
                                resultDiv.innerHTML = '';
                            }, 8000);
                        }
                    });
            });
        }
    }

    // Initialize both contact forms
    handleContactForm('contact-form', 'form-result'); // Contact page form
    handleContactForm('contact-form-home', 'form-result-home'); // Home page form

    // --- FAQ Functionality ---
    function initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        if (faqQuestions.length === 0) {
            return;
        }
        
        faqQuestions.forEach((question) => {
            question.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const faqItem = this.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all other FAQ items
                faqQuestions.forEach(otherQuestion => {
                    const otherItem = otherQuestion.parentElement;
                    if (otherItem !== faqItem) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ item
                if (isActive) {
                    faqItem.classList.remove('active');
                } else {
                    faqItem.classList.add('active');
                }
            });
        });
    }
    
    // Initialize FAQ functionality
    initializeFAQ();
    
    // Alternative approach using event delegation (more reliable)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.faq-question')) {
            e.preventDefault();
            
            const faqQuestion = e.target.closest('.faq-question');
            const faqItem = faqQuestion.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items first
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                faqItem.classList.remove('active');
            } else {
                faqItem.classList.add('active');
            }
        }
    });
});

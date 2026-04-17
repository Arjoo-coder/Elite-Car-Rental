// script.js - Professional Car Booking System with C++ Backend
class CarBookingApp {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.selectedCar = null;
        this.bookingData = null;
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadUserState();
        this.updateUI();
        this.initAnimations();
    }

    cacheDOM() {
        this.loginBtn = document.querySelector('.login-btn');
        this.loginModal = document.querySelector('.modal');
        this.closeModal = document.querySelector('.close');
        this.loginForm = document.querySelector('#loginForm');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.exploreBtn = document.querySelector('.explore-btn');
        this.bookBtns = document.querySelectorAll('.book-btn');
        this.confirmationCard = document.querySelector('.confirmation-card');
        this.confirmClose = document.querySelector('.confirm-close');
        this.sections = document.querySelectorAll('section');
    }

    bindEvents() {
        // Login modal events
        if (this.loginBtn) this.loginBtn.addEventListener('click', () => this.showLoginModal());
        if (this.closeModal) this.closeModal.addEventListener('click', () => this.hideLoginModal());
        if (this.loginForm) this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        if (this.exploreBtn) this.exploreBtn.addEventListener('click', () => this.scrollToCars());
        
        // Book buttons (dynamic)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('book-btn')) {
                this.handleBookClick(e.target.dataset.car);
            }
        });
        
        // Confirmation close
        if (this.confirmClose) this.confirmClose.addEventListener('click', () => this.hideConfirmation());
        
        // Window events
        window.addEventListener('click', (e) => {
            if (e.target === this.loginModal) this.hideLoginModal();
        });
        
        // Header scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
    }

    showLoginModal() {
        this.loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hideLoginModal() {
        this.loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.querySelector('#username').value.trim();
        const password = document.querySelector('#password').value.trim();

        if (!username || !password) {
            this.showAlert('Please enter both username and password', 'error');
            return;
        }

        // Simple login validation (in production, use proper backend auth)
        if (username === 'user' && password === '1234') {
            this.isLoggedIn = true;
            this.currentUser = username;
            this.loginBtn.textContent = `Welcome, ${username}!`;
            this.loginBtn.style.background = '#10b981';
            this.hideLoginModal();
            this.saveUserState();
            this.updateUI();
            this.showAlert('Login successful!', 'success');
        } else {
            this.showAlert('Invalid credentials! Try: user/1234', 'error');
        }
    }

    handleBookClick(carName) {
        this.selectedCar = this.getCarData(carName);
        
        if (!this.isLoggedIn) {
            this.showLoginModal();
            return;
        }
        
        // Redirect to booking page with car data
        sessionStorage.setItem('selectedCar', JSON.stringify(this.selectedCar));
        window.location.href = 'booking.html';
    }

    handleNavigation(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    scrollToCars() {
        document.getElementById('cars').scrollIntoView({ behavior: 'smooth' });
    }

    updateUI() {
        // Update login button
        if (this.loginBtn) {
            if (this.isLoggedIn) {
                this.loginBtn.textContent = `Welcome, ${this.currentUser}!`;
                this.loginBtn.style.background = '#10b981';
            } else {
                this.loginBtn.textContent = 'Login Now';
                this.loginBtn.style.background = '';
            }
        }
    }

    getCarData(carName) {
        const cars = {
            'verna': { name: 'Hyundai Verna', price: 2500, image: 'images/verna.jpg' },
            'thar': { name: 'Mahindra Thar', price: 4500, image: 'images/thar.jpg' },
            'bmw': { name: 'BMW X5', price: 12000, image: 'images/bmw.jpg' },
            'fortuner': { name: 'Toyota Fortuner', price: 6500, image: 'images/fortuner.jpg' },
            'rangerover': { name: 'Range Rover', price: 18000, image: 'images/rangerover.jpg' },
            'scorpio': { name: 'Mahindra Scorpio', price: 3200, image: 'images/scorpio.jpg' },
            'nano': { name: 'Tata Nano', price: 800, image: 'images/nano.jpg' },
            'suzuki': { name: 'Suzuki Swift', price: 1800, image: 'images/suzuki.jpg' }
        };
        return cars[carName] || cars.verna;
    }

    saveUserState() {
        localStorage.setItem('isLoggedIn', this.isLoggedIn);
        localStorage.setItem('currentUser', this.currentUser);
    }

    loadUserState() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.currentUser = localStorage.getItem('currentUser');
    }

    showAlert(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    handleScroll() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255,255,255,0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255,255,255,0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    }

    initAnimations() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.car-card, .section').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    showConfirmation(data) {
        if (!this.confirmationCard) return;
        
        this.confirmationCard.innerHTML = `
            <div class="confirm-close">❌</div>
            <img src="${data.image}" alt="${data.name}" style="width:100%; height:150px; object-fit:cover; border-radius:10px; margin-bottom:1rem;">
            <h3 style="margin-bottom:0.5rem;">✅ ${data.name}</h3>
            <p style="margin-bottom:0.5rem;">${data.days} days</p>
            <p style="font-size:1.3rem; font-weight:bold;">₹${data.totalPrice}</p>
        `;
        
        this.confirmationCard.classList.add('show');
        setTimeout(() => this.confirmationCard.classList.remove('show'), 8000);
    }

    hideConfirmation() {
        this.confirmationCard.classList.remove('show');
    }
}

// Initialize app on index.html
if (document.querySelector('.login-btn')) {
    const app = new CarBookingApp();
    window.app = app; // Global access for booking.html
}

// Booking Page Specific Logic
if (window.location.pathname.includes('booking.html')) {
    class BookingPage {
        constructor() {
            this.init();
        }

        init() {
            this.cacheDOM();
            this.bindEvents();
            this.loadSelectedCar();
        }

        cacheDOM() {
            this.daysInput = document.querySelector('.days-input');
            this.calculateBtn = document.querySelector('.calculate-btn');
            this.bookingTitle = document.querySelector('.booking-title');
            this.bookingImage = document.querySelector('.booking-image');
            this.result = document.querySelector('.result');
            this.totalPriceEl = document.querySelector('.total-price');
        }

        bindEvents() {
            this.calculateBtn.addEventListener('click', () => this.calculatePrice());
            this.daysInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.calculatePrice();
            });
        }

        loadSelectedCar() {
            const carData = sessionStorage.getItem('selectedCar');
            if (carData) {
                this.selectedCar = JSON.parse(carData);
                this.bookingTitle.textContent = this.selectedCar.name;
                this.bookingImage.src = this.selectedCar.image;
                this.bookingImage.alt = this.selectedCar.name;
            } else {
                alert('No car selected. Please go back to home page.');
                window.location.href = 'index.html';
            }
        }

        async calculatePrice() {
            const days = parseInt(this.daysInput.value);
            
            // Validation
            if (!days || days <= 0) {
                this.showError('Please enter valid number of days (1 or more)');
                return;
            }

            this.calculateBtn.disabled = true;
            this.calculateBtn.textContent = 'Calculating...';

            try {
                // Call C++ backend via CGI or system execution
                const result = await this.callCppBackend(this.selectedCar.name, days);
                
                if (result.success) {
                    this.showResult(result.totalPrice);
                    this.saveBooking(result);
                } else {
                    throw new Error(result.error || 'Calculation failed');
                }
            } catch (error) {
                this.showError(error.message);
            } finally {
                this.calculateBtn.disabled = false;
                this.calculateBtn.textContent = 'Confirm Booking';
            }
        }

        async callCppBackend(carName, days) {
            // Method 1: CGI (Apache server) - Preferred for XAMPP
            try {
                const formData = new FormData();
                formData.append('car', carName);
                formData.append('days', days);

                const response = await fetch('booking.cgi', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.text();
                return JSON.parse(result);
            } catch (e) {
                // Fallback: Direct system call (Windows .exe)
                return await this.callCppExecutable(carName, days);
            }
        }

        async callCppExecutable(carName, days) {
            // For local .exe execution (Windows)
            return new Promise((resolve) => {
                const args = [`"${carName}"`, days.toString()];
                
                // Simulate C++ response (replace with actual exec when compiled)
                // In production: use Node.js child_process or similar
                setTimeout(() => {
                    const pricePerDay = this.selectedCar.price;
                    const totalPrice = pricePerDay * days;
                    resolve({
                        success: true,
                        totalPrice: totalPrice,
                        car: carName,
                        days: days
                    });
                }, 1000);
            });
        }

        showResult(totalPrice) {
            this.result.classList.add('show');
            this.totalPriceEl.textContent = `₹${totalPrice.toLocaleString()}`;
            
            // Auto redirect after 2 seconds
            setTimeout(() => {
                this.completeBooking(totalPrice);
            }, 2000);
        }

        showError(message) {
            this.result.classList.remove('show');
            window.app?.showAlert(message, 'error');
            this.daysInput.style.borderColor = '#ef4444';
            setTimeout(() => {
                this.daysInput.style.borderColor = '#e5e7eb';
            }, 2000);
        }

        saveBooking(result) {
            this.bookingData = {
                ...this.selectedCar,
                days: result.days,
                totalPrice: result.totalPrice,
                timestamp: new Date().toISOString()
            };
            sessionStorage.setItem('bookingData', JSON.stringify(this.bookingData));
        }

        completeBooking(totalPrice) {
            // Redirect back with booking data
            sessionStorage.setItem('completedBooking', JSON.stringify(this.bookingData));
            window.location.href = 'index.html';
        }
    }

    new BookingPage();
}

// Show booking confirmation on homepage load
document.addEventListener('DOMContentLoaded', () => {
    const completedBooking = sessionStorage.getItem('completedBooking');
    if (completedBooking && window.app) {
        const data = JSON.parse(completedBooking);
        window.app.showConfirmation(data);
        sessionStorage.removeItem('completedBooking');
    }
});

// Dynamic car cards generation (for index.html)
function generateCarCards() {
    const cars = [
        { id: 'verna', name: 'Hyundai Verna', price: 2500 },
        { id: 'thar', name: 'Mahindra Thar', price: 4500 },
        { id: 'bmw', name: 'BMW X5', price: 12000 },
        { id: 'fortuner', name: 'Toyota Fortuner', price: 6500 },
        { id: 'rangerover', name: 'Range Rover', price: 18000 },
        { id: 'scorpio', name: 'Mahindra Scorpio', price: 3200 },
        { id: 'nano', name: 'Tata Nano', price: 800 },
        { id: 'suzuki', name: 'Suzuki Swift', price: 1800 }
    ];

    const container = document.querySelector('.cars-grid');
    cars.forEach(car => {
        const card = document.createElement('div');
        card.className = 'car-card';
        
        // Try local → Online fallback → Placeholder
        const imgSrc = `images/${car.id}.jpg`;
        const fallbackSrc = `https://via.placeholder.com/350x250/2563eb/ffffff?text=${car.name.replace(/\s+/g,'+')}`;
        
        card.innerHTML = `
            <img src="${imgSrc}" 
                 onerror="this.src='${fallbackSrc}';this.onerror=null;"
                 alt="${car.name}" class="car-image">
            <div class="car-info">
                <h3 class="car-name">${car.name}</h3>
                <div class="car-price">₹${car.price.toLocaleString()}/day</div>
                <button class="book-btn" data-car="${car.id}">
                    <i class="fas fa-car"></i> Book Now
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Auto-generate cards if container exists
if (document.querySelector('.cars-grid')) {
    generateCarCards();
}
let lastScroll = 0;
const body = document.body;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    // At the very top of the page
    body.classList.remove("scroll-up", "scroll-down");
  } 
  else if (currentScroll > lastScroll) {
    // Scrolling down
    body.classList.add("scroll-down");
    body.classList.remove("scroll-up");
  } 
  else if (currentScroll < lastScroll) {
    // Scrolling up
    body.classList.add("scroll-up");
    body.classList.remove("scroll-down");
  }

  lastScroll = currentScroll;
});

// Services Dropdown Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const servicesDropdowns = document.querySelectorAll('.services-dropdown');
    
    servicesDropdowns.forEach(function(servicesDropdown) {
        const dropdownContent = servicesDropdown.querySelector('.dropdown-content');
        
        if (dropdownContent) {
            let hideTimeout;
            
            // Add smooth entrance animation
            servicesDropdown.addEventListener('mouseenter', function() {
                clearTimeout(hideTimeout);
                dropdownContent.style.opacity = '1';
                dropdownContent.style.visibility = 'visible';
                dropdownContent.style.pointerEvents = 'auto';
            });
            
            servicesDropdown.addEventListener('mouseleave', function() {
                hideTimeout = setTimeout(function() {
                    dropdownContent.style.opacity = '0';
                    dropdownContent.style.visibility = 'hidden';
                    dropdownContent.style.pointerEvents = 'none';
                }, 100); // Small delay to prevent flickering
            });
            
            // Add keyboard navigation support
            const servicesTrigger = servicesDropdown.querySelector('.services-trigger');
            if (servicesTrigger) {
                servicesTrigger.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        dropdownContent.style.opacity = '1';
                        dropdownContent.style.visibility = 'visible';
                    }
                });
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const nav = document.querySelector("#bottom-header nav");

  menuIcon.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  // Simple captcha refresher and basic validation mimic
  const captchaCode = document.getElementById("captchaCode");
  const captchaInput = document.getElementById("captchaInput");
  const form = document.getElementById("contactForm");

  if (captchaCode && captchaInput && form) {
    const randomCode = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let out = "";
      for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
      return out.split("").join(" ");
    };

    const setCode = () => (captchaCode.textContent = randomCode());
    setCode();

    captchaCode.addEventListener("click", setCode);

    form.addEventListener("submit", (e) => {
      const normalizedInput = captchaInput.value.replace(/\s+/g, "").toUpperCase();
      const normalizedCode = captchaCode.textContent.replace(/\s+/g, "");
      if (normalizedInput !== normalizedCode) {
        e.preventDefault();
        alert("Please enter the correct code.");
        setCode();
        captchaInput.value = "";
        captchaInput.focus();
      }
    });
  }
});

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Mobile Menu Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', String(!isHidden));
        });

        document.querySelectorAll('.mobile-link').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Native Remote Support Download Toast Notification
    document.querySelectorAll('.download-client-link').forEach((link) => {
        link.addEventListener('click', () => {
            const osLabel = link.getAttribute('data-os') || 'desktop';
            showToast(`Downloading VoroscakIT Support client for ${osLabel}...`, 'success');
        });
    });

    // SHA-256 Checksum One-Click Copy
    document.querySelectorAll('.copy-hash-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-copy-target');
            const label = btn.getAttribute('data-label') || 'installer';
            const hashEl = targetId ? document.getElementById(targetId) : null;
            const hashValue = hashEl ? hashEl.textContent.trim() : '';

            if (!hashValue) return;

            try {
                await navigator.clipboard.writeText(hashValue);
                const prevText = btn.textContent;
                btn.textContent = 'COPIED';
                showToast(`Copied ${label} SHA-256 checksum to clipboard.`, 'success');
                setTimeout(() => {
                    btn.textContent = prevText;
                }, 2000);
            } catch {
                showToast('Unable to copy automatically. Please select and copy the hash manually.', 'error');
            }
        });
    });

    // Contact Form Handling (Web3Forms -> FreeScout Ticket Intake)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const originalLabel = btn.textContent;
            btn.disabled = true;
            btn.innerHTML = `<span class="inline-block animate-spin mr-2">&#9881;</span> CREATING TICKET...`;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                btn.disabled = false;
                btn.textContent = originalLabel;

                if (data.success) {
                    showToast('Support ticket created. VoroscakIT has received your inquiry and will follow up shortly.', 'success');
                    contactForm.reset();
                } else {
                    showToast(data.message || 'Submission failed. Please try again or call (267) 540-3247.', 'error');
                }
            } catch {
                btn.disabled = false;
                btn.textContent = originalLabel;
                showToast('Network error. Please check your connection or call (267) 540-3247.', 'error');
            }
        });
    }
});

// Toast Feedback System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const isError = type === 'error';

    const borderClass = isError ? 'border-rose-500/40' : 'border-slateBorder';
    const iconSvg = isError
        ? `<svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.5l-7.5-13a1 1 0 00-1.74 0z"></path></svg>`
        : `<svg class="w-4 h-4 text-iceBlue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;

    toast.className = `pointer-events-auto flex items-start space-x-3 px-5 py-3.5 rounded-[14px] bg-slateCard border ${borderClass} text-offWhite shadow-ambient text-xs font-mono transition-all duration-400 transform translate-y-4 opacity-0`;
    toast.innerHTML = `
        <div class="mt-0.5">${iconSvg}</div>
        <div class="leading-relaxed"></div>
    `;
    toast.querySelector('.leading-relaxed').textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    }, 50);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

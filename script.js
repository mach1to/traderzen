document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Set Current Date dynamically
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = `Today, ${today.toLocaleDateString('en-US', options)}`;
    }

    // Mood Selector Logic (Pre-Market is multi-select, Setup Quality is single-select)
    const moodSelectors = document.querySelectorAll('.mood-selector');

    moodSelectors.forEach((selector, index) => {
        const btns = selector.querySelectorAll('.mood-btn');
        // The first selector on the page is Pre-Market Mindset
        const isMultiSelect = index === 0;

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (isMultiSelect) {
                    // Multi-select for Pre-Market Mindset
                    btn.classList.toggle('selected');
                } else {
                    // Single-select for Setup Quality
                    btns.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                }
            });
        });
    });

    // Setup Type Toggle Logic
    const setupRadios = document.querySelectorAll('input[name="setup-type"]');
    const reversalCheckboxes = document.getElementById('reversal-checkboxes');
    const continuationCheckboxes = document.getElementById('continuation-checkboxes');

    if (setupRadios.length > 0) {
        setupRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'reversal') {
                    reversalCheckboxes.style.display = 'block';
                    continuationCheckboxes.style.display = 'none';
                } else if (e.target.value === 'continuation') {
                    reversalCheckboxes.style.display = 'none';
                    continuationCheckboxes.style.display = 'block';
                }
            });
        });
    }

    // Emotion Tags Logic (Multi-select)
    const emotionTags = document.querySelectorAll('.tag');
    emotionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('selected');
        });
    });

    // Form Submission Simulation & AI Coach Integration
    const form = document.getElementById('session-form');
    const coachSection = document.getElementById('coach-analysis-section');
    const coachLoader = document.getElementById('coach-loading-spinner');
    const coachContent = document.getElementById('coach-content-body');
    const newSessionBtn = document.getElementById('new-session-btn');
    const formActions = document.getElementById('form-actions-container');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('save-session-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Saving...';
            lucide.createIcons();

            // Spin animation inline is already added below or we can rely on what we have
            if (!document.getElementById('spin-style')) {
                const spinStyle = document.createElement('style');
                spinStyle.id = 'spin-style';
                spinStyle.innerHTML = `
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                    .spin { animation: spin 1s linear infinite; }
                `;
                document.head.appendChild(spinStyle);
            }

            // Phase 1: Save Session
            setTimeout(() => {
                submitBtn.innerHTML = '<i data-lucide="check-circle"></i> Saved successfully';
                submitBtn.style.backgroundColor = '#4ade80'; // soft green
                submitBtn.style.color = '#fff';
                lucide.createIcons();

                // Phase 2: Start AI Coach Analysis
                setTimeout(() => {
                    // Hide form actions temporarily
                    formActions.style.display = 'none';

                    // Disable form inputs to "lock" the session
                    const allInputs = form.querySelectorAll('input, textarea, button[type="button"].mood-btn');
                    allInputs.forEach(input => input.disabled = true);
                    emotionTags.forEach(tag => tag.style.pointerEvents = 'none');

                    // Show AI Coach section with loader
                    coachSection.style.display = 'block';
                    coachSection.scrollIntoView({ behavior: 'smooth', block: 'end' });

                    // Simulate AI processing delay (e.g., calling OpenAI)
                    setTimeout(() => {
                        coachLoader.style.display = 'none';
                        coachContent.style.display = 'block';
                        lucide.createIcons();

                        coachSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }, 2500); // 2.5s AI simulation

                }, 1000);
            }, 1000);
        });
    }

    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', () => {
            // Reset everything for a new session
            form.reset();

            // Enable inputs
            const allInputs = form.querySelectorAll('input, textarea, button[type="button"].mood-btn');
            allInputs.forEach(input => input.disabled = false);
            emotionTags.forEach(tag => tag.style.pointerEvents = 'auto');

            // Remove selected classes
            moodSelectors.forEach(selector => {
                const btns = selector.querySelectorAll('.mood-btn');
                btns.forEach(b => b.classList.remove('selected'));
            });
            emotionTags.forEach(t => t.classList.remove('selected'));

            // Hide AI section
            coachSection.style.display = 'none';
            coachLoader.style.display = 'flex';
            coachContent.style.display = 'none';

            // Show and reset save button
            formActions.style.display = 'flex';
            const submitBtn = document.getElementById('save-session-btn');
            submitBtn.innerHTML = '<i data-lucide="check"></i> Save Session';
            submitBtn.style.backgroundColor = '';
            submitBtn.style.color = '';
            lucide.createIcons();

            // Scroll to top
            document.querySelector('.scroll-area').scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

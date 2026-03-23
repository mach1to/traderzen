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

    // --- AI COACH FEEDBACK LOGIC ---
    function generateAICoachFeedback(d) {
        if (!d) return null;
        const executionAnalysis = [];
        const psychologyAnalysis = [];
        const rulesAnalysis = [];
        const consistencyCheck = [];
        const specificFeedback = [];
        let nextFocus = "";

        // 1. Execution Analysis (Confirmations vs Setup Quality)
        const confCount = (d.confirmations || []).length;
        const rating = (d.setupQuality || 'none').toLowerCase();
        const setupType = d.setupType || 'none';
        
        if ((rating.includes('a') && confCount < 2) || (rating.includes('b+') && confCount < 1)) {
            executionAnalysis.push(`You graded this setup as ${rating.toUpperCase()}, but you only identified ${confCount} technical confirmation(s). This shows you are being too generous with your grading or ignoring the actual evidence to justify taking a trade.`);
            executionAnalysis.push("When you inflate your ratings, you lose the ability to tell which setups actually make you money. Stick to the data and only give top marks when the market gives you everything you need.");
        } else if (rating.includes('c') && confCount >= 3) {
            executionAnalysis.push(`This setup had ${confCount} strong confirmations, yet you only gave it a ${rating.toUpperCase()} rating. This suggests you are doubting your strategy even when the market is giving you clear signals.`);
            executionAnalysis.push("Consistency comes from trusting your plan, not from your gut feeling. If the criteria are met, be objective about the quality.");
        } else {
            executionAnalysis.push(`The ${setupType} setup rating of ${rating.toUpperCase()} matches the technical evidence you recorded. This shows you are being honest and realistic about the opportunities you are taking.`);
            executionAnalysis.push("Staying objective about setup quality is how you build a reliable database of your performance over time.");
        }

        // 2. Psychology Analysis (Emotions vs Execution)
        const negativeStates = ['Fear', 'Anxiety', 'FOMO', 'Greed', 'Frustration', 'Revenge Trading Urge', 'Impatience', 'Doubt', 'Hesitation'];
        const feltEmotions = d.emotions || [];
        const feltNegatives = feltEmotions.filter(e => negativeStates.includes(e));
        
        if (feltNegatives.length > 0) {
            psychologyAnalysis.push(`Feeling ${feltNegatives.join(' and ')} during the trade is a sign that your survival instincts are interfering with your plan. These emotions usually make traders rush entries or close trades too early because they are scared of losing or missing out.`);
            psychologyAnalysis.push("When you feel this way, you are reacting to the price flickering on the screen instead of following your business plan. The goal is to notice these feelings and pause before you take action based on them.");
        } else {
            psychologyAnalysis.push("You stayed calm and steady during this trade. This neutral state is what allows your technical edge to actually work over the long run because you aren't fighting your own ego.");
            psychologyAnalysis.push("Maintaining this internal stability is a major win for your discipline.");
        }

        // 3. Rule Discipline (Respected vs Broken)
        const coreRules = ["Respected Stop Loss", "Respected Break Even", "Respected Take Profit", "Waited For Confirmation"];
        const rulesTaken = d.rules || [];
        const respected = rulesTaken.filter(r => coreRules.includes(r));
        const broken = coreRules.filter(r => !rulesTaken.includes(r));
        
        if (respected.length > 0) {
            rulesAnalysis.push(`Rules Respected: ${respected.join(', ')}. By sticking to these, you protected your capital and acted like a professional trader.`);
        }
        if (broken.length > 0) {
            rulesAnalysis.push(`Rules Broken: ${broken.join(', ')}. Breaking your rules turns your strategy into a guessing game, which makes it impossible to build a consistent career.`);
            rulesAnalysis.push("Every time you break a rule, you train yourself to ignore your plan, which damages your self-trust.");
        } else if (broken.length === 0) {
            rulesAnalysis.push("You followed every single one of your core rules perfectly this session. This level of discipline is more important than whether the trade made money or not.");
        }

        // 4. Consistency Check (Mindset, Emotions, Rating, Rules)
        const moodArr = d.preMarketMoods || [];
        if (moodArr.includes('focused') && (feltEmotions.includes('FOMO') || feltEmotions.includes('Impatience'))) {
            consistencyCheck.push("You started the session feeling focused, but your actions were driven by FOMO and impatience. This means your 'focus' disappeared the moment the chart started moving.");
        }
        if (rating.includes('a') && broken.includes('Waited For Confirmation')) {
            consistencyCheck.push("You called this an A-tier setup but didn't even wait for confirmation. This is a contradiction; a setup isn't high quality if you skip the requirements to enter it.");
        }
        if (consistencyCheck.length === 0) {
            consistencyCheck.push("Your mindset before the trade, your emotions during it, and your final actions all aligned. This consistency is exactly what you need to build a professional process.");
        }

        // 5. Specific Feedback From This Session
        if (broken.includes('Waited For Confirmation')) {
            specificFeedback.push("The biggest issue today was rushing into the trade. Rushing is usually caused by a fear that the market will leave without you, but the market always provides more opportunities.");
            specificFeedback.push("Next time, force yourself to wait for one extra signal or candle close before you click the button.");
        } else if (feltNegatives.includes('FOMO') || feltNegatives.includes('Impatience')) {
            specificFeedback.push("Your struggle this session was chasing the market. This impatience shows you were looking for quick action rather than following a calm business process.");
            specificFeedback.push("Notice the urge to chase next time and use it as a signal to step away for a moment.");
        } else if (broken.length > 0) {
            specificFeedback.push(`You broken your protocol regarding ${broken[0]}. This behavior removes the structure that keeps you safe from large losses.`);
            specificFeedback.push("Consistency only comes from doing the same thing every time, regardless of what the market is doing.");
        } else {
            specificFeedback.push("Your greatest strength was your ability to stay disciplined. You treated this trade like a serious business transaction.");
            specificFeedback.push("Keep focusing on this level of professional execution.");
        }

        // 6. Next Focus (Clear Behavioral Instruction)
        if (broken.includes('Waited For Confirmation')) {
            nextFocus = "Your only mission is to wait for the candle to close and all confirmations to hit. Do not click until the criteria are 100% met. Discipline > Profit.";
        } else if (broken.length > 0) {
            nextFocus = `You broke your ${broken[0]} rule. Your next session is a success ONLY if you respect that specific rule, regardless of the PnL.`;
        } else if (feltNegatives.includes('FOMO') || feltNegatives.includes('Impatience') || feltNegatives.includes('Revenge Trading Urge')) {
            const primaryEmotion = feltNegatives.find(e => ['FOMO', 'Impatience', 'Revenge Trading Urge'].includes(e));
            nextFocus = `You let ${primaryEmotion} dictate your actions today. Prove you are the master of your hands. Sit out the first 15 minutes of tomorrow's session to regain control.`;
        } else if (d.mistake && d.mistake.length > 5) {
            nextFocus = `Focus on correcting the error you identified: "${d.mistake.substring(0, 40)}${d.mistake.length > 40 ? '...' : ''}". Process over outcome.`;
        } else {
            nextFocus = "You executed with perfect discipline today. Your goal for tomorrow is to be 'bored'—repeat this exact mechanical process without adding any ego.";
        }

        return { 
            execution: executionAnalysis.join(' '), 
            psychology: psychologyAnalysis.join(' '), 
            rules: rulesAnalysis.join(' '), 
            consistency: consistencyCheck.join(' '), 
            specific: specificFeedback.join(' '),
            focus: nextFocus 
        };
    }

    // Form Submission Logic
    const form = document.getElementById('session-form');
    const coachSection = document.getElementById('coach-analysis-section');
    const coachLoader = document.getElementById('coach-loading-spinner');
    const coachContent = document.getElementById('coach-content-body');
    const newSessionBtn = document.getElementById('new-session-btn');
    const formActions = document.getElementById('form-actions-container');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // --- GATHER FORM DATA ---
            const moodSelectors = document.querySelectorAll('.mood-selector');
            const preMarketMoods = Array.from(moodSelectors[0]?.querySelectorAll('.mood-btn.selected') || []).map(b => b.dataset.mood);
            
            const numInputs = document.querySelectorAll('input[type="number"]');
            const energy = parseInt(numInputs[0]?.value) || 5;
            const stress = parseInt(numInputs[1]?.value) || 5;
            
            const setupType = document.querySelector('input[name="setup-type"]:checked')?.value || 'none';
            const setupQuality = Array.from(moodSelectors[1]?.querySelectorAll('.mood-btn.selected') || []).map(b => b.dataset.mood)[0] || 'none';
            
            const emotions = Array.from(document.querySelectorAll('.emotion-tags .tag.selected')).map(t => t.textContent.trim());
            
            const confirmations = Array.from(document.querySelectorAll('input[name="confirmations"]:checked')).map(cb => cb.value);
            const rules = Array.from(document.querySelectorAll('input[name="rules"]:checked')).map(cb => cb.value);
            
            const textareas = document.querySelectorAll('textarea');
            const didWell = textareas[0]?.value.trim() || "";
            const mistake = textareas[1]?.value.trim() || "";
            const emotionActions = textareas[2]?.value.trim() || "";
            
            const goodTrade = document.querySelector('input[name="good-trade"]:checked')?.value || 'none';
            const outcome = document.querySelector('input[name="trade-outcome"]:checked')?.value || 'unspecified';

            const data = { preMarketMoods, energy, stress, setupType, setupQuality, emotions, confirmations, rules, didWell, mistake, emotionActions, goodTrade, outcome };
            const feedback = generateAICoachFeedback(data);

            // --- SAVE/UPDATE IN LOCALSTORAGE ---
            const editingId = form.dataset.editingId;
            let savedSessions = [];
            try {
                savedSessions = JSON.parse(localStorage.getItem('traderZenSessions') || '[]');
            } catch (e) { console.error(e); }

            if (editingId) {
                // Update existing
                const index = savedSessions.findIndex(s => s.id === editingId);
                if (index !== -1) {
                    savedSessions[index].formInputs = data;
                    savedSessions[index].aiFeedback = feedback;
                }
                delete form.dataset.editingId;
            } else {
                // Create new
                const sessionData = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    formInputs: data,
                    aiFeedback: feedback
                };
                savedSessions.unshift(sessionData);
            }

            try {
                localStorage.setItem('traderZenSessions', JSON.stringify(savedSessions));
            } catch (err) {
                console.error("Storage error:", err);
            }

            // --- UI FEEDBACK ---
            const submitBtn = document.getElementById('save-session-btn');
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Saving...';
            lucide.createIcons();

            setTimeout(() => {
                submitBtn.innerHTML = '<i data-lucide="check-circle"></i> Saved & Synced';
                submitBtn.style.backgroundColor = '#4ade80';
                submitBtn.style.color = '#fff';
                lucide.createIcons();

                setTimeout(() => {
                    formActions.style.display = 'none';
                    form.querySelectorAll('input, textarea, button[type="button"].mood-btn').forEach(input => input.disabled = true);
                    document.querySelectorAll('.emotion-tags .tag').forEach(tag => tag.style.pointerEvents = 'none');

                    coachSection.style.display = 'block';
                    coachSection.scrollIntoView({ behavior: 'smooth', block: 'end' });

                    document.getElementById('coach-execution').textContent = feedback.execution;
                    document.getElementById('coach-psychology').textContent = feedback.psychology;
                    document.getElementById('coach-rules').textContent = feedback.rules;
                    document.getElementById('coach-consistency').textContent = feedback.consistency;
                    document.getElementById('coach-specific').textContent = feedback.specific;
                    document.getElementById('coach-focus').textContent = feedback.focus;

                    setTimeout(() => {
                        coachLoader.style.display = 'none';
                        coachContent.style.display = 'block';
                        lucide.createIcons();
                        if (typeof window.loadSessionsToDashboard === 'function') window.loadSessionsToDashboard();
                    }, 1500); 
                }, 800);
            }, 800);
        });
    }

    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', () => {
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            const today = new Date();
            document.getElementById('current-date').textContent = `Today, ${today.toLocaleDateString('en-US', options)}`;
            document.querySelector('.page-title').textContent = "New Trading Session";

            // Reset everything for a new session
            form.reset();
            delete form.dataset.editingId;

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

    // --- VIEW ROUTING & DASHBOARD LOGIC ---
    const viewDashboard = document.getElementById('view-dashboard');
    const viewJournalForm = document.getElementById('view-journal-form');
    const navDashboard = document.getElementById('nav-dashboard');
    const navNewSession = document.getElementById('nav-new-session');
    const dashNewSessionBtn = document.getElementById('dashboard-new-session-btn');
    const sessionListContainer = document.getElementById('session-list');

    function switchView(viewName) {
        console.log("Switching view to:", viewName);
        // Reset Nav
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

        if (viewName === 'dashboard') {
            viewDashboard.style.display = 'flex';
            viewJournalForm.style.display = 'none';
            if (navDashboard) navDashboard.classList.add('active');
            if (typeof window.loadSessionsToDashboard === 'function') {
                window.loadSessionsToDashboard();
            }
        } else if (viewName === 'new-session') {
            viewDashboard.style.display = 'none';
            viewJournalForm.style.display = 'flex';
            if (navNewSession) navNewSession.classList.add('active');

            // Optional: Call new session reset logic if navigating from a completed state
            if (newSessionBtn) newSessionBtn.click();
        }
    }

    if (navDashboard) {
        navDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('dashboard');
        });
    }

    if (navNewSession) {
        navNewSession.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('new-session');
        });
    }

    if (dashNewSessionBtn) {
        dashNewSessionBtn.addEventListener('click', () => {
            switchView('new-session');
        });
    }

    // Make load function available globally for the submit handler
    window.loadSessionsToDashboard = function () {
        console.log("Running loadSessionsToDashboard...");
        if (!sessionListContainer) {
            console.error("Error: sessionListContainer (#session-list) not found.");
            return;
        }

        let savedSessions = [];
        try {
            const raw = localStorage.getItem('traderZenSessions');
            savedSessions = raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Critical: Failed to load sessions from storage", e);
            savedSessions = [];
        }

        console.log("Found sessions:", savedSessions.length);

        if (savedSessions.length === 0) {
            sessionListContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <i data-lucide="inbox" style="width: 48px; height: 48px; opacity: 0.5; margin-bottom: 1rem;"></i>
                    <h3>No Sessions Yet</h3>
                    <p>Start a new session to log your first trade and get AI feedback.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        sessionListContainer.innerHTML = savedSessions.map((session, index) => {
            const dateStr = new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            const outcome = session.formInputs?.outcome || 'unspecified';
            let outcomeClass = '';
            if (outcome === 'win' || outcome === 'partial-win') outcomeClass = 'win';
            else if (outcome === 'loss' || outcome === 'partial-loss') outcomeClass = 'loss';
            else if (outcome === 'break-even') outcomeClass = 'breakeven';

            const rating = (session.formInputs?.setupQuality && session.formInputs.setupQuality !== 'none') ? session.formInputs.setupQuality.toUpperCase() : '';

            return `
                <div class="session-card fade-in" tabindex="0" onclick="viewPastSession('${session.id}')" style="animation-delay: ${index * 0.05}s;">
                    <div class="session-card-header">
                        <span class="session-card-date">${dateStr}</span>
                        <div class="session-card-badges">
                            ${outcome !== 'unspecified' ? `<span class="badge ${outcomeClass}">${outcome.replace('-', ' ')}</span>` : ''}
                            ${rating ? `<span class="badge rating">${rating}</span>` : ''}
                            ${session.formInputs?.setupType && session.formInputs.setupType !== 'none' ? `<span class="badge">${session.formInputs.setupType}</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="session-card-preview">
                        ${(() => {
                            try {
                                const f = session.aiFeedback || (session.formInputs ? generateAICoachFeedback(session.formInputs) : null);
                                if (!f) return "No analysis available.";
                                
                                // Synthesize Analysis: Combine what went right and what went wrong from AI categories
                                const primaryIssue = (f.specific && f.specific.includes('.')) ? f.specific.split('.')[0] + '.' : (f.specific || "");
                                const disciplineState = (f.rules && f.rules.includes('.')) ? f.rules.split('.')[0] + '.' : (f.rules || "");
                                const psychologyState = (f.psychology && f.psychology.includes('.')) ? f.psychology.split('.')[0] + '.' : (f.psychology || "");
                                
                                return `
                                    <div style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 12px;">
                                        ${primaryIssue} ${disciplineState} ${psychologyState}
                                    </div>
                                    <div style="margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--border-light);">
                                        <strong style="color: #3B82F6; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">Next Focus</strong> 
                                        <p style="font-size: 0.9rem; font-weight: 500; color: var(--navy-dark); line-height: 1.4;">${f.focus || "Keep building consistency"}</p>
                                    </div>
                                `;
                            } catch (err) {
                                console.error("Error rendering session preview:", err);
                                return "Analysis could not be displayed.";
                            }
                        })()}
                    </div>

                    <!-- Actions Overlay -->
                    <div class="session-card-actions">
                        <button class="action-btn edit" onclick="event.stopPropagation(); editSession('${session.id}')" title="Edit Session">
                            <i data-lucide="edit-3"></i>
                        </button>
                        <button class="action-btn delete" onclick="event.stopPropagation(); deleteSession('${session.id}')" title="Delete Session">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    };

    // View Past Session feature
    window.viewPastSession = function (id) {
        console.log("Viewing past session ID:", id);
        const savedSessions = JSON.parse(localStorage.getItem('traderZenSessions') || '[]');
        const session = savedSessions.find(s => s.id === id);

        if (!session) {
            console.error("Error: Session not found for ID:", id);
            return;
        }

        switchView('new-session'); // Hijack new session view

        // 1. Update Title and Date
        const dateStr = new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        document.getElementById('current-date').textContent = `Reviewing: ${dateStr}`;
        document.querySelector('.page-title').textContent = "Saved Trading Session";

        // 2. Populate and Disable Pre-Market
        const preMarketBtns = document.querySelectorAll('.mood-selector')[0].querySelectorAll('.mood-btn');
        preMarketBtns.forEach(btn => {
            btn.classList.remove('selected');
            if (session.formInputs.preMarketMoods.includes(btn.dataset.mood)) {
                btn.classList.add('selected');
            }
        });

        const numInputs = document.querySelectorAll('input[type="number"]');
        if (numInputs[0]) numInputs[0].value = session.formInputs.energy;
        if (numInputs[1]) numInputs[1].value = session.formInputs.stress;

        // 3. Setup Type
        const setupRadios = document.querySelectorAll('input[name="setup-type"]');
        setupRadios.forEach(radio => {
            radio.checked = radio.value === session.formInputs.setupType;
        });

        if (session.formInputs.setupType !== 'none') {
            document.querySelector(`input[name="setup-type"][value="${session.formInputs.setupType}"]`)?.dispatchEvent(new Event('change'));
        }

        // 4. Setup Quality
        const qualityBtns = document.querySelectorAll('.mood-selector')[1]?.querySelectorAll('.mood-btn') || [];
        qualityBtns.forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.mood === session.formInputs.setupQuality) {
                btn.classList.add('selected');
            }
        });

        // 5. Emotions
        const tags = document.querySelectorAll('.emotion-tags .tag');
        tags.forEach(tag => {
            tag.classList.remove('selected');
            if (session.formInputs.emotions.includes(tag.textContent.trim())) {
                tag.classList.add('selected');
            }
            tag.style.pointerEvents = 'none'; // disable
        });

        // 6. Rules & Confirmations
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach(cb => {
            const val = cb.value;
            if (cb.name === 'confirmations') {
                cb.checked = (session.formInputs.confirmations || []).includes(val);
            } else if (cb.name === 'rules') {
                cb.checked = (session.formInputs.rules || []).includes(val);
            }
        });

        // 7. Post Trade
        const outcomeRadios = document.querySelectorAll('input[name="trade-outcome"]');
        outcomeRadios.forEach(radio => radio.checked = radio.value === session.formInputs.outcome);

        const goodTradeRadios = document.querySelectorAll('input[name="good-trade"]');
        goodTradeRadios.forEach(radio => radio.checked = radio.value === session.formInputs.goodTrade);

        const textareas = document.querySelectorAll('textarea');
        if (textareas[0]) textareas[0].value = session.formInputs.didWell;
        if (textareas[1]) textareas[1].value = session.formInputs.mistake;
        if (textareas[2]) textareas[2].value = session.formInputs.emotionActions;

        const allInputs = form.querySelectorAll('input, textarea, button[type="button"].mood-btn');
        allInputs.forEach(input => input.disabled = true);
        formActions.style.display = 'none';

        // 8. Populate AI Feedback (regenerate if missing)
        const feedback = session.aiFeedback || (session.formInputs ? generateAICoachFeedback(session.formInputs) : null);
        if (feedback) {
            document.getElementById('coach-execution').textContent = feedback.execution;
            document.getElementById('coach-psychology').textContent = feedback.psychology;
            document.getElementById('coach-rules').textContent = feedback.rules;
            document.getElementById('coach-consistency').textContent = feedback.consistency;
            document.getElementById('coach-specific').textContent = feedback.specific;
            document.getElementById('coach-focus').textContent = feedback.focus;
        } else {
            document.getElementById('coach-execution').textContent = "Feedback unavailable.";
            document.getElementById('coach-psychology').textContent = "-";
            document.getElementById('coach-rules').textContent = "-";
            document.getElementById('coach-consistency').textContent = "-";
            document.getElementById('coach-specific').textContent = "-";
            document.getElementById('coach-focus').textContent = "-";
        }
        
        // Ensure section is visible
        if (coachSection) {
            coachSection.style.display = 'block';
            if (coachLoader) coachLoader.style.display = 'none';
            if (coachContent) coachContent.style.display = 'block';
            coachSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
        lucide.createIcons();
    };

    // --- DELETE MODAL LOGIC ---
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    let sessionToDelete = null;

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            if (deleteModal) deleteModal.style.display = 'none';
            sessionToDelete = null;
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (sessionToDelete) {
                let savedSessions = JSON.parse(localStorage.getItem('traderZenSessions') || '[]');
                savedSessions = savedSessions.filter(s => s.id !== sessionToDelete);
                localStorage.setItem('traderZenSessions', JSON.stringify(savedSessions));
                window.loadSessionsToDashboard();
            }
            if (deleteModal) deleteModal.style.display = 'none';
            sessionToDelete = null;
        });
    }

    // Delete Session feature (Now uses custom modal)
    window.deleteSession = function (id) {
        console.log("Delete session triggered for ID:", id);
        sessionToDelete = id;
        const modal = document.getElementById('delete-modal');
        if (modal) {
            console.log("Showing delete modal");
            modal.style.display = 'flex';
            lucide.createIcons();
        } else {
            console.error("Critical Error: Delete modal element not found in DOM");
            // Fallback to generic confirm if modal fails
            if (confirm("Are you sure you want to delete this session?")) {
                let savedSessions = JSON.parse(localStorage.getItem('traderZenSessions') || '[]');
                savedSessions = savedSessions.filter(s => s.id !== id);
                localStorage.setItem('traderZenSessions', JSON.stringify(savedSessions));
                window.loadSessionsToDashboard();
            }
        }
    };

    // Edit Session feature (Enables inputs for a past session)
    window.editSession = function (id) {
        window.viewPastSession(id); // First load the data
        
        // Change title to Edit Mode
        document.querySelector('.page-title').textContent = "Editing Trading Session";
        
        // Re-enable all inputs
        form.querySelectorAll('input, textarea, button[type="button"].mood-btn').forEach(input => input.disabled = false);
        document.querySelectorAll('.emotion-tags .tag').forEach(tag => tag.style.pointerEvents = 'auto');
        
        // Show the save button again (Updated for Edit)
        formActions.style.display = 'flex';
        const submitBtn = document.getElementById('save-session-btn');
        submitBtn.innerHTML = '<i data-lucide="save"></i> Update Session';
        
        // We'll need a way for the submit handler to know if it's an update
        form.dataset.editingId = id;

        // Hide AI section while editing
        coachSection.style.display = 'none';
        
        lucide.createIcons();
    };

    // Initialize View
    console.log("Initializing app view...");
    switchView('dashboard');

});

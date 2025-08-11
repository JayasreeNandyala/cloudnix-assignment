// js/script.js
document.addEventListener('DOMContentLoaded', function() {
  let currentStep = 1;
  const totalSteps = 3;

  function setStep(step) {
    if (step < 1) step = 1;
    if (step > totalSteps) step = totalSteps;
    currentStep = step;

    // show/hide
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');

    // progress UI
    const pct = Math.round((step / totalSteps) * 100);
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('stepNumber').textContent = step;
  }

  // Next / Prev (delegated)
  document.addEventListener('click', function(e){
    if (e.target.matches('.next-step')) { setStep(currentStep + 1); }
    if (e.target.matches('.prev-step')) { setStep(currentStep - 1); }
  });

  // Theme selection (click & keyboard)
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', function(){
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      // store selected theme name
      const theme = this.dataset.theme || '';
      try { localStorage.setItem('selectedTheme', theme); } catch(e){}
    });
    card.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
  });

  // Save draft button (saves to localStorage)
  const saveDraftBtn = document.getElementById('saveDraft');
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', function(){
      const payload = {
        theme: localStorage.getItem('selectedTheme') || null,
        productType: document.getElementById('productType').value || '',
        productCategory: document.getElementById('productCategory').value || '',
        platform: document.getElementById('platform').value || ''
      };
      try {
        localStorage.setItem('onboardingDraft', JSON.stringify(payload));
        alert('Draft saved locally.');
      } catch(e) { alert('Could not save draft (storage error).'); }
    });
  }

  // Finish button
  const finishBtn = document.getElementById('finishBtn');
  if (finishBtn) {
    finishBtn.addEventListener('click', function(){
      const result = {
        theme: localStorage.getItem('selectedTheme') || 'Not set',
        productType: document.getElementById('productType').value,
        category: document.getElementById('productCategory').value,
        platform: document.getElementById('platform').value
      };
      console.log('Onboarding result:', result);
      alert('Onboarding complete — values logged to console (demo).');
      // In real app send to server here
    });
  }

  // restore draft + theme on load
  (function restore(){
    try {
      const draft = JSON.parse(localStorage.getItem('onboardingDraft') || '{}');
      if (draft) {
        if (draft.productType) document.getElementById('productType').value = draft.productType;
        if (draft.category) document.getElementById('productCategory').value = draft.productCategory;
        if (draft.platform) document.getElementById('platform').value = draft.platform;
      }
      const selTheme = localStorage.getItem('selectedTheme');
      if (selTheme) {
        document.querySelectorAll('.theme-card').forEach(c => {
          if ((c.dataset.theme || '').toLowerCase() === selTheme.toLowerCase()) c.classList.add('selected');
        });
      }
    } catch(e){}
  })();

  // init
  setStep(1);
});

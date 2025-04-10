// Bestand: dagen-indicators-modal.js
// Vervang de functie createIndicatorsModal met onderstaande verbeterde versie
// om de opslaan-knop toe te voegen

function createIndicatorsModal() {
  // Maak de modal wrapper
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'modal-backdrop';
  modalBackdrop.id = 'indicatorsModal';
  
  // Maak de modal content
  const modalHTML = `
    <div class="modal" style="max-width: 600px;">
      <div class="modal-header">
        <h3 class="modal-title">Dag-indicatoren beheren</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="tabs">
          <!-- Tabs worden dynamisch ingevuld op basis van de indicators -->
        </div>
        
        <!-- Tab inhoud containers worden ook dynamisch aangemaakt -->
        <div class="tab-contents">
        </div>
        
        <!-- Nieuwe duidelijke knop voor het toevoegen van een indicator -->
        <button class="btn btn-add-indicator" id="addNewIndicatorBtn">
          <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nieuwe Indicator Toevoegen
        </button>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-cancel">Annuleren</button>
        <button class="btn btn-primary modal-save">Opslaan</button>
      </div>
    </div>
  `;
  
  modalBackdrop.innerHTML = modalHTML;
  document.body.appendChild(modalBackdrop);
  
  // Nu de modal is aangemaakt, zet de event handlers op
  setupModalEventHandlers();
}

// Vervang of vul vervolgens de setupModalEventHandlers aan 
// om de save-button functionaliteit te ondersteunen:

function setupModalEventHandlers() {
  const modal = document.getElementById('indicatorsModal');
  if (!modal) return;
  
  const modalElement = modal.querySelector('.modal');
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('.modal-cancel');
  const saveBtn = modal.querySelector('.modal-save'); // Nieuwe referentie naar de opslaan knop
  const tabsContainer = modal.querySelector('.tabs');
  const tabContentsContainer = modal.querySelector('.tab-contents');
  
  // Modal sluiten functionaliteit
  const closeModal = () => {
    modal.classList.remove('active');
  };
  
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  
  // Sluit de modal als er buiten wordt geklikt
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // NIEUWE CODE: Event handler voor de opslaan knop
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (!window.dagenIndicators) {
        console.error('DagenIndicators module is niet geladen');
        return;
      }
      
      saveBtn.disabled = true;
      saveBtn.textContent = 'Bezig met opslaan...';
      
      try {
        // Alle indicators opslaan
        let allSaved = true;
        for (const indicator of window.dagenIndicators.indicators) {
          const success = await window.dagenIndicators.saveToSharePoint(indicator);
          if (!success) {
            allSaved = false;
          }
        }
        
        if (allSaved) {
          saveBtn.textContent = 'Opgeslagen!';
          // Update de legenda om de wijzigingen weer te geven
          window.dagenIndicators.renderLegend();
          setTimeout(() => {
            saveBtn.textContent = 'Opslaan';
            saveBtn.disabled = false;
            closeModal(); // Sluit modal na succesvol opslaan
          }, 1500);
        } else {
          saveBtn.textContent = 'Fout bij opslaan';
          setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Opslaan';
          }, 2000);
        }
      } catch (error) {
        console.error('Fout bij opslaan van indicators:', error);
        saveBtn.textContent = 'Fout bij opslaan';
        setTimeout(() => {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Opslaan';
        }, 2000);
      }
    });
  }
  
  // Event handler voor de nieuwe indicator knop
  const addNewIndicatorBtn = modal.querySelector('#addNewIndicatorBtn');
  if (addNewIndicatorBtn) {
    addNewIndicatorBtn.addEventListener('click', () => {
      createNewIndicator();
    });
  }
  
  // Methode om de modal te openen en te vullen met indicator data
  window.openIndicatorsModal = () => {
    if (!window.dagenIndicators) {
      console.error('DagenIndicators module is niet geladen');
      return;
    }
    
    // Render eerst de tabs op basis van beschikbare indicators
    renderIndicatorTabs();
    
    // Activeer de eerste tab als standaard
    const firstTab = modal.querySelector('.tab');
    if (firstTab) {
      firstTab.click();
    }
    
    // Toon de modal
    modal.classList.add('active');
  };
  
  // Functie om de tabs te renderen op basis van de beschikbare indicators
  function renderIndicatorTabs() {
    if (!window.dagenIndicators || !window.dagenIndicators.indicators) {
      return;
    }
    
    // Maak de containers leeg
    if (tabsContainer) tabsContainer.innerHTML = '';
    if (tabContentsContainer) tabContentsContainer.innerHTML = '';
    
    // Voor elke indicator, maak een tab en een content container
    window.dagenIndicators.indicators.forEach((indicator, index) => {
      // Maak de tab
      const tab = document.createElement('div');
      tab.className = `tab ${index === 0 ? 'active' : ''}`;
      tab.setAttribute('data-target', indicator.id);
      tab.textContent = indicator.title;
      
      // Voeg de tab toe aan de container
      if (tabsContainer) tabsContainer.appendChild(tab);
      
      // Maak de content container
      const contentContainer = document.createElement('div');
      contentContainer.className = `tab-content ${index === 0 ? 'active' : ''}`;
      contentContainer.setAttribute('data-tab', indicator.id);
      
      // Voeg de content container toe aan de container
      if (tabContentsContainer) tabContentsContainer.appendChild(contentContainer);
      
      // Voeg event listener toe aan de tab
      tab.addEventListener('click', () => {
        // Actieve tab updaten
        const allTabs = modal.querySelectorAll('.tab');
        allTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Actieve content updaten
        const allContents = modal.querySelectorAll('.tab-content');
        allContents.forEach(c => c.classList.remove('active'));
        contentContainer.classList.add('active');
        
        // Configuratie renderen voor deze indicator
        if (window.dagenIndicators) {
          window.dagenIndicators.renderIndicatorConfig(contentContainer, indicator);
        }
      });
    });
  }
  
  // Functie voor het toevoegen van een nieuwe indicator
  function createNewIndicator() {
    if (!window.dagenIndicators) {
      console.error('DagenIndicators module is niet geladen');
      return;
    }
    
    // Maak een nieuwe indicator aan
    const newIndicator = {
      id: `indicator_${Date.now()}`,
      title: 'Nieuwe Indicator',
      kleur: window.dagenIndicators.defaultColors[0],
      effect: 'solid'
    };
    
    // Voeg toe aan indicators lijst
    window.dagenIndicators.indicators.push(newIndicator);
    
    // Genereer de tabs opnieuw om de nieuwe indicator als normale tab te tonen
    renderIndicatorTabs();
    
    // Selecteer de nieuwe tab
    const newlyAddedTab = modal.querySelector(`.tab[data-target="${newIndicator.id}"]`);
    if (newlyAddedTab) {
      newlyAddedTab.click();
    }
    
    // Sla de indicator op
    window.dagenIndicators.saveIndicators();
  }
}
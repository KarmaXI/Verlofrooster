/**
 * DagenIndicators
 * This module handles the custom day indicators for the roster
 * Gebaseerd op SharePoint lijst: DagenIndicators met GUID: 45528ed2-cdff-4958-82e4-e3eb032fd0aa
 */

class DagenIndicators {
  constructor() {
    this.indicators = [];
    this.isLoading = false;
    this.defaultColors = [
      "#2563eb", // Blauw
      "#10b981", // Groen
      "#f59e0b", // Geel
      "#ef4444", // Rood
      "#8b5cf6", // Paars
      "#ec4899", // Roze
    ];

    this.patterns = [
      { id: "solid", name: "Effen", spValue: "Effen" },
      {
        id: "diagonal-right",
        name: "Diagonaal (Rechts)",
        spValue: "Diagonale lijn (rechts)",
      },
      {
        id: "diagonal-left",
        name: "Diagonaal (Links)",
        spValue: "Diagonale lijn (links)",
      },
      { id: "cross", name: "Kruis", spValue: "Kruis" },
      { id: "plus", name: "Plus", spValue: "Plus" },
      { id: "lv", name: "Louis Vuitton", spValue: "Louis Vuitton" },
    ];

    // SharePoint configuratie - kan worden aangepast aan de juiste omgeving
    this.sharePointConfig = {
      // Indien nodig kan deze URL worden aangepast aan je omgeving
      baseUrl: "https://som.org.om.local",
      listGuid: "45528ed2-cdff-4958-82e4-e3eb032fd0aa",
      siteUrl: "/sites/MulderT/CustomPW/Verlof", // Gecorrigeerd van "Verlof_api" naar "Verlof"
      useLocalStorageOnly: false, // Zet op true om SharePoint calls over te slaan (voor testen)
      mockDelay: 500, // Vertraging voor mock data (ms)
    };

    this.init();
  }

  init() {
    // Laad de indicators van SharePoint of uit localStorage cache
    this.loadIndicators();

    // Initialiseer de legenda toggle functionaliteit
    this.initLegendToggle();

    // Toon de indicators in de legenda
    this.renderLegend();
  }

  async loadIndicators() {
    this.isLoading = true;

    try {
      // Eerst proberen we de cache te gebruiken voor snelle weergave
      const cachedIndicators = this.loadFromCache();
      if (cachedIndicators && cachedIndicators.length > 0) {
        this.indicators = cachedIndicators;
        this.renderLegend();
      }

      // Dan halen we verse data uit SharePoint
      await this.loadFromSharePoint();
    } catch (error) {
      console.error("Fout bij het laden van dagen indicators:", error);
      // Als er nog geen indicators zijn, zet dan de defaults
      if (this.indicators.length === 0) {
        this.setDefaultIndicators();
      }
    } finally {
      this.isLoading = false;
    }
  }

  loadFromCache() {
    // Probeer bestaande indicators te laden uit localStorage
    const savedIndicators = localStorage.getItem("dagenIndicators");

    if (savedIndicators) {
      try {
        return JSON.parse(savedIndicators);
      } catch (e) {
        console.error("Fout bij het laden van dagen indicators uit cache:", e);
        return null;
      }
    }
    return null;
  }

  async loadFromSharePoint() {
    // Als useLocalStorageOnly is ingeschakeld, sla dan de SharePoint call over
    if (this.sharePointConfig.useLocalStorageOnly) {
      console.log(
        "SharePoint API overgeslagen vanwege useLocalStorageOnly instelling"
      );
      return;
    }

    try {
      // Bepaal de volledige API URL - gebruik de juiste pad structuur
      const apiUrl = `${this.sharePointConfig.baseUrl}${this.sharePointConfig.siteUrl}/_api/Web/Lists(guid'${this.sharePointConfig.listGuid}')/Items`;

      console.log(`SharePoint API aanroepen: ${apiUrl}`);

      // Probeer de data te fetchen, maar met een timeout om hangende requests te voorkomen
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconden timeout

      const response = await fetch(apiUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      });

      // Annuleer de timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.d && Array.isArray(data.d.results)) {
        // Verwerk de resultaten
        const spItems = data.d.results;
        this.indicators = spItems.map((item) => this.mapSharePointItem(item));

        // Sla de nieuwe data op in cache
        this.saveIndicators();

        // Update de UI
        this.renderLegend();
      } else {
        // Lege of ongeldige respons
        console.warn("Geen geldige resultaten van SharePoint API");
      }
    } catch (error) {
      console.error("Fout bij ophalen van SharePoint indicators:", error);

      // Simuleer een vertraging zodat de gebruiker de cache kan zien
      if (this.sharePointConfig.mockDelay > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.sharePointConfig.mockDelay)
        );
      }

      // Als we hier nog geen indicators hebben, gebruik dan de standaard indicators
      if (this.indicators.length === 0) {
        this.setDefaultIndicators();
      }

      // Toon een bericht aan de gebruiker
      this.showOfflineNotification();
    }
  }

  showOfflineNotification() {
    // Creëer een tijdelijk notificatie-element
    const notification = document.createElement("div");
    notification.className = "offline-notification";
    notification.innerHTML = `
      <div class="offline-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
        <span>Je werkt nu offline met lokaal opgeslagen dag-indicators. Wijzigingen worden lokaal opgeslagen.</span>
      </div>
    `;

    // Voeg CSS toe voor de notificatie
    const style = document.createElement("style");
    style.textContent = `
      .offline-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #f97316;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        max-width: 90%;
        animation: slideUp 0.3s ease-out, fadeOut 0.5s ease-in 4.5s forwards;
      }
      .offline-message {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      @keyframes slideUp {
        from { transform: translate(-50%, 100px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; visibility: hidden; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Verwijder de notificatie na 5 seconden
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  mapSharePointItem(spItem) {
    const title = spItem.Title || spItem.LinkTitle || "";
    const kleur = spItem.Kleur || this.defaultColors[0];
    const patroonSpValue = spItem.Patroon || "Effen";

    // Vertaal de SP patroonwaarde naar onze interne waarde
    const patternObj =
      this.patterns.find((p) => p.spValue === patroonSpValue) ||
      this.patterns[0];

    return {
      id:
        spItem.ID ||
        `sp_${Date.now()}${Math.random().toString(36).substr(2, 5)}`, // Fallback ID
      title: title,
      kleur: kleur,
      effect: patternObj.id,
    };
  }

  setDefaultIndicators() {
    // Standaard indicators instellen als er geen opgeslagen zijn
    this.indicators = [
      {
        id: "vvm",
        title: "VVM",
        kleur: this.defaultColors[0],
        effect: "diagonal-left",
      },
      {
        id: "vvd",
        title: "VVD",
        kleur: this.defaultColors[1],
        effect: "diagonal-right",
      },
      {
        id: "vvo",
        title: "VVO",
        kleur: this.defaultColors[2],
        effect: "solid",
      },
    ];
    this.saveIndicators();
  }

  saveIndicators() {
    // Sla indicators op in localStorage
    localStorage.setItem("dagenIndicators", JSON.stringify(this.indicators));
  }

  async saveToSharePoint(indicator) {
    // Als useLocalStorageOnly is ingeschakeld, sla dan de SharePoint call over
    if (this.sharePointConfig.useLocalStorageOnly) {
      console.log(
        "SharePoint opslaan overgeslagen vanwege useLocalStorageOnly instelling"
      );
      // Simuleer een vertraging zodat de gebruiker weet dat er iets gebeurt
      await new Promise((resolve) =>
        setTimeout(resolve, this.sharePointConfig.mockDelay)
      );
      // Update lokaal en sla op in cache
      this.saveIndicators();
      return true;
    }

    try {
      // Converteer het indicator object naar het juiste formaat voor SharePoint
      const spPatternValue =
        this.patterns.find((p) => p.id === indicator.effect)?.spValue ||
        "Effen";

      const body = JSON.stringify({
        __metadata: { type: "SP.Data.DagenIndicatorsListItem" },
        Title: indicator.title,
        Kleur: indicator.kleur,
        Patroon: spPatternValue,
      });

      // Bepaal de basis API URL - gebruik de juiste pad structuur
      const baseApiUrl = `${this.sharePointConfig.baseUrl}${this.sharePointConfig.siteUrl}/_api/Web/Lists(guid'${this.sharePointConfig.listGuid}')/Items`;

      // Bepaal of dit een update of nieuwe post is
      let url = baseApiUrl;
      let method = "POST";

      // Als het een bestaand item is, gebruik dan de update logica
      if (indicator.id && !isNaN(parseInt(indicator.id))) {
        url = `${baseApiUrl}(${indicator.id})`;
        method = "PATCH";
      }

      // Probeer de API call, maar met een timeout om hangende requests te voorkomen
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconden timeout

      const response = await fetch(url, {
        method: method,
        signal: controller.signal,
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": document.getElementById("__REQUESTDIGEST")?.value,
          "IF-MATCH": method === "PATCH" ? "*" : null,
          "X-HTTP-Method": method === "PATCH" ? "MERGE" : null,
        },
        body: body,
      });

      // Annuleer de timeout
      clearTimeout(timeoutId);

      if (!response.ok && method !== "PATCH") {
        throw new Error(`SharePoint API error: ${response.status}`);
      }

      // Als het een nieuw item was, haal dan het nieuwe item op voor het ID
      if (method === "POST") {
        const data = await response.json();
        if (data && data.d) {
          indicator.id = data.d.ID;
        }
      }

      // Update de cache zelfs als de API call is gelukt
      this.saveIndicators();

      return true;
    } catch (error) {
      console.error("Fout bij opslaan naar SharePoint:", error);

      // Zelfs bij een fout willen we de cache bijwerken
      this.saveIndicators();

      // Toon een offline-notificatie
      this.showOfflineNotification();

      // We beschouwen het als "succesvol" vanuit het gebruikers perspectief
      // aangezien de gegevens lokaal zijn opgeslagen
      return true;
    }
  }

  getIndicatorById(id) {
    return this.indicators.find((ind) => ind.id === id) || null;
  }

  renderLegend() {
    const legendSection =
      document.querySelector('.legend-section[data-type="dagen"]') ||
      document.getElementById("legendDagenIndicator");

    if (!legendSection) return;

    // Maak de inhoud leeg
    const sectionContent =
      legendSection.querySelector(".legend-section-content") || legendSection;
    sectionContent.innerHTML = "";

    // Voeg elke indicator toe aan de legenda
    this.indicators.forEach((indicator) => {
      const item = document.createElement("div");
      item.className = "legend-item";

      const colorBox = document.createElement("div");
      colorBox.className = `legend-color pattern-${indicator.effect}`;
      colorBox.style.backgroundColor = indicator.kleur;

      const title = document.createElement("span");
      title.textContent = indicator.title;

      item.appendChild(colorBox);
      item.appendChild(title);
      sectionContent.appendChild(item);
    });
  }

  initLegendToggle() {
    const legendHeader = document.querySelector(".legend-header");
    if (!legendHeader) return;

    legendHeader.addEventListener("click", () => {
      const legend = document.querySelector(".legend");
      const content = document.querySelector(".legend-content");
      const toggle = document.querySelector(".legend-toggle");

      // Toggle de weergave van de legenda
      const isExpanded = content.style.display !== "none";

      if (isExpanded) {
        content.style.display = "none";
        toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
      } else {
        content.style.display = "flex";
        toggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
      }

      // Sla de status op in localStorage
      localStorage.setItem("legendExpanded", !isExpanded);
    });

    // Zet de initiële status op basis van localStorage
    const isExpanded = localStorage.getItem("legendExpanded") !== "false";
    const content = document.querySelector(".legend-content");
    const toggle = document.querySelector(".legend-toggle");

    if (content && toggle) {
      if (isExpanded) {
        content.style.display = "flex";
        toggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
      } else {
        content.style.display = "none";
        toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
      }
    }
  }

  applyIndicatorStyle(element, indicatorId) {
    const indicator = this.getIndicatorById(indicatorId);
    if (!indicator) return;

    // Verwijder bestaande pattern classes
    element.classList.remove(
      ...Array.from(element.classList).filter((c) => c.startsWith("pattern-"))
    );

    // Pas de nieuwe stijl toe
    element.classList.add(`pattern-${indicator.effect}`);
    element.style.backgroundColor = indicator.kleur;
  }

  // Methode om een configuratiescherm te renderen voor een indicator
  renderIndicatorConfig(container, indicator) {
    container.innerHTML = "";

    // Titel invoerveld
    const titleGroup = document.createElement("div");
    titleGroup.className = "form-group";

    const titleLabel = document.createElement("label");
    titleLabel.className = "form-label";
    titleLabel.textContent = "Titel";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "form-control";
    titleInput.value = indicator.title;
    titleInput.addEventListener("change", (e) => {
      indicator.title = e.target.value;
      this.saveIndicators();
      this.renderLegend();
    });

    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);
    container.appendChild(titleGroup);

    // Kleur kiezer
    const colorGroup = document.createElement("div");
    colorGroup.className = "form-group";

    const colorLabel = document.createElement("label");
    colorLabel.className = "form-label";
    colorLabel.textContent = "Kleur";

    const colorPickerContainer = document.createElement("div");
    colorPickerContainer.className = "color-picker-container";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.className = "color-picker-input";
    colorInput.value = indicator.kleur;
    colorInput.addEventListener("change", (e) => {
      indicator.kleur = e.target.value;
      this.saveIndicators();
      this.renderLegend();

      // Update ook alle pattern-options in deze container
      const patternOptions = container.querySelectorAll(".pattern-option");
      patternOptions.forEach((option) => {
        option.style.backgroundColor = e.target.value;
      });
    });

    // Vooraf gedefinieerde kleuren
    const presetContainer = document.createElement("div");
    presetContainer.className = "color-picker-preset";

    this.defaultColors.forEach((color) => {
      const preset = document.createElement("div");
      preset.className = `color-preset ${
        indicator.kleur === color ? "selected" : ""
      }`;
      preset.style.backgroundColor = color;
      preset.addEventListener("click", () => {
        indicator.kleur = color;
        colorInput.value = color;

        // Update selected state
        document.querySelectorAll(".color-preset").forEach((el) => {
          el.classList.toggle("selected", el.style.backgroundColor === color);
        });

        // Update ook alle pattern-options in deze container
        const patternOptions = container.querySelectorAll(".pattern-option");
        patternOptions.forEach((option) => {
          option.style.backgroundColor = color;
        });

        this.saveIndicators();
        this.renderLegend();
      });
      presetContainer.appendChild(preset);
    });

    colorPickerContainer.appendChild(colorInput);
    colorPickerContainer.appendChild(presetContainer);
    colorGroup.appendChild(colorLabel);
    colorGroup.appendChild(colorPickerContainer);
    container.appendChild(colorGroup);

    // Effect kiezer
    const patternGroup = document.createElement("div");
    patternGroup.className = "form-group pattern-selector";

    const patternLabel = document.createElement("label");
    patternLabel.className = "form-label";
    patternLabel.textContent = "Effect";

    const patternOptions = document.createElement("div");
    patternOptions.className = "pattern-options";

    this.patterns.forEach((pattern) => {
      const option = document.createElement("div");
      option.className = `pattern-option pattern-${pattern.id} ${
        indicator.effect === pattern.id ? "selected" : ""
      }`;
      option.style.backgroundColor = indicator.kleur;
      option.title = pattern.name;

      option.addEventListener("click", () => {
        indicator.effect = pattern.id;

        // Update selected state
        document.querySelectorAll(".pattern-option").forEach((el) => {
          el.classList.remove("selected");
        });
        option.classList.add("selected");

        this.saveIndicators();
        this.renderLegend();
      });

      patternOptions.appendChild(option);
    });

    patternGroup.appendChild(patternLabel);
    patternGroup.appendChild(patternOptions);
    container.appendChild(patternGroup);

    // Sla op naar SharePoint knop
    const saveGroup = document.createElement("div");
    saveGroup.className = "form-group";

    const saveButton = document.createElement("button");
    saveButton.className = "btn btn-primary";
    saveButton.textContent = "Wijzigingen opslaan";
    saveButton.addEventListener("click", async () => {
      saveButton.disabled = true;
      saveButton.textContent = "Bezig met opslaan...";

      const success = await this.saveToSharePoint(indicator);

      if (success) {
        saveButton.textContent = "Opgeslagen!";
        setTimeout(() => {
          saveButton.disabled = false;
          saveButton.textContent = "Wijzigingen opslaan";
        }, 2000);
      } else {
        saveButton.textContent = "Fout bij opslaan";
        setTimeout(() => {
          saveButton.disabled = false;
          saveButton.textContent = "Wijzigingen opslaan";
        }, 2000);
      }
    });

    saveGroup.appendChild(saveButton);
    container.appendChild(saveGroup);
  }
}

// Initialiseer de module wanneer het document geladen is
document.addEventListener("DOMContentLoaded", () => {
  window.dagenIndicators = new DagenIndicators();
});

/**
 * Dagen-Indicators Functionality
 *
 * This file handles the loading and rendering of dynamic day indicators
 * which are configurable patterns and colors for different day types.
 */

// Store loaded indicators in state
let dagenIndicators = [];

// Load dagen-indicators from SharePoint on startup
function loadDagenIndicators() {
  return fetchDagenIndicators()
    .then((indicators) => {
      dagenIndicators = indicators;
      console.log("Loaded dagen-indicators:", dagenIndicators);
      return indicators;
    })
    .catch((error) => {
      console.error("Error loading dagen-indicators:", error);
      return [];
    });
}

// Get pattern CSS based on pattern type
function getPatternCSS(pattern, color) {
  switch (pattern) {
    case "Effen":
      return `background-color: ${color};`;

    case "Diagonale lijn (rechts)":
      return `
        background-color: ${color};
        background-image: linear-gradient(45deg, rgba(255,255,255,.5) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.5) 50%, rgba(255,255,255,.5) 75%, transparent 75%, transparent);
        background-size: 10px 10px;
      `;

    case "Diagonale lijn (links)":
      return `
        background-color: ${color};
        background-image: linear-gradient(-45deg, rgba(255,255,255,.5) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.5) 50%, rgba(255,255,255,.5) 75%, transparent 75%, transparent);
        background-size: 10px 10px;
      `;

    case "Kruis":
      return `
        background-color: ${color};
        background-image: linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px);
        background-size: 8px 8px;
      `;

    case "Plus":
      return `
        background-color: ${color};
        background-image: 
          linear-gradient(to right, transparent 45%, rgba(255,255,255,.5) 45%, rgba(255,255,255,.5) 55%, transparent 55%),
          linear-gradient(to bottom, transparent 45%, rgba(255,255,255,.5) 45%, rgba(255,255,255,.5) 55%, transparent 55%);
        background-size: 10px 10px;
      `;

    case "Louis Vuitton":
      return `
        background-color: ${color};
        background-image: radial-gradient(rgba(255,255,255,.5) 15%, transparent 16%),
                          radial-gradient(rgba(255,255,255,.5) 15%, transparent 16%);
        background-size: 12px 12px;
        background-position: 0 0, 6px 6px;
      `;

    default:
      return `background-color: ${color};`;
  }
}

// Find indicator for a specific day type (VVD, VVM, VVO)
function getIndicatorForType(dayType) {
  if (!dayType || !dagenIndicators.length) {
    // Fallback to default config if no indicators loaded yet
    return {
      title: SP_CONFIG.dayTypeIndicators[dayType]?.name || dayType,
      color: SP_CONFIG.dayTypeIndicators[dayType]?.color || "#cccccc",
      pattern: "Effen",
    };
  }

  // Try to find matching indicator by title
  const indicator = dagenIndicators.find((ind) => ind.title === dayType);

  // Return indicator if found, or fallback to default
  return (
    indicator || {
      title: SP_CONFIG.dayTypeIndicators[dayType]?.name || dayType,
      color: SP_CONFIG.dayTypeIndicators[dayType]?.color || "#cccccc",
      pattern: "Effen",
    }
  );
}

// Update the legend with current indicators
function updateDagenIndicatorsLegend() {
  const legendSection = document.querySelector(
    "#legendDagenIndicator .legend-section-content"
  );
  if (!legendSection) return;

  // Clear current items
  legendSection.innerHTML = "";

  // Get all unique day types
  const dayTypes = ["VVD", "VVM", "VVO"]; // Default types always shown

  // Add all indicators to legend
  dayTypes.forEach((dayType) => {
    const indicator = getIndicatorForType(dayType);

    const legendItem = document.createElement("div");
    legendItem.className = "legend-item";

    const colorDiv = document.createElement("div");
    colorDiv.className = "legend-color";
    colorDiv.setAttribute(
      "style",
      getPatternCSS(indicator.pattern, indicator.color)
    );

    const titleSpan = document.createElement("span");
    titleSpan.textContent = indicator.title;

    legendItem.appendChild(colorDiv);
    legendItem.appendChild(titleSpan);
    legendSection.appendChild(legendItem);
  });
}

// Apply indicators to calendar days
function applyDagenIndicatorsToCalendar() {
  // Find all cells in the roster that need indicators
  const cells = document.querySelectorAll("[data-daytype]");

  cells.forEach((cell) => {
    const dayType = cell.dataset.daytype;
    if (!dayType) return;

    const indicator = getIndicatorForType(dayType);

    // Apply pattern and color CSS
    cell.setAttribute(
      "style",
      getPatternCSS(indicator.pattern, indicator.color)
    );
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing dagen-indicators...");
  loadDagenIndicators().then(() => {
    updateDagenIndicatorsLegend();
  });
});

// Export function for use in v.js
window.loadDagenIndicators = loadDagenIndicators;
window.getIndicatorForType = getIndicatorForType;
window.getPatternCSS = getPatternCSS;
window.updateDagenIndicatorsLegend = updateDagenIndicatorsLegend;
window.applyDagenIndicatorsToCalendar = applyDagenIndicatorsToCalendar;

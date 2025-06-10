// Bestand: js/beheerCentrum_logic_new.js
// Beschrijving: Nieuwe logica voor het Beheercentrum, aangepast aan de structuur van configLijst.js

// --- Globale Variabelen ---
let SharePointSiteUrl = ""; 
let SharePointRequestDigest = ""; 
let HuidigeActieveTabKey = null; 
const LIJST_CONFIG_FUNC_TIMEOUT = 7000; 
const LIJST_CONFIG_FUNC_INTERVAL = 300; 
let GeinitialiseerdeConfiguraties = {}; // Lokaal object om de configuraties op te slaan

// --- Hulpfuncties voor UI (Fallbacks als ui_utilities.js niet beschikbaar is) ---
const ui = {
    showGlobalSpinner: (show, message = "Laden...") => {
        if (window.ui_utilities && typeof window.ui_utilities.showGlobalSpinner === 'function') {
            window.ui_utilities.showGlobalSpinner(show, message);
            return;
        }
        let spinnerOverlay = document.getElementById('fallback-spinner-overlay');
        if (show) {
            if (!spinnerOverlay) {
                spinnerOverlay = document.createElement('div');
                spinnerOverlay.id = 'fallback-spinner-overlay';
                spinnerOverlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex flex-col items-center justify-center z-[200]';
                spinnerOverlay.innerHTML = `
                    <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-white text-lg mt-3">${message}</p>
                `;
                document.body.appendChild(spinnerOverlay);
            }
            spinnerOverlay.classList.remove('hidden');
        } else if (spinnerOverlay) {
            spinnerOverlay.classList.add('hidden');
        }
    },
    toonNotificatie: (bericht, type = "info", containerId = "globale-notificatie-balk", autoDismiss = true) => {
        if (window.ui_utilities && typeof window.ui_utilities.toonNotificatie === 'function') {
            window.ui_utilities.toonNotificatie(bericht, type, containerId, autoDismiss);
            return;
        }
        const notificatieBalk = document.getElementById(containerId);
        if (!notificatieBalk) {
            console.warn(`Notificatiebalk met ID '${containerId}' niet gevonden. Fallback alert: ${type} - ${bericht}`);
            alert(`${type.toUpperCase()}: ${bericht}`);
            return;
        }
        const tekstElement = notificatieBalk.querySelector('span#globale-notificatie-tekst') || notificatieBalk.querySelector('span');
        if (tekstElement) tekstElement.textContent = bericht;

        notificatieBalk.classList.remove('hidden', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'text-white', 'text-black');
        switch (type) {
            case 'success': notificatieBalk.classList.add('bg-green-500', 'text-white'); break;
            case 'error': notificatieBalk.classList.add('bg-red-500', 'text-white'); break;
            case 'warning': notificatieBalk.classList.add('bg-yellow-500', 'text-black'); break;
            default: notificatieBalk.classList.add('bg-blue-500', 'text-white'); break;
        }
        notificatieBalk.classList.remove('hidden');
        if (autoDismiss) {
            setTimeout(() => {
                notificatieBalk.classList.add('hidden');
            }, 7000); // Iets langere tijd voor notificaties
        }
    },
    showConfirmationModal: async (message, onConfirm) => {
        if (window.ui_utilities && typeof window.ui_utilities.showConfirmationModal === 'function') {
            await window.ui_utilities.showConfirmationModal(message, onConfirm);
            return;
        }
        if (confirm(message)) {
            if (typeof onConfirm === 'function') {
                await onConfirm();
            }
        }
    }
};

// --- Initialisatie ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Nieuwe Beheercentrum Logica: DOM geladen.");
    ui.showGlobalSpinner(true, "Beheercentrum initialiseren...");

    try {
        const contextOK = await getSharePointContext();
        if (!contextOK) {
            throw new Error("SharePoint context kon niet worden geladen.");
        }

        const configFuncOK = await waitForGetLijstConfigFunction();
        if (!configFuncOK) {
            throw new Error("Functie 'getLijstConfig' (van configLijst.js) niet gevonden. Controleer of configLijst.js correct laadt.");
        }
        
        initializeerConfiguratiesEnTabs(); // Verzamelt configuraties en maakt tab content divs
        
        if (Object.keys(GeinitialiseerdeConfiguraties).length === 0) {
            throw new Error("Geen lijstconfiguraties kunnen initialiseren. Controleer de tab-keys in HTML en de output van getLijstConfig.");
        }
        console.log("Lijstconfiguraties succesvol geïnitialiseerd:", JSON.parse(JSON.stringify(GeinitialiseerdeConfiguraties)));

        setupTabNavigatieListeners_new(); // Aangepaste naam om conflict te voorkomen indien oude script nog laadt
        setupModalEventListeners_new();

        // Activeer de eerste tab die succesvol geconfigureerd is
        const eersteGeconfigureerdeTabKey = Object.keys(GeinitialiseerdeConfiguraties)[0];
        let initieleTabKey = "medewerkers"; // Default voorkeur

        if (GeinitialiseerdeConfiguraties[initieleTabKey]) {
            // Default 'medewerkers' bestaat en is geconfigureerd
        } else if (eersteGeconfigureerdeTabKey) {
            initieleTabKey = eersteGeconfigureerdeTabKey; // Fallback naar de eerste die wel bestaat
        } else {
            initieleTabKey = null; // Geen enkele tab kon geconfigureerd worden
        }
        
        if (initieleTabKey) {
            const knopVoorInitieleTab = document.querySelector(`#tab-navigatie .tab-button[data-tab-key="${initieleTabKey}"]`);
            if (knopVoorInitieleTab) {
                console.log(`Activeren initiële tab: ${initieleTabKey}`);
                knopVoorInitieleTab.click(); 
            } else {
                 console.warn(`Knop voor initiële tab '${initieleTabKey}' niet gevonden, hoewel configuratie bestaat. Controleer data-tab-key attributen.`);
                 ui.toonNotificatie(`Kon initiële tab '${initieleTabKey}' niet automatisch selecteren.`, "warning", "globale-notificatie-balk", false);
            }
        } else {
            console.error("Geen enkele tab kon succesvol geconfigureerd worden. Controleer configLijst.js en de HTML tab-knoppen.");
            ui.toonNotificatie("Fout: Geen beheerbare lijsten geconfigureerd.", "error", "globale-notificatie-balk", false);
        }

    } catch (error) {
        console.error("FATALE FOUT tijdens initialisatie Beheercentrum:", error);
        ui.toonNotificatie(`Initialisatiefout: ${error.message}`, "error", "globale-notificatie-balk", false);
    } finally {
        ui.showGlobalSpinner(false);
    }
});

/**
 * Wacht tot window.getLijstConfig functie beschikbaar is.
 */
async function waitForGetLijstConfigFunction() {
    console.log(`Wachten op window.getLijstConfig (max ${LIJST_CONFIG_FUNC_TIMEOUT / 1000}s)...`);
    const startTime = Date.now();
    while (typeof window.getLijstConfig !== 'function') {
        if (Date.now() - startTime > LIJST_CONFIG_FUNC_TIMEOUT) {
            console.error(`Timeout: window.getLijstConfig functie niet gevonden na ${LIJST_CONFIG_FUNC_TIMEOUT}ms.`);
            return false;
        }
        console.log(`window.getLijstConfig nog niet beschikbaar. Opnieuw proberen over ${LIJST_CONFIG_FUNC_INTERVAL}ms.`);
        await new Promise(resolve => setTimeout(resolve, LIJST_CONFIG_FUNC_INTERVAL));
    }
    console.log("✅ window.getLijstConfig functie GEVONDEN.");
    return true;
}

/**
 * Haalt SharePoint site URL en request digest op.
 */
async function getSharePointContext() {
    try {
        const currentPageUrl = window.location.href;
        const cpwIndex = currentPageUrl.indexOf("/CPW/"); // Zoek naar /CPW/ in de URL
        let baseUrl = "";

        if (cpwIndex !== -1) {
            baseUrl = currentPageUrl.substring(0, cpwIndex); // URL tot aan /CPW/
             // We willen de URL van de subsite "Verlof", dus tot en met /Verlof
            const verlofIndex = currentPageUrl.toLowerCase().indexOf("/verlof/");
            if (verlofIndex !== -1) {
                 SharePointSiteUrl = currentPageUrl.substring(0, verlofIndex + "/verlof".length);
            } else {
                // Fallback als /verlof/ niet expliciet in URL staat maar we wel in /sites/MulderT/CustomPW/ zijn
                const customPWIndex = currentPageUrl.toLowerCase().indexOf("/custompw/");
                if (customPWIndex !== -1) {
                    const partAfterCustomPW = currentPageUrl.substring(customPWIndex + "/custompw/".length);
                    const firstSlashAfterCustomPW = partAfterCustomPW.indexOf('/');
                    if (firstSlashAfterCustomPW !== -1) {
                         SharePointSiteUrl = currentPageUrl.substring(0, customPWIndex + "/custompw/".length + firstSlashAfterCustomPW);
                    } else { // Geen verdere subsite na /CustomPW/, dus dat is de subsite
                         SharePointSiteUrl = currentPageUrl.substring(0, customPWIndex + "/custompw/".length -1);
                    }
                } else {
                     throw new Error("Kon subsite URL niet correct afleiden. '/CPW/' gevonden, maar pad naar subsite 'Verlof' onduidelijk.");
                }
            }
        } else {
            // Fallback als /CPW/ niet in de URL zit, probeer een meer generieke benadering of hardcoded waarde
            SharePointSiteUrl = "https://som.org.om.local/sites/MulderT/CustomPW/Verlof"; // Hardcoded fallback
            console.warn("'/CPW/' niet gevonden in URL, fallback naar hardcoded SharePointSiteUrl:", SharePointSiteUrl);
        }
        
        console.log("Afgeleide/vastgestelde SharePoint Site URL:", SharePointSiteUrl);

        const contextInfoUrl = `${SharePointSiteUrl}/_api/contextinfo`;
        console.log(`Request Digest ophalen van: ${contextInfoUrl}`);
        const response = await fetch(contextInfoUrl, {
            method: "POST",
            headers: { "Accept": "application/json;odata=verbose" }
        });
        if (!response.ok) {
            throw new Error(`Fout bij ophalen request digest (status: ${response.status}) vanaf ${contextInfoUrl}: ${response.statusText}`);
        }
        const data = await response.json();
        SharePointRequestDigest = data.d.GetContextWebInformation.FormDigestValue;
        console.log("SharePoint Context succesvol geladen.");
        return true;
    } catch (error) {
        console.error("Fout bij initialiseren SharePoint context:", error);
        SharePointSiteUrl = "";
        SharePointRequestDigest = "";
        return false;
    }
}

/**
 * Leest tab-keys uit HTML, haalt configuraties op via window.getLijstConfig,
 * en maakt de content divs voor elke geconfigureerde tab.
 */
function initializeerConfiguratiesEnTabs() {
    const tabContentContainer = document.getElementById('tab-content-container');
    const tabNavKnoppen = document.querySelectorAll('#tab-navigatie .tab-button'); // Gebruik bestaande knoppen

    if (!tabContentContainer || tabNavKnoppen.length === 0) {
        console.error("Tab content container of tab navigatieknoppen niet gevonden in HTML.");
        return;
    }
    tabContentContainer.innerHTML = ''; // Leeg de content area voor dynamische opbouw

    GeinitialiseerdeConfiguraties = {}; // Reset

    tabNavKnoppen.forEach(tabKnop => {
        const configKey = tabKnop.dataset.tabKey;
        if (!configKey) {
            console.warn("Tab knop gevonden zonder data-tab-key attribuut:", tabKnop);
            return;
        }

        const configFromGlobalFunc = window.getLijstConfig(configKey); // Gebruik de globale functie

        if (configFromGlobalFunc) {
            // Probeer itemEntityTypeFullName af te leiden als het ontbreekt
            if (!configFromGlobalFunc.itemEntityTypeFullName) {
                const lijstNaamVoorEntityType = configFromGlobalFunc.lijstTitel.replace(/\s+/g, ''); // Verwijder spaties
                configFromGlobalFunc.itemEntityTypeFullName = `SP.Data.${lijstNaamVoorEntityType}ListItem`;
                console.warn(`itemEntityTypeFullName afgeleid voor '${configKey}': ${configFromGlobalFunc.itemEntityTypeFullName}. Controleer of dit correct is!`);
            }
            // Hernoem properties voor consistentie binnen dit script
            const interneConfig = {
                ...configFromGlobalFunc,
                tabTitel: configFromGlobalFunc.tabTitel || configKey, // Fallback
                sharepointLijstNaam: configFromGlobalFunc.lijstTitel, // Gebruik lijstTitel als sharepointLijstNaam
                singularNoun: configFromGlobalFunc.singularNoun || configKey.slice(0, -1) || 'Item', // Eenvoudige fallback
                // Velden moeten ook gemapt worden van 'titel'/'interneNaam' naar 'label'/'spInternalName'
                velden: (configFromGlobalFunc.velden || []).map(v => ({
                    naam: v.titel, // Gebruik 'titel' als 'naam' voor UI
                    label: v.titel,
                    spInternalName: v.interneNaam,
                    type: v.type,
                    isRequired: v.isRequired || false, // Default naar false
                    readOnly: v.readOnly || false,
                    readOnlyInModal: v.readOnlyInModal || false,
                    hideInTable: v.hideInTable || false,
                    isDisplayName: v.isDisplayName || (v.interneNaam === 'Title'), // Title is vaak display name
                    choices: v.choices || [], // Voor Choice/Lookup velden
                    sendNull: v.sendNull === true // Voor het expliciet sturen van null
                }))
            };
            GeinitialiseerdeConfiguraties[configKey] = interneConfig;
            console.log(`Configuratie voor tab '${configKey}' succesvol verwerkt.`);

            // Maak tab content div
            const tabContentDiv = document.createElement('div');
            tabContentDiv.id = `tab-content-${configKey}`;
            tabContentDiv.className = 'tab-content space-y-6'; 
            
            tabContentDiv.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-white">Beheer ${interneConfig.tabTitel}</h2>
                    <button id="nieuw-item-${configKey}-knop" data-config-key="${configKey}" class="nieuw-item-algemeen-knop bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow text-sm">
                        Nieuwe ${interneConfig.singularNoun}
                    </button>
                </div>
                <div class="bg-gray-700 p-4 md:p-6 rounded-lg shadow-md">
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead id="tabel-head-${configKey}" class="bg-gray-600"></thead>
                            <tbody id="tabel-body-${configKey}" class="divide-y divide-gray-600"></tbody>
                        </table>
                    </div>
                    <div id="status-${configKey}" class="mt-3 text-sm text-gray-400">Data nog niet geladen.</div>
                </div>
            `;
            tabContentContainer.appendChild(tabContentDiv);

        } else {
            console.warn(`Kon geen configuratie ophalen voor tab-key '${configKey}' via window.getLijstConfig. Deze tab wordt overgeslagen.`);
            tabKnop.classList.add('opacity-50', 'pointer-events-none'); // Maak knop niet-klikbaar
            tabKnop.title = `Configuratie voor ${configKey} niet gevonden.`;
        }
    });
}


/**
 * Stelt event listeners in voor de tabknoppen.
 */
function setupTabNavigatieListeners_new() {
    const tabNavContainer = document.getElementById('tab-navigatie');
    if (!tabNavContainer) {
        console.error("Tab navigatie container ('tab-navigatie') niet gevonden.");
        return;
    }

    tabNavContainer.addEventListener('click', async (event) => {
        const geklikteKnop = event.target.closest('.tab-button');
        if (!geklikteKnop || geklikteKnop.classList.contains('active') || geklikteKnop.classList.contains('opacity-50')) {
            return; 
        }
        console.log(`Tab geselecteerd: ${geklikteKnop.dataset.tabKey}`);

        const huidigeActieveKnop = tabNavContainer.querySelector('.tab-button.active');
        if (huidigeActieveKnop) {
            huidigeActieveKnop.classList.remove('active', 'border-blue-500', 'text-blue-500', 'bg-gray-600'); // Oude active class
            huidigeActieveKnop.classList.add('text-gray-400', 'bg-gray-700'); 
            const huidigeContentId = `tab-content-${huidigeActieveKnop.dataset.tabKey}`;
            const huidigeContentElem = document.getElementById(huidigeContentId);
            if (huidigeContentElem) huidigeContentElem.classList.remove('active');
        }

        geklikteKnop.classList.add('active', 'border-blue-500', 'text-blue-500', 'bg-gray-600');
        geklikteKnop.classList.remove('text-gray-400', 'bg-gray-700');
        const nieuweTabKey = geklikteKnop.dataset.tabKey;
        HuidigeActieveTabKey = nieuweTabKey;
        const nieuweContentElem = document.getElementById(`tab-content-${nieuweTabKey}`);
        if (nieuweContentElem) nieuweContentElem.classList.add('active');
        else console.error(`Content div voor tab ${nieuweTabKey} niet gevonden!`);


        await laadLijstGegevensVoorTab_new(nieuweTabKey);
    });
}

/**
 * Stelt event listeners in voor de modal en de "Nieuw Item" knoppen.
 */
function setupModalEventListeners_new() {
    const modalElement = document.getElementById('item-modal');
    if (!modalElement) {
        console.error("Modal element ('item-modal') niet gevonden.");
        return;
    }
    const sluitKnopX = document.getElementById('modal-sluit-knop-x');
    const annuleerKnop = document.getElementById('modal-annuleer-knop');
    const opslaanKnop = document.getElementById('modal-opslaan-knop');
    const modalDialog = modalElement.querySelector('.transform'); // Voor animatie

    const sluitModalActie = () => {
        console.log("Modal sluiten actie.");
        if (modalDialog) {
            modalDialog.classList.remove('scale-100', 'opacity-100');
            modalDialog.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => {
            modalElement.classList.add('hidden', 'opacity-0'); 
            const veldenContainer = document.getElementById('modal-velden-container');
            if (veldenContainer) veldenContainer.innerHTML = '';
            const modalStatus = document.getElementById('modal-status');
            if (modalStatus) {
                modalStatus.textContent = '';
                modalStatus.className = 'mt-3 text-sm'; 
            }
            modalElement.removeAttribute('data-modus');
            modalElement.removeAttribute('data-config-key');
            modalElement.removeAttribute('data-item-id');
            console.log("Modal gesloten en gereset.");
        }, 300); 
    };

    if (sluitKnopX) sluitKnopX.addEventListener('click', sluitModalActie);
    if (annuleerKnop) annuleerKnop.addEventListener('click', sluitModalActie);
    
    modalElement.addEventListener('click', (event) => { 
        if (event.target === modalElement) {
            sluitModalActie();
        }
    });

    if (opslaanKnop) {
        opslaanKnop.addEventListener('click', async () => {
            const modus = modalElement.dataset.modus; 
            const configKey = modalElement.dataset.configKey;
            const itemId = modalElement.dataset.itemId; 
            
            console.log(`Opslaan geklikt: modus=${modus}, configKey=${configKey}, itemId=${itemId}`);

            if (!configKey || !GeinitialiseerdeConfiguraties[configKey]) {
                console.error("Kan niet opslaan: configKey ontbreekt of is ongeldig in modal dataset.");
                ui.toonNotificatie("Fout bij opslaan: configuratie niet gevonden.", "error", "modal-status", false);
                return;
            }

            if (modus === 'nieuw') {
                await handleNieuwOpslaan_new(configKey);
            } else if (modus === 'bewerk') {
                await handleBewerkOpslaan_new(configKey, itemId);
            }
        });
    }

    // Event listener voor "Nieuw Item" knoppen (gedelegeerd vanaf tab-content-container)
    const tabContentContainer = document.getElementById('tab-content-container');
    if (tabContentContainer) {
        tabContentContainer.addEventListener('click', (event) => {
            const nieuwKnop = event.target.closest('.nieuw-item-algemeen-knop');
            if (nieuwKnop) {
                const configKey = nieuwKnop.dataset.configKey;
                console.log(`Nieuw item knop geklikt voor configKey: ${configKey}`);
                if (configKey && GeinitialiseerdeConfiguraties[configKey]) {
                    openModalVoorNieuwItem_new(configKey);
                } else {
                    console.error(`Configuratie niet gevonden voor nieuw item knop met key: ${configKey}`);
                    ui.toonNotificatie("Kon item formulier niet openen: configuratie ontbreekt.", "error");
                }
            }
        });
    } else {
        console.error("Tab content container voor 'nieuw item' knop listener niet gevonden.");
    }
}

// --- Data Laad Functies ---
async function laadLijstGegevensVoorTab_new(configKey) {
    if (!GeinitialiseerdeConfiguraties[configKey]) {
        console.error(`Poging tot laden data voor niet-geïnitialiseerde configKey: ${configKey}`);
        ui.toonNotificatie(`Kan data niet laden: configuratie voor '${configKey}' ontbreekt.`, "error");
        return;
    }
    const configuratie = GeinitialiseerdeConfiguraties[configKey];
    ui.showGlobalSpinner(true, `Laden ${configuratie.tabTitel || 'data'}...`);
    console.log(`Start laadLijstGegevensVoorTab_new voor configKey: ${configKey}`);
    
    const tabelHead = document.getElementById(`tabel-head-${configKey}`);
    const tabelBody = document.getElementById(`tabel-body-${configKey}`);
    const statusElement = document.getElementById(`status-${configKey}`);

    if (!tabelHead || !tabelBody || !statusElement) {
        console.error(`Een of meer tabel elementen niet gevonden voor ${configKey}. Head: ${!!tabelHead}, Body: ${!!tabelBody}, Status: ${!!statusElement}`);
        ui.toonNotificatie("Fout bij opbouwen tabel structuur.", "error");
        ui.showGlobalSpinner(false);
        return;
    }

    tabelHead.innerHTML = ''; 
    const headerRow = tabelHead.insertRow();
    (configuratie.velden || []).forEach(veld => {
        if (veld.hideInTable) return; 
        const th = document.createElement('th');
        th.className = 'p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider';
        th.textContent = veld.label || veld.naam; // Gebruik label (gemapt van titel)
        headerRow.appendChild(th);
    });
    const actieTh = document.createElement('th');
    actieTh.className = 'p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider';
    actieTh.textContent = 'Acties';
    headerRow.appendChild(actieTh);

    const colspan = (configuratie.velden || []).filter(v => !v.hideInTable).length + 1;
    tabelBody.innerHTML = `<tr><td colspan="${colspan}" class="p-4 text-center text-gray-400">Data wordt geladen...</td></tr>`;
    statusElement.textContent = "Laden...";
    statusElement.className = "mt-3 text-sm text-gray-400";

    const selectVelden = ['Id']; 
    const expandVelden = new Set();

    (configuratie.velden || []).forEach(v => {
        if (v.hideInTable) return;
        const spName = v.spInternalName; // Gebruik spInternalName (gemapt van interneNaam)
        if (!selectVelden.includes(spName.split('/')[0])) { // Voeg basisveld toe
             selectVelden.push(spName.split('/')[0]);
        }
        if (spName.includes('/')) {
            const parentField = spName.split('/')[0];
             if (!selectVelden.includes(spName)) selectVelden.push(spName); // Zorg dat het volledige pad erin staat
            if (v.type === 'Lookup' || v.type === 'User') expandVelden.add(parentField);
        } else {
            if ((v.type === 'Lookup' || v.type === 'User') && spName !== 'Author' && spName !== 'Editor') {
                expandVelden.add(spName);
            }
        }
    });
    if (!selectVelden.includes('Title') && (configuratie.velden || []).some(v => v.spInternalName === 'Title')) {
        selectVelden.push('Title'); // Voeg Title toe als het een veld is, maar nog niet in select
    }
    
    const uniekeSelectVelden = [...new Set(selectVelden)];
    const selectQuery = uniekeSelectVelden.join(',');
    let expandQueryString = expandVelden.size > 0 ? `&$expand=${Array.from(expandVelden).join(',')}` : '';

    const apiUrl = `${SharePointSiteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(configuratie.sharepointLijstNaam)}')/items?$select=${selectQuery}${expandQueryString}`;
    console.log(`API URL voor ${configKey}: ${apiUrl}`);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "Accept": "application/json;odata=verbose" }
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({ error: { message: { value: response.statusText } } }));
            throw new Error(`Fout bij ophalen data (${response.status}): ${errData.error.message.value}`);
        }
        const data = await response.json();
        tabelBody.innerHTML = ''; 

        if (data.d.results && data.d.results.length > 0) {
            data.d.results.forEach(item => {
                const rij = tabelBody.insertRow();
                rij.className = "hover:bg-gray-600 transition-colors duration-150";
                (configuratie.velden || []).forEach(veld => {
                    if (veld.hideInTable) return;
                    const cel = rij.insertCell();
                    cel.className = 'p-3 text-sm text-gray-200 whitespace-nowrap';
                    let celWaarde = Utils.getItemValue_new(item, veld.spInternalName, veld.type);

                    if (veld.type === 'Boolean') {
                        cel.innerHTML = `<span class="inline-block w-4 h-4 rounded-full ${celWaarde ? 'bg-green-400' : 'bg-red-400'} border border-gray-500"></span>`;
                    } else if (veld.type === 'DateTime' && celWaarde) {
                        cel.textContent = new Date(celWaarde).toLocaleString('nl-NL', {dateStyle: 'medium', timeStyle: 'short'});
                    } else if (veld.type === 'Date' && celWaarde) {
                        cel.textContent = new Date(celWaarde).toLocaleDateString('nl-NL', {dateStyle: 'medium'});
                    } else if (veld.type === 'Color' && celWaarde) {
                        cel.innerHTML = `<div class="w-full h-6 rounded border border-gray-500" style="background-color: ${celWaarde}; min-width: 50px;"></div>`;
                    }
                     else {
                        cel.textContent = (celWaarde === null || typeof celWaarde === 'undefined' || celWaarde === '') ? '-' : String(celWaarde).substring(0,50) + (String(celWaarde).length > 50 ? '...' : ''); // Truncate lange tekst
                    }
                });

                const actieCel = rij.insertCell();
                actieCel.className = 'p-3 text-sm';
                const bewerkKnop = document.createElement('button');
                bewerkKnop.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>`;
                bewerkKnop.className = 'text-blue-400 hover:text-blue-300 mr-2 focus:outline-none';
                bewerkKnop.title = "Bewerken";
                bewerkKnop.addEventListener('click', () => openModalVoorBewerkItem_new(configKey, item.Id, item));
                actieCel.appendChild(bewerkKnop);

                const verwijderKnop = document.createElement('button');
                verwijderKnop.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`;
                verwijderKnop.className = 'text-red-400 hover:text-red-300 focus:outline-none';
                verwijderKnop.title = "Verwijderen";
                const displayNameConfig = (configuratie.velden || []).find(v => v.isDisplayName);
                let displayNameForDeletion = item.Id; 
                if (item.Title) {
                    displayNameForDeletion = item.Title;
                } else if (displayNameConfig) {
                    displayNameForDeletion = Utils.getItemValue_new(item, displayNameConfig.spInternalName, displayNameConfig.type === 'User' || displayNameConfig.type === 'Lookup') || item.Id;
                }
                verwijderKnop.addEventListener('click', () => bevestigVerwijdering_new(configKey, item.Id, displayNameForDeletion));
                actieCel.appendChild(verwijderKnop);
            });
            statusElement.textContent = `${data.d.results.length} items geladen.`;
        } else {
            tabelBody.innerHTML = `<tr><td colspan="${colspan}" class="p-4 text-center text-gray-400">Geen items gevonden.</td></tr>`;
            statusElement.textContent = "Geen items.";
        }

    } catch (error) {
        console.error(`Fout bij laden data voor ${configKey}:`, error);
        tabelBody.innerHTML = `<tr><td colspan="${colspan}" class="p-4 text-center text-red-400">Kon data niet laden: ${error.message}</td></tr>`;
        statusElement.textContent = `Fout: ${error.message}`;
        statusElement.className = "mt-3 text-sm text-red-400";
    } finally {
        ui.showGlobalSpinner(false);
    }
}

// --- Modal & CRUD Hulpfuncties ---
function openModalVoorNieuwItem_new(configKey) {
    console.log(`Modal openen voor NIEUW item (config: ${configKey})`);
    const modalElement = document.getElementById('item-modal');
    const modalTitel = document.getElementById('modal-titel');
    const veldenContainer = document.getElementById('modal-velden-container');
    const modalStatus = document.getElementById('modal-status');
    const modalDialog = modalElement.querySelector('.transform');

    const configuratie = GeinitialiseerdeConfiguraties[configKey];
    if (!configuratie) {
        ui.toonNotificatie("Configuratie niet gevonden om modal te openen.", "error");
        return;
    }

    modalTitel.textContent = `Nieuwe ${configuratie.singularNoun || 'Item'} Toevoegen`;
    veldenContainer.innerHTML = ''; 
    modalStatus.textContent = '';
    modalStatus.className = 'mt-3 text-sm';

    (configuratie.velden || []).forEach(veld => {
        if (veld.readOnly || veld.spInternalName === 'Id') return;
        const formVeldDiv = createFormField_new(veld, null, `nieuw-${configKey}-${veld.naam.replace(/\s+/g, '_')}`); // Unieke ID
        veldenContainer.appendChild(formVeldDiv);
    });

    modalElement.dataset.modus = 'nieuw';
    modalElement.dataset.configKey = configKey;
    modalElement.classList.remove('hidden', 'opacity-0');
    requestAnimationFrame(() => {
        modalDialog.classList.remove('scale-95');
        modalDialog.classList.add('scale-100');
        modalElement.classList.add('opacity-100'); 
    });
}

function openModalVoorBewerkItem_new(configKey, itemId, itemData) {
    console.log(`Modal openen voor BEWERK item (config: ${configKey}, ID: ${itemId})`);
    const modalElement = document.getElementById('item-modal');
    const modalTitel = document.getElementById('modal-titel');
    const veldenContainer = document.getElementById('modal-velden-container');
    const modalStatus = document.getElementById('modal-status');
    const modalDialog = modalElement.querySelector('.transform');

    const configuratie = GeinitialiseerdeConfiguraties[configKey];
    if (!configuratie) {
        ui.toonNotificatie("Configuratie niet gevonden om modal te openen.", "error");
        return;
    }

    modalTitel.textContent = `${configuratie.singularNoun || 'Item'} Bewerken (ID: ${itemId})`;
    veldenContainer.innerHTML = '';
    modalStatus.textContent = '';
    modalStatus.className = 'mt-3 text-sm';

    (configuratie.velden || []).forEach(veld => {
        if (veld.spInternalName === 'Id') return; 
        let huidigeWaarde = Utils.getItemValue_new(itemData, veld.spInternalName, veld.type);
        
        if (veld.type === 'DateTime' && huidigeWaarde) {
            try { huidigeWaarde = new Date(huidigeWaarde).toISOString().slice(0, 16); } 
            catch (e) { console.warn(`Datumconversiefout voor DateTime ${veld.spInternalName}: ${huidigeWaarde}`, e); huidigeWaarde = ''; }
        } else if (veld.type === 'Date' && huidigeWaarde) {
            try { huidigeWaarde = new Date(huidigeWaarde).toISOString().split('T')[0]; }
            catch (e) { console.warn(`Datumconversiefout voor Date ${veld.spInternalName}: ${huidigeWaarde}`, e); huidigeWaarde = ''; }
        }

        const formVeldDiv = createFormField_new(veld, huidigeWaarde, `bewerk-${configKey}-${veld.naam.replace(/\s+/g, '_')}`);
        veldenContainer.appendChild(formVeldDiv);
    });

    modalElement.dataset.modus = 'bewerk';
    modalElement.dataset.configKey = configKey;
    modalElement.dataset.itemId = itemId;
    modalElement.classList.remove('hidden', 'opacity-0');
     requestAnimationFrame(() => {
        modalDialog.classList.remove('scale-95');
        modalDialog.classList.add('scale-100');
        modalElement.classList.add('opacity-100');
    });
}

function createFormField_new(veldConfig, currentValue, baseId) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'mb-4';

    const label = document.createElement('label');
    label.htmlFor = baseId;
    label.className = 'block text-sm font-medium text-gray-300 mb-1';
    label.textContent = veldConfig.label || veldConfig.naam;
    fieldDiv.appendChild(label);

    let inputElement;
    const inputBaseClasses = 'w-full p-2 rounded-md border border-gray-500 bg-gray-600 text-white focus:ring-blue-500 focus:border-blue-500';
    const readOnlyLookClasses = veldConfig.readOnlyInModal ? 'opacity-70 cursor-not-allowed bg-gray-500' : '';
    let finalInputClasses = `${inputBaseClasses} ${readOnlyLookClasses}`;

    switch (veldConfig.type) {
        case 'Text': case 'Email': case 'Tel': case 'Url':
            inputElement = document.createElement('input');
            inputElement.type = veldConfig.type.toLowerCase();
            inputElement.value = currentValue ?? '';
            break;
        case 'Number':
            inputElement = document.createElement('input');
            inputElement.type = 'number';
            inputElement.value = currentValue ?? '';
            break;
        case 'Note':
            inputElement = document.createElement('textarea');
            finalInputClasses = `${inputBaseClasses} ${readOnlyLookClasses} h-24 resize-y`;
            inputElement.value = currentValue ?? '';
            break;
        case 'Boolean':
            inputElement = document.createElement('select');
            finalInputClasses = `${inputBaseClasses} ${readOnlyLookClasses}`;
            ['true', 'false'].forEach(val => {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = val === 'true' ? 'Ja' : 'Nee';
                inputElement.appendChild(opt);
            });
            inputElement.value = currentValue !== null && typeof currentValue !== 'undefined' ? String(currentValue) : 'false';
            break;
        case 'DateTime':
            inputElement = document.createElement('input');
            inputElement.type = 'datetime-local';
            inputElement.value = currentValue ?? '';
            break;
        case 'Date':
            inputElement = document.createElement('input');
            inputElement.type = 'date';
            inputElement.value = currentValue ?? '';
            break;
        case 'Time':
            inputElement = document.createElement('input');
            inputElement.type = 'time';
            inputElement.value = currentValue ?? '';
            break;
        case 'Color':
            inputElement = document.createElement('input');
            inputElement.type = 'color';
            finalInputClasses = `${inputBaseClasses} ${readOnlyLookClasses} h-10 p-1`;
            inputElement.value = currentValue ?? '#000000';
            break;
        case 'User': case 'Lookup':
            inputElement = document.createElement('input');
            if (veldConfig.choices && Array.isArray(veldConfig.choices) && veldConfig.choices.length > 0) {
                inputElement = document.createElement('select');
                finalInputClasses = `${inputBaseClasses} ${readOnlyLookClasses}`;
                if (!veldConfig.isRequired || veldConfig.choices.length === 0) {
                    const emptyOpt = new Option("-- Selecteer --", "");
                    inputElement.add(emptyOpt);
                }
                veldConfig.choices.forEach(choice => inputElement.add(new Option(choice.value, choice.id)));
                inputElement.value = currentValue ?? "";
            } else { 
                inputElement.type = 'number'; 
                inputElement.placeholder = `Voer ID in voor ${veldConfig.label}`;
                inputElement.value = currentValue ?? '';
                const help = document.createElement('p');
                help.className = 'text-xs text-gray-400 mt-1';
                help.textContent = `ID invoeren. Een keuzelijst is aanbevolen.`;
                fieldDiv.appendChild(help);
            }
            break;
        case 'Choice':
            inputElement = document.createElement('select');
            finalInputClasses = `${inputBaseClasses} ${readOnlyLookClasses}`;
            if (!veldConfig.isRequired && (!veldConfig.choices || veldConfig.choices.length === 0)) { // Alleen lege optie als geen choices en niet verplicht
                 inputElement.add(new Option("-- Selecteer --", ""));
            } else if (!veldConfig.isRequired && veldConfig.choices && veldConfig.choices.length > 0) {
                 inputElement.add(new Option("-- Selecteer --", ""));
            }
            (veldConfig.choices || []).forEach(c => inputElement.add(new Option(c, c)));
            inputElement.value = currentValue ?? '';
            break;
        default:
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = `Onbekend type: ${veldConfig.type}. Waarde: ${currentValue ?? ''}`;
            veldConfig.readOnlyInModal = true; 
            finalInputClasses = `${inputBaseClasses} ${readOnlyLookClasses} opacity-70 cursor-not-allowed bg-gray-500`; // Forceer disabled look
    }

    inputElement.id = baseId;
    inputElement.name = veldConfig.spInternalName;
    inputElement.className = finalInputClasses;
    if (veldConfig.isRequired) inputElement.required = true;
    if (veldConfig.readOnlyInModal) {
        inputElement.readOnly = true;
        inputElement.disabled = true; 
    }
    
    fieldDiv.appendChild(inputElement);
    return fieldDiv;
}


async function handleNieuwOpslaan_new(configKey) {
    const configuratie = GeinitialiseerdeConfiguraties[configKey];
    const form = document.getElementById('modal-formulier');
    const modalStatus = document.getElementById('modal-status');
    modalStatus.textContent = '';
    modalStatus.className = 'mt-3 text-sm';

    const itemData = { '__metadata': { 'type': configuratie.itemEntityTypeFullName } };
    let isValid = true;
    const errors = [];

    for (const veld of (configuratie.velden || [])) {
        if (veld.readOnly || veld.spInternalName === 'Id' || veld.readOnlyInModal) continue;
        const inputElement = form.elements[veld.spInternalName];
        if (!inputElement) {
            console.warn(`Element voor ${veld.spInternalName} niet gevonden in formulier.`);
            continue;
        }
        let waarde = inputElement.value;

        if (veld.isRequired && (waarde === null || String(waarde).trim() === '')) {
            errors.push(`'${veld.label}' is verplicht.`);
            isValid = false;
        }

        if (veld.type === 'Boolean') waarde = (waarde === 'true');
        else if ((veld.type === 'User' || veld.type === 'Lookup' || veld.type === 'Number')) {
            if (String(waarde).trim() === '') {
                waarde = null; // Leeg is null, tenzij verplicht (dan al error)
            } else {
                const num = parseInt(waarde, 10);
                if (isNaN(num)) {
                    errors.push(`Ongeldige ID/nummer voor '${veld.label}'.`);
                    isValid = false;
                } else {
                    waarde = num;
                }
            }
        } else if ((veld.type === 'DateTime' || veld.type === 'Date')) {
            if (String(waarde).trim() === '') waarde = null;
            else waarde = new Date(waarde).toISOString();
        } else if (String(waarde).trim() === '') {
            waarde = null; 
        }
        
        if (waarde !== null) {
            if (veld.type === 'User' || veld.type === 'Lookup') {
                itemData[veld.spInternalName + 'Id'] = waarde;
            } else {
                itemData[veld.spInternalName] = waarde;
            }
        } else if (waarde === null && veld.sendNull === true) { // Expliciet null sturen
             if (veld.type === 'User' || veld.type === 'Lookup') {
                itemData[veld.spInternalName + 'Id'] = null;
            } else {
                itemData[veld.spInternalName] = null;
            }
        }
    }

    if (!isValid) {
        modalStatus.textContent = errors.join(' \n');
        modalStatus.classList.add('text-red-400');
        return;
    }

    ui.showGlobalSpinner(true, "Nieuw item opslaan...");
    console.log("Nieuw item opslaan:", JSON.stringify(itemData));

    try {
        const response = await fetch(`${SharePointSiteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(configuratie.sharepointLijstNaam)}')/items`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': SharePointRequestDigest
            },
            body: JSON.stringify(itemData)
        });
        if (!response.ok && response.status !== 201) {
            const err = await response.json().catch(()=>null);
            throw new Error(err?.error?.message?.value || `Serverfout bij opslaan (${response.status})`);
        }
        ui.toonNotificatie(`${configuratie.singularNoun || 'Item'} succesvol aangemaakt!`, "success");
        document.getElementById('modal-sluit-knop-x').click(); 
        await laadLijstGegevensVoorTab_new(configKey); 
    } catch (error) {
        console.error("Fout bij opslaan nieuw item:", error);
        modalStatus.textContent = `Fout: ${error.message}`;
        modalStatus.classList.add('text-red-400');
    } finally {
        ui.showGlobalSpinner(false);
    }
}

async function handleBewerkOpslaan_new(configKey, itemId) {
    const configuratie = GeinitialiseerdeConfiguraties[configKey];
    const form = document.getElementById('modal-formulier');
    const modalStatus = document.getElementById('modal-status');
    modalStatus.textContent = '';
    modalStatus.className = 'mt-3 text-sm';

    const itemData = { '__metadata': { 'type': configuratie.itemEntityTypeFullName } };
    let isValid = true;
    const errors = [];

     for (const veld of (configuratie.velden || [])) {
        if (veld.readOnly || veld.spInternalName === 'Id' || veld.readOnlyInModal) continue;
        const inputElement = form.elements[veld.spInternalName];
        if (!inputElement) continue;
        let waarde = inputElement.value;

        if (veld.isRequired && (waarde === null || String(waarde).trim() === '')) {
            errors.push(`'${veld.label}' is verplicht.`);
            isValid = false;
        }

        if (veld.type === 'Boolean') waarde = (waarde === 'true');
        else if ((veld.type === 'User' || veld.type === 'Lookup' || veld.type === 'Number')) {
            if (String(waarde).trim() === '') {
                 waarde = null;
            } else {
                const num = parseInt(waarde, 10);
                if (isNaN(num)) {
                    errors.push(`Ongeldige ID/nummer voor '${veld.label}'.`);
                    isValid = false;
                } else {
                    waarde = num;
                }
            }
        } else if ((veld.type === 'DateTime' || veld.type === 'Date')) {
            if (String(waarde).trim() === '') waarde = null;
            else waarde = new Date(waarde).toISOString();
        } else if (String(waarde).trim() === '') {
            if (veld.sendNull === true || !veld.isRequired) { // Stuur null als sendNull true is of als niet verplicht
                waarde = null;
            } else if (veld.isRequired) {
                // Blijft lege string, validatie hierboven vangt dit al af
            }
        }
        
        if (typeof waarde !== 'undefined' || veld.type === 'Boolean') { // Stuur altijd booleans
            if (waarde === null && !(veld.sendNull === true) && veld.type !== 'Boolean') {
                // Stuur geen null tenzij sendNull true is (behalve voor booleans)
            } else {
                 if (veld.type === 'User' || veld.type === 'Lookup') {
                    itemData[veld.spInternalName + 'Id'] = waarde; 
                } else {
                    itemData[veld.spInternalName] = waarde;
                }
            }
        }
    }

    if (!isValid) {
        modalStatus.textContent = errors.join(' \n');
        modalStatus.classList.add('text-red-400');
        return;
    }
    
    ui.showGlobalSpinner(true, "Wijzigingen opslaan...");
    console.log("Item bijwerken:", JSON.stringify(itemData));

    try {
        const response = await fetch(`${SharePointSiteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(configuratie.sharepointLijstNaam)}')/items(${itemId})`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': SharePointRequestDigest,
                'IF-MATCH': '*',
                'X-HTTP-Method': 'MERGE'
            },
            body: JSON.stringify(itemData)
        });
         if (!response.ok && response.status !== 204) { 
            const err = await response.json().catch(()=>null);
            throw new Error(err?.error?.message?.value || `Serverfout bij bijwerken (${response.status})`);
        }
        ui.toonNotificatie(`${configuratie.singularNoun || 'Item'} succesvol bijgewerkt!`, "success");
        document.getElementById('modal-sluit-knop-x').click();
        await laadLijstGegevensVoorTab_new(configKey);
    } catch (error) {
        console.error("Fout bij bijwerken item:", error);
        modalStatus.textContent = `Fout: ${error.message}`;
        modalStatus.classList.add('text-red-400');
    } finally {
        ui.showGlobalSpinner(false);
    }
}

async function bevestigVerwijdering_new(configKey, itemId, itemNaam) {
    const configuratie = GeinitialiseerdeConfiguraties[configKey];
    if (!configuratie) {
        ui.toonNotificatie("Kan item niet verwijderen: configuratie ontbreekt.", "error");
        return;
    }
    await ui.showConfirmationModal(
        `Weet u zeker dat u '${itemNaam}' (ID: ${itemId}) van ${configuratie.tabTitel} wilt verwijderen?`,
        async () => {
            ui.showGlobalSpinner(true, "Item verwijderen...");
            try {
                const response = await fetch(`${SharePointSiteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(configuratie.sharepointLijstNaam)}')/items(${itemId})`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose',
                        'X-RequestDigest': SharePointRequestDigest,
                        'IF-MATCH': '*',
                        'X-HTTP-Method': 'DELETE'
                    }
                });
                 if (!response.ok && response.status !== 204) {
                    const err = await response.json().catch(()=>null);
                    throw new Error(err?.error?.message?.value || `Serverfout bij verwijderen (${response.status})`);
                }
                ui.toonNotificatie(`${configuratie.singularNoun || 'Item'} succesvol verwijderd.`, "success");
                await laadLijstGegevensVoorTab_new(configKey);
            } catch (error) {
                console.error("Fout bij verwijderen item:", error);
                ui.toonNotificatie(`Fout bij verwijderen: ${error.message}`, "error");
            } finally {
                ui.showGlobalSpinner(false);
            }
        }
    );
}

// --- Utility Functies ---
const Utils = {
    getItemValue_new: (item, spInternalName, fieldType = 'Text') => {
        // Helper om geneste waarden (zoals Lookup/Title) of directe waarden op te halen.
        // Houdt ook rekening met User velden die soms een 'Name' ipv 'Title' property hebben.
        if (!item || typeof spInternalName !== 'string') return null;

        if (spInternalName.includes('/')) {
            const parts = spInternalName.split('/');
            let tempValue = item;
            for (const part of parts) {
                if (tempValue && typeof tempValue === 'object' && tempValue.hasOwnProperty(part)) {
                    tempValue = tempValue[part];
                } else {
                    return null; // Pad niet gevonden
                }
            }
            return tempValue;
        }
        
        // Voor directe User/Lookup velden, probeer de display waarde of ID
        if ((fieldType === 'User' || fieldType === 'Lookup') && item[spInternalName] && typeof item[spInternalName] === 'object') {
            return item[spInternalName].Title || item[spInternalName].Name || item[spInternalName].Id || null;
        }
        
        // Voor User/Lookup velden waar alleen de ID is opgeslagen (bv. MedewerkerID als Text)
        // Dit is meer een fallback als de $expand niet goed werkte of het veld een Text type heeft maar een ID bevat.
        if ((fieldType === 'User' || fieldType === 'Lookup') && typeof item[spInternalName] === 'number') {
            return item[spInternalName]; // Geef de ID terug
        }

        return item.hasOwnProperty(spInternalName) ? item[spInternalName] : null;
    }
};

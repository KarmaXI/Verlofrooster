/**
 * Werkschema met Start- en Eindtijden
 * 
 * Dit script implementeert een intuïtief werkschema-systeem gebaseerd op
 * start- en eindtijden in plaats van uren en dagdelen.
 */

// Standaard werktijden per type
const DEFAULT_TIMES = {
  'fulltime': { start: '09:00', end: '17:00' },
  'morning': { start: '09:00', end: '13:00' },
  'afternoon': { start: '13:00', end: '17:00' },
  'none': { start: '', end: '' }
};

/**
 * Initialiseer het werkschema tijden systeem
 */
function initTimeRangeWorkSchedule() {
  console.log('Initialiseren van werkschema tijden systeem...');
  
  // Vervang de bestaande werkschema formulieren met het nieuwe formaat
  replaceScheduleFormContent();
  
  // Stel event handlers in voor alle tijds-inputs en preset knoppen
  setupTimeInputHandlers();
}

/**
 * Vervang de inhoud van de werkschema formulieren
 */
function replaceScheduleFormContent() {
  // Vervang in beide formulieren: registratie en instellingen
  replaceFormContent('workDaysContainer');
  replaceFormContent('settingsWorkDaysContainer');
  
  // Stel de schema type handlers in
  setupScheduleTypeHandlers();
}

/**
 * Vervang de inhoud van één specifiek formulier
 */
function replaceFormContent(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Leeg de container
  container.innerHTML = '';
  
  // Voeg uitleg toe
  const explanation = document.createElement('p');
  explanation.textContent = 'Vul per dag je werktijden in. Het aantal uren wordt automatisch berekend.';
  container.appendChild(explanation);
  
  // Voeg schema presets toe
  const presetContainer = document.createElement('div');
  presetContainer.className = 'schedule-presets';
  presetContainer.innerHTML = `
    <label>Snelle instelling: </label>
    <button type="button" class="btn btn-secondary preset-btn" data-preset="fulltime">Fulltime (9-17)</button>
    <button type="button" class="btn btn-secondary preset-btn" data-preset="parttime-4">4 dagen (vr vrij)</button>
    <button type="button" class="btn btn-secondary preset-btn" data-preset="parttime-3">3 dagen (do-vr vrij)</button>
  `;
  container.appendChild(presetContainer);
  
  // Maak tabel voor werkdagen
  const table = document.createElement('table');
  table.className = 'workday-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Dag</th>
        <th>Starttijd</th>
        <th>Eindtijd</th>
        <th>Uren</th>
      </tr>
    </thead>
    <tbody>
      <tr class="workday-row" data-day="monday">
        <td>Maandag</td>
        <td><input type="time" class="form-control start-time" id="${containerId}-monday-start"></td>
        <td><input type="time" class="form-control end-time" id="${containerId}-monday-end"></td>
        <td><span class="hours-display" id="${containerId}-monday-hours">0</span> uur</td>
      </tr>
      <tr class="workday-row" data-day="tuesday">
        <td>Dinsdag</td>
        <td><input type="time" class="form-control start-time" id="${containerId}-tuesday-start"></td>
        <td><input type="time" class="form-control end-time" id="${containerId}-tuesday-end"></td>
        <td><span class="hours-display" id="${containerId}-tuesday-hours">0</span> uur</td>
      </tr>
      <tr class="workday-row" data-day="wednesday">
        <td>Woensdag</td>
        <td><input type="time" class="form-control start-time" id="${containerId}-wednesday-start"></td>
        <td><input type="time" class="form-control end-time" id="${containerId}-wednesday-end"></td>
        <td><span class="hours-display" id="${containerId}-wednesday-hours">0</span> uur</td>
      </tr>
      <tr class="workday-row" data-day="thursday">
        <td>Donderdag</td>
        <td><input type="time" class="form-control start-time" id="${containerId}-thursday-start"></td>
        <td><input type="time" class="form-control end-time" id="${containerId}-thursday-end"></td>
        <td><span class="hours-display" id="${containerId}-thursday-hours">0</span> uur</td>
      </tr>
      <tr class="workday-row" data-day="friday">
        <td>Vrijdag</td>
        <td><input type="time" class="form-control start-time" id="${containerId}-friday-start"></td>
        <td><input type="time" class="form-control end-time" id="${containerId}-friday-end"></td>
        <td><span class="hours-display" id="${containerId}-friday-hours">0</span> uur</td>
      </tr>
      <tr class="total-row">
        <td colspan="3"><strong>Totaal per week</strong></td>
        <td><strong><span id="${containerId}-total-hours">0</span> uur</strong></td>
      </tr>
    </tbody>
  `;
  container.appendChild(table);
  
  // Voeg stijlen toe indien nog niet aanwezig
  addRequiredStyles();
}

/**
 * Voeg event handlers toe aan alle tijds-inputs
 */
function setupTimeInputHandlers() {
  // Selecteer alle begin- en eindtijd inputs
  document.querySelectorAll('.start-time, .end-time').forEach(input => {
    input.addEventListener('change', function() {
      const row = this.closest('.workday-row');
      const day = row.getAttribute('data-day');
      const containerId = this.id.split('-')[0];
      
      // Vind de bijbehorende andere tijd-input
      const startInput = document.getElementById(`${containerId}-${day}-start`);
      const endInput = document.getElementById(`${containerId}-${day}-end`);
      
      // Bereken aantal uren alleen als beide tijden zijn ingevuld
      if (startInput.value && endInput.value) {
        const hours = calculateHours(startInput.value, endInput.value);
        document.getElementById(`${containerId}-${day}-hours`).textContent = hours.toFixed(1);
      } else {
        document.getElementById(`${containerId}-${day}-hours`).textContent = '0';
      }
      
      // Update totaal aantal uren
      updateTotalHours(containerId);
    });
  });
  
  // Stel event handlers in voor preset knoppen
  document.querySelectorAll('.preset-btn').forEach(button => {
    button.addEventListener('click', function() {
      const preset = this.getAttribute('data-preset');
      const containerId = this.closest('[id]').id;
      
      applyPreset(containerId, preset);
    });
  });
}

/**
 * Stel event handlers in voor de werkschema-type selects
 */
function setupScheduleTypeHandlers() {
  const scheduleSelects = [
    document.getElementById('workScheduleSelect'),
    document.getElementById('settingsWorkScheduleSelect')
  ];
  
  scheduleSelects.forEach(select => {
    if (!select) return;
    
    // Verwijder eerst eventueel bestaande event listeners door klonen
    const newSelect = select.cloneNode(true);
    select.parentNode.replaceChild(newSelect, select);
    
    // Voeg de nieuwe event listener toe
    newSelect.addEventListener('change', function() {
      const value = this.value;
      const containerId = this.closest('.modal-body')?.querySelector('[id^="workDays"]')?.id || 
                           this.closest('.tab-content')?.querySelector('[id^="settings"]')?.id;
      
      if (!containerId) return;
      
      // Pas de juiste preset toe op basis van de geselecteerde waarde
      applyPreset(containerId, value);
    });
  });
}

/**
 * Pas een vooraf ingesteld schema toe
 */
function applyPreset(containerId, preset) {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  
  switch (preset) {
    case "fulltime":
      // Alle dagen 9-17
      daysOfWeek.forEach(day => {
        setDayTimes(containerId, day, DEFAULT_TIMES.fulltime.start, DEFAULT_TIMES.fulltime.end);
      });
      break;
      
    case "parttime-4":
      // 4 dagen, vrijdag vrij
      daysOfWeek.slice(0, 4).forEach(day => {
        setDayTimes(containerId, day, DEFAULT_TIMES.fulltime.start, DEFAULT_TIMES.fulltime.end);
      });
      setDayTimes(containerId, 'friday', '', ''); // Leeg = vrij
      break;
      
    case "parttime-3":
      // 3 dagen, donderdag en vrijdag vrij
      daysOfWeek.slice(0, 3).forEach(day => {
        setDayTimes(containerId, day, DEFAULT_TIMES.fulltime.start, DEFAULT_TIMES.fulltime.end);
      });
      setDayTimes(containerId, 'thursday', '', '');
      setDayTimes(containerId, 'friday', '', '');
      break;
      
    case "morning":
      // Alleen ochtenden
      daysOfWeek.forEach(day => {
        setDayTimes(containerId, day, DEFAULT_TIMES.morning.start, DEFAULT_TIMES.morning.end);
      });
      break;
      
    case "afternoon":
      // Alleen middagen
      daysOfWeek.forEach(day => {
        setDayTimes(containerId, day, DEFAULT_TIMES.afternoon.start, DEFAULT_TIMES.afternoon.end);
      });
      break;
  }
}

/**
 * Stel de werk tijden in voor een specifieke dag
 */
function setDayTimes(containerId, day, startTime, endTime) {
  const startInput = document.getElementById(`${containerId}-${day}-start`);
  const endInput = document.getElementById(`${containerId}-${day}-end`);
  
  if (startInput && endInput) {
    startInput.value = startTime;
    endInput.value = endTime;
    
    // Trigger change event om uren te berekenen
    const event = new Event('change');
    endInput.dispatchEvent(event);
  }
}

/**
 * Bereken het aantal uren tussen twee tijden
 */
function calculateHours(startTime, endTime) {
  // Parse de tijden naar Date objecten
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  
  // Als eindtijd voor begintijd ligt, gaan we uit van een fout
  if (end < start) {
    return 0;
  }
  
  // Bereken het verschil in milliseconden
  const diff = end - start;
  
  // Converteer naar uren (met 1 decimaal)
  return Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
}

/**
 * Update het totaal aantal uren per week
 */
function updateTotalHours(containerId) {
  let totalHours = 0;
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  
  // Tel de uren van alle werkdagen op
  daysOfWeek.forEach(day => {
    const hoursElement = document.getElementById(`${containerId}-${day}-hours`);
    if (hoursElement) {
      totalHours += parseFloat(hoursElement.textContent) || 0;
    }
  });
  
  // Update het totaal in de UI
  const totalElement = document.getElementById(`${containerId}-total-hours`);
  if (totalElement) {
    totalElement.textContent = totalHours.toFixed(1);
  }
  
  // Update ook het weekelijks uren veld als het beschikbaar is
  const hoursField = document.querySelector(`#${containerId}`).closest('.modal-body')?.querySelector('#weeklyHoursInput') ||
                     document.querySelector(`#${containerId}`).closest('.tab-content')?.querySelector('#settingsWeeklyHoursInput');
  
  if (hoursField) {
    hoursField.value = Math.round(totalHours);
  }
}

/**
 * Voeg de benodigde CSS stijlen toe
 */
function addRequiredStyles() {
  // Check of de stijlen al bestaan
  if (document.getElementById('timerange-workschedule-styles')) return;
  
  const styleElement = document.createElement('style');
  styleElement.id = 'timerange-workschedule-styles';
  styleElement.textContent = `
    .workday-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    
    .workday-table th, 
    .workday-table td {
      padding: 0.5rem;
      border-bottom: 1px solid var(--color-gray-200);
    }
    
    .workday-table th {
      text-align: left;
      font-weight: 600;
      color: var(--color-gray-700);
    }
    
    .total-row {
      background-color: var(--color-gray-50);
    }
    
    .hours-display {
      font-weight: 500;
      min-width: 2em;
      display: inline-block;
    }
    
    .schedule-presets {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .preset-btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }
  `;
  
  document.head.appendChild(styleElement);
}

/**
 * Verzamel werkschema gegevens voor opslaan
 */
function collectWorkScheduleData(containerId) {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const workDays = {};
  let halfDayType = '';
  let halfDayOfWeek = '';
  
  daysOfWeek.forEach(day => {
    const startInput = document.getElementById(`${containerId}-${day}-start`);
    const endInput = document.getElementById(`${containerId}-${day}-end`);
    const hoursElement = document.getElementById(`${containerId}-${day}-hours`);
    
    if (startInput && endInput && hoursElement) {
      const startTime = startInput.value;
      const endTime = endInput.value;
      const hours = parseFloat(hoursElement.textContent) || 0;
      
      // Bepaal het type dag
      let type = 'none';
      if (startTime && endTime) {
        if (hours >= 7) {
          type = 'full';
        } else if (startTime <= '12:00' && endTime <= '13:00') {
          type = 'morning';
          // Als dit de eerste halve dag is die we tegenkomen
          if (!halfDayType) {
            halfDayType = 'VVO'; // Vaste vrije ochtend (omdat we 's ochtends werken)
            halfDayOfWeek = day;
          }
        } else if (startTime >= '12:00') {
          type = 'afternoon';
          // Als dit de eerste halve dag is die we tegenkomen
          if (!halfDayType) {
            halfDayType = 'VVM'; // Vaste vrije middag (omdat we 's middags werken)
            halfDayOfWeek = day;
          }
        } else {
          type = 'full'; // Default naar full als het geen duidelijk patroon volgt
        }
      }
      
      workDays[day] = {
        hours: hours,
        type: type,
        startTime: startTime,
        endTime: endTime
      };
    }
  });
  
  return {
    workDays: workDays,
    halfDayType: halfDayType,
    halfDayOfWeek: halfDayOfWeek,
    weeklyHours: parseFloat(document.getElementById(`${containerId}-total-hours`).textContent) || 0
  };
}

/**
 * Aangepaste handleSaveWorkSchedule functie die werkt met het nieuwe systeem
 */
function handleSaveWorkSchedule() {
  const employeeId = parseInt(document.getElementById('workScheduleEmployeeId').value);
  if (!employeeId) {
    showSnackbar("Medewerker ID ontbreekt", "error");
    return;
  }
  
  // Get values from form
  const scheduleData = collectWorkScheduleData('workDaysContainer');
  const workSchedule = document.getElementById('workScheduleSelect').value;
  const weeklyHours = Math.round(scheduleData.weeklyHours);
  
  // Update employee with work schedule data
  updateEmployeeWorkSchedule(employeeId, {
    weeklyHours: weeklyHours,
    workSchedule: workSchedule,
    workDays: JSON.stringify(scheduleData.workDays),
    halfDayType: scheduleData.halfDayType,
    halfDayOfWeek: scheduleData.halfDayOfWeek
  })
    .then(() => {
      // Update in local state
      const index = state.employees.findIndex(e => e.id === employeeId);
      if (index !== -1) {
        state.employees[index].weeklyHours = weeklyHours;
        state.employees[index].workSchedule = workSchedule;
        state.employees[index].workDays = scheduleData.workDays;
        state.employees[index].halfDayType = scheduleData.halfDayType;
        state.employees[index].halfDayOfWeek = scheduleData.halfDayOfWeek;
      }
      
      // Close modal and update UI
      document.getElementById('workScheduleModal').classList.remove("active");
      welcomeBox.style.display = "none";
      
      // Update UI components
      renderRoster();
      showSnackbar("Werkschema succesvol opgeslagen", "success");
    })
    .catch(error => {
      console.error("Fout bij opslaan werkschema:", error);
      showSnackbar("Fout bij opslaan werkschema", "error");
    });
}

/**
 * Functie die ook voor settings/profiel pagina kan worden gebruikt
 */
function handleSaveUserWorkSchedule() {
  // Verkrijg de medewerker gegevens
  const currentEmployee = state.employees.find(emp => 
    emp.email && state.currentUser && 
    emp.email.toLowerCase() === state.currentUser.email.toLowerCase()
  );
  
  if (!currentEmployee) {
    showSnackbar("Je moet eerst geregistreerd zijn als medewerker", "error");
    return;
  }
  
  // Get values from form
  const scheduleData = collectWorkScheduleData('settingsWorkDaysContainer');
  const workSchedule = document.getElementById('settingsWorkScheduleSelect').value;
  const weeklyHours = Math.round(scheduleData.weeklyHours);
  
  // Update employee with work schedule data
  updateEmployeeWorkSchedule(currentEmployee.id, {
    weeklyHours: weeklyHours,
    workSchedule: workSchedule,
    workDays: JSON.stringify(scheduleData.workDays),
    halfDayType: scheduleData.halfDayType,
    halfDayOfWeek: scheduleData.halfDayOfWeek
  })
    .then(() => {
      // Update state
      currentEmployee.weeklyHours = weeklyHours;
      currentEmployee.workSchedule = workSchedule;
      currentEmployee.workDays = scheduleData.workDays;
      currentEmployee.halfDayType = scheduleData.halfDayType;
      currentEmployee.halfDayOfWeek = scheduleData.halfDayOfWeek;
      
      // Sluit modal
      userSettingsModal.classList.remove("active");
      
      // Update UI
      showSnackbar("Werkschema succesvol bijgewerkt", "success");
    })
    .catch(error => {
      console.error("Fout bij bijwerken werkschema:", error);
      showSnackbar("Fout bij bijwerken werkschema", "error");
    });
}

// Initialiseer het systeem zodra de DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
  // Initialiseer na een korte vertraging om er zeker van te zijn dat alle andere scripts geladen zijn
  setTimeout(initTimeRangeWorkSchedule, 500);
  
  // Vervang de originele save handlers met onze nieuwe versies
  if (document.getElementById('saveWorkScheduleBtn')) {
    document.getElementById('saveWorkScheduleBtn').addEventListener('click', handleSaveWorkSchedule);
  }
  
  if (document.getElementById('saveUserSettingsBtn')) {
    // Bewaar de originele handler om andere instellingen te behouden
    const originalHandler = document.getElementById('saveUserSettingsBtn').onclick;
    
    document.getElementById('saveUserSettingsBtn').addEventListener('click', function(e) {
      // Als we op het werkschema tabblad zijn, gebruik dan onze handler
      if (document.querySelector('#work-schedule.active')) {
        e.preventDefault();
        handleSaveUserWorkSchedule();
      } else if (originalHandler) {
        // Anders, gebruik de originele handler
        originalHandler(e);
      }
    });
  }
});
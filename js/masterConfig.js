// SharePoint User Info tooltips functionality
// This file adds mouse-over functionality to employee avatars and names

// USER_INFO_CONFIG object voor cache van gebruikersgegevens
const USER_INFO_CONFIG = {
  userCache: {}, // Cache voor gebruikersinformatie
  cacheTime: 15 * 60 * 1000, // 15 minuten cache tijd
  lastUpdate: {}
};

// USER_SETTINGS_CONFIG object voor de gebruikersinstellingen
const USER_SETTINGS_CONFIG = {
  storageKey: "VerlofRooster_UserSettings_",
  defaultSettings: {
      defaultView: "month",
      defaultTeam: "all",
      showWeekends: true,
      notifications: {
          leaveRequests: true,
          leaveStatus: true,
          email: false
      },
      workSchedule: {
          weeklyHours: 40,
          type: "fulltime",
          workDays: {
              monday: { hours: 8, type: "full" },
              tuesday: { hours: 8, type: "full" },
              wednesday: { hours: 8, type: "full" },
              thursday: { hours: 8, type: "full" },
              friday: { hours: 8, type: "full" }
          }
      }
  }
};

// Create tooltip element that will show user details
function createUserTooltip() {
  const tooltip = document.createElement('div');
  tooltip.id = 'user-info-tooltip';
  tooltip.className = 'user-info-tooltip';
  tooltip.style.cssText = `
      position: absolute;
      z-index: 1000;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      max-width: 320px;
      display: none;
      font-size: 14px;
      line-height: 1.5;
  `;
  document.body.appendChild(tooltip);
  return tooltip;
}

// Fetch user information from SharePoint
async function fetchUserInfo(email) {
  // Check cache
  if (USER_INFO_CONFIG.userCache[email] && 
      Date.now() - USER_INFO_CONFIG.lastUpdate[email] < USER_INFO_CONFIG.cacheTime) {
      return USER_INFO_CONFIG.userCache[email];
  }

  try {
      // Use findEmployeeByEmail to get employee info instead of using People Manager
      const employee = findEmployeeByEmail(email);
      if (employee) {
          console.log(`Found employee in local state for ${email}:`, employee);
          
          const userInfo = {
              name: employee.name || email.split('@')[0],
              email: email,
              phone: 'Geen telefoonnummer',
              aboutMe: 'Informatie uit lokale medewerkers lijst',
              jobTitle: employee.function || 'Geen functietitel',
              department: employee.team || 'Geen afdeling',
              office: '',
              manager: '',
              skills: '',
              pictureUrl: getProfilePictureUrl(email)
          };
          
          // Cache the result
          USER_INFO_CONFIG.userCache[email] = userInfo;
          USER_INFO_CONFIG.lastUpdate[email] = Date.now();
          return userInfo;
      }
      
      console.log("Employee not found in local state, using fallback info");
      // Fallback if employee not found in local state
      const basicUserInfo = {
          email: email,
          name: email.split('@')[0], // Use first part of email as name
          phone: 'Geen telefoonnummer',
          aboutMe: 'Geen toegang tot profiel informatie',
          jobTitle: '',
          department: '',
          pictureUrl: null,
          _errorFetching: true // Flag to indicate this was a failed request
      };
      
      // Cache the result even when it fails to prevent repeated API calls
      USER_INFO_CONFIG.userCache[email] = basicUserInfo;
      USER_INFO_CONFIG.lastUpdate[email] = Date.now();
      return basicUserInfo;
  } catch (error) {
      console.error('Error fetching user info:', error);
      
      // Cache the failed result to avoid repeated requests
      const basicUserInfo = {
          email: email,
          name: email.split('@')[0], // Use first part of email as name
          phone: 'Geen telefoonnummer',
          aboutMe: 'Geen toegang tot profiel informatie',
          jobTitle: '',
          department: '',
          pictureUrl: null,
          _errorFetching: true // Flag to indicate this was a failed request
      };
      
      // Cache the result even when it fails to prevent repeated API calls
      USER_INFO_CONFIG.userCache[email] = basicUserInfo;
      USER_INFO_CONFIG.lastUpdate[email] = Date.now();
      return basicUserInfo;
  }
}

// Show tooltip with user information
async function showUserTooltip(email, element, event) {
  if (!email) return;
  
  const tooltip = document.getElementById('user-info-tooltip') || createUserTooltip();
  
  // Show loading state with a modern spinner
  tooltip.innerHTML = `
      <div class="tooltip-loading">
          <div class="tooltip-spinner"></div>
          <div>Gegevens ophalen...</div>
      </div>
  `;
  tooltip.style.display = 'block';
  
  // Position the tooltip near the cursor but not directly under it
  const offset = 15;
  tooltip.style.left = `${event.pageX + offset}px`;
  tooltip.style.top = `${event.pageY + offset}px`;
  
  try {
      // Fetch user information
      const userInfo = await fetchUserInfo(email);
      
      // Create modern tooltip content with all available information
      tooltip.innerHTML = `
          <div class="tooltip-header">
              <div class="tooltip-user-profile">
                  <div class="tooltip-avatar">
                      ${userInfo.pictureUrl ? 
                          `<img src="${userInfo.pictureUrl}" alt="${userInfo.name}" 
                           onerror="this.style.display='none'; this.parentNode.textContent='${generateInitials(userInfo.name)}';">` : 
                          generateInitials(userInfo.name)
                      }
                  </div>
                  <div class="tooltip-user-info">
                      <div class="tooltip-name">${userInfo.name}</div>
                      ${userInfo.jobTitle ? `<div class="tooltip-job-title">${userInfo.jobTitle}</div>` : ''}
                      ${userInfo.department ? `<div class="tooltip-department">${userInfo.department}</div>` : ''}
                  </div>
              </div>
          </div>
          <div class="tooltip-content">
              <div class="tooltip-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>${userInfo.phone}</span>
              </div>
              <div class="tooltip-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>${userInfo.email}</span>
              </div>
              ${userInfo.office ? `
              <div class="tooltip-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>${userInfo.office}</span>
              </div>` : ''}
              ${userInfo.aboutMe && userInfo.aboutMe !== 'Geen persoonlijke informatie beschikbaar' ? `
              <div class="tooltip-about">
                  <strong>Over mij:</strong>
                  <p>${userInfo.aboutMe}</p>
              </div>` : ''}
          </div>
      `;
      
      // Make sure tooltip doesn't go offscreen
      const tooltipRect = tooltip.getBoundingClientRect();
      if (tooltipRect.right > window.innerWidth) {
          tooltip.style.left = `${window.innerWidth - tooltipRect.width - 20}px`;
      }
      if (tooltipRect.bottom > window.innerHeight) {
          tooltip.style.top = `${window.innerHeight - tooltipRect.height - 20}px`;
      }
      
  } catch (error) {
      console.error('Error displaying user tooltip:', error);
      tooltip.innerHTML = `
          <div class="tooltip-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>Fout bij laden van gebruikersinformatie</div>
          </div>
      `;
  }
}

// Hide tooltip
function hideUserTooltip() {
  const tooltip = document.getElementById('user-info-tooltip');
  if (tooltip) {
      tooltip.style.display = 'none';
  }
}

// Add tooltip functionality to employee elements in the roster
function initializeUserTooltips() {
  // Add CSS for the tooltip
  const style = document.createElement('style');
  style.textContent = `
      .user-info-tooltip {
          transition: all 0.2s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .tooltip-loading {
          padding: 15px;
          text-align: center;
          color: #666;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
      }
      .tooltip-spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid var(--color-primary);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
      }
      @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }
      .tooltip-error {
          padding: 15px;
          color: var(--color-red);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
      }
      .tooltip-header {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
      }
      .tooltip-user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
      }
      .tooltip-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          overflow: hidden;
      }
      .tooltip-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
      }
      .tooltip-name {
          font-weight: 600;
          font-size: 16px;
          color: var(--color-gray-900);
      }
      .tooltip-job-title {
          color: var(--color-gray-700);
          font-size: 14px;
          margin-top: 3px;
      }
      .tooltip-department {
          color: var(--color-gray-600);
          font-size: 13px;
          margin-top: 2px;
      }
      .tooltip-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
      }
      .tooltip-item {
          display: flex;
          align-items: center;
          gap: 10px;
      }
      .tooltip-item svg {
          color: var(--color-gray-500);
          flex-shrink: 0;
      }
      .tooltip-about {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #eee;
      }
      .tooltip-about strong {
          color: var(--color-gray-700);
          font-size: 14px;
      }
      .tooltip-about p {
          margin: 8px 0 0 0;
          color: var(--color-gray-600);
          font-size: 13px;
          line-height: 1.5;
      }
  `;
  document.head.appendChild(style);
  
  // Add event listener to the roster container to use event delegation
  document.getElementById('teamRoster').addEventListener('mouseover', function(event) {
      // Check if hovering over employee name or avatar
      const employeeElement = event.target.closest('.employee-info');
      if (employeeElement) {
          const employeeName = employeeElement.querySelector('span').textContent;
          const employee = state.employees.find(emp => emp.name === employeeName);
          
          if (employee && employee.email) {
              showUserTooltip(employee.email, employeeElement, event);
          }
      }
  });
  
  // Hide tooltip when mouse leaves the employee element
  document.getElementById('teamRoster').addEventListener('mouseout', function(event) {
      const fromElement = event.target;
      const toElement = event.relatedTarget;
      
      // Check if mouse is leaving employee element and not entering its child
      if (fromElement.closest('.employee-info') && 
          (!toElement || !fromElement.closest('.employee-info').contains(toElement)) && 
          !toElement?.closest('#user-info-tooltip')) {
          hideUserTooltip();
      }
  });
  
  // Hide tooltip when clicking elsewhere
  document.addEventListener('click', function(event) {
      if (!event.target.closest('#user-info-tooltip') && 
          !event.target.closest('.employee-info')) {
          hideUserTooltip();
      }
  });
  
  // Prevent tooltip from hiding when interacting with it
  document.addEventListener('mouseover', function(event) {
      if (event.target.closest('#user-info-tooltip')) {
          const tooltip = document.getElementById('user-info-tooltip');
          if (tooltip) {
              tooltip.style.display = 'block';
          }
      }
  });
  
  console.log('User information tooltips initialized');
}

// Initialize tooltips once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait a short delay to ensure the roster is rendered
  setTimeout(initializeUserTooltips, 1000);
});

// Re-initialize tooltips after roster is updated
const originalRenderRoster = renderRoster;
renderRoster = function(...args) {
  const result = originalRenderRoster.apply(this, args);
  // Wait for DOM to update after rendering
  setTimeout(initializeUserTooltips, 500);
  return result;
};

// Gebruikersmenu functionaliteit
function loadUserSettings() {
  // Als gebruiker is ingelogd, laad instellingen uit localStorage
  if (!state.currentUser?.email) return USER_SETTINGS_CONFIG.defaultSettings;

  const storageKey = USER_SETTINGS_CONFIG.storageKey + state.currentUser.email;
  const storedSettings = localStorage.getItem(storageKey);
  
  if (!storedSettings) return USER_SETTINGS_CONFIG.defaultSettings;
  
  try {
      return JSON.parse(storedSettings);
  } catch (error) {
      console.error('Error loading user settings:', error);
      return USER_SETTINGS_CONFIG.defaultSettings;
  }
}

function saveUserSettings(settings) {
  if (!state.currentUser?.email) return;
  
  const storageKey = USER_SETTINGS_CONFIG.storageKey + state.currentUser.email;
  localStorage.setItem(storageKey, JSON.stringify(settings));
  
  // Pas instellingen direct toe
  applyUserSettings(settings);
}

function applyUserSettings(settings) {
  // Pas weergave-instellingen toe
  if (settings.defaultView !== state.currentView) {
      handleViewChange(settings.defaultView);
  }
  
  // Pas teamfilter toe als het niet al geselecteerd is en het geen "my-team" is
  // Voor "my-team" moet eerst het team van de huidige gebruiker bepaald worden
  if (settings.defaultTeam !== "my-team" && settings.defaultTeam !== state.filteredTeam) {
      handleTeamFilterChange(settings.defaultTeam);
  } else if (settings.defaultTeam === "my-team") {
      // Zoek het team van de huidige gebruiker
      const currentEmployee = state.employees.find(emp => {
          return emp.email && state.currentUser && 
                 emp.email.toLowerCase() === state.currentUser.email.toLowerCase();
      });
      
      if (currentEmployee?.team) {
          handleTeamFilterChange(currentEmployee.team);
      }
  }
  
  // Pas weekendweergave toe (hiervoor wordt nog niet standaard functionaliteit geboden,
  // we zouden deze nog moeten implementeren in de renderRoster functie)
}

function populateUserSettings() {
  // Laad huidige instellingen
  const settings = loadUserSettings();
  
  // Vul de formuliervelden in
  defaultViewSelect.value = settings.defaultView;
  showWeekendsCheckbox.checked = settings.showWeekends;
  
  // Vul teamfilter met huidige teams
  populateDefaultTeamSelect();
  defaultTeamSelect.value = settings.defaultTeam;
  
  // Notificatie instellingen
  notifyLeaveRequestsCheckbox.checked = settings.notifications.leaveRequests;
  notifyLeaveStatusCheckbox.checked = settings.notifications.leaveStatus;
  emailNotificationsCheckbox.checked = settings.notifications.email;
  
  // Werkschema instellingen
  settingsWeeklyHoursInput.value = settings.workSchedule.weeklyHours;
  settingsWorkScheduleSelect.value = settings.workSchedule.type;
}

function populateDefaultTeamSelect() {
  // Laad teams in defaultTeamSelect
  defaultTeamSelect.innerHTML = `
      <option value="all">Alle teams</option>
      <option value="my-team">Mijn team</option>
  `;
  
  // Voeg alle actieve teams toe
  state.teams
      .filter(team => team.active)
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(team => {
          const option = document.createElement('option');
          option.value = team.name;
          option.textContent = team.name;
          defaultTeamSelect.appendChild(option);
      });
}

// Calculate total hours between start and end time
function calculateTotalHours(startTime, endTime) {
  if (!startTime || !endTime) {
      return 0;
  }
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startTimeMinutes = startHour * 60 + startMinute;
  const endTimeMinutes = endHour * 60 + endMinute;
  
  // Calculate difference in minutes and convert to hours (rounded to 1 decimal)
  const diffMinutes = endTimeMinutes - startTimeMinutes;
  return Math.max(0, Math.round(diffMinutes / 6) / 10); // Round to 1 decimal
}

// Calculate day type (VVD, VVM, VVO, or VVF) based on hours and time
function calculateDayType(startTime, endTime, totalHours) {
  if (!startTime || !endTime || totalHours === 0) {
      return "VVD"; // Free day
  }
  
  if (totalHours < 6) {
      // Convert start time to hours for comparison
      const startHour = parseInt(startTime.split(':')[0]);
      
      if (startHour < 12) {
          return "VVM"; // Morning work (before noon)
      } else {
          return "VVO"; // Afternoon work (after noon)
      }
  }
  
  return "VVF"; // Full day (6+ hours)
}

// Get existing UrenPerWeek entry for employee
async function getUrenPerWeekForEmployee(employeeId) {
  try {
      console.log(`Fetching UrenPerWeek entry for employee ID: ${employeeId}`);
      
      // Make sure employeeId is a string since it's stored as text in SharePoint
      const employeeIdStr = employeeId.toString();
      
      // Use the correct API URL structure - ensure we use proper filtering for text values
      const url = `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.urenPerWeek.guid}')/items?$filter=${SP_CONFIG.lists.urenPerWeek.fields.medewerkerId} eq '${employeeIdStr}'`;
      console.log("Request URL:", url);
      
      const response = await fetch(url, {
          headers: {
              "Accept": "application/json;odata=verbose"
          }
      });
      
      if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error fetching UrenPerWeek: ${response.status}`, errorText);
          return null;
      }
      
      const data = await response.json();
      
      // Properly handle the case where data structure might be unexpected
      if (!data || !data.d || !Array.isArray(data.d.results)) {
          console.warn("Unexpected response format from UrenPerWeek query:", data);
          return null;
      }
      
      if (data.d.results.length === 0) {
          console.log("No UrenPerWeek entry found for employee ID:", employeeIdStr);
          return null;
      }
      
      console.log("Found UrenPerWeek entry:", data.d.results[0]);
      return data.d.results[0];
  } catch (error) {
      console.error("Error getting UrenPerWeek for employee:", error);
      return null;
  }
}

// Create new UrenPerWeek item
async function createUrenPerWeekItem(employeeId, workHoursData) {
  try {
      // First get a fresh form digest token
      const formDigest = await getFormDigest();
      
      const metadata = { 
          "__metadata": { 
              "type": `SP.Data.UrenPerWeekListItem` 
          } 
      };
      
      // Calculate all day totals and types
      const monday = workHoursData.workDays.monday;
      const tuesday = workHoursData.workDays.tuesday;
      const wednesday = workHoursData.workDays.wednesday;
      const thursday = workHoursData.workDays.thursday;
      const friday = workHoursData.workDays.friday;
      
      // Calculate total hours for each day
      const mondayTotal = monday.isFreeDay ? 0 : calculateTotalHours(monday.startTime, monday.endTime);
      const tuesdayTotal = tuesday.isFreeDay ? 0 : calculateTotalHours(tuesday.startTime, tuesday.endTime);
      const wednesdayTotal = wednesday.isFreeDay ? 0 : calculateTotalHours(wednesday.startTime, wednesday.endTime);
      const thursdayTotal = thursday.isFreeDay ? 0 : calculateTotalHours(thursday.startTime, thursday.endTime);
      const fridayTotal = friday.isFreeDay ? 0 : calculateTotalHours(friday.startTime, friday.endTime);
      
      // Convert all numerical values to strings since all fields are single line text fields
      const itemData = {
          ...metadata,
          [SP_CONFIG.lists.urenPerWeek.fields.medewerkerId]: employeeId.toString(),
          
          // Monday data
          [SP_CONFIG.lists.urenPerWeek.fields.maandagStart]: monday.isFreeDay ? "" : monday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.maandagEind]: monday.isFreeDay ? "" : monday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.maandagTotaal]: mondayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.maandagSoort]: calculateDayType(monday.startTime, monday.endTime, mondayTotal),
          
          // Tuesday data
          [SP_CONFIG.lists.urenPerWeek.fields.dinsdagStart]: tuesday.isFreeDay ? "" : tuesday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.dinsdagEind]: tuesday.isFreeDay ? "" : tuesday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.dinsdagTotaal]: tuesdayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.dinsdagSoort]: calculateDayType(tuesday.startTime, tuesday.endTime, tuesdayTotal),
          
          // Wednesday data
          [SP_CONFIG.lists.urenPerWeek.fields.woensdagStart]: wednesday.isFreeDay ? "" : wednesday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.woensdagEind]: wednesday.isFreeDay ? "" : wednesday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.woensdagTotaal]: wednesdayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.woensdagSoort]: calculateDayType(wednesday.startTime, wednesday.endTime, wednesdayTotal),
          
          // Thursday data
          [SP_CONFIG.lists.urenPerWeek.fields.donderdagStart]: thursday.isFreeDay ? "" : thursday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.donderdagEind]: thursday.isFreeDay ? "" : thursday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.donderdagTotaal]: thursdayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.donderdagSoort]: calculateDayType(thursday.startTime, thursday.endTime, thursdayTotal),
          
          // Friday data
          [SP_CONFIG.lists.urenPerWeek.fields.vrijdagStart]: friday.isFreeDay ? "" : friday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.vrijdagEind]: friday.isFreeDay ? "" : friday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.vrijdagTotaal]: fridayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.vrijdagSoort]: calculateDayType(friday.startTime, friday.endTime, fridayTotal)
      };

      console.log("Creating UrenPerWeek item:", itemData);
      
      // Fixed URL - removed the incorrect "web/" segment
      const response = await fetch(
          `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.urenPerWeek.guid}')/items`,
          {
              method: "POST",
              headers: {
                  "Accept": "application/json;odata=verbose",
                  "Content-Type": "application/json;odata=verbose",
                  "X-RequestDigest": formDigest
              },
              body: JSON.stringify(itemData)
          }
      );
      
      if (!response.ok) {
          const errorText = await response.text();
          console.error("Error creating UrenPerWeek item:", response.status, errorText);
          throw new Error(`Error creating UrenPerWeek item: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Successfully created UrenPerWeek item:", data);
      return data;
  } catch (error) {
      console.error("Failed to create UrenPerWeek item:", error);
      throw error;
  }
}

// Update existing UrenPerWeek item
async function updateUrenPerWeekItem(itemId, employeeId, workHoursData) {
  try {
      // First get a fresh form digest token
      const formDigest = await getFormDigest();
      
      console.log(`Updating UrenPerWeek item ID: ${itemId} for employee ID: ${employeeId}`);
      
      // Calculate for each day
      const monday = workHoursData.workDays.monday;
      const tuesday = workHoursData.workDays.tuesday;
      const wednesday = workHoursData.workDays.wednesday;
      const thursday = workHoursData.workDays.thursday;
      const friday = workHoursData.workDays.friday;
      
      // Calculate total hours for each day
      const mondayTotal = monday.isFreeDay ? 0 : calculateTotalHours(monday.startTime, monday.endTime);
      const tuesdayTotal = tuesday.isFreeDay ? 0 : calculateTotalHours(tuesday.startTime, tuesday.endTime);
      const wednesdayTotal = wednesday.isFreeDay ? 0 : calculateTotalHours(wednesday.startTime, wednesday.endTime);
      const thursdayTotal = thursday.isFreeDay ? 0 : calculateTotalHours(thursday.startTime, thursday.endTime);
      const fridayTotal = friday.isFreeDay ? 0 : calculateTotalHours(friday.startTime, friday.endTime);
      
      const metadata = { 
          "__metadata": { 
              "type": `SP.Data.UrenPerWeekListItem` 
          } 
      };
      
      const itemData = {
          ...metadata,
          // Monday data - convert numerical values to strings since all fields are single line text fields
          [SP_CONFIG.lists.urenPerWeek.fields.maandagStart]: monday.isFreeDay ? "" : monday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.maandagEind]: monday.isFreeDay ? "" : monday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.maandagTotaal]: mondayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.maandagSoort]: calculateDayType(monday.startTime, monday.endTime, mondayTotal),
          
          // Tuesday data
          [SP_CONFIG.lists.urenPerWeek.fields.dinsdagStart]: tuesday.isFreeDay ? "" : tuesday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.dinsdagEind]: tuesday.isFreeDay ? "" : tuesday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.dinsdagTotaal]: tuesdayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.dinsdagSoort]: calculateDayType(tuesday.startTime, tuesday.endTime, tuesdayTotal),
          
          // Wednesday data
          [SP_CONFIG.lists.urenPerWeek.fields.woensdagStart]: wednesday.isFreeDay ? "" : wednesday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.woensdagEind]: wednesday.isFreeDay ? "" : wednesday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.woensdagTotaal]: wednesdayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.woensdagSoort]: calculateDayType(wednesday.startTime, wednesday.endTime, wednesdayTotal),
          
          // Thursday data
          [SP_CONFIG.lists.urenPerWeek.fields.donderdagStart]: thursday.isFreeDay ? "" : thursday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.donderdagEind]: thursday.isFreeDay ? "" : thursday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.donderdagTotaal]: thursdayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.donderdagSoort]: calculateDayType(thursday.startTime, thursday.endTime, thursdayTotal),
          
          // Friday data
          [SP_CONFIG.lists.urenPerWeek.fields.vrijdagStart]: friday.isFreeDay ? "" : friday.startTime,
          [SP_CONFIG.lists.urenPerWeek.fields.vrijdagEind]: friday.isFreeDay ? "" : friday.endTime,
          [SP_CONFIG.lists.urenPerWeek.fields.vrijdagTotaal]: fridayTotal.toString(),
          [SP_CONFIG.lists.urenPerWeek.fields.vrijdagSoort]: calculateDayType(friday.startTime, friday.endTime, fridayTotal)
      };

      console.log("Updating UrenPerWeek item with data:", itemData);

      // Fixed URL - removed the incorrect "web/" segment
      const response = await fetch(
          `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.urenPerWeek.guid}')/items(${itemId})`,
          {
              method: "POST",
              headers: {
                  "Accept": "application/json;odata=verbose",
                  "Content-Type": "application/json;odata=verbose",
                  "X-RequestDigest": formDigest,
                  "IF-MATCH": "*",
                  "X-HTTP-Method": "MERGE"
              },
              body: JSON.stringify(itemData)
          }
      );
      
      if (!response.ok) {
          const errorText = await response.text();
          console.error("Error updating UrenPerWeek item:", response.status, errorText);
          throw new Error(`Error updating UrenPerWeek item: ${response.status}`);
      }
      
      console.log("Successfully updated UrenPerWeek item:", itemId);
      return true;
  } catch (error) {
      console.error("Exception updating UrenPerWeek item:", error);
      throw error;
  }
}

// Function to save employee work hours to UrenPerWeek list
async function saveEmployeeWorkHours(employeeId, workHoursData) {
  try {
      // Convert to string since all fields in UrenPerWeek are single line text fields
      const medewerkerId = employeeId.toString();
      console.log(`Saving work hours for employee with ID: ${medewerkerId}`);

      // Add isFreeDay property for days if not present (needed for the rest of the processing)
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      days.forEach(day => {
          if (!workHoursData.workDays[day].hasOwnProperty('isFreeDay')) {
              // If there's no start or end time, treat it as a free day
              workHoursData.workDays[day].isFreeDay = 
                  !workHoursData.workDays[day].startTime || 
                  !workHoursData.workDays[day].endTime;
          }
      });

      // Check if an entry already exists in the UrenPerWeek list
      const urenPerWeekListItem = await getUrenPerWeekForEmployee(medewerkerId);
      
      let result;
      if (urenPerWeekListItem) {
          // Update existing entry
          console.log(`Updating existing UrenPerWeek entry with ID: ${urenPerWeekListItem.Id}`);
          result = await updateUrenPerWeekItem(urenPerWeekListItem.Id, medewerkerId, workHoursData);
      } else {
          // Create new entry
          console.log(`Creating new UrenPerWeek entry for employee ID: ${medewerkerId}`);
          result = await createUrenPerWeekItem(medewerkerId, workHoursData);
      }
      
      console.log("UrenPerWeek save result:", result);
      return result;
  } catch (error) {
      console.error("Error saving employee work hours:", error);
      throw error;
  }
}

// Enhanced collectWorkHoursData function
function collectWorkHoursData() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const workDays = {};
  let totalWeeklyHours = 0;
  
  days.forEach(day => {
      const startInput = document.getElementById(`${day}-start`);
      const endInput = document.getElementById(`${day}-end`);
      const freeCheckbox = document.getElementById(`${day}-free`);
      
      const isFreeDay = freeCheckbox.checked;
      const startTime = isFreeDay ? "" : startInput.value;
      const endTime = isFreeDay ? "" : endInput.value;
      
      // Calculate hours for this day
      const hoursForDay = isFreeDay ? 0 : calculateTotalHours(startTime, endTime);
      totalWeeklyHours += hoursForDay;
      
      workDays[day] = {
          startTime,
          endTime,
          isFreeDay,
          hours: hoursForDay
      };
  });
  
  return {
      workDays,
      totalWeeklyHours
  };
}

function handleSaveUserSettings() {
  // Collect settings from the form
  const settings = {
      defaultView: defaultViewSelect.value,
      defaultTeam: defaultTeamSelect.value,
      showWeekends: showWeekendsCheckbox.checked,
      notifications: {
          leaveRequests: notifyLeaveRequestsCheckbox.checked,
          leaveStatus: notifyLeaveStatusCheckbox.checked,
          email: emailNotificationsCheckbox.checked
      },
      workSchedule: {
          weeklyHours: parseInt(settingsWeeklyHoursInput.value) || 40,
          type: settingsWorkScheduleSelect.value,
          workDays: {
              monday: {
                  startTime: document.getElementById("monday-start").value,
                  endTime: document.getElementById("monday-end").value
              },
              tuesday: {
                  startTime: document.getElementById("tuesday-start").value,
                  endTime: document.getElementById("tuesday-end").value
              },
              wednesday: {
                  startTime: document.getElementById("wednesday-start").value,
                  endTime: document.getElementById("wednesday-end").value
              },
              thursday: {
                  startTime: document.getElementById("thursday-start").value,
                  endTime: document.getElementById("thursday-end").value
              },
              friday: {
                  startTime: document.getElementById("friday-start").value,
                  endTime: document.getElementById("friday-end").value
              }
          }
      }
  };

  // Calculate total hours and day types
  const days = Object.keys(settings.workSchedule.workDays);
  let totalWeeklyHours = 0;

  days.forEach(day => {
      const { startTime, endTime } = settings.workSchedule.workDays[day];
      const totalHours = calculateTotalHours(startTime, endTime);
      totalWeeklyHours += totalHours;

      // Update the Totaal and Soort fields
      settings.workSchedule.workDays[day].totalHours = totalHours;
      settings.workSchedule.workDays[day].type = calculateDayType(startTime, endTime, totalHours);

      // Safely update the calculated hours and type on the form
      const totalElement = document.getElementById(`${day}-total`);
      const typeElement = document.getElementById(`${day}-type`);

      if (totalElement) {
          totalElement.textContent = `${totalHours} uur`;
      } else {
          console.warn(`Element with id '${day}-total' not found.`);
      }

      if (typeElement) {
          typeElement.textContent = settings.workSchedule.workDays[day].type;
      } else {
          console.warn(`Element with id '${day}-type' not found.`);
      }
  });

  // Update the total weekly hours on the form
  const weeklyTotalElement = document.getElementById("weekly-total");
  if (weeklyTotalElement) {
      weeklyTotalElement.textContent = `${totalWeeklyHours} uur`;
  } else {
      console.warn("Element with id 'weekly-total' not found.");
  }

  // Save the settings
  saveUserSettings(settings);

  // Save to the UrenPerWeek list
  if (state.isRegistered) {
      const employee = state.employees.find(emp => 
          emp.email && state.currentUser && 
          emp.email.toLowerCase() === state.currentUser.email.toLowerCase()
      );

      if (employee) {
          saveEmployeeWorkHours(employee.id, settings.workSchedule)
              .then(() => {
                  showSnackbar('Werkschema bijgewerkt', 'success');
              })
              .catch(error => {
                  console.error('Fout bij bijwerken werkschema:', error);
                  showSnackbar('Fout bij bijwerken werkschema', 'error');
              });
      }
  }

  // Close the modal
  userSettingsModal.classList.remove("active");

  // Show confirmation
  showSnackbar('Instellingen opgeslagen', 'success');
}

function getHalfDayType(workDays) {
  // Zoek naar een dag met type "morning" of "afternoon"
  for (const [day, details] of Object.entries(workDays)) {
      if (details.type === 'morning') return 'morning';
      if (details.type === 'afternoon') return 'afternoon';
  }
  return '';
}

function getHalfDayOfWeek(workDays) {
  // Zoek naar een dag met type "morning" of "afternoon" en geef de dag terug
  const dayMapping = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday'
  };
  
  for (const [day, details] of Object.entries(workDays)) {
      if (details.type === 'morning' || details.type === 'afternoon') {
          return dayMapping[day];
      }
  }
  return '';
}

function switchSettingsTab(tabId) {
  // Update active tab
  settingsTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabId) {
          tab.classList.add('active');
      } else {
          tab.classList.remove('active');
      }
  });
  
  // Update visible content
  settingsTabContents.forEach(content => {
      if (content.id === tabId) {
          content.classList.add('active');
          
          // If this is the work schedule tab, initialize the UI
          if (tabId === 'work-schedule') {
              try {
                  // Use the new function in werkschema-tijden.js to initialize the settings form
                  if (typeof initSettingsWorkSchedule === 'function') {
                      initSettingsWorkSchedule();
                  } else {
                      console.error('initSettingsWorkSchedule function is not defined');
                  }
              } catch (e) {
                  console.error('Error initializing work schedule UI:', e);
              }
          }
      } else {
          content.classList.remove('active');
      }
  });
}

function initWorkScheduleUI() {
  // Clone the work schedule UI from the registration modal into the settings
  const workScheduleContainer = document.getElementById('settingsWorkDaysContainer');
  
  if (!workScheduleContainer) {
      console.error('Work schedule container not found in settings');
      return;
  }
  
  // Clear existing content
  workScheduleContainer.innerHTML = '';
  
  // Copy the work days UI from the registration modal
  const workDaysContainer = document.getElementById('workDaysContainer');
  if (workDaysContainer) {
      // Create a clone of the UI
      const workDaysClone = workDaysContainer.cloneNode(true);
      
      // Update the clone's content to match our settings needs
      workScheduleContainer.appendChild(workDaysClone);
      
      // Get the current work schedule data for the logged-in user
      if (state.isRegistered && state.currentUser) {
          const employee = state.employees.find(emp => 
              emp.email && state.currentUser && 
              emp.email.toLowerCase() === state.currentUser.email.toLowerCase()
          );
          
          if (employee) {
              populateWorkScheduleUI(employee);
          }
      }
      
      // Initialize work hours UI listeners
      initWorkHoursUI();
  }
}

function populateWorkScheduleUI(employee) {
  // Fill the work schedule UI with data from the employee
  if (!employee) return;
  
  // Set weekly hours
  document.getElementById('weeklyHoursInput').value = employee.weeklyHours || 40;
  
  // Set work schedule type
  document.getElementById('workScheduleSelect').value = employee.workSchedule || 'fulltime';
  
  // Work days setup
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  let workDays = {};
  
  try {
      if (typeof employee.workDays === 'string') {
          workDays = JSON.parse(employee.workDays);
      } else if (typeof employee.workDays === 'object') {
          workDays = employee.workDays;
      }
  } catch (error) {
      console.error('Error parsing workDays:', error);
  }
  
  // For each day, set the UI values based on the employee data
  days.forEach(day => {
      const dayData = workDays[day] || {};
      const startTimeInput = document.getElementById(`${day}-start`);
      const endTimeInput = document.getElementById(`${day}-end`);
      const freeDayCheckbox = document.getElementById(`${day}-free`);
      
      if (startTimeInput && dayData.startTime) startTimeInput.value = dayData.startTime;
      if (endTimeInput && dayData.endTime) endTimeInput.value = dayData.endTime;
      if (freeDayCheckbox) freeDayCheckbox.checked = dayData.isFreeDay || false;
      
      // Update the display
      if (startTimeInput && endTimeInput && freeDayCheckbox) {
          updateWorkHoursDisplay(day, freeDayCheckbox.checked, startTimeInput.value, endTimeInput.value);
      }
  });
  
  // Update total weekly hours
  updateTotalWeeklyHours();
}
// Import the configuration from masterConfig.js
const SP_CONFIG = window.SP_CONFIG || {};

// App state
const state = {
  currentUser: null,
  isAdmin: false,
  employees: [],
  teams: [],
  reasons: [],
  leaves: [],
  workSchedules: [], // New array to store work schedules
  seniors: [],
  currentDate: new Date(),
  currentView: "month", // "week", "month", "quarter"
  filteredTeam: "all",
  searchQuery: "",
  isLoading: true,
  isRegistered: false,
  // Day indicator colors now coming from masterConfig
};

// DOM Elements
const userInfo = document.getElementById("userInfo");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const adminDropdown = document.getElementById("adminDropdown");
const welcomeBox = document.getElementById("welcomeBox");

// Verlof Modal
const leaveModal = document.getElementById("leaveModal");
const leaveModalTitle = document.getElementById("leaveModalTitle");
const closeLeaveModalBtn = document.getElementById("closeLeaveModalBtn");
const employeeSelect = document.getElementById("employeeSelect");
const reasonSelect = document.getElementById("reasonSelect");
const startDateInput = document.getElementById("startDateInput");
const endDateInput = document.getElementById("endDateInput");
const descriptionInput = document.getElementById("descriptionInput");
const workdaysOnlyCheckbox = document.getElementById("workdaysOnlyCheckbox");
const statusField = document.getElementById("statusField");
const statusSelect = document.getElementById("statusSelect");
const leaveIdInput = document.getElementById("leaveIdInput");
const cancelLeaveBtn = document.getElementById("cancelLeaveBtn");
const deleteLeaveBtn = document.getElementById("deleteLeaveBtn");
const saveLeaveBtn = document.getElementById("saveLeaveBtn");

// Registratie Modal
const registerModal = document.getElementById("registerModal");
const registerBtn = document.getElementById("registerBtn");
const closeRegisterModalBtn = document.getElementById("closeRegisterModalBtn");
const registerNameInput = document.getElementById("registerNameInput");
const registerEmailInput = document.getElementById("registerEmailInput");
const registerTeamSelect = document.getElementById("registerTeamSelect");
const registerFunctionInput = document.getElementById("registerFunctionInput");
const cancelRegisterBtn = document.getElementById("cancelRegisterBtn");
const saveRegisterBtn = document.getElementById("saveRegisterBtn");

// Verlofreden Modal
const reasonModal = document.getElementById("reasonModal");
const reasonModalTitle = document.getElementById("reasonModalTitle");
const closeReasonModalBtn = document.getElementById("closeReasonModalBtn");
const reasonNameInput = document.getElementById("reasonNameInput");
const reasonColorInput = document.getElementById("reasonColorInput");
const colorPicker = document.getElementById("colorPicker");
const countAsLeaveCheckbox = document.getElementById("countAsLeaveCheckbox");
const requiresApprovalCheckbox = document.getElementById(
  "requiresApprovalCheckbox"
);
const reasonIdInput = document.getElementById("reasonIdInput");
const cancelReasonBtn = document.getElementById("cancelReasonBtn");
const deleteReasonBtn = document.getElementById("deleteReasonBtn");
const saveReasonBtn = document.getElementById("saveReasonBtn");

// Verlofredenen Manager Modal
const reasonsManagerModal = document.getElementById("reasonsManagerModal");
const closeReasonsManagerModalBtn = document.getElementById(
  "closeReasonsManagerModalBtn"
);
const reasonsTable = document.getElementById("reasonsTable");
const reasonsSearchInput = document.getElementById("reasonsSearchInput");
const closeReasonsManagerBtn = document.getElementById(
  "closeReasonsManagerBtn"
);
const teamColorInput = document.getElementById("teamColorInput");
const teamColorPicker = document.getElementById("teamColorPicker");
const teamActiveCheckbox = document.getElementById("teamActiveCheckbox");
const teamIdInput = document.getElementById("teamIdInput");
const cancelTeamBtn = document.getElementById("cancelTeamBtn");
const deleteTeamBtn = document.getElementById("deleteTeamBtn");
const saveTeamBtn = document.getElementById("saveTeamBtn");

// Medewerkers Modal
const employeesModal = document.getElementById("employeesModal");
const closeEmployeesModalBtn = document.getElementById(
  "closeEmployeesModalBtn"
);
const employeesTable = document.getElementById("employeesTable");
const employeesSearchInput = document.getElementById("employeesSearchInput");
const closeEmployeesBtn = document.getElementById("closeEmployeesBtn");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const backToListBtn = document.getElementById("backToListBtn");
const editEmployeeNameInput = document.getElementById("editEmployeeNameInput");
const editEmployeeEmailInput = document.getElementById(
  "editEmployeeEmailInput"
);
const editEmployeeTeamSelect = document.getElementById(
  "editEmployeeTeamSelect"
);
const editEmployeeFunctionInput = document.getElementById(
  "editEmployeeFunctionInput"
);
const editEmployeeActiveCheckbox = document.getElementById(
  "editEmployeeActiveCheckbox"
);
const editEmployeeIdInput = document.getElementById("editEmployeeIdInput");
const deleteEmployeeBtn = document.getElementById("deleteEmployeeBtn");
const saveEmployeeBtn = document.getElementById("saveEmployeeBtn");

// UI Elements
const addLeaveBtn = document.getElementById("addLeaveBtn");
const addTeamBtn = document.getElementById("addTeamBtn");
const addReasonBtn = document.getElementById("addReasonBtn");
const manageEmployeesBtn = document.getElementById("manageEmployeesBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const todayBtn = document.getElementById("todayBtn");
const currentPeriod = document.getElementById("currentPeriod");
const viewBtns = document.querySelectorAll(".view-btn");
const teamFilter = document.getElementById("teamFilter");
const employeeSearch = document.getElementById("employeeSearch");
const teamRoster = document.getElementById("teamRoster");
const loadingIndicator = document.getElementById("loadingIndicator");
const legendContainer = document.getElementById("legendContainer");
const exportBtn = document.getElementById("exportBtn");
const snackbar = document.getElementById("snackbar");

// Tab elementen
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const employeesListFooter = document.getElementById("employees-list-footer");
const employeeEditFooter = document.getElementById("employee-edit-footer");

// DOM References for Seniors Modal
const seniorsModal = document.getElementById("seniorsModal");
const closeSeniorsModalBtn = document.getElementById("closeSeniorsModalBtn");
const seniorTeamSelect = document.getElementById("seniorTeamSelect");
const seniorsTable = document.getElementById("seniorsTable");
const addSeniorForm = document.getElementById("addSeniorForm");
const seniorEmployeeInput = document.getElementById("seniorEmployeeInput");
const seniorEmployeeResults = document.getElementById("seniorEmployeeResults");
const seniorEmployeeIdInput = document.getElementById("seniorEmployeeIdInput");
const addSeniorBtn = document.getElementById("addSeniorBtn");
const closeSeniorsFormBtn = document.getElementById("closeSeniorsFormBtn");
const manageSeniorsBtn = document.getElementById("manageSeniorsBtn");

// Helper-functies
function formatDate(date, options = {}) {
  return date.toLocaleDateString("nl-NL", options);
}

function formatSPDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString);
}

function formatDateForSharePoint(date) {
  return date.toISOString();
}

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  // Zorg ervoor dat we tijdzone-issues vermijden door alleen datum te gebruiken
  currentDate.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = zondag, 6 = zaterdag
}

function getFormDigest() {
  return fetch(`${SP_CONFIG.siteUrl}/_api/contextinfo`, {
    method: "POST",
    headers: {
      Accept: "application/json;odata=verbose",
    },
  })
    .then((response) => response.json())
    .then((data) => data.d.GetContextWebInformation.FormDigestValue);
}

function generateInitials(name) {
  if (!name) return "??";
  const nameParts = name.split(" ");
  if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
}

// Get profile picture URL from SharePoint
function getProfilePictureUrl(userEmail) {
  if (!userEmail) return null;

  // SharePoint profile picture URL format
  return `${
    SP_CONFIG.siteUrl
  }/_layouts/15/userphoto.aspx?size=M&accountname=${encodeURIComponent(
    userEmail
  )}`;
}

// Update avatar to use profile picture
function updateUserAvatar(element, name, email) {
  if (!element) return;

  const pictureUrl = getProfilePictureUrl(email);

  if (pictureUrl) {
    // Test if image exists and is accessible
    const img = new Image();
    img.onload = function () {
      element.innerHTML = `<img src="${pictureUrl}" alt="${name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    };
    img.onerror = function () {
      // Fallback to initials if image fails to load
      element.textContent = generateInitials(name);
    };
    img.src = pictureUrl;
  } else {
    // Use initials as fallback
    element.textContent = generateInitials(name);
  }
}

// Gebruiker en rechten
function getCurrentUser() {
  return fetch(`${SP_CONFIG.apiUrl}/currentuser?$expand=groups`, {
    headers: {
      Accept: "application/json;odata=verbose",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const user = {
        id: data.d.Id,
        name: data.d.Title,
        email: data.d.Email,
        loginName: data.d.LoginName,
        groups: data.d.Groups.results.map((group) => group.Title),
      };

      // Controleer of gebruiker admin rechten heeft
      user.isAdmin = user.groups.some((group) =>
        SP_CONFIG.adminGroups.includes(group)
      );

      return user;
    })
    .catch((error) => {
      console.error("Fout bij ophalen gebruikersgegevens:", error);
      return null;
    });
}

function checkUserRegistration(user) {
  if (!user) return Promise.resolve(false);

  return fetchEmployees()
    .then((employees) => {
      const isRegistered = employees.some(
        (emp) =>
          emp.email && emp.email.toLowerCase() === user.email.toLowerCase()
      );

      return isRegistered;
    })
    .catch((error) => {
      console.error("Fout bij controleren registratie:", error);
      return false;
    });
}

// API calls
function fetchEmployees() {
  const fields = SP_CONFIG.lists.medewerkers.fields;
  return fetch(
    `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.medewerkers.guid}')/items?$select=ID,${fields.naam},${fields.email},${fields.team},${fields.functie},${fields.actief},${fields.horen},${fields.weeklyHours},${fields.workSchedule},${fields.workDays},${fields.halfDayType},${fields.halfDayOfWeek}`,
    {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data.d.results.map((item) => {
        // Parse workDays if it exists
        let workDays = {};
        try {
          if (item[fields.workDays]) {
            workDays = JSON.parse(item[fields.workDays]);
          }
        } catch (e) {
          console.error("Error parsing workDays:", e);
        }

        return {
          id: item.ID,
          name: item[fields.naam],
          email: item[fields.email] || "",
          team: item[fields.team] || "",
          function: item[fields.functie] || "",
          active: item[fields.actief] === "true" || item[fields.actief] === true,
          horen: item[fields.horen] === "true" || item[fields.horen] === true,
          weeklyHours: item[fields.weeklyHours] || 40,
          workSchedule: item[fields.workSchedule] || "fulltime",
          workDays: workDays,
          halfDayType: item[fields.halfDayType] || "",
          halfDayOfWeek: item[fields.halfDayOfWeek] || "",
        };
      });
    });
}

function fetchTeams() {
  const fields = SP_CONFIG.lists.teams.fields;
  return fetch(
    `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.teams.guid}')/items?$select=ID,${fields.naam},${fields.teamleider},${fields.teamleiderId},${fields.kleur},${fields.actief}`,
    {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data.d.results.map((item) => ({
        id: item.ID,
        name: item[fields.naam],
        leader: item[fields.teamleider] || "",
        leaderId: item[fields.teamleiderId] || null,
        color: item[fields.kleur] || "#3b82f6",
        active: item[fields.actief] === "true" || item[fields.actief] === true,
      }));
    });
}

function fetchReasons() {
  const fields = SP_CONFIG.lists.verlofredenen.fields;
  return fetch(
    `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.verlofredenen.guid}')/items?$select=ID,${fields.naam},${fields.kleur},${fields.verlofdag},${fields.goedgekeurd}`,
    {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data.d.results.map((item) => ({
        id: item.ID,
        name: item[fields.naam],
        color: item[fields.kleur] || "#3b82f6",
        countAsLeave:
          item[fields.verlofdag] === "true" || item[fields.verlofdag] === true,
        requiresApproval:
          item[fields.goedgekeurd] === "true" ||
          item[fields.goedgekeurd] === true,
      }));
    });
}

function fetchLeaves() {
  const fields = SP_CONFIG.lists.verlof.fields;
  return fetch(
    `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.verlof.guid}')/items?$select=ID,${fields.medewerker},${fields.reden},${fields.startDatum},${fields.eindDatum},${fields.omschrijving},${fields.status},${fields.aanvragtijdstip}`,
    {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data.d.results.map((item) => ({
        id: item.ID,
        employee: item[fields.medewerker],
        reason: item[fields.reden],
        startDate: formatSPDate(item[fields.startDatum]),
        endDate: formatSPDate(item[fields.eindDatum]),
        description: item[fields.omschrijving] || "",
        status: item[fields.status] || "Aangevraagd",
        requestTime: formatSPDate(item[fields.aanvragtijdstip]),
      }));
    });
}

function createEmployee(employeeData) {
  const fields = SP_CONFIG.lists.medewerkers.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.MedewerkersListItem`,
        },
      };

      payload[fields.naam] = employeeData.name;
      payload[fields.email] = employeeData.email;
      payload[fields.team] = employeeData.team;
      payload[fields.functie] = employeeData.function;
      payload[fields.actief] = employeeData.active;
      payload[fields.horen] = employeeData.horen;

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.medewerkers.guid}')/items`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.d;
    });
}

function updateEmployee(employeeData) {
  const fields = SP_CONFIG.lists.medewerkers.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.MedewerkersListItem`,
        },
      };

      payload[fields.naam] = employeeData.name;
      payload[fields.email] = employeeData.email;
      payload[fields.team] = employeeData.team;
      payload[fields.functie] = employeeData.function;
      payload[fields.actief] = employeeData.active;
      payload[fields.horen] = employeeData.horen;

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.medewerkers.guid}')/items(${employeeData.id})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "MERGE",
            "If-Match": "*",
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response;
    });
}

function deleteEmployee(employeeId) {
  return getFormDigest()
    .then((formDigest) => {
      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.medewerkers.guid}')/items(${employeeId})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "DELETE",
            "If-Match": "*",
          },
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response;
    });
}

function createTeam(teamData) {
  const fields = SP_CONFIG.lists.teams.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.TeamsListItem`,
        },
      };

      payload[fields.naam] = teamData.name;
      payload[fields.teamleider] = teamData.leader || null;
      payload[fields.kleur] = teamData.color;
      payload[fields.actief] = teamData.active;

      // Only include TeamleiderId if it's a valid non-empty value
      // and convert it to a string since SharePoint expects Edm.String
      if (teamData.leaderId && !isNaN(parseInt(teamData.leaderId))) {
        // Debug logging
        console.log("Adding TeamleiderId:", teamData.leaderId);
        payload[fields.teamleiderId] = String(teamData.leaderId);
      }

      console.log("Team payload:", JSON.stringify(payload));

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.teams.guid}')/items`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        console.error("Failed with status:", response.status);
        return response.text().then((text) => {
          console.error("Error response:", text);
          throw new Error(`Status: ${response.status}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      return data.d;
    });
}

function updateTeam(teamData) {
  const fields = SP_CONFIG.lists.teams.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.TeamsListItem`,
        },
      };

      payload[fields.naam] = teamData.name;
      payload[fields.teamleider] = teamData.leader || null;
      payload[fields.kleur] = teamData.color;
      payload[fields.actief] = String(teamData.active); // Convert boolean to string

      // Only include TeamleiderId if it's a valid non-empty value
      if (teamData.leaderId && !isNaN(parseInt(teamData.leaderId))) {
        // Convert to string - SharePoint expects string values for this field
        payload[fields.teamleiderId] = String(teamData.leaderId);
        console.log(
          "Adding TeamleiderId for update (as string):",
          String(teamData.leaderId)
        );
      }

      console.log("Team update payload:", JSON.stringify(payload));

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.teams.guid}')/items(${teamData.id})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "MERGE",
            "If-Match": "*",
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        console.error("Failed with status:", response.status);
        return response.text().then((text) => {
          console.error("Error response:", text);
          throw new Error(`Status: ${response.status}`);
        });
      }
      return response;
    });
}

function deleteTeam(teamId) {
  return getFormDigest()
    .then((formDigest) => {
      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.teams.guid}')/items(${teamId})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "DELETE",
            "If-Match": "*",
          },
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response;
    });
}

function createReason(reasonData) {
  const fields = SP_CONFIG.lists.verlofredenen.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.VerlofredenenListItem`,
        },
      };

      payload[fields.naam] = reasonData.name;
      payload[fields.kleur] = reasonData.color;
      payload[fields.verlofdag] = reasonData.countAsLeave;
      payload[fields.goedgekeurd] = reasonData.requiresApproval;

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.verlofredenen.guid}')/items`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.d;
    });
}

function updateReason(reasonData) {
  const fields = SP_CONFIG.lists.verlofredenen.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.VerlofredenenListItem`,
        },
      };

      payload[fields.naam] = reasonData.name;
      payload[fields.kleur] = reasonData.color;
      payload[fields.verlofdag] = reasonData.countAsLeave;
      payload[fields.goedgekeurd] = reasonData.requiresApproval;

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.verlofredenen.guid}')/items(${reasonData.id})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "MERGE",
            "If-Match": "*",
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response;
    });
}

function deleteReason(reasonId) {
  return getFormDigest()
    .then((formDigest) => {
      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.verlofredenen.guid}')/items(${reasonId})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "DELETE",
            "If-Match": "*",
          },
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response;
    });
}

function createLeave(leaveData) {
  const fields = SP_CONFIG.lists.verlof.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.VerlofListItem`,
        },
      };

      payload[fields.medewerker] = leaveData.employee;
      payload[fields.reden] = leaveData.reason;
      payload[fields.startDatum] = formatDateForSharePoint(leaveData.startDate);
      payload[fields.eindDatum] = formatDateForSharePoint(leaveData.endDate);
      payload[fields.omschrijving] = leaveData.description;
      payload[fields.status] = leaveData.status;
      payload[fields.aanvragtijdstip] = formatDateForSharePoint(new Date());

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.verlof.guid}')/items`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.d;
    });
}

function updateLeave(leaveData) {
  const fields = SP_CONFIG.lists.verlof.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.VerlofListItem`,
        },
      };

      payload[fields.medewerker] = leaveData.employee;
      payload[fields.reden] = leaveData.reason;
      payload[fields.startDatum] = formatDateForSharePoint(leaveData.startDate);
      payload[fields.eindDatum] = formatDateForSharePoint(leaveData.endDate);
      payload[fields.omschrijving] = leaveData.description;
      payload[fields.status] = leaveData.status;

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.verlof.guid}')/items(${leaveData.id})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "MERGE",
            "If-Match": "*",
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response;
    });
}

function deleteLeave(leaveId) {
  return getFormDigest()
    .then((formDigest) => {
      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.verlof.guid}')/items(${leaveId})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "DELETE",
            "If-Match": "*",
          },
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response;
    });
}

function updateEmployeeWorkSchedule(employeeId, scheduleData) {
  const fields = SP_CONFIG.lists.medewerkers.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.MedewerkersListItem`,
        },
      };

      payload[fields.weeklyHours] = scheduleData.weeklyHours;
      payload[fields.workSchedule] = scheduleData.workSchedule;
      payload[fields.workDays] = scheduleData.workDays;
      payload[fields.halfDayType] = scheduleData.halfDayType;
      payload[fields.halfDayOfWeek] = scheduleData.halfDayOfWeek;

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.medewerkers.guid}')/items(${employeeId})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "MERGE",
            "If-Match": "*",
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response;
    });
}

// Function to fetch work schedules from the UrenPerWeek list
function fetchWorkSchedules() {
  const fields = SP_CONFIG.lists.urenPerWeek.fields;
  return fetch(
    `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.urenPerWeek.guid}')/items?$select=ID,${fields.medewerkerId},${fields.maandagStart},${fields.maandagEind},${fields.maandagSoort},${fields.maandagTotaal},${fields.dinsdagStart},${fields.dinsdagEind},${fields.dinsdagSoort},${fields.dinsdagTotaal},${fields.woensdagStart},${fields.woensdagEind},${fields.woensdagSoort},${fields.woensdagTotaal},${fields.donderdagStart},${fields.donderdagEind},${fields.donderdagSoort},${fields.donderdagTotaal},${fields.vrijdagStart},${fields.vrijdagEind},${fields.vrijdagSoort},${fields.vrijdagTotaal}`,
    {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data.d.results.map((item) => ({
        id: item.ID,
        medewerkerId: item[fields.medewerkerId],
        monday: {
          start: item[fields.maandagStart] || "",
          end: item[fields.maandagEind] || "",
          type: item[fields.maandagSoort] || "",
          hours: item[fields.maandagTotaal] || "0"
        },
        tuesday: {
          start: item[fields.dinsdagStart] || "",
          end: item[fields.dinsdagEind] || "",
          type: item[fields.dinsdagSoort] || "",
          hours: item[fields.dinsdagTotaal] || "0"
        },
        wednesday: {
          start: item[fields.woensdagStart] || "",
          end: item[fields.woensdagEind] || "",
          type: item[fields.woensdagSoort] || "",
          hours: item[fields.woensdagTotaal] || "0"
        },
        thursday: {
          start: item[fields.donderdagStart] || "",
          end: item[fields.donderdagEind] || "",
          type: item[fields.donderdagSoort] || "",
          hours: item[fields.donderdagTotaal] || "0"
        },
        friday: {
          start: item[fields.vrijdagStart] || "",
          end: item[fields.vrijdagEind] || "",
          type: item[fields.vrijdagSoort] || "",
          hours: item[fields.vrijdagTotaal] || "0"
        }
      }));
    });
}

// Function to create or update work schedule
function saveWorkSchedule(scheduleData) {
  const fields = SP_CONFIG.lists.urenPerWeek.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.UrenPerWeekListItem`,
        },
      };

      payload[fields.medewerkerId] = scheduleData.medewerkerId;
      
      // Monday
      payload[fields.maandagStart] = scheduleData.monday.start;
      payload[fields.maandagEind] = scheduleData.monday.end;
      payload[fields.maandagSoort] = scheduleData.monday.type;
      payload[fields.maandagTotaal] = scheduleData.monday.hours;
      
      // Tuesday
      payload[fields.dinsdagStart] = scheduleData.tuesday.start;
      payload[fields.dinsdagEind] = scheduleData.tuesday.end;
      payload[fields.dinsdagSoort] = scheduleData.tuesday.type;
      payload[fields.dinsdagTotaal] = scheduleData.tuesday.hours;
      
      // Wednesday
      payload[fields.woensdagStart] = scheduleData.wednesday.start;
      payload[fields.woensdagEind] = scheduleData.wednesday.end;
      payload[fields.woensdagSoort] = scheduleData.wednesday.type;
      payload[fields.woensdagTotaal] = scheduleData.wednesday.hours;
      
      // Thursday
      payload[fields.donderdagStart] = scheduleData.thursday.start;
      payload[fields.donderdagEind] = scheduleData.thursday.end;
      payload[fields.donderdagSoort] = scheduleData.thursday.type;
      payload[fields.donderdagTotaal] = scheduleData.thursday.hours;
      
      // Friday
      payload[fields.vrijdagStart] = scheduleData.friday.start;
      payload[fields.vrijdagEind] = scheduleData.friday.end;
      payload[fields.vrijdagSoort] = scheduleData.friday.type;
      payload[fields.vrijdagTotaal] = scheduleData.friday.hours;

      // If we have an ID, update existing record, otherwise create new one
      if (scheduleData.id) {
        return fetch(
          `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.urenPerWeek.guid}')/items(${scheduleData.id})`,
          {
            method: "POST",
            headers: {
              Accept: "application/json;odata=verbose",
              "Content-Type": "application/json;odata=verbose",
              "X-RequestDigest": formDigest,
              "X-HTTP-Method": "MERGE",
              "If-Match": "*",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        return fetch(
          `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.urenPerWeek.guid}')/items`,
          {
            method: "POST",
            headers: {
              Accept: "application/json;odata=verbose",
              "Content-Type": "application/json;odata=verbose",
              "X-RequestDigest": formDigest,
            },
            body: JSON.stringify(payload),
          }
        );
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.d;
    });
}

// PeoplePicker Functions
function initPeoplePicker(inputId, resultsId, hiddenIdField) {
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  const hiddenId = document.getElementById(hiddenIdField);

  if (!input || !results || !hiddenId) {
    console.error(
      `PeoplePicker initialization failed: missing elements for ${inputId}`
    );
    return;
  }

  let timeoutId;

  input.addEventListener("input", function () {
    clearTimeout(timeoutId);
    const query = this.value.trim();

    if (query.length < 2) {
      results.innerHTML = "";
      results.style.display = "none";
      return;
    }

    timeoutId = setTimeout(() => {
      searchUsers(query)
        .then((users) => {
          if (users.length === 0) {
            results.innerHTML =
              '<div class="no-results">Geen gebruikers gevonden</div>';
          } else {
            results.innerHTML = "";
            users.forEach((user) => {
              const item = document.createElement("div");
              item.className = "people-picker-item";
              item.innerHTML = `
                            <div class="user-avatar">${generateInitials(
                              user.Title
                            )}</div>
                            <div class="user-details">
                                <div class="user-name">${user.Title}</div>
                                <div class="user-email">${
                                  user.Email || ""
                                }</div>
                            </div>
                        `;
              item.addEventListener("click", () => {
                input.value = user.Title;
                hiddenId.value = user.Id;
                results.style.display = "none";
              });
              results.appendChild(item);
            });
          }
          results.style.display = "block";
        })
        .catch((error) => {
          console.error("Error searching users:", error);
          // Fallback: Allow manual entry
          results.innerHTML =
            '<div class="no-results">Fout bij zoeken: type de naam handmatig in</div>';
          results.style.display = "block";
        });
    }, 500);
  });

  // Close results when clicking outside
  document.addEventListener("click", function (e) {
    if (!results.contains(e.target) && e.target !== input) {
      results.style.display = "none";
    }
  });

  // Allow manual entry if user presses Enter or Tab
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === "Tab") {
      if (input.value.trim() && !hiddenId.value) {
        // Store the display name in both fields if no ID was selected
        hiddenId.value = input.value.trim();
      }
      results.style.display = "none";
    }
  });
}

function searchUsers(query) {
  return fetch(
    `${SP_CONFIG.siteUrl}/_api/web/siteusers?$filter=substringof('${query}',Title)`,
    {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.d.results || [];
    })
    .catch((error) => {
      console.error("Error in searchUsers:", error);
      // Return empty array so UI doesn't break
      return [];
    });
}

// UI Updates
function updateCurrentPeriod() {
  const formatter = new Intl.DateTimeFormat("nl-NL", {
    month: "long",
    year: "numeric",
  });

  switch (state.currentView) {
    case "week":
      const weekStart = new Date(state.currentDate);
      weekStart.setDate(
        state.currentDate.getDate() - (state.currentDate.getDay() || 7) + 1
      ); // Monday
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // Sunday

      currentPeriod.textContent = `${formatDate(weekStart, {
        day: "numeric",
      })} - ${formatDate(weekEnd, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;
      break;

    case "month":
      currentPeriod.textContent = formatter.format(state.currentDate);
      break;

    case "quarter":
      const quarterStart = Math.floor(state.currentDate.getMonth() / 3) * 3;
      const startDate = new Date(
        state.currentDate.getFullYear(),
        quarterStart,
        1
      );
      const endDate = new Date(
        state.currentDate.getFullYear(),
        quarterStart + 3,
        0
      );

      const formatterShort = new Intl.DateTimeFormat("nl-NL", {
        month: "short",
      });
      currentPeriod.textContent = `${formatterShort.format(
        startDate
      )} - ${formatterShort.format(
        endDate
      )} ${state.currentDate.getFullYear()}`;
      break;
  }

  welcomeBox.style.display = !state.isRegistered ? "block" : "none";
}

function updateUserInfo() {
  // Update user information in the UI
  if (state.currentUser) {
    // Update with profile picture
    updateUserAvatar(
      userAvatar,
      state.currentUser.name,
      state.currentUser.email
    );
    userName.textContent = state.currentUser.name;

    // Show/hide admin dropdown based on admin rights
    adminDropdown.style.display = state.currentUser.isAdmin ? "block" : "none";

    // Show welcome box if user is not registered
    welcomeBox.style.display = !state.isRegistered ? "block" : "none";
  } else {
    userAvatar.textContent = "?";
    userName.textContent = "Niet ingelogd";
    adminDropdown.style.display = "none";
  }
}

function updateLegend() {
  // Initialize legend container if it doesn't exist
  if (!document.getElementById("legendContainer")) {
    legendContainer.innerHTML = '<div id="legendContainer"></div>';
  }
  
  let legendContent = `
    <div class="legend-section" id="legendVerlofredenen">
      <div class="legend-section-title">Verlofredenen</div>
      <div class="legend-section-content">
        <!-- Verlof items will be added dynamically -->
      </div>
    </div>
    <div class="legend-section" id="legendDagenIndicator">
      <div class="legend-section-title">Dagen-indicators</div>
      <div class="legend-section-content">
        <div class="legend-item">
          <div class="legend-color vvd-pattern" style="background-color: ${SP_CONFIG.dayTypeIndicators.VVD.color};"></div>
          <span>${SP_CONFIG.dayTypeIndicators.VVD.name}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color vvm-pattern" style="background-color: ${SP_CONFIG.dayTypeIndicators.VVM.color};"></div>
          <span>${SP_CONFIG.dayTypeIndicators.VVM.name}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color vvo-pattern" style="background-color: ${SP_CONFIG.dayTypeIndicators.VVO.color};"></div>
          <span>${SP_CONFIG.dayTypeIndicators.VVO.name}</span>
        </div>
      </div>
    </div>
    <div class="legend-section" id="legendHorenIndicator">
      <div class="legend-section-title">Horen-indicators</div>
      <div class="legend-section-content">
        <div class="legend-item horen-yes">
          <span>Beoordelaar beschikbaar voor horen</span>
        </div>
        <div class="legend-item horen-no">
          <span>Beoordelaar niet inplannen voor horen</span>
        </div>
      </div>
    </div>
  `;

  // Replace the content of the legend container
  document.getElementById("legendContainer").innerHTML = legendContent;

  // Add verlofredenen to the legend
  const legendVerlofredenenContent = document.querySelector("#legendVerlofredenen .legend-section-content");
  
  // Add legend items for each reason
  state.reasons.forEach((reason) => {
    // Add click event for admins
    const adminClickable =
      state.currentUser && state.currentUser.isAdmin
        ? `style="cursor: pointer;" onclick="window.openEditReasonModal(${reason.id})"`
        : "";

    legendVerlofredenenContent.innerHTML += `
      <div class="legend-item" ${adminClickable}>
        <div class="legend-color" style="background-color: ${reason.color};"></div>
        <span>${reason.name}</span>
        ${
          state.currentUser && state.currentUser.isAdmin
            ? `<svg class="edit-icon" style="margin-left: 5px; display: none;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>`
            : ""
        }
      </div>
    `;
  });

  // Weekend legend item
  legendVerlofredenenContent.innerHTML += `
    <div class="legend-item">
      <div class="legend-color" style="border-left: 1px dashed black;"></div>
      <span>Weekend</span>
    </div>
  `;

  // Add hover effect to show edit icon for admins
  if (state.currentUser && state.currentUser.isAdmin) {
    document.querySelectorAll(".legend-item").forEach((item) => {
      if (!item.querySelector(".edit-icon")) return; // Skip items without edit icon

      item.addEventListener("mouseenter", () => {
        const editIcon = item.querySelector(".edit-icon");
        if (editIcon) editIcon.style.display = "inline";
      });

      item.addEventListener("mouseleave", () => {
        const editIcon = item.querySelector(".edit-icon");
        if (editIcon) editIcon.style.display = "none";
      });
    });
  }

  // Add event listeners for collapsing/expanding legend sections
  document.querySelectorAll(".legend-section-title").forEach(title => {
    title.addEventListener("click", () => {
      const section = title.closest(".legend-section");
      section.classList.toggle("collapsed");
    });
  });

  // Make openEditReasonModal available to the window object for onclick handlers
  window.openEditReasonModal = openEditReasonModal;
}

function renderRoster() {
  teamRoster.innerHTML = "";
  loadingIndicator.style.display = "flex";

  // Bereken de datums die we moeten weergeven op basis van de huidige weergavemodus
  const renderDates = getDatesToRender();

  // Groepeer medewerkers op team
  const teamEmployees = {};

  // Filter medewerkers op team en zoekterm
  const filteredEmployees = state.employees.filter((employee) => {
    // Toon alleen actieve medewerkers
    if (!employee.active) return false;

    // Check team filter
    const teamMatches =
      state.filteredTeam === "all" || employee.team === state.filteredTeam;

    // Check search query
    const searchMatches =
      !state.searchQuery ||
      employee.name.toLowerCase().includes(state.searchQuery.toLowerCase());

    return teamMatches && searchMatches;
  });

  // Groepeer medewerkers per team
  filteredEmployees.forEach((employee) => {
    const team = employee.team || "Geen team";
    if (!teamEmployees[team]) {
      teamEmployees[team] = [];
    }
    teamEmployees[team].push(employee);
  });

  // Geen resultaten
  if (Object.keys(teamEmployees).length === 0) {
    teamRoster.innerHTML = `
      <div class="data-state">
        Geen medewerkers gevonden die voldoen aan de filters.
      </div>
    `;
    loadingIndicator.style.display = "none";
    return;
  }

  // Helper functie om dag afkorting te krijgen
  function getDayAbbreviation(dayNum) {
    const days = ["zo", "ma", "di", "wo", "do", "vr", "za"];
    return days[dayNum];
  }

  // Creëer HTML per team
  Object.keys(teamEmployees).forEach((teamName) => {
    const employees = teamEmployees[teamName];
    const teamData = state.teams.find((t) => t.name === teamName) || {
      name: teamName,
      color: "#3b82f6", // Standaard kleur als team niet is gevonden
      leader: "", // Geen teamleader als team niet is gevonden
    };

    // Bereid teamleader informatie voor
    let teamLeaderInfo = "";
    if (teamData.leader) {
      // Haal het e-mailadres van de teamleider op als die bestaat in medewerkers
      const teamLeader = state.employees.find(
        (emp) => emp.name === teamData.leader
      );
      const teamLeaderEmail = teamLeader?.email || "";

      // Verwerk de naam voor formele weergave (voornaam + achternaam)
      const leaderName = teamData.leader;
      const nameParts = leaderName.split(" ");
      let formattedName = leaderName;

      // Als er spaties in de naam zijn, formatteren we het als voornaam + achternaam
      if (nameParts.length > 1) {
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        formattedName = `${firstName} ${lastName}`;
      }

      // Voeg teamleider info toe
      if (teamLeaderEmail) {
        teamLeaderInfo = ` <span class="teamleader-info">• TL: <span class="teamleader-avatar" style="width: 18px; height: 18px; border-radius: 50%; margin-left: 4px; margin-right: 2px;">${generateInitials(
          teamData.leader
        )}</span> ${formattedName}</span>`;
      } else {
        teamLeaderInfo = ` <span class="teamleader-info">• TL: ${formattedName}</span>`;
      }
    }

    let teamHtml = `
      <div class="team-section">
        <div class="team-header">
          <div class="team-name">
            <div class="team-color" style="background-color: ${
              teamData.color
            };"></div>
            ${teamName} (${employees.length} ${
      employees.length === 1 ? "lid" : "leden"
    })${teamLeaderInfo}
          </div>
          <div class="team-tools">
            ${
              state.currentUser && state.currentUser.isAdmin
                ? `<button class="edit-btn" title="Team bewerken" data-team-id="${teamData.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>`
                : ``
            }
            <button class="toggle-btn" title="Team inklappen">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="roster-days-container">
          <table class="roster-table">
            <thead>
              <tr>
                <th class="employee-col">Medewerker</th>
    `;

    // Voeg datumkoppen toe met dagafkorting + nummer
    renderDates.forEach((date) => {
      const isWeekendDay = isWeekend(date);
      const isCurrentDay = isSameDay(date, new Date());
      const dayClass = isWeekendDay ? "weekend" : "";
      const dateNum = date.getDate();
      const dayAbbr = getDayAbbreviation(date.getDay());

      teamHtml += `<th class="${dayClass} ${
        isCurrentDay ? "current-day" : ""
      }" style="border-left: 1px dashed var(--color-gray-200);">${dayAbbr} ${dateNum}</th>`;
    });

    teamHtml += `
              </tr>
            </thead>
            <tbody>
    `;

    // Voeg rijen toe voor elke medewerker
    employees.forEach((employee) => {
      const initials = generateInitials(employee.name);
      
      // Use the horen CSS classes instead of inline styles
      const horenClass = employee.horen === false ? 
        'horen-no' : 
        employee.horen === true ? 
        'horen-yes' : '';

      teamHtml += `
        <tr class="employee-row">
          <td class="employee-col">
            <div class="employee-info${horenClass ? ' ' + horenClass : ''}">
              <div class="avatar" id="avatar-${employee.id}">${initials}</div>
              <span>${employee.name}</span>
              <div class="employee-actions">
                <button class="edit-btn" title="Medewerker bewerken" data-employee-id="${employee.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </td>
      `;

      // Voeg cellen toe voor elke datum
      renderDates.forEach((date) => {
        const isWeekendDay = isWeekend(date);
        const dayClass = isWeekendDay ? "weekend" : "";

        // Controleer of er verlof is op deze datum
        const leave = findLeaveForEmployeeOnDate(employee, date);
        
        // Check for work schedule indicator (VVD, VVM, VVO)
        const workScheduleType = getWorkScheduleForDay(employee, date);

        teamHtml += `<td class="day-cell ${dayClass}">`;

        // First render leave if it exists (higher priority)
        if (leave) {
          // Zoek de verlofreden op om de kleur te bepalen
          const reason = state.reasons.find((r) => r.name === leave.reason);
          const backgroundColor = reason ? reason.color : "#3b82f6";

          teamHtml += `
            <div class="leave-indicator" style="background-color: ${backgroundColor};" data-leave-id="${leave.id}">
              <div class="leave-tooltip">${leave.reason}</div>
            </div>
          `;
        } 
        // Otherwise show work schedule indicator if available
        else if (workScheduleType && !isWeekendDay) {
          // Get colors from masterConfig
          const indicatorConfig = SP_CONFIG.dayTypeIndicators[workScheduleType];
          const backgroundColor = indicatorConfig ? indicatorConfig.color : "#3b82f6";
          
          teamHtml += `
            <div class="work-schedule-indicator ${workScheduleType.toLowerCase()}" 
                 style="background-color: ${backgroundColor};">
              <div class="work-schedule-tooltip">${indicatorConfig ? indicatorConfig.name : workScheduleType}</div>
            </div>
          `;
        }

        teamHtml += `</td>`;
      });

      teamHtml += `
        </tr>
      `;
    });

    teamHtml += `
            </tbody>
          </table>
        </div>
      </div>
    `;

    teamRoster.innerHTML += teamHtml;
  });

  // Voeg CSS styling toe voor teamleider informatie
  const styleElement = document.getElementById("dynamic-team-styles");
  if (!styleElement) {
    const newStyle = document.createElement("style");
    newStyle.id = "dynamic-team-styles";
    newStyle.textContent = `
      .teamleader-info {
        display: inline-flex;
        align-items: center;
        font-weight: 500;
      }
      .teamleader-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #e5e7eb;
        color: #4b5563;
        font-size: 12px;
        font-weight: 600;
      }
    `;
    document.head.appendChild(newStyle);
  }

  // Voeg event listeners toe voor team toggle-knoppen
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const teamSection = e.currentTarget.closest(".team-section");
      const rosterContainer = teamSection.querySelector(
        ".roster-days-container"
      );

      if (rosterContainer.style.display === "none") {
        rosterContainer.style.display = "block";
        e.currentTarget.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        `;
        e.currentTarget.title = "Team inklappen";
      } else {
        rosterContainer.style.display = "none";
        e.currentTarget.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 15 12 9 18 15"></polyline>
          </svg>
        `;
        e.currentTarget.title = "Team uitklappen";
      }
    });
  });

  // Event listener voor verlof-indicators (voor bewerken)
  document
    .querySelectorAll(".leave-indicator[data-leave-id]")
    .forEach((indicator) => {
      indicator.addEventListener("click", (e) => {
        const leaveId = parseInt(e.currentTarget.dataset.leaveId);
        openEditLeaveModal(leaveId);
      });
    });

  // Event listeners voor team bewerken knoppen
  document.querySelectorAll(".edit-btn[data-team-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const teamId = parseInt(e.currentTarget.dataset.teamId);
      openEditTeamModal(teamId);
    });
  });

  // Event listeners voor medewerker bewerken knoppen
  document.querySelectorAll(".edit-btn[data-employee-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const employeeId = parseInt(e.currentTarget.dataset.employeeId);
      openEditEmployeeModal(employeeId);
    });
  });

  // Update employee avatars with profile pictures
  state.employees.forEach((emp) => {
    const avatarElement = document.getElementById(`avatar-${emp.id}`);
    if (avatarElement) {
      updateUserAvatar(avatarElement, emp.name, emp.email);
    }
  });

  loadingIndicator.style.display = "none";
}

function findLeaveForEmployeeOnDate(employee, date) {
  return state.leaves.find((leave) => {
    if (leave.employee !== employee.name) return false;

    // Controleer of de datum binnen de verlofperiode valt
    if (!leave.startDate || !leave.endDate) return false;

    const checkDate = new Date(date);
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);

    // Reset tijden voor pure datumvergelijking
    checkDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return checkDate >= startDate && checkDate <= endDate;
  });
}

function renderEmployeesTable(filter = "") {
  const filteredEmployees = state.employees.filter(
    (emp) => !filter || emp.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredEmployees.length === 0) {
    employeesTable.innerHTML = `<div class="data-state">Geen medewerkers gevonden</div>`;
    return;
  }

  let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Naam</th>
                    <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Team</th>
                    <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Functie</th>
                    <th style="text-align: center; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Actief</th>
                    <th style="text-align: right; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Acties</th>
                </tr>
            </thead>
            <tbody>
    `;

  filteredEmployees.forEach((emp) => {
    html += `
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">${
                  emp.name
                }</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">${
                  emp.team || "-"
                }</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">${
                  emp.function || "-"
                }</td>
                <td style="text-align: center; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">
                    ${
                      emp.active
                        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                    }
                </td>
                <td style="text-align: right; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">
                    <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem;" onclick="window.editEmployee(${
                      emp.id
                    })">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Bewerken
                    </button>
                </td>
            </tr>
        `;
  });

  html += `
            </tbody>
        </table>
    `;

  employeesTable.innerHTML = html;

  // Voeg editEmployee functie toe aan window object zodat inline onclick handlers werken
  window.editEmployee = function (employeeId) {
    openEditEmployeeModal(employeeId);
  };
}

function renderReasonsTable(filter = "") {
  const filteredReasons = state.reasons.filter(
    (reason) =>
      !filter || reason.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredReasons.length === 0) {
    reasonsTable.innerHTML = `<div class="data-state">Geen verlofredenen gevonden</div>`;
    return;
  }

  let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Naam</th>
                    <th style="text-align: center; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Kleur</th>
                    <th style="text-align: center; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Verlofdag</th>
                    <th style="text-align: center; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Goedkeuring</th>
                    <th style="text-align: right; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Acties</th>
                </tr>
            </thead>
            <tbody>
    `;

  filteredReasons.forEach((reason) => {
    html += `
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">${
                  reason.name
                }</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100); text-align: center;">
                    <div style="width: 24px; height: 24px; background-color: ${
                      reason.color
                    }; border-radius: 4px; margin: 0 auto;"></div>
                </td>
                <td style="text-align: center; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">
                    ${
                      reason.countAsLeave
                        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                    }
                </td>
                <td style="text-align: center; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">
                    ${
                      reason.requiresApproval
                        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                    }
                </td>
                <td style="text-align: right; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">
                    <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem;" onclick="window.editReasonFromTable(${
                      reason.id
                    })">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Bewerken
                    </button>
                </td>
            </tr>
        `;
  });

  html += `
            </tbody>
        </table>
    `;

  reasonsTable.innerHTML = html;

  // Add editReasonFromTable function to window object for inline event handlers
  window.editReasonFromTable = function (reasonId) {
    openEditReasonModal(reasonId);
    // Don't close the manager modal so user can come back to it after editing
  };
}

function getDatesToRender() {
  const dates = [];

  switch (state.currentView) {
    case "week":
      // Bereken eerste en laatste dag van de week (maandag t/m zondag)
      const weekStart = new Date(state.currentDate);
      weekStart.setDate(
        state.currentDate.getDate() - (state.currentDate.getDay() || 7) + 1
      ); // Maandag

      // Voeg 7 dagen toe, vanaf maandag
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        dates.push(date);
      }
      break;

    case "month":
      // Bereken eerste dag van de maand
      const firstDay = new Date(
        state.currentDate.getFullYear(),
        state.currentDate.getMonth(),
        1
      );
      // Bereken laatste dag van de maand
      const lastDay = new Date(
        state.currentDate.getFullYear(),
        state.currentDate.getMonth() + 1,
        0
      );

      // Voeg alle dagen van de maand toe
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(
          state.currentDate.getFullYear(),
          state.currentDate.getMonth(),
          i
        );
        dates.push(date);
      }
      break;

    case "quarter":
      // Bereken eerste maand van het kwartaal
      const quarterStart = Math.floor(state.currentDate.getMonth() / 3) * 3;

      // Voeg datums toe voor 3 maanden
      for (let month = quarterStart; month < quarterStart + 3; month++) {
        const firstDayOfMonth = new Date(
          state.currentDate.getFullYear(),
          month,
          1
        );
        const lastDayOfMonth = new Date(
          state.currentDate.getFullYear(),
          month + 1,
           0
        );

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
          const date = new Date(state.currentDate.getFullYear(), month, i);
          dates.push(date);
        }
      }
      break;
  }

  return dates;
}

function populateTeamFilter() {
  teamFilter.innerHTML = '<option value="all">Alle teams</option>';

  // Haal unieke teamnamen op uit medewerkers
  const uniqueTeams = [
    ...new Set(state.employees.map((emp) => emp.team)),
  ].filter(Boolean);

  uniqueTeams.sort().forEach((teamName) => {
    const team = state.teams.find((t) => t.name === teamName) || {
      name: teamName,
    };
    teamFilter.innerHTML += `<option value="${team.name}">${team.name}</option>`;
  });
}

function populateEmployeeSelect() {
  // Bepaal welke medewerker moet worden geselecteerd
  // Als de huidige gebruiker geregistreerd is, selecteer die automatisch
  let selectedEmployee = "";

  if (state.currentUser && state.isRegistered) {
    const currentUserEmployee = state.employees.find(
      (emp) =>
        emp.email &&
        emp.email.toLowerCase() === state.currentUser.email.toLowerCase()
    );

    if (currentUserEmployee) {
      selectedEmployee = currentUserEmployee.name;
    }
  }

  employeeSelect.innerHTML = '<option value="">Selecteer medewerker</option>';

  // Groepeer medewerkers op team
  const teamEmployees = {};

  state.employees
    .filter((emp) => emp.active)
    .forEach((employee) => {
      const team = employee.team || "Geen team";
      if (!teamEmployees[team]) {
        teamEmployees[team] = [];
      }
      teamEmployees[team].push(employee);
    });

  // Voeg medewerkers gesorteerd per team toe
  Object.keys(teamEmployees)
    .sort()
    .forEach((team) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = team;

      teamEmployees[team]
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((employee) => {
          const option = document.createElement("option");
          option.value = employee.name;
          option.textContent = employee.name;

          if (employee.name === selectedEmployee) {
            option.selected = true;
          }

          optgroup.appendChild(option);
        });

      employeeSelect.appendChild(optgroup);
    });
}

function populateReasonSelect() {
  reasonSelect.innerHTML = '<option value="">Selecteer reden</option>';

  state.reasons.forEach((reason) => {
    const option = document.createElement("option");
    option.value = reason.name;
    option.textContent = reason.name;
    option.style.backgroundColor = reason.color;
    reasonSelect.appendChild(option);
  });
}

function populateTeamSelects() {
  // Zorg ervoor dat we alle team selects bijwerken
  const selects = [registerTeamSelect, editEmployeeTeamSelect];

  selects.forEach((select) => {
    if (!select) return;

    select.innerHTML = '<option value="">Selecteer team</option>';

    state.teams
      .filter((team) => team.active)
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((team) => {
        const option = document.createElement("option");
        option.value = team.name;
        option.textContent = team.name;
        select.appendChild(option);
      });
  });
}

function showSnackbar(message, type = "default") {
  snackbar.textContent = message;
  snackbar.className = `snackbar ${type}`;
  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 3000);
}

function openAddLeaveModal() {
  // Reset het formulier
  leaveModalTitle.textContent = "Verlof Toevoegen";
  leaveIdInput.value = "";

  // Reset form fields
  employeeSelect.value = "";
  reasonSelect.value = "";

  // Zet huidige datum als standaard
  const today = new Date();
  const todayStr = formatDateStr(today);
  startDateInput.value = todayStr;
  endDateInput.value = todayStr;

  descriptionInput.value = "";
  workdaysOnlyCheckbox.checked = true;

  // Verberg verwijderknop
  deleteLeaveBtn.style.display = "none";

  // Toon/verberg status veld op basis van admin rechten
  statusField.style.display = state.currentUser.isAdmin ? "block" : "none";
  statusSelect.value = "Aangevraagd";

  // Selecteer automatisch de huidige medewerker als die geregistreerd is
  if (state.currentUser && state.isRegistered) {
    const currentUserEmployee = state.employees.find(
      (emp) =>
        emp.email &&
        emp.email.toLowerCase() === state.currentUser.email.toLowerCase()
    );

    if (currentUserEmployee) {
      employeeSelect.value = currentUserEmployee.name;
    }
  }

  // Toon modal
  leaveModal.classList.add("active");
}

function openEditLeaveModal(leaveId) {
  const leave = state.leaves.find((l) => l.id === leaveId);
  if (!leave) return;

  // Update modal titel
  leaveModalTitle.textContent = "Verlof Bewerken";

  // Vul formuliervelden
  employeeSelect.value = leave.employee;
  reasonSelect.value = leave.reason;

  // Formatteer datums
  startDateInput.value = formatDateStr(leave.startDate);
  endDateInput.value = formatDateStr(leave.endDate);

  descriptionInput.value = leave.description || "";
  leaveIdInput.value = leaveId;

  // Toon verwijderknop
  deleteLeaveBtn.style.display = "block";

  // Toon/verberg status veld op basis van admin rechten
  statusField.style.display = state.currentUser.isAdmin ? "block" : "none";
  statusSelect.value = leave.status || "Aangevraagd";

  // Toon modal
  leaveModal.classList.add("active");
}

function openAddTeamModal() {
  // Reset het formulier
  teamModalTitle.textContent = "Team Toevoegen";
  teamIdInput.value = "";

  teamNameInput.value = "";
  teamLeaderInput.value = "";
  teamColorInput.value = "#3b82f6";

  // Reset kleur selectie
  document
    .querySelectorAll("#teamColorPicker .color-option")
    .forEach((option) => {
      option.classList.remove("selected");
    });

  teamActiveCheckbox.checked = true;

  // Verberg verwijderknop
  deleteTeamBtn.style.display = "none";

  // Toon modal
  teamModal.classList.add("active");
}

function openEditTeamModal(teamId) {
  const team = state.teams.find((t) => t.id === teamId);
  if (!team) return;

  // Update modal titel
  teamModalTitle.textContent = "Team Bewerken";

  // Vul formuliervelden
  teamNameInput.value = team.name;
  teamLeaderInput.value = team.leader || "";
  teamColorInput.value = team.color || "#3b82f6";
  teamActiveCheckbox.checked = team.active;
  teamIdInput.value = teamId;

  // Update kleur selectie
  document
    .querySelectorAll("#teamColorPicker .color-option")
    .forEach((option) => {
      option.classList.toggle("selected", option.dataset.color === team.color);
    });

  // Toon verwijderknop
  deleteTeamBtn.style.display = "block";

  // Toon modal
  teamModal.classList.add("active");
}

function openAddReasonModal() {
  // Reset het formulier
  reasonModalTitle.textContent = "Verlofreden Toevoegen";
  reasonIdInput.value = "";

  reasonNameInput.value = "";
  reasonColorInput.value = "#dbeafe";

  // Reset kleur selectie
  document.querySelectorAll("#colorPicker .color-option").forEach((option) => {
    option.classList.remove("selected");
  });

  countAsLeaveCheckbox.checked = true;
  requiresApprovalCheckbox.checked = true;

  // Verberg verwijderknop
  deleteReasonBtn.style.display = "none";

  // Toon modal
  reasonModal.classList.add("active");
}

function openEditReasonModal(reasonId) {
  const reason = state.reasons.find((r) => r.id === reasonId);
  if (!reason) return;

  // Update modal titel
  reasonModalTitle.textContent = "Verlofreden Bewerken";

  // Vul formuliervelden
  reasonNameInput.value = reason.name;
  reasonColorInput.value = reason.color || "#dbeafe";
  countAsLeaveCheckbox.checked = reason.countAsLeave;
  requiresApprovalCheckbox.checked = reason.requiresApproval;
  reasonIdInput.value = reasonId;

  // Update kleur selectie
  document.querySelectorAll("#colorPicker .color-option").forEach((option) => {
    option.classList.toggle("selected", option.dataset.color === reason.color);
  });

  // Toon verwijderknop
  deleteReasonBtn.style.display = "block";

  // Toon modal
  reasonModal.classList.add("active");
}

function openEditEmployeeModal(employeeId) {
  // Schakel naar bewerken tab
  switchTab("employee-edit");

  const employee = state.employees.find((e) => e.id === employeeId);
  if (!employee) return;

  // Vul formuliervelden
  editEmployeeNameInput.value = employee.name;
  editEmployeeEmailInput.value = employee.email || "";
  editEmployeeTeamSelect.value = employee.team || "";
  editEmployeeFunctionInput.value = employee.function || "";
  editEmployeeActiveCheckbox.checked = employee.active;
  editEmployeeIdInput.value = employeeId;

  // Set the Horen field value
  const editEmployeeHorenCheckbox = document.getElementById(
    "editEmployeeHorenCheckbox"
  );
  if (editEmployeeHorenCheckbox) {
    editEmployeeHorenCheckbox.checked = employee.horen || false;
  }

  // Only show the Horen field to admins
  const horenFieldContainer = document.getElementById("horenFieldContainer");
  if (horenFieldContainer) {
    horenFieldContainer.style.display =
      state.currentUser && state.currentUser.isAdmin ? "block" : "none";
  }

  // Toon de medewerker bewerken modal
  employeesModal.classList.add("active");
}

function openAddEmployeeModal() {
  // Schakel naar bewerken tab
  switchTab("employee-edit");

  // Reset formulier
  editEmployeeNameInput.value = "";
  editEmployeeEmailInput.value = "";
  editEmployeeTeamSelect.value = "";
  editEmployeeFunctionInput.value = "";
  editEmployeeActiveCheckbox.checked = true;
  editEmployeeIdInput.value = "";

  // Toon de medewerker bewerken modal
  employeesModal.classList.add("active");
}

function switchTab(tabId) {
  // Update active tab
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });

  // Update visible content
  tabContents.forEach((content) => {
    content.classList.toggle("active", content.id === tabId);
  });

  // Toggle footer buttons
  if (tabId === "employees-list") {
    employeesListFooter.style.display = "flex";
    employeeEditFooter.style.display = "none";
  } else {
    employeesListFooter.style.display = "none";
    employeeEditFooter.style.display = "flex";
  }
}

function formatDateStr(date) {
  if (!date) return "";

  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

// Function to get work schedule for a specific employee on a specific date
function getWorkScheduleForDay(employee, date) {
  if (!employee) return null;
  
  // Check if it's a weekend
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return null; // Sunday (0) or Saturday (6)
  
  // Map day of week to corresponding day in the workDays object
  const dayMap = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday'
  };
  
  const dayName = dayMap[dayOfWeek];
  
  // First try to get data from employee.workDays if available
  if (employee.workDays && typeof employee.workDays === 'object') {
    const dayInfo = employee.workDays[dayName];
    
    if (dayInfo) {
      // Check if it's a free day
      if (dayInfo.isFreeDay) return 'VVD';
      
      // Check for half days based on hours
      if (dayInfo.hours && dayInfo.hours <= 4) {
        // Determine if it's morning or afternoon based on start time
        if (dayInfo.startTime) {
          const [hours] = dayInfo.startTime.split(':').map(Number);
          return hours < 12 ? 'VVO' : 'VVM'; // Morning start = afternoon free (VVO), Afternoon start = morning free (VVM)
        }
      }
    }
  }
  
  // If no info in employee.workDays, check for halfDayType and halfDayOfWeek
  if (employee.halfDayType && employee.halfDayOfWeek) {
    const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    
    if (employee.halfDayOfWeek === dayNameCapitalized) {
      if (employee.halfDayType === 'morning') return 'VVM'; // Morning only = afternoon free
      if (employee.halfDayType === 'afternoon') return 'VVO'; // Afternoon only = morning free
    }
  }
  
  // Finally try to get from workSchedules array 
  if (state.workSchedules && state.workSchedules.length > 0) {
    // Find work schedule for this employee
    const workSchedule = state.workSchedules.find(schedule => 
      schedule.medewerkerId === String(employee.id)
    );
    
    if (workSchedule) {
      // Get day info from work schedule
      const dayInfo = workSchedule[dayName];
      
      if (dayInfo) {
        // If the day type is explicitly set, use that
        if (dayInfo.type && ['VVD', 'VVM', 'VVO'].includes(dayInfo.type)) {
          return dayInfo.type;
        }
        
        // Check if hours are 0 (free day)
        if (dayInfo.hours === '0' || parseInt(dayInfo.hours) === 0) {
          return 'VVD';
        }
        
        // Determine based on start/end times
        if (dayInfo.start && dayInfo.end) {
          const startHour = parseInt(dayInfo.start.split(':')[0]);
          const endHour = parseInt(dayInfo.end.split(':')[0]);
          
          if (endHour <= 13) {
            return 'VVO'; // Morning only = afternoon free
          } else if (startHour >= 12) {
            return 'VVM'; // Afternoon only = morning free
          }
        }
      }
    }
  }
  
  return null;
}

// Event Handlers
function handleSaveLeave() {
  // Valideer input
  const employee = employeeSelect.value;
  const reason = reasonSelect.value;
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  const description = descriptionInput.value;
  const workdaysOnly = workdaysOnlyCheckbox.checked;
  const status = statusSelect.value;
  const leaveId = leaveIdInput.value ? parseInt(leaveIdInput.value) : null;

  if (!employee || !reason || !startDate || !endDate) {
    showSnackbar("Vul alle verplichte velden in", "error");
    return;
  }

  if (endDate < startDate) {
    showSnackbar("Einddatum moet na startdatum liggen", "error");
    return;
  }

  // Filter weekenddagen indien nodig
  let start = new Date(startDate);
  let end = new Date(endDate);

  if (workdaysOnly) {
    // Pas alleen start en eind aan indien het weekend is
    if (isWeekend(start)) {
      // Als startdatum in weekend valt, schuif naar volgende maandag
      start.setDate(
        start.getDate() + (start.getDay() === 0 ? 1 : 8 - start.getDay())
      );
    }

    if (isWeekend(end)) {
      // Als einddatum in weekend valt, schuif naar vorige vrijdag
      end.setDate(end.getDate() - (end.getDay() === 0 ? 2 : end.getDay() - 5));
    }

    // Controleer opnieuw datums
    if (end < start) {
      showSnackbar(
        "Na correctie voor werkdagen ligt de einddatum vóór de startdatum",
        "error"
      );
      return;
    }
  }

  // Creëer verlof object
  const leaveData = {
    employee: employee,
    reason: reason,
    startDate: start,
    endDate: end,
    description: description,
    status: state.currentUser.isAdmin ? status : "Aangevraagd",
  };

  // Disable save button
  saveLeaveBtn.disabled = true;

  // Update of toevoegen op basis van leaveId
  if (leaveId) {
    // Update bestaand verlof
    leaveData.id = leaveId;

    updateLeave(leaveData)
      .then(() => {
        // Update in lokale state
        const index = state.leaves.findIndex((l) => l.id === leaveId);
        if (index !== -1) {
          state.leaves[index] = {
            ...state.leaves[index],
            ...leaveData,
          };
        }

        // Sluit modal en update UI
        leaveModal.classList.remove("active");
        renderRoster();
        showSnackbar("Verlof succesvol bijgewerkt", "success");
      })
      .catch((error) => {
        console.error("Fout bij bijwerken verlof:", error);
        showSnackbar("Fout bij bijwerken van verlof", "error");
      })
      .finally(() => {
        saveLeaveBtn.disabled = false;
      });
  } else {
    // Voeg nieuw verlof toe
    createLeave(leaveData)
      .then((result) => {
        // Voeg toe aan lokale state
        state.leaves.push({
          id: result.ID,
          ...leaveData,
          requestTime: new Date(),
        });

        // Sluit modal en update UI
        leaveModal.classList.remove("active");
        renderRoster();
        showSnackbar("Verlof succesvol toegevoegd", "success");
      })
      .catch((error) => {
        console.error("Fout bij toevoegen verlof:", error);
        showSnackbar("Fout bij toevoegen van verlof", "error");
      })
      .finally(() => {
        saveLeaveBtn.disabled = false;
      });
  }
}

function handleDeleteLeave() {
  const leaveId = parseInt(leaveIdInput.value);
  if (!leaveId) return;

  if (!confirm("Weet je zeker dat je dit verlof wilt verwijderen?")) {
    return;
  }

  // Disable delete button
  deleteLeaveBtn.disabled = true;

  deleteLeave(leaveId)
    .then(() => {
      // Verwijder uit lokale state
      state.leaves = state.leaves.filter((l) => l.id !== leaveId);

      // Sluit modal en update UI
      leaveModal.classList.remove("active");
      renderRoster();
      showSnackbar("Verlof succesvol verwijderd", "success");
    })
    .catch((error) => {
      console.error("Fout bij verwijderen verlof:", error);
      showSnackbar("Fout bij verwijderen van verlof", "error");
    })
    .finally(() => {
      deleteLeaveBtn.disabled = false;
    });
}

function handleSaveTeam() {
  // Valideer input
  const name = teamNameInput.value.trim();
  const leader = teamLeaderInput.value.trim();
  const leaderId = teamLeaderIdInput.value; // Add leaderId from PeoplePicker
  const color = teamColorInput.value;
  const active = teamActiveCheckbox.checked;
  const teamId = teamIdInput.value ? parseInt(teamIdInput.value) : null;

  if (!name) {
    showSnackbar("Vul een teamnaam in", "error");
    return;
  }

  // Creëer team object
  const teamData = {
    name: name,
    leader: leader,
    leaderId: leaderId, // Add leaderId to the data object
    color: color,
    active: active,
  };

  // Disable save button
  saveTeamBtn.disabled = true;

  // Update of toevoegen op basis van teamId
  if (teamId) {
    teamData.id = teamId;
    updateTeam(teamData)
      .then(() => {
        // Update in lokale state
        const index = state.teams.findIndex((t) => t.id === teamId);
        if (index !== -1) {
          state.teams[index] = {
            id: teamId,
            name: name,
            leader: leader,
            leaderId: leaderId, // Include leaderId in state
            color: color,
            active: active,
          };
        }

        // Sluit modal en update UI
        teamModal.classList.remove("active");
        populateTeamFilter();
        populateTeamSelects();
        renderRoster();
        showSnackbar("Team succesvol bijgewerkt", "success");
      })
      .catch((error) => {
        console.error("Fout bij bijwerken team:", error);
        showSnackbar("Fout bij bijwerken van team", "error");
      })
      .finally(() => {
        saveTeamBtn.disabled = false;
      });
  } else {
    createTeam(teamData)
      .then((result) => {
        // Voeg toe aan lokale state
        state.teams.push({
          id: result.ID,
          name: name,
          leader: leader,
          leaderId: leaderId, // Include leaderId in state
          color: color,
          active: active,
        });

        // Sluit modal en update UI
        teamModal.classList.remove("active");
        populateTeamFilter();
        populateTeamSelects();
        renderRoster();
        showSnackbar("Team succesvol toegevoegd", "success");
      })
      .catch((error) => {
        console.error("Fout bij toevoegen team:", error);
        showSnackbar("Fout bij toevoegen van team", "error");
      })
      .finally(() => {
        saveTeamBtn.disabled = false;
      });
  }
}

function handleDeleteTeam() {
  const teamId = parseInt(teamIdInput.value);
  if (!teamId) return;

  // Check of dit team in gebruik is
  const employeesUsingTeam = state.employees.filter((emp) => {
    const team = state.teams.find((t) => t.id === teamId);
    return team && emp.team === team.name;
  });

  if (employeesUsingTeam.length > 0) {
    showSnackbar(
      `Dit team kan niet worden verwijderd omdat het wordt gebruikt door ${employeesUsingTeam.length} medewerker(s)`,
      "error"
    );
    return;
  }

  if (!confirm("Weet je zeker dat je dit team wilt verwijderen?")) {
    return;
  }

  // Disable delete button
  deleteTeamBtn.disabled = true;

  deleteTeam(teamId)
    .then(() => {
      // Verwijder uit lokale state
      state.teams = state.teams.filter((t) => t.id !== teamId);

      // Sluit modal en update UI
      teamModal.classList.remove("active");
      populateTeamFilter();
      populateTeamSelects();
      renderRoster();
      showSnackbar("Team succesvol verwijderd", "success");
    })
    .catch((error) => {
      console.error("Fout bij verwijderen team:", error);
      showSnackbar("Fout bij verwijderen van team", "error");
    })
    .finally(() => {
      deleteTeamBtn.disabled = false;
    });
}

function handleSaveReason() {
  // Valideer input
  const name = reasonNameInput.value.trim();
  const color = reasonColorInput.value;
  const countAsLeave = countAsLeaveCheckbox.checked;
  const requiresApproval = requiresApprovalCheckbox.checked;
  const reasonId = reasonIdInput.value ? parseInt(reasonIdInput.value) : null;

  if (!name) {
    showSnackbar("Vul een naam in", "error");
    return;
  }

  // Creëer reason object
  const reasonData = {
    name: name,
    color: color,
    countAsLeave: countAsLeave,
    requiresApproval: requiresApproval,
  };

  // Disable save button
  saveReasonBtn.disabled = true;

  // Update of toevoegen op basis van reasonId
  if (reasonId) {
    // Update bestaande reden
    reasonData.id = reasonId;

    updateReason(reasonData)
      .then(() => {
        // Update in lokale state
        const index = state.reasons.findIndex((r) => r.id === reasonId);
        if (index !== -1) {
          state.reasons[index] = {
            ...state.reasons[index],
            ...reasonData,
          };
        }

        // Sluit modal en update UI
        reasonModal.classList.remove("active");
        updateLegend();
        populateReasonSelect();
        renderRoster();
        showSnackbar("Verlofreden succesvol bijgewerkt", "success");

        // Also update the reasons table if it's open
        if (reasonsManagerModal.classList.contains("active")) {
          renderReasonsTable(reasonsSearchInput.value);
        }
      })
      .catch((error) => {
        console.error("Fout bij bijwerken verlofreden:", error);
        showSnackbar("Fout bij bijwerken van verlofreden", "error");
      })
      .finally(() => {
        saveReasonBtn.disabled = false;
      });
  } else {
    // Voeg nieuwe reden toe
    createReason(reasonData)
      .then((result) => {
        // Voeg toe aan lokale state
        state.reasons.push({
          id: result.ID,
          ...reasonData,
        });

        // Sluit modal en update UI
        reasonModal.classList.remove("active");
        updateLegend();
        populateReasonSelect();
        renderRoster();
        showSnackbar("Verlofreden succesvol toegevoegd", "success");

        // Also update the reasons table if it's open
        if (reasonsManagerModal.classList.contains("active")) {
          renderReasonsTable(reasonsSearchInput.value);
        }
      })
      .catch((error) => {
        console.error("Fout bij toevoegen verlofreden:", error);
        showSnackbar("Fout bij toevoegen van verlofreden", "error");
      })
      .finally(() => {
        saveReasonBtn.disabled = false;
      });
  }
}

function handleDeleteReason() {
  const reasonId = parseInt(reasonIdInput.value);
  if (!reasonId) return;

  // Check of deze reden in gebruik is
  const leavesUsingReason = state.leaves.filter((leave) => {
    const reason = state.reasons.find((r) => r.id === reasonId);
    return reason && leave.reason === reason.name;
  });

  if (leavesUsingReason.length > 0) {
    showSnackbar(
      `Deze reden kan niet worden verwijderd omdat deze wordt gebruikt in ${leavesUsingReason.length} verlofaanvragen`,
      "error"
    );
    return;
  }

  if (!confirm("Weet je zeker dat je deze verlofreden wilt verwijderen?")) {
    return;
  }

  // Disable delete button
  deleteReasonBtn.disabled = true;

  deleteReason(reasonId)
    .then(() => {
      // Verwijder uit lokale state
      state.reasons = state.reasons.filter((r) => r.id !== reasonId);

      // Sluit modal en update UI
      reasonModal.classList.remove("active");
      updateLegend();
      populateReasonSelect();
      renderRoster();
      showSnackbar("Verlofreden succesvol verwijderd", "success");
    })
    .catch((error) => {
      console.error("Fout bij verwijderen verlofreden:", error);
      showSnackbar("Fout bij verwijderen van verlofreden", "error");
    })
    .finally(() => {
      deleteReasonBtn.disabled = false;
    });
}

function handleRegister() {
  registerModal.classList.add("active");

  // Voorafinvullen van e-mailadres indien bekend
  if (state.currentUser && state.currentUser.email) {
    registerEmailInput.value = state.currentUser.email;
  }
}

function handleSaveRegistration() {
  // Valideer input
  const name = registerNameInput.value.trim();
  const email = registerEmailInput.value.trim();
  const team = registerTeamSelect.value;
  const functionTitle = registerFunctionInput.value.trim();
<<<<<<< HEAD
  const role = registerRoleSelect ? registerRoleSelect.value : "";
=======
  const role = registerRoleSelect.value;
>>>>>>> 9f4c84f3aa6cbf7666234d7bdd14f6fec224cae9

  if (!name || !email) {
    showSnackbar("Vul je naam en e-mail in", "error");
    return;
  }

  // Check of e-mail al bestaat
  const existingEmployee = state.employees.find(
    (emp) => emp.email && emp.email.toLowerCase() === email.toLowerCase()
  );

  if (existingEmployee) {
    showSnackbar("Dit e-mailadres is al geregistreerd", "error");
    return;
  }

  // Creëer employee object
  const employeeData = {
    name: name,
    email: email,
    team: team,
    function: functionTitle,
    active: true,
    role: role,
  };

  // Disable save button
  saveRegisterBtn.disabled = true;

  createEmployee(employeeData)
    .then((result) => {
      // Voeg toe aan lokale state
      const newEmployee = {
        id: result.ID,
        ...employeeData,
      };

      state.employees.push(newEmployee);

      // Markeer gebruiker als geregistreerd
      state.isRegistered = true;

      // Store the ID for the work schedule modal
      const newEmployeeId = result.ID;
      document.getElementById("workScheduleEmployeeId").value = newEmployeeId;

      // Close registration modal
      registerModal.classList.remove("active");

      // Open work schedule modal for step 2
      document.getElementById("workScheduleModal").classList.add("active");

      return Promise.resolve();
    })
    .catch((error) => {
      console.error("Fout bij registreren:", error);
      showSnackbar("Fout bij registreren", "error");
    })
    .finally(() => {
      saveRegisterBtn.disabled = false;
    });
}

function handleSaveEmployee() {
  // Valideer input
  const name = editEmployeeNameInput.value.trim();
  const email = editEmployeeEmailInput.value.trim();
  const team = editEmployeeTeamSelect.value;
  const functionTitle = editEmployeeFunctionInput.value.trim();
  const active = editEmployeeActiveCheckbox.checked;
  const employeeId = editEmployeeIdInput.value
    ? parseInt(editEmployeeIdInput.value)
    : null;

  // Get the horen value (but only if admin can see it)
  const editEmployeeHorenCheckbox = document.getElementById(
    "editEmployeeHorenCheckbox"
  );
  const horen =
    state.currentUser &&
    state.currentUser.isAdmin &&
    editEmployeeHorenCheckbox
      ? editEmployeeHorenCheckbox.checked
      : employeeId
      ? state.employees.find((e) => e.id === employeeId)?.horen
      : false;

  if (!name) {
    showSnackbar("Vul een naam in", "error");
    return;
  }

  // Creëer employee object
  const employeeData = {
    name: name,
    email: email,
    team: team,
    function: functionTitle,
    active: active,
    horen: horen,
  };

  // Disable save button
  saveEmployeeBtn.disabled = true;

  // Update of toevoegen op basis van employeeId
  if (employeeId) {
    // Update bestaande medewerker
    employeeData.id = employeeId;

    updateEmployee(employeeData)
      .then(() => {
        // Update in lokale state
        const index = state.employees.findIndex((e) => e.id === employeeId);
        if (index !== -1) {
          state.employees[index] = {
            ...state.employees[index],
            ...employeeData,
          };
        }

        // Switch terug naar lijst
        switchTab("employees-list");
        renderEmployeesTable(employeesSearchInput.value);

        // Update UI
        populateEmployeeSelect();
        renderRoster();
        showSnackbar("Medewerker succesvol bijgewerkt", "success");
      })
      .catch((error) => {
        console.error("Fout bij bijwerken medewerker:", error);
        showSnackbar("Fout bij bijwerken van medewerker", "error");
      })
      .finally(() => {
        saveEmployeeBtn.disabled = false;
      });
  } else {
    // Voeg nieuwe medewerker toe
    createEmployee(employeeData)
      .then((result) => {
        // Voeg toe aan lokale state
        state.employees.push({
          id: result.ID,
          ...employeeData,
        });

        // Switch terug naar lijst
        switchTab("employees-list");
        renderEmployeesTable(employeesSearchInput.value);

        // Update UI
        populateEmployeeSelect();
        renderRoster();
        showSnackbar("Medewerker succesvol toegevoegd", "success");
      })
      .catch((error) => {
        console.error("Fout bij toevoegen medewerker:", error);
        showSnackbar("Fout bij toevoegen van medewerker", "error");
      })
      .finally(() => {
        saveEmployeeBtn.disabled = false;
      });
  }
}

function handleDeleteEmployee() {
  const employeeId = parseInt(editEmployeeIdInput.value);
  if (!employeeId) return;

  // Check of deze medewerker verlofaanvragen heeft
  const employeeName = state.employees.find((e) => e.id === employeeId)?.name;
  if (!employeeName) return;

  const leavesFromEmployee = state.leaves.filter(
    (leave) => leave.employee === employeeName
  );

  if (leavesFromEmployee.length > 0) {
    showSnackbar(
      `Deze medewerker kan niet worden verwijderd omdat er ${leavesFromEmployee.length} verlofaanvragen zijn`,
      "error"
    );
    return;
  }

  if (!confirm("Weet je zeker dat je deze medewerker wilt verwijderen?")) {
    return;
  }

  // Disable delete button
  deleteEmployeeBtn.disabled = true;

  deleteEmployee(employeeId)
    .then(() => {
      // Verwijder uit lokale state
      state.employees = state.employees.filter((e) => e.id !== employeeId);

      // Switch terug naar lijst
      switchTab("employees-list");
      renderEmployeesTable(employeesSearchInput.value);

      // Update UI
      populateEmployeeSelect();
      renderRoster();
      showSnackbar("Medewerker succesvol verwijderd", "success");
    })
    .catch((error) => {
      console.error("Fout bij verwijderen medewerker:", error);
      showSnackbar("Fout bij verwijderen van medewerker", "error");
    })
    .finally(() => {
      deleteEmployeeBtn.disabled = false;
    });
}

function handlePeriodChange(direction) {
  switch (state.currentView) {
    case "week":
      // Ga 7 dagen vooruit of achteruit
      state.currentDate.setDate(state.currentDate.getDate() + 7 * direction);
      break;

    case "month":
      // Ga 1 maand vooruit of achteruit
      state.currentDate.setMonth(state.currentDate.getMonth() + direction);
      break;

    case "quarter":
      // Ga 3 maanden vooruit of achteruit
      state.currentDate.setMonth(state.currentDate.getMonth() + 3 * direction);
      break;
  }

  updateCurrentPeriod();
  renderRoster();
}

function handleViewChange(view) {
  state.currentView = view;

  // Update actieve knoppen
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });

  updateCurrentPeriod();
  renderRoster();
}

function handleTeamFilterChange(team) {
  state.filteredTeam = team;
  renderRoster();
}

function handleEmployeeSearch(query) {
  state.searchQuery = query.trim().toLowerCase();
  renderRoster();
}

function handleExport() {
  // Eenvoudige CSV export
  const rows = [];

  // Header row
  const dates = getDatesToRender();
  const headerRow = [
    "Medewerker",
    "Team",
    "Functie",
    ...dates.map((d) => formatDate(d, { day: "numeric", month: "numeric" })),
  ];
  rows.push(headerRow.join(","));

  // Rijen per medewerker
  state.employees
    .filter((emp) => emp.active)
    .forEach((employee) => {
      if (state.filteredTeam !== "all" && employee.team !== state.filteredTeam)
        return;
      if (
        state.searchQuery &&
        !employee.name.toLowerCase().includes(state.searchQuery)
      )
        return;

      const row = [employee.name, employee.team || "", employee.function || ""];

      // Voeg data toe voor elke datum
      dates.forEach((date) => {
        const leave = findLeaveForEmployeeOnDate(employee, date);
        row.push(leave ? leave.reason : "");
      });

      rows.push(row.join(","));
    });

  // Maak een downloadbare CSV
  const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
  const encodedUri = encodeURI(csvContent);

  // Creëer een downloadlink en klik erop
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `verlofrooster_${formatDate(new Date(), {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showSnackbar("Export succesvol gedownload");
}

// Event Listeners
function setupEventListeners() {
  // Verlof modal
  if (addLeaveBtn) addLeaveBtn.addEventListener("click", openAddLeaveModal);
  if (closeLeaveModalBtn)
    closeLeaveModalBtn.addEventListener("click", () =>
      leaveModal.classList.remove("active")
    );
  if (cancelLeaveBtn)
    cancelLeaveBtn.addEventListener("click", () =>
      leaveModal.classList.remove("active")
    );
  if (saveLeaveBtn) saveLeaveBtn.addEventListener("click", handleSaveLeave);
  if (deleteLeaveBtn)
    deleteLeaveBtn.addEventListener("click", handleDeleteLeave);

  // Registratie modal
  if (registerBtn) registerBtn.addEventListener("click", handleRegister);
  if (closeRegisterModalBtn)
    closeRegisterModalBtn.addEventListener("click", () =>
      registerModal.classList.remove("active")
    );
  if (cancelRegisterBtn)
    cancelRegisterBtn.addEventListener("click", () =>
      registerModal.classList.remove("active")
    );
  if (saveRegisterBtn)
    saveRegisterBtn.addEventListener("click", handleSaveRegistration);

  // Team modal
  if (addTeamBtn) addTeamBtn.addEventListener("click", openAddTeamModal);
  if (closeTeamModalBtn)
    closeTeamModalBtn.addEventListener("click", () =>
      teamModal.classList.remove("active")
    );
  if (cancelTeamBtn)
    cancelTeamBtn.addEventListener("click", () =>
      teamModal.classList.remove("active")
    );
  if (saveTeamBtn) saveTeamBtn.addEventListener("click", handleSaveTeam);
  if (deleteTeamBtn) deleteTeamBtn.addEventListener("click", handleDeleteTeam);

  // Verlofreden modal
  if (addReasonBtn) addReasonBtn.addEventListener("click", openAddReasonModal);
  if (closeReasonModalBtn)
    closeReasonModalBtn.addEventListener("click", () =>
      reasonModal.classList.remove("active")
    );
  if (cancelReasonBtn)
    cancelReasonBtn.addEventListener("click", () =>
      reasonModal.classList.remove("active")
    );
  if (saveReasonBtn) saveReasonBtn.addEventListener("click", handleSaveReason);
  if (deleteReasonBtn)
    deleteReasonBtn.addEventListener("click", handleDeleteReason);

  // Medewerkers modal
  if (manageEmployeesBtn)
    manageEmployeesBtn.addEventListener("click", () => {
      switchTab("employees-list");
      renderEmployeesTable();
      employeesModal.classList.add("active");
    });
  if (closeEmployeesModalBtn)
    closeEmployeesModalBtn.addEventListener("click", () =>
      employeesModal.classList.remove("active")
    );
  if (closeEmployeesBtn)
    closeEmployeesBtn.addEventListener("click", () =>
      employeesModal.classList.remove("active")
    );
  if (addEmployeeBtn)
    addEmployeeBtn.addEventListener("click", openAddEmployeeModal);
  if (backToListBtn)
    backToListBtn.addEventListener("click", () => switchTab("employees-list"));
  if (saveEmployeeBtn)
    saveEmployeeBtn.addEventListener("click", handleSaveEmployee);
  if (deleteEmployeeBtn)
    deleteEmployeeBtn.addEventListener("click", handleDeleteEmployee);

  // Tabs
  if (tabs) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });
  }

  // Medewerkers zoeken
  if (employeesSearchInput) {
    employeesSearchInput.addEventListener("input", (e) => {
      renderEmployeesTable(e.target.value.trim());
    });
  }

  // Kleurenkiezer voor redenen
  const colorOptions = document.querySelectorAll("#colorPicker .color-option");
  if (colorOptions) {
    colorOptions.forEach((option) => {
      option.addEventListener("click", () => {
        document
          .querySelectorAll("#colorPicker .color-option")
          .forEach((opt) => {
            opt.classList.remove("selected");
          });
        option.classList.add("selected");
        reasonColorInput.value = option.dataset.color;
      });
    });
  }

  // Kleurenkiezer voor teams
  const teamColorOptions = document.querySelectorAll(
    "#teamColorPicker .color-option"
  );
  if (teamColorOptions) {
    teamColorOptions.forEach((option) => {
      option.addEventListener("click", () => {
        document
          .querySelectorAll("#teamColorPicker .color-option")
          .forEach((opt) => {
            opt.classList.remove("selected");
          });
        option.classList.add("selected");
        teamColorInput.value = option.dataset.color;
      });
    });
  }

  // Periode navigatie
  if (prevBtn) prevBtn.addEventListener("click", () => handlePeriodChange(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => handlePeriodChange(1));
  if (todayBtn)
    todayBtn.addEventListener("click", () => {
      state.currentDate = new Date();
      updateCurrentPeriod();
      renderRoster();
    });

  // Weergave selector
  if (viewBtns) {
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => handleViewChange(btn.dataset.view));
    });
  }

  // Team filter
  if (teamFilter)
    teamFilter.addEventListener("change", () =>
      handleTeamFilterChange(teamFilter.value)
    );

  // Medewerker zoeken
  if (employeeSearch) {
    employeeSearch.addEventListener("input", (e) =>
      handleEmployeeSearch(e.target.value)
    );
    employeeSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleEmployeeSearch(e.target.value);
      }
    });
  }

  // Export
  if (exportBtn) exportBtn.addEventListener("click", handleExport);

  // Verlofredenen Manager Modal
  if (manageReasonsBtn)
    manageReasonsBtn.addEventListener("click", () => {
      renderReasonsTable();
      reasonsManagerModal.classList.add("active");
    });
  if (closeReasonsManagerModalBtn)
    closeReasonsManagerModalBtn.addEventListener("click", () =>
      reasonsManagerModal.classList.remove("active")
    );
  if (closeReasonsManagerBtn)
    closeReasonsManagerBtn.addEventListener("click", () =>
      reasonsManagerModal.classList.remove("active")
    );
  if (addReasonFromManagerBtn)
    addReasonFromManagerBtn.addEventListener("click", () => {
      openAddReasonModal();
      // We'll keep the manager modal open so user can see their new entry after saving
    });

  // Verlofredenen search input
  if (reasonsSearchInput)
    reasonsSearchInput.addEventListener("input", (e) => {
      renderReasonsTable(e.target.value.trim());
    });

  // Seniors Modal
  if (manageSeniorsBtn)
    manageSeniorsBtn.addEventListener("click", () => {
      // Populate team select
      seniorTeamSelect.innerHTML = '<option value="">Selecteer team</option>';
      state.teams
        .filter((t) => t.active)
        .forEach((team) => {
          seniorTeamSelect.innerHTML += `<option value="${team.id}">${team.name}</option>`;
        });

      seniorsModal.classList.add("active");
      renderSeniorsTable();
    });

  // Dagen-indicators Modal
  const manageDagenIndicatorsBtn = document.getElementById(
    "manageDagenIndicatorsBtn"
  );
  if (manageDagenIndicatorsBtn) {
    manageDagenIndicatorsBtn.addEventListener("click", () => {
      if (window.openIndicatorsModal) {
        window.openIndicatorsModal();
      } else {
        console.error("openIndicatorsModal functie niet gevonden");
        showSnackbar("Kon de dag-indicatoren niet laden", "error");
      }
    });
  }

  if (closeSeniorsModalBtn)
    closeSeniorsModalBtn.addEventListener("click", () =>
      seniorsModal.classList.remove("active")
    );

  if (closeSeniorsFormBtn)
    closeSeniorsFormBtn.addEventListener("click", () =>
      seniorsModal.classList.remove("active")
    );

  if (seniorTeamSelect)
    seniorTeamSelect.addEventListener("change", () => {
      renderSeniorsTable(seniorTeamSelect.value);
    });

  if (addSeniorBtn)
    addSeniorBtn.addEventListener("click", () => {
      const teamId = seniorTeamSelect.value;
      const medewerkerId = seniorEmployeeIdInput.value;

      if (!teamId || !medewerkerId) {
        showSnackbar("Selecteer een team en medewerker", "error");
        return;
      }

      // Check if already a senior
      const existingSenior = state.seniors.find(
        (s) =>
          s.teamId === parseInt(teamId) &&
          s.medewerkerId === parseInt(medewerkerId)
      );

      if (existingSenior) {
        showSnackbar("Deze medewerker is al senior in dit team", "error");
        return;
      }

      const seniorData = {
        teamId: parseInt(teamId),
        medewerkerId: parseInt(medewerkerId),
      };

      createSenior(seniorData)
        .then((result) => {
          // Get employee and team names
          const employee = state.employees.find(
            (e) => e.id === parseInt(medewerkerId)
          );
          const team = state.teams.find((t) => t.id === parseInt(teamId));

          // Add to state
          state.seniors.push({
            id: result.ID,
            teamId: parseInt(teamId),
            teamName: team ? team.name : "",
            medewerkerId: parseInt(medewerkerId),
            medewerkerName: employee ? employee.name : "",
          });

          // Reset form and update UI
          seniorEmployeeInput.value = "";
          seniorEmployeeIdInput.value = "";
          renderSeniorsTable(teamId);
          showSnackbar("Senior succesvol toegevoegd", "success");
        })
        .catch((error) => {
          console.error("Fout bij toevoegen senior:", error);
          showSnackbar("Fout bij toevoegen van senior", "error");
        });
    });

  // Initialize PeoplePicker for senior employee selection
  initPeoplePicker(
    "seniorEmployeeInput",
    "seniorEmployeeResults",
    "seniorEmployeeIdInput"
  );

  // Initialize PeoplePicker for team leader
  initPeoplePicker("teamLeaderInput", "teamLeaderResults", "teamLeaderIdInput");

  // Work Schedule Modal
  if (document.getElementById("closeWorkScheduleModalBtn"))
    document
      .getElementById("closeWorkScheduleModalBtn")
      .addEventListener("click", () =>
        document.getElementById("workScheduleModal").classList.remove("active")
      );
  if (document.getElementById("cancelWorkScheduleBtn"))
    document
      .getElementById("cancelWorkScheduleBtn")
      .addEventListener("click", () => {
        document.getElementById("workScheduleModal").classList.remove("active");
        welcomeBox.style.display = "none";
      });
  if (document.getElementById("saveWorkScheduleBtn"))
    document
      .getElementById("saveWorkScheduleBtn")
      .addEventListener("click", handleSaveWorkSchedule);

  // Add event handler for workScheduleSelect to update UI based on selection
  if (document.getElementById("workScheduleSelect")) {
    document
      .getElementById("workScheduleSelect")
      .addEventListener("change", function () {
        const value = this.value;
        if (value === "fulltime") {
          // 5 days, 8 hours each
          document
            .querySelectorAll(".workday-hours")
            .forEach((input) => {
              input.value = "8";
            });
          document
            .querySelectorAll(".workday-type")
            .forEach((select) => {
              select.value = "full";
            });
        } else if (value === "parttime-4") {
          // 4 days, make Friday 0
          document
            .querySelectorAll(".workday-hours")
            .forEach((input) => {
              input.value = "8";
            });
          document.getElementById("friday-hours").value = "0";
          document.getElementById("friday-type").value = "none";
        } else if (value === "parttime-3") {
          // 3 days, make Thursday and Friday 0
          document
            .querySelectorAll(".workday-hours")
            .forEach((input) => {
              input.value = "8";
            });
          document.getElementById("thursday-hours").value = "0";
          document.getElementById("thursday-type").value = "none";
          document.getElementById("friday-hours").value = "0";
          document.getElementById("friday-type").value = "none";
        }
        // parttime-custom doesn't need special handling - user sets values
      });
  }

  // Add event handlers for the workday type selectors
  document.querySelectorAll(".workday-type").forEach((select) => {
    select.addEventListener("change", function () {
      const hoursInput = this.closest(".workday-row").querySelector(
        ".workday-hours"
      );
      if (this.value === "none") {
        hoursInput.value = "0";
      } else if (this.value === "morning" || this.value === "afternoon") {
        if (parseInt(hoursInput.value) >= 6) {
          hoursInput.value = "4";
        }
      } else if (this.value === "full" && parseInt(hoursInput.value) === 0) {
        hoursInput.value = "8";
      }
    });
  });
}

// Functions for Seniors Management
function fetchSeniors() {
  const fields = SP_CONFIG.lists.seniors.fields;

  // When using $expand, we need to specify fields from the expanded entity
  return fetch(
    `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.seniors.guid}')/items?$select=ID,${fields.medewerker},${fields.medewerkerId}/ID,${fields.medewerkerId}/Title,${fields.team},${fields.teamId}&$expand=${fields.medewerkerId}`,
    {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        console.warn(
          "Error fetching seniors, returning empty array:",
          response.status
        );
        return { d: { results: [] } };
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !data.d || !data.d.results) {
        console.warn(
          "Invalid data structure from seniors API, returning empty array"
        );
        return [];
      }

      return data.d.results.map((item) => {
        // Extract the ID from the expanded lookup field
        const medewerkerId = item[fields.medewerkerId]
          ? item[fields.medewerkerId].ID
          : null;
        const teamId = item[fields.teamId] || null;

        // Get the corresponding employee and team
        const employee = state.employees.find(
          (emp) => emp.id === parseInt(medewerkerId)
        );
        const team = state.teams.find((t) => t.id === parseInt(teamId));

        return {
          id: item.ID,
          medewerkerId: medewerkerId,
          medewerkerName: employee
            ? employee.name
            : item[fields.medewerkerId]
            ? item[fields.medewerkerId].Title
            : "Unknown Employee",
          teamId: teamId,
          teamName: team ? team.name : item[fields.team] || "Unknown Team",
        };
      });
    })
    .catch((error) => {
      console.error("Error in fetchSeniors:", error);
      return [];
    });
}

function createSenior(seniorData) {
  const fields = SP_CONFIG.lists.seniors.fields;

  return getFormDigest()
    .then((formDigest) => {
      const payload = {
        __metadata: {
          type: `SP.Data.SeniorsListItem`,
        },
      };

      // FIXED: Use the correct field naming format for SharePoint lookup fields
      // For lookup fields in SharePoint REST API, we need to set the ID field correctly
      if (seniorData.medewerkerId) {
        // The proper format for lookup fields is FieldNameId (no space)
        payload[`${fields.medewerkerId}Id`] = parseInt(seniorData.medewerkerId);
      }

      if (seniorData.teamId) {
        payload[`${fields.teamId}Id`] = parseInt(seniorData.teamId);
      }

      // Add debugging to see the actual payload being sent
      console.log("Senior payload:", JSON.stringify(payload));

      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.seniors.guid}')/items`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
          },
          body: JSON.stringify(payload),
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        // Better error handling to capture the actual response details
        return response.text().then((text) => {
          console.error("Failed to create senior:", text);
          throw new Error(`Status: ${response.status} - ${text}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      return data.d;
    });
}

function deleteSenior(seniorId) {
  return getFormDigest()
    .then((formDigest) => {
      return fetch(
        `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.seniors.guid}')/items(${seniorId})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": formDigest,
            "X-HTTP-Method": "DELETE",
            "If-Match": "*",
          },
        }
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      return response;
    });
}

// Render seniors table for a specific team
function renderSeniorsTable(teamId) {
  if (!teamId) {
    seniorsTable.innerHTML =
      '<div class="data-state">Selecteer eerst een team</div>';
    addSeniorForm.style.display = "none";
    return;
  }

  const teamSeniors = state.seniors.filter(
    (senior) => senior.teamId === parseInt(teamId)
  );
  const team = state.teams.find((t) => t.id === parseInt(teamId));

  if (!team) {
    seniorsTable.innerHTML = '<div class="data-state">Team niet gevonden</div>';
    addSeniorForm.style.display = "none";
    return;
  }

  addSeniorForm.style.display = "block";

  if (teamSeniors.length === 0) {
    seniorsTable.innerHTML = `
            <div class="data-state">
                Geen seniors gevonden voor team "${team.name}"
            </div>
        `;
    return;
  }

  let html = `
        <h4>Seniors voor team "${team.name}"</h4>
        <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Medewerker</th>
                    <th style="text-align: right; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-200);">Acties</th>
                </tr>
            </thead>
            <tbody>
    `;

  teamSeniors.forEach((senior) => {
    html += `
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">${senior.medewerkerName}</td>
                <td style="text-align: right; padding: 0.5rem; border-bottom: 1px solid var(--color-gray-100);">
                    <button class="btn btn-danger" style="padding: 0.25rem 0.5rem;" onclick="window.removeSenior(${senior.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Verwijderen
                    </button>
                </td>
            </tr>
        `;
  });

  html += `
            </tbody>
        </table>
    `;

  seniorsTable.innerHTML = html;

  // Add function to window object for remove button
  window.removeSenior = function (seniorId) {
    if (
      confirm("Weet je zeker dat je deze senior wilt verwijderen uit het team?")
    ) {
      deleteSenior(seniorId)
        .then(() => {
          // Remove from state
          state.seniors = state.seniors.filter((s) => s.id !== seniorId);
          renderSeniorsTable(teamId);
          showSnackbar("Senior succesvol verwijderd", "success");
        })
        .catch((error) => {
          console.error("Fout bij verwijderen senior:", error);
          showSnackbar("Fout bij verwijderen van senior", "error");
        });
    }
  };
}

// Helper function to determine the work day type based on start and end times
function determineWorkDayType(startTime, endTime, hours) {
  // If no hours or zero hours, it's a free day (VVD)
  if (!hours || parseFloat(hours) === 0) {
    return "VVD";
  }

  // If no start or end time defined, can't determine type
  if (!startTime || !endTime) {
    return null;
  }

  // Convert times to minutes for easier comparison
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  // Define noon as 12:00 (720 minutes)
  const noon = 12 * 60;
  
  // If work ends before or at noon, it's only morning work (VVO = free afternoon)
  if (endMinutes <= noon) {
    return "VVO";
  }
  
  // If work starts at or after noon, it's only afternoon work (VVM = free morning)
  if (startMinutes >= noon) {
    return "VVM";
  }
  
  // Otherwise, it's a regular working day
  return null;
}

// Helper functie voor het converteren van tijd naar minuten
function timeToMinutes(timeString) {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper functie voor het converteren van minuten naar uren (met twee decimalen)
function minutesToHours(minutes) {
  return (minutes / 60).toFixed(1);
}

// Bereken de werkuren voor een dag op basis van starttijd en eindtijd
function calculateWorkHours(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  if (endMinutes <= startMinutes) return 0;
  return minutesToHours(endMinutes - startMinutes);
}

// Verzamel werkuren data uit de UI
function collectWorkHoursData() {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const workDays = {};

  days.forEach((day) => {
    const freeDay = document.getElementById(`${day}-free`).checked;
    const startTime = document.getElementById(`${day}-start`).value;
    const endTime = document.getElementById(`${day}-end`).value;

    workDays[day] = {
      isFreeDay: freeDay,
      startTime: freeDay ? "" : startTime,
      endTime: freeDay ? "" : endTime,
      hours: freeDay ? 0 : parseFloat(calculateWorkHours(startTime, endTime)),
    };
  });

  return {
    workDays,
    totalWeeklyHours: Object.values(workDays).reduce(
      (sum, day) => sum + day.hours,
      0
    ),
  };
}

// Initialiseer werkuren UI
function initWorkHoursUI() {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  days.forEach((day) => {
    const freeDayCheckbox = document.getElementById(`${day}-free`);
    const startTimeInput = document.getElementById(`${day}-start`);
    const endTimeInput = document.getElementById(`${day}-end`);

    freeDayCheckbox.addEventListener("change", () => {
      updateWorkHoursDisplay(
        day,
        freeDayCheckbox.checked,
        startTimeInput.value,
        endTimeInput.value
      );
      updateTotalWeeklyHours();
    });

    startTimeInput.addEventListener("change", () => {
      updateWorkHoursDisplay(
        day,
        freeDayCheckbox.checked,
        startTimeInput.value,
        endTimeInput.value
      );
      updateTotalWeeklyHours();
    });

    endTimeInput.addEventListener("change", () => {
      updateWorkHoursDisplay(
        day,
        freeDayCheckbox.checked,
        startTimeInput.value,
        endTimeInput.value
      );
      updateTotalWeeklyHours();
    });

    updateWorkHoursDisplay(
      day,
      freeDayCheckbox.checked,
      startTimeInput.value,
      endTimeInput.value
    );
  });

  updateTotalWeeklyHours();
}

// Update werkuren weergave
function updateWorkHoursDisplay(dayId, isFreeDayChecked, startTime, endTime) {
  const hoursDisplay = document.getElementById(`${dayId}-hours-display`);
  const timeInputs = document
    .getElementById(`${dayId}-start`)
    .closest(".time-inputs");

  if (isFreeDayChecked) {
    hoursDisplay.textContent = "0 uren";
    timeInputs.classList.add("disabled-time-inputs");
  } else {
    const hours = calculateWorkHours(startTime, endTime);
    hoursDisplay.textContent = `${hours} uren`;
    timeInputs.classList.remove("disabled-time-inputs");
  }
}

// Update totaal aantal werkuren per week
function updateTotalWeeklyHours() {
  const workHoursData = collectWorkHoursData();
  document.getElementById("total-weekly-hours").textContent =
    workHoursData.totalWeeklyHours;
}

// Voeg werkuren data op in SharePoint
function handleSaveWorkSchedule() {
  const employeeId = parseInt(
    document.getElementById("workScheduleEmployeeId").value
  );
  if (!employeeId) {
    showSnackbar("Medewerker ID ontbreekt", "error");
    return;
  }

  const workHoursData = collectWorkHoursData();

  updateEmployeeWorkSchedule(employeeId, {
    weeklyHours: workHoursData.totalWeeklyHours,
    workDays: JSON.stringify(workHoursData.workDays),
  })
    .then(() => {
      showSnackbar("Werkschema succesvol opgeslagen", "success");
    })
    .catch((error) => {
      console.error("Fout bij opslaan werkschema:", error);
      showSnackbar("Fout bij opslaan werkschema", "error");
    });
}

// Initialiseer werkuren UI bij laden van de pagina
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("workDaysContainer")) {
    initWorkHoursUI();
  }
});

// Initialisatie
function init() {
  state.currentDate = new Date();
  updateCurrentPeriod();
  setupEventListeners();

  // Haal de huidige gebruiker op
  getCurrentUser()
    .then((user) => {
      state.currentUser = user;

      // Laad alle data
      return Promise.all([
        fetchEmployees(),
        fetchTeams(),
        fetchReasons(),
        fetchLeaves(),
        fetchSeniors(), // Add seniors fetch
        fetchWorkSchedules(), // Add work schedules fetch
      ]);
    })
    .then(([employees, teams, reasons, leaves, seniors, workSchedules]) => {
      state.employees = employees;
      state.teams = teams;
      state.reasons = reasons;
      state.leaves = leaves;
      state.seniors = seniors; // Store seniors in state
      state.workSchedules = workSchedules; // Store work schedules in state
      state.isLoading = false;

      // Controleer of de huidige gebruiker is geregistreerd
      if (state.currentUser) {
        return checkUserRegistration(state.currentUser).then((isRegistered) => {
          state.isRegistered = isRegistered;
          updateUserInfo();
        });
      }

      return Promise.resolve();
    })
    .then(() => {
      console.log("Data geladen:", {
        medewerkers: state.employees.length,
        teams: state.teams.length,
        verlofredenen: state.reasons.length,
        verlof: state.leaves.length,
        seniors: state.seniors.length,
        workSchedules: state.workSchedules.length,
        gebruiker: state.currentUser,
        isAdmin: state.currentUser?.isAdmin,
        isRegistered: state.isRegistered,
      });

      // Update UI
      updateUserInfo();
      updateLegend();
      populateTeamFilter();
      populateEmployeeSelect();
      populateReasonSelect();
      populateTeamSelects();
      renderRoster();
    })
    .catch((error) => {
      console.error("Fout bij laden data:", error);
      loadingIndicator.style.display = "none";
      teamRoster.innerHTML = `
                <div class="data-state">
                    Er is een fout opgetreden bij het laden van de data. Probeer de pagina te vernieuwen.
                </div>
            `;
    });
}

// Start de applicatie
init();

<<<<<<< HEAD
// Function to find employee by email
function findEmployeeByEmail(email) {
  if (!email) return null;
  
  // Case-insensitive search for employee with matching email
  return state.employees.find(
    emp => emp.email && emp.email.toLowerCase() === email.toLowerCase()
  );
}

// Function to fetch dagen-indicators from SharePoint
function fetchDagenIndicators() {
  const fields = SP_CONFIG.lists.dagenIndicators.fields;
  return fetch(
    `${SP_CONFIG.apiUrl}/lists(guid'${SP_CONFIG.lists.dagenIndicators.guid}')/items?$select=ID,${fields.titel},${fields.kleur},${fields.patroon}`,
    {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data.d.results.map((item) => ({
        id: item.ID,
        title: item[fields.titel],
        color: item[fields.kleur] || "#cccccc",
        pattern: item[fields.patroon] || "Effen"
      }));
    });
}

=======
>>>>>>> 9f4c84f3aa6cbf7666234d7bdd14f6fec224cae9

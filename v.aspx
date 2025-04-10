<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teamverlofrooster</title>
    <link rel="stylesheet" type="text/css" href="css/v.css">
</head>

<body>
    <header class="header">
        <div class="container">
            <nav class="navbar">
                <div class="logo">
                    <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Teamverlofrooster
                </div>

                <div class="actions">
                    <!-- Export naar Excel knop -->
                    <button class="btn btn-export" id="exportBtn" title="Exporteren naar Excel">
                        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="8" y1="13" x2="16" y2="13"></line>
                            <line x1="8" y1="17" x2="16" y2="17"></line>
                            <line x1="10" y1="9" x2="14" y2="9"></line>
                        </svg>
                        Export
                    </button>

                    <!-- Admin dropdown voor beheerders -->
                    <div class="dropdown" id="adminDropdown" style="display: none;">
                        <button class="btn btn-secondary">
                            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path
                                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                                </path>
                            </svg>
                            Beheer
                        </button>
                        <div class="dropdown-content">
                            <a class="dropdown-item" id="addTeamBtn">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Team toevoegen
                            </a>

                            <div class="dropdown-divider" style="border-top-style: dotted;"></div>

                            <a class="dropdown-item" id="manageReasonsBtn">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Verlofredenen beheren
                            </a>

                            <a class="dropdown-item" id="manageSeniorsBtn">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Team Seniors Beheren
                            </a>

                            <a class="dropdown-item" id="manageEmployeesBtn">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Medewerkers beheren
                            </a>

                            <a class="dropdown-item" id="manageDagenIndicatorsBtn">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="9" cy="12" r="2"></circle>
                                    <circle cx="15" cy="12" r="2"></circle>
                                </svg>
                                Dag-indicatoren beheren
                            </a>
                        </div>
                    </div>

                    <!-- Toevoegen dropdown met 3 opties -->
                    <div class="add-dropdown">
                        <button class="btn btn-primary add-dropdown-btn">
                            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            + Toevoegen
                        </button>
                        <div class="add-dropdown-content">
                            <a class="dropdown-item" id="addLeaveBtn">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Verlof toevoegen
                            </a>
                            <a class="dropdown-item" id="addTeamMemberBtn">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                                Teamlid toevoegen
                            </a>
                            <a class="dropdown-item" id="addTeamBtn2">
                                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Team toevoegen
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Gebruikersinfo -->
                <div class="user-info" id="userInfo">
                    <div class="user-avatar" id="userAvatar">?</div>
                    <span id="userName">Laden...</span>
                </div>

                <!-- Gebruikers settings dropdown -->
                <div class="user-settings">
                    <button class="user-settings-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="user-settings-content">
                        <a class="dropdown-item" id="userSettingsBtn">
                            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path
                                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                                </path>
                            </svg>
                            Instellingen
                        </a>
                        <a class="dropdown-item" id="userProfileBtn">
                            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Mijn profiel
                        </a>
                        <a class="dropdown-item" id="userHelpBtn">
                            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            Help
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <!-- Zelfregistratie box (alleen tonen als gebruiker nog niet is geregistreerd) -->
            <div class="welcome-box" id="welcomeBox" style="display: none;">
                <h2 class="welcome-title">Welkom bij het Teamverlofrooster</h2>
                <p class="welcome-text">Je bent nog niet geregistreerd in dit systeem. Registreer jezelf om verlof te
                    kunnen aanvragen.</p>
                <div class="welcome-actions">
                    <button class="btn btn-primary" id="registerBtn">Registreren</button>
                </div>
            </div>

            <!-- Bedieningspaneel -->
            <div class="control-panel">
                <div class="period-selector">
                    <div class="period-nav">
                        <button class="period-nav-btn" id="prevBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <div class="period-display" id="currentPeriod">Laden...</div>
                        <button class="period-nav-btn" id="nextBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                    <button class="btn btn-secondary" id="todayBtn">Vandaag</button>
                </div>

                <div class="view-selector">
                    <div class="view-btn-group">
                        <button class="view-btn" data-view="week">Week</button>
                        <button class="view-btn active" data-view="month">Maand</button>
                        <button class="view-btn" data-view="quarter">Kwartaal</button>
                    </div>
                </div>

                <div class="search-box">
                    <input type="text" class="search-input" id="employeeSearch" placeholder="Zoek medewerker...">
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>

                <div class="team-selector">
                    <label class="team-label">Team:</label>
                    <select class="team-select" id="teamFilter">
                        <option value="all">Alle teams</option>
                        <!-- Teams worden hier ingeladen -->
                    </select>
                </div>
            </div>

            <!-- Legenda -->
            <div class="legend" id="legendContainer">
                <!-- Sectie 1: Verlofredenen legenda -->
                <div class="legend-section" id="legendVerlofredenen">
                    <div class="legend-section-title">Verlofredenen</div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: var(--color-gray-50);"></div>
                        <span>Weekend</span>
                    </div>
                    <!-- Overige verlofredenen worden hier dynamisch ingeladen -->
                </div>

                <!-- Sectie 2: Dagen-indicator legenda -->
                <div class="legend-section" id="legendDagenIndicator" data-type="dagen">
                    <div class="legend-section-title">Dagen-indicators</div>
                    <div class="legend-section-content">
                        <!-- Dagen-indicators worden hier dynamisch ingeladen door dagen-indicators.js -->
                    </div>
                </div>

                <!-- Sectie 3: Horen-indicator legenda -->
                <div class="legend-section" id="legendHorenIndicator">
                    <div class="legend-section-title">Horen-indicators</div>
                    <div class="legend-person horen-yes">
                        <span>Beoordelaar beschikbaar voor horen</span>
                        <span class="legend-email"></span>
                    </div>
                    <div class="legend-person horen-no">
                        <span>Beoordelaar niet beschikbaar voor horen</span>
                    </div>
                </div>
            </div>

            <!-- Laadanimatie -->
            <div class="loading" id="loadingIndicator">
                <div class="spinner"></div>
                <p>Verlofgegevens laden...</p>
            </div>

            <!-- Teammembers overzicht -->
            <div class="team-roster" id="teamRoster">
                <!-- Teams en medewerkers worden hier ingeladen -->
            </div>
        </div>
    </main>

    <!-- Verlof toevoegen/bewerken Modal -->
    <div class="modal-backdrop" id="leaveModal">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title" id="leaveModalTitle">Verlof Toevoegen</h3>
                <button class="modal-close" id="closeLeaveModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Medewerker</label>
                    <select class="form-control" id="employeeSelect" required>
                        <option value="">Selecteer medewerker</option>
                        <!-- Medewerkers worden hier ingeladen -->
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Reden</label>
                    <select class="form-control" id="reasonSelect" required>
                        <option value="">Selecteer reden</option>
                        <!-- Redenen worden hier ingeladen -->
                    </select>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <div class="form-group">
                            <label class="form-label">Van</label>
                            <input type="date" class="form-control" id="startDateInput" required>
                        </div>
                    </div>
                    <div class="form-col">
                        <div class="form-group">
                            <label class="form-label">Tot</label>
                            <input type="date" class="form-control" id="endDateInput" required>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Omschrijving</label>
                    <input type="text" class="form-control" id="descriptionInput"
                        placeholder="Bijv. Zomervakantie, Training, etc.">
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="workdaysOnlyCheckbox"> Alleen werkdagen (ma-vr)
                    </label>
                </div>

                <!-- Status veld alleen zichtbaar voor beheerders -->
                <div class="form-group" id="statusField" style="display: none;">
                    <label class="form-label">Status</label>
                    <select class="form-control" id="statusSelect">
                        <option value="Aangevraagd">Aangevraagd</option>
                        <option value="Goedgekeurd">Goedgekeurd</option>
                        <option value="Afgewezen">Afgewezen</option>
                    </select>
                </div>

                <input type="hidden" id="leaveIdInput" value="">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelLeaveBtn">Annuleren</button>
                <button class="btn btn-danger" id="deleteLeaveBtn" style="display: none;">Verwijderen</button>
                <button class="btn btn-primary" id="saveLeaveBtn">Opslaan</button>
            </div>
        </div>
    </div>

    <!-- Medewerker Registratie Modal -->
    <div class="modal-backdrop" id="registerModal">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Registreren als Medewerker</h3>
                <button class="modal-close" id="closeRegisterModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Naam</label>
                    <input type="text" class="form-control" id="registerNameInput" placeholder="Voornaam Achternaam"
                        required>
                </div>

                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="email" class="form-control" id="registerEmailInput" placeholder="naam@voorbeeld.nl"
                        required>
                </div>

                <div class="form-group">
                    <label class="form-label">Team</label>
                    <select class="form-control" id="registerTeamSelect" required>
                        <option value="">Selecteer je team</option>
                        <!-- Teams worden hier ingeladen -->
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Functie</label>
                    <input type="text" class="form-control" id="registerFunctionInput"
                        placeholder="Bijv. Developer, Manager, etc.">
                </div>

                <div class="form-group">
                    <label class="form-label">Rol</label>
                    <select class="form-control" id="registerRoleSelect">
                        <option value="Medewerker">Medewerker</option>
                        <option value="Senior">Senior</option>
                        <option value="Teamleider">Teamleider</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelRegisterBtn">Annuleren</button>
                <button class="btn btn-primary" id="saveRegisterBtn">Registreren</button>
            </div>
        </div>
    </div>

    <!-- Working Hours Registration Modal (Step 2) -->
    <div class="modal-backdrop" id="workScheduleModal">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Werkschema instellen</h3>
                <button class="modal-close" id="closeWorkScheduleModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <p>Geef je standaard werkschema op. Dit helpt bij het plannen van verlof.</p>

                <div class="form-group">
                    <label class="form-label">Totaal uren per week</label>
                    <input type="number" class="form-control" id="weeklyHoursInput" min="0" max="40" value="40">
                </div>

                <div class="form-group">
                    <label class="form-label">Werkschema</label>
                    <select class="form-control" id="workScheduleSelect">
                        <option value="fulltime">Fulltime (5 dagen)</option>
                        <option value="parttime-4">Parttime (4 dagen)</option>
                        <option value="parttime-3">Parttime (3 dagen)</option>
                        <option value="parttime-custom">Aangepast schema</option>
                    </select>
                </div>

                <div id="workDaysContainer" class="work-days-container">
                    <div class="form-group">
                        <h4>Werktijden per dag</h4>
                        <p class="form-hint">Vul voor elke werkdag de begin- en eindtijd in. Selecteer 'Vrije dag' voor
                            dagen waarop u niet werkt.</p>
                    </div>

                    <div class="workday-row">
                        <div class="workday-day">
                            <label class="form-label">Maandag</label>
                        </div>
                        <div class="workday-times">
                            <div class="time-inputs">
                                <input type="time" class="form-control start-time" id="monday-start" value="09:00">
                                <span class="time-separator">tot</span>
                                <input type="time" class="form-control end-time" id="monday-end" value="17:00">
                            </div>
                        </div>
                        <div class="workday-hours" id="monday-hours-display">8 uren</div>
                        <div class="workday-free">
                            <label class="checkbox-container">
                                <input type="checkbox" id="monday-free" class="free-day-checkbox"> Vrije dag
                            </label>
                        </div>
                    </div>
                    <!-- Dinsdag -->
                    <div class="workday-row">
                        <div class="workday-day">
                            <label class="form-label">Dinsdag</label>
                        </div>
                        <div class="workday-times">
                            <div class="time-inputs">
                                <input type="time" class="form-control start-time" id="tuesday-start" value="09:00">
                                <span class="time-separator">tot</span>
                                <input type="time" class="form-control end-time" id="tuesday-end" value="17:00">
                            </div>
                        </div>
                        <div class="workday-hours" id="tuesday-hours-display">8 uren</div>
                        <div class="workday-free">
                            <label class="checkbox-container">
                                <input type="checkbox" id="tuesday-free" class="free-day-checkbox"> Vrije dag
                            </label>
                        </div>
                    </div>

                    <!-- Woensdag -->
                    <div class="workday-row">
                        <div class="workday-day">
                            <label class="form-label">Woensdag</label>
                        </div>
                        <div class="workday-times">
                            <div class="time-inputs">
                                <input type="time" class="form-control start-time" id="wednesday-start" value="09:00">
                                <span class="time-separator">tot</span>
                                <input type="time" class="form-control end-time" id="wednesday-end" value="17:00">
                            </div>
                        </div>
                        <div class="workday-hours" id="wednesday-hours-display">8 uren</div>
                        <div class="workday-free">
                            <label class="checkbox-container">
                                <input type="checkbox" id="wednesday-free" class="free-day-checkbox"> Vrije dag
                            </label>
                        </div>
                    </div>

                    <!-- Donderdag -->
                    <div class="workday-row">
                        <div class="workday-day">
                            <label class="form-label">Donderdag</label>
                        </div>
                        <div class="workday-times">
                            <div class="time-inputs">
                                <input type="time" class="form-control start-time" id="thursday-start" value="09:00">
                                <span class="time-separator">tot</span>
                                <input type="time" class="form-control end-time" id="thursday-end" value="17:00">
                            </div>
                        </div>
                        <div class="workday-hours" id="thursday-hours-display">8 uren</div>
                        <div class="workday-free">
                            <label class="checkbox-container">
                                <input type="checkbox" id="thursday-free" class="free-day-checkbox"> Vrije dag
                            </label>
                        </div>
                    </div>

                    <!-- Vrijdag -->
                    <div class="workday-row">
                        <div class="workday-day">
                            <label class="form-label">Vrijdag</label>
                        </div>
                        <div class="workday-times">
                            <div class="time-inputs">
                                <input type="time" class="form-control start-time" id="friday-start" value="09:00">
                                <span class="time-separator">tot</span>
                                <input type="time" class="form-control end-time" id="friday-end" value="17:00">
                            </div>
                        </div>
                        <div class="workday-hours" id="friday-hours-display">8 uren</div>
                        <div class="workday-free">
                            <label class="checkbox-container">
                                <input type="checkbox" id="friday-free" class="free-day-checkbox"> Vrije dag
                            </label>
                        </div>
                    </div>

                    <div class="form-group total-hours">
                        <label class="form-label">Totaal uren per week: <span id="total-weekly-hours">40</span></label>
                    </div>
                </div>

                <input type="hidden" id="workScheduleEmployeeId" value="">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelWorkScheduleBtn">Overslaan</button>
                <button class="btn btn-primary" id="saveWorkScheduleBtn">Opslaan</button>
            </div>
        </div>
    </div>

    <!-- Verlofreden Toevoegen Modal -->
    <div class="modal-backdrop" id="reasonModal">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title" id="reasonModalTitle">Verlofreden Toevoegen</h3>
                <button class="modal-close" id="closeReasonModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Naam</label>
                    <input type="text" class="form-control" id="reasonNameInput"
                        placeholder="Bijv. Vakantie, Ziekte, etc." required>
                </div>

                <div class="form-group">
                    <label class="form-label">Kleur</label>
                    <input type="text" class="form-control" id="reasonColorInput" placeholder="#rrggbb">
                    <div class="color-picker" id="colorPicker">

                        <div class="color-option" style="background-color: #ffedd5;" data-color="#ffedd5"></div>
                        <div class="color-option" style="background-color: #3b82f6;" data-color="#3b82f6"></div>
                        <div class="color-option" style="background-color: #ef4444;" data-color="#ef4444"></div>
                        <div class="color-option" style="background-color: #22c55e;" data-color="#22c55e"></div>
                        <div class="color-option" style="background-color: #eab308;" data-color="#eab308"></div>
                        <div class="color-option" style="background-color: #8b5cf6;" data-color="#8b5cf6"></div>
                        <div class="color-option" style="background-color: #f97316;" data-color="#f97316"></div>
                        <div class="color-option" style="background-color: #ec4899;" data-color="#ec4899"></div>
                        <div class="color-option" style="background-color: #06b6d4;" data-color="#06b6d4"></div>
                        <div class="color-option" style="background-color: #14b8a6;" data-color="#14b8a6"></div>
                        <div class="color-option" style="background-color: #6366f1;" data-color="#6366f1"></div>
                        <div class="color-option" style="background-color: #a3e635;" data-color="#a3e635"></div>
                        <div class="color-option" style="background-color: #71717a;" data-color="#71717a"></div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="countAsLeaveCheckbox" checked> Telt als verlofdag
                    </label>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="requiresApprovalCheckbox" checked> Goedkeuring vereist
                    </label>
                </div>

                <input type="hidden" id="reasonIdInput" value="">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelReasonBtn">Annuleren</button>
                <button class="btn btn-danger" id="deleteReasonBtn" style="display: none;">Verwijderen</button>
                <button class="btn btn-primary" id="saveReasonBtn">Opslaan</button>
            </div>
        </div>
    </div>

    <!-- Team Toevoegen Modal -->
    <div class="modal-backdrop" id="teamModal">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title" id="teamModalTitle">Team Toevoegen</h3>
                <button class="modal-close" id="closeTeamModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Naam</label>
                    <input type="text" class="form-control" id="teamNameInput"
                        placeholder="Bijv. Development, Sales, etc." required>
                </div>

                <div class="form-group">
                    <label class="form-label">Teamleider</label>
                    <div class="people-picker-container" id="teamLeaderPicker">
                        <input type="text" class="form-control people-picker-input" id="teamLeaderInput"
                            placeholder="Zoek naar een gebruiker...">
                        <div class="people-picker-results" id="teamLeaderResults"></div>
                    </div>
                    <input type="hidden" id="teamLeaderIdInput">
                </div>

                <div class="form-group">
                    <label class="form-label">Kleur</label>
                    <input type="text" class="form-control" id="teamColorInput" placeholder="#rrggbb">
                    <div class="color-picker" id="teamColorPicker">
                        <div class="color-option" style="background-color: #2563eb;" data-color="#2563eb"></div>
                        <div class="color-option" style="background-color: #10b981;" data-color="#10b981"></div>
                        <div class="color-option" style="background-color: #ef4444;" data-color="#ef4444"></div>
                        <div class="color-option" style="background-color: #f59e0b;" data-color="#f59e0b"></div>
                        <div class="color-option" style="background-color: #8b5cf6;" data-color="#8b5cf6"></div>
                        <div class="color-option" style="background-color: #f97316;" data-color="#f97316"></div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="teamActiveCheckbox" checked> Actief
                    </label>
                </div>

                <input type="hidden" id="teamIdInput" value="">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelTeamBtn">Annuleren</button>
                <button class="btn btn-danger" id="deleteTeamBtn" style="display: none;">Verwijderen</button>
                <button class="btn btn-primary" id="saveTeamBtn">Opslaan</button>
            </div>
        </div>
    </div>

    <!-- Medewerkers Beheren Modal -->
    <div class="modal-backdrop" id="employeesModal">
        <div class="modal" style="max-width: 800px;">
            <div class="modal-header">
                <h3 class="modal-title">Medewerkers Beheren</h3>
                <button class="modal-close" id="closeEmployeesModalBtn">&times;"></button>
            </div>
            <div class="modal-body">
                <div class="tabs">
                    <div class="tab active" data-tab="employees-list">Alle medewerkers</div>
                    <div class="tab" data-tab="employee-edit">Medewerker bewerken</div>
                </div>

                <div class="tab-content active" id="employees-list">
                    <div class="search-box" style="width: 100%; max-width: none; margin-bottom: 1rem;">
                        <input type="text" class="search-input" id="employeesSearchInput"
                            placeholder="Zoek medewerker...">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>

                    <div id="employeesTable" style="max-height: 400px; overflow-y: auto;">
                        <!-- Medewerkers tabel wordt hier ingeladen -->
                    </div>
                </div>

                <div class="tab-content" id="employee-edit">
                    <div class="form-group">
                        <label class="form-label">Naam</label>
                        <input type="text" class="form-control" id="editEmployeeNameInput" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">E-mail</label>
                        <input type="email" class="form-control" id="editEmployeeEmailInput" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Team</label>
                        <select class="form-control" id="editEmployeeTeamSelect" required>
                            <option value="">Selecteer team</option>
                            <!-- Teams worden hier ingeladen -->
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Functie</label>
                        <input type="text" class="form-control" id="editEmployeeFunctionInput">
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="editEmployeeActiveCheckbox" checked> Actief
                        </label>
                    </div>

                    <div class="form-group" id="horenFieldContainer" style="display: none;">
                        <label class="form-label">
                            <input type="checkbox" id="editEmployeeHorenCheckbox"> Horen
                        </label>
                    </div>

                    <input type="hidden" id="editEmployeeIdInput" value="">
                </div>
            </div>
            <div class="modal-footer" id="employees-list-footer">
                <button class="btn btn-secondary" id="closeEmployeesBtn">Sluiten</button>
                <button class="btn btn-primary" id="addEmployeeBtn">Nieuwe Medewerker</button>
            </div>
            <div class="modal-footer" id="employee-edit-footer" style="display: none;">
                <button class="btn btn-secondary" id="backToListBtn">Terug naar lijst</button>
                <button class="btn btn-danger" id="deleteEmployeeBtn">Verwijderen</button>
                <button class="btn btn-primary" id="saveEmployeeBtn">Opslaan</button>
            </div>
        </div>
    </div>

    <!-- Verlofredenen Beheren Modal -->
    <div class="modal-backdrop" id="reasonsManagerModal">
        <div class="modal" style="max-width: 800px;">
            <div class="modal-header">
                <h3 class="modal-title">Verlofredenen Beheren</h3>
                <button class="modal-close" id="closeReasonsManagerModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="search-box" style="width: 100%; max-width: none; margin-bottom: 1rem;">
                    <input type="text" class="search-input" id="reasonsSearchInput" placeholder="Zoek verlofreden...">
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>

                <div id="reasonsTable" style="max-height: 400px; overflow-y: auto;">
                    <!-- Verlofredenen tabel wordt hier ingeladen -->
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="closeReasonsManagerBtn">Sluiten</button>
                <button class="btn btn-primary" id="addReasonFromManagerBtn">Nieuwe Verlofreden</button>
            </div>
        </div>
    </div>

    <!-- Seniors Beheren Modal -->
    <div class="modal-backdrop" id="seniorsModal">
        <div class="modal" style="max-width: 800px;">
            <div class="modal-header">
                <h3 class="modal-title">Team Seniors Beheren</h3>
                <button class="modal-close" id="closeSeniorsModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Team</label>
                    <select class="form-control" id="seniorTeamSelect">
                        <option value="">Selecteer team</option>
                        <!-- Teams worden hier ingeladen -->
                    </select>
                </div>

                <div id="seniorsTable" style="margin-top: 1rem;">
                    <div class="data-state">Selecteer eerst een team</div>
                </div>

                <div id="addSeniorForm"
                    style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-gray-200); display: none;">
                    <h4>Senior toevoegen</h4>
                    <div class="form-group">
                        <label class="form-label">Medewerker</label>
                        <div class="people-picker-container" id="seniorEmployeePicker">
                            <input type="text" class="form-control people-picker-input" id="seniorEmployeeInput"
                                placeholder="Zoek naar een medewerker...">
                            <div class="people-picker-results" id="seniorEmployeeResults"></div>
                        </div>
                        <input type="hidden" id="seniorEmployeeIdInput">
                    </div>
                    <button class="btn btn-primary" id="addSeniorBtn">Toevoegen</button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="closeSeniorsFormBtn">Sluiten</button>
            </div>
        </div>
    </div>

    <!-- Snackbar voor notificaties -->
    <div class="snackbar" id="snackbar"></div>

    <!-- Gebruikersinstellingen Modal -->
    <div class="modal-backdrop" id="userSettingsModal">
        <div class="modal" style="max-width: 600px;">
            <div class="modal-header">
                <h3 class="modal-title">Instellingen</h3>
                <button class="modal-close" id="closeUserSettingsModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tabs">
                    <div class="tab active" data-tab="view-settings">Weergave</div>
                    <div class="tab" data-tab="notifications-settings">Notificaties</div>
                    <div class="tab" data-tab="work-schedule">Werkschema</div>
                </div>

                <!-- Weergave instellingen -->
                <div class="tab-content active" id="view-settings">
                    <div class="form-group">
                        <label class="form-label">Standaard weergave</label>
                        <select class="form-control" id="defaultViewSelect">
                            <option value="week">Week</option>
                            <option value="month" selected>Maand</option>
                            <option value="quarter">Kwartaal</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Standaard teamfilter</label>
                        <select class="form-control" id="defaultTeamSelect">
                            <option value="all">Alle teams</option>
                            <option value="my-team">Mijn team</option>
                            <!-- Andere teams worden hier dynamisch ingeladen -->
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="showWeekendsCheckbox" checked> Weekenden weergeven
                        </label>
                    </div>
                </div>

                <!-- Notificatie instellingen -->
                <div class="tab-content" id="notifications-settings">
                    <div class="form-group">
                        <label class="form-label">Verlofaanvragen</label>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" id="notifyLeaveRequestsCheckbox" checked> Notificaties ontvangen
                                voor verlofaanvragen
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Verlofstatuswijzigingen</label>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" id="notifyLeaveStatusCheckbox" checked> Notificaties ontvangen
                                bij statuswijzigingen
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">E-mail notificaties</label>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" id="emailNotificationsCheckbox"> E-mail notificaties ontvangen
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Werkschema instellingen -->
                <div class="tab-content" id="work-schedule">
                    <div class="form-group">
                        <label class="form-label">Totaal uren per week</label>
                        <input type="number" class="form-control" id="settingsWeeklyHoursInput" min="0" max="40"
                            value="40">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Werkschema</label>
                        <select class="form-control" id="settingsWorkScheduleSelect">
                            <option value="fulltime">Fulltime (5 dagen)</option>
                            <option value="parttime-4">Parttime (4 dagen)</option>
                            <option value="parttime-3">Parttime (3 dagen)</option>
                            <option value="parttime-custom">Aangepast schema</option>
                        </select>
                    </div>

                    <div id="settingsWorkDaysContainer">
                        <!-- Work days UI will be inserted here by JavaScript -->
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelUserSettingsBtn">Annuleren</button>
                <button class="btn btn-primary" id="saveUserSettingsBtn">Opslaan</button>
            </div>
        </div>
    </div>

    <!-- Gebruikersprofiel Modal -->
    <div class="modal-backdrop" id="userProfileModal">
        <div class="modal" style="max-width: 700px;">
            <div class="modal-header">
                <h3 class="modal-title">Mijn Profiel</h3>
                <button class="modal-close" id="closeUserProfileModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="profile-header">
                    <div class="profile-avatar-container" id="profileAvatarContainer">
                        <div class="profile-avatar" id="profileAvatar"></div>
                        <div class="profile-avatar-overlay">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z">
                                </path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                        </div>
                    </div>
                    <div class="profile-info">
                        <h2 id="profileName">-</h2>
                        <p id="profileFunction">-</p>
                        <p id="profileTeam">-</p>
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Persoonlijke gegevens</h3>
                    <div class="form-group">
                        <label class="form-label">Naam</label>
                        <input type="text" class="form-control" id="profileNameInput">
                    </div>
                    <div class="form-group">
                        <label class="form-label">E-mail</label>
                        <input type="email" class="form-control" id="profileEmailInput" readonly>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Functie</label>
                        <input type="text" class="form-control" id="profileFunctionInput">
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Verlofoverzicht</h3>
                    <div class="leave-summary">
                        <div class="leave-summary-item">
                            <div class="leave-summary-value" id="currentLeaveBalance">-</div>
                            <div class="leave-summary-label">Verlofsaldo</div>
                        </div>
                        <div class="leave-summary-item">
                            <div class="leave-summary-value" id="pendingLeaveRequests">-</div>
                            <div class="leave-summary-label">In behandeling</div>
                        </div>
                        <div class="leave-summary-item">
                            <div class="leave-summary-value" id="approvedLeaveRequests">-</div>
                            <div class="leave-summary-label">Goedgekeurd</div>
                        </div>
                    </div>

                    <div class="leave-history" id="leaveHistoryContainer">
                        <h4>Recente verlofaanvragen</h4>
                        <div id="leaveHistoryList">
                            <!-- Verlofdagen worden hier dynamisch ingeladen -->
                            <div class="data-state">Geen recente verlofaanvragen</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="closeProfileBtn">Sluiten</button>
                <button class="btn btn-primary" id="saveProfileBtn">Wijzigingen opslaan</button>
            </div>
        </div>
    </div>

    <!-- Help Modal -->
    <div class="modal-backdrop" id="helpModal">
        <div class="modal" style="max-width: 800px;">
            <div class="modal-header">
                <h3 class="modal-title">Help</h3>
                <button class="modal-close" id="closeHelpModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tabs">
                    <div class="tab active" data-tab="help-overview">Overzicht</div>
                    <div class="tab" data-tab="help-leave">Verlof</div>
                    <div class="tab" data-tab="help-calendar">Kalender</div>
                    <div class="tab" data-tab="help-faq">FAQ</div>
                </div>

                <!-- Overzicht -->
                <div class="tab-content active" id="help-overview">
                    <h3>Welkom bij het Teamverlofrooster</h3>
                    <p>Het Teamverlofrooster is een applicatie waarmee je gemakkelijk verlof kunt aanvragen en beheren
                        voor jezelf en je team. Deze help-sectie biedt informatie over hoe je de verschillende functies
                        van de applicatie kunt gebruiken.</p>

                    <h4>Hoofdfuncties</h4>
                    <ul>
                        <li><strong>Verlofrooster bekijken</strong> - Zie het verlofrooster van je team in verschillende
                            weergaven (week, maand, kwartaal)</li>
                        <li><strong>Verlof aanvragen</strong> - Dien verlofaanvragen in voor jezelf</li>
                        <li><strong>Verlof beheren</strong> - Als teamleider of senior kun je verlofaanvragen goedkeuren
                            of afwijzen</li>
                        <li><strong>Instellingen aanpassen</strong> - Pas je persoonlijke instellingen aan</li>
                    </ul>
                </div>

                <!-- Verlof -->
                <div class="tab-content" id="help-leave">
                    <h3>Verlof aanvragen en beheren</h3>

                    <h4>Verlof aanvragen</h4>
                    <ol>
                        <li>Klik op de knop "+ Toevoegen" in de rechterbovenhoek</li>
                        <li>Kies "Verlof toevoegen"</li>
                        <li>Vul de verlofinformatie in:
                            <ul>
                                <li>Medewerker (standaard jezelf)</li>
                                <li>Reden voor verlof</li>
                                <li>Start- en einddatum</li>
                                <li>Optionele omschrijving</li>
                            </ul>
                        </li>
                        <li>Klik op "Opslaan" om de aanvraag in te dienen</li>
                    </ol>

                    <h4>Verlofstatus</h4>
                    <p>Een verlofaanvraag kan de volgende statussen hebben:</p>
                    <ul>
                        <li><strong>Aangevraagd</strong> - De aanvraag is ingediend maar nog niet beoordeeld</li>
                        <li><strong>Goedgekeurd</strong> - De aanvraag is goedgekeurd</li>
                        <li><strong>Afgewezen</strong> - De aanvraag is afgewezen</li>
                    </ul>
                </div>

                <!-- Kalender -->
                <div class="tab-content" id="help-calendar">
                    <h3>Kalenderweergave</h3>

                    <h4>Weergavemodi</h4>
                    <p>Je kunt de kalender op drie manieren bekijken:</p>
                    <ul>
                        <li><strong>Week</strong> - Toont één week</li>
                        <li><strong>Maand</strong> - Toont een hele maand</li>
                        <li><strong>Kwartaal</strong> - Toont drie maanden</li>
                    </ul>

                    <h4>Navigatie</h4>
                    <p>Gebruik de pijltjes naast de huidige periode om door de kalender te navigeren. Klik op "Vandaag"
                        om terug te gaan naar de huidige periode.</p>

                    <h4>Filters</h4>
                    <p>Je kunt het rooster filteren op team of op individuele medewerkers zoeken met de zoekfunctie.</p>
                </div>

                <!-- FAQ -->
                <div class="tab-content" id="help-faq">
                    <h3>Veelgestelde vragen</h3>

                    <div class="faq-item">
                        <div class="faq-question">Hoe kan ik mijn verlof wijzigen?</div>
                        <div class="faq-answer">
                            <p>Je kunt je verlofaanvraag wijzigen door erop te klikken in het rooster, mits deze nog
                                niet is goedgekeurd. Als de aanvraag al is goedgekeurd, moet je eerst contact opnemen
                                met je teamleider.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question">Wie kan mijn verlofaanvraag goedkeuren?</div>
                        <div class="faq-answer">
                            <p>Je teamleider of een senior medewerker in je team kan je verlofaanvraag goedkeuren.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question">Hoe kan ik mijn werkschema instellen?</div>
                        <div class="faq-answer">
                            <p>Je kunt je werkschema instellen via het instellingenmenu. Klik op het pijltje naast je
                                naam en kies "Instellingen". Ga vervolgens naar het tabblad "Werkschema".</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question">Waarom zie ik sommige teams niet in het filter?</div>
                        <div class="faq-answer">
                            <p>Je ziet alleen actieve teams in het filter. Als een team ontbreekt, neem dan contact op
                                met je beheerder.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question">Hoe werkt het verlofsaldo?</div>
                        <div class="faq-answer">
                            <p>Het verlofsaldo wordt berekend op basis van je contracturen en reeds opgenomen
                                verlofdagen. Je kunt je huidige saldo bekijken in je profiel.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="closeHelpBtn">Sluiten</button>
            </div>
        </div>
    </div>

    <!-- Script references - masterConfig.js moet vóór v.js geladen worden -->
    <script src="js/masterConfig.js"></script>
    <script src="js/v.js"></script>
    <script src="js/meerFuncties.js"></script>
    <script src="js/dagen-indicators.js"></script>
    <script src="js/dagen-indicators-modal.js"></script>
    <script>
        // Direct uitvoerbare code om de modal te forceren aanmaken
        (function () {
            // Controleer of de modal al bestaat, zo niet, maak deze aan
            if (!document.getElementById('indicatorsModal')) {
                const modalBackdrop = document.createElement('div');
                modalBackdrop.className = 'modal-backdrop';
                modalBackdrop.id = 'indicatorsModal';

                // Maak de modal content
                modalBackdrop.innerHTML = `
					<div class="modal" style="max-width: 600px;">
					  <div class="modal-header">
						<h3 class="modal-title">Dag-indicatoren beheren</h3>
						<button class="modal-close">&times;</button>
					  </div>
					  <div class="modal-body">
						<div class="tabs">
						  <!-- Tabs worden dynamisch ingevuld -->
						</div>
						<div class="tab-contents">
						  <!-- Tab inhoud containers -->
						</div>
					  </div>
					  <div class="modal-footer">
						<button class="btn btn-secondary modal-cancel">Annuleren</button>
						<button class="btn btn-primary modal-save">Opslaan</button>
					  </div>
					</div>
				`;

                document.body.appendChild(modalBackdrop);
            }

            // Debug modal beschikbaarheid
            console.log('Indicators modal container beschikbaar gemaakt');
        })();

        // Script voor initialisatie van gebruikersmenu's direct na het laden van de pagina
        document.addEventListener('DOMContentLoaded', function () {
            // Wacht tot de pagina volledig is geladen
            setTimeout(function () {
                // Gebruikersinstellingen menu items
                const userSettingsBtn = document.getElementById("userSettingsBtn");
                const userProfileBtn = document.getElementById("userProfileBtn");
                const userHelpBtn = document.getElementById("userHelpBtn");

                // De modals
                const userSettingsModal = document.getElementById("userSettingsModal");
                const userProfileModal = document.getElementById("userProfileModal");
                const helpModal = document.getElementById("helpModal");

                // Close buttons
                const closeUserSettingsModalBtn = document.getElementById("closeUserSettingsModalBtn");
                const closeUserProfileModalBtn = document.getElementById("closeUserProfileModalBtn");
                const closeHelpModalBtn = document.getElementById("closeHelpModalBtn");
                const saveUserSettingsBtn = document.getElementById("saveUserSettingsBtn");
                const cancelUserSettingsBtn = document.getElementById("cancelUserSettingsBtn");
                const closeProfileBtn = document.getElementById("closeProfileBtn");
                const saveProfileBtn = document.getElementById("saveProfileBtn");
                const closeHelpBtn = document.getElementById("closeHelpBtn");

                // Tabs in settings
                const settingsTabs = userSettingsModal?.querySelectorAll(".tab");
                const settingsTabContents = userSettingsModal?.querySelectorAll(".tab-content");

                // Tabs in help
                const helpTabs = helpModal?.querySelectorAll(".tab");
                const helpTabContents = helpModal?.querySelectorAll(".tab-content");

                // Event listeners voor menu items
                if (userSettingsBtn) {
                    userSettingsBtn.addEventListener('click', function () {
                        userSettingsModal.classList.add('active');
                    });
                }

                if (userProfileBtn) {
                    userProfileBtn.addEventListener('click', function () {
                        // Laad eventuele profielgegevens
                        try {
                            if (typeof loadUserProfile === 'function') {
                                loadUserProfile();
                            }
                        } catch (e) {
                            console.error('Fout bij laden van profiel:', e);
                        }
                        userProfileModal.classList.add('active');
                    });
                }

                if (userHelpBtn) {
                    userHelpBtn.addEventListener('click', function () {
                        helpModal.classList.add('active');
                    });
                }

                // Event listeners voor close buttons
                if (closeUserSettingsModalBtn) {
                    closeUserSettingsModalBtn.addEventListener('click', function () {
                        userSettingsModal.classList.remove('active');
                    });
                }

                if (closeUserProfileModalBtn) {
                    closeUserProfileModalBtn.addEventListener('click', function () {
                        userProfileModal.classList.remove('active');
                    });
                }

                if (closeHelpModalBtn) {
                    closeHelpModalBtn.addEventListener('click', function () {
                        helpModal.classList.remove('active');
                    });
                }

                // Overige close/save buttons
                if (saveUserSettingsBtn) {
                    saveUserSettingsBtn.addEventListener('click', function () {
                        try {
                            if (typeof handleSaveUserSettings === 'function') {
                                handleSaveUserSettings();
                            } else {
                                userSettingsModal.classList.remove('active');
                            }
                        } catch (e) {
                            console.error('Fout bij opslaan instellingen:', e);
                            userSettingsModal.classList.remove('active');
                        }
                    });
                }

                if (cancelUserSettingsBtn) {
                    cancelUserSettingsBtn.addEventListener('click', function () {
                        userSettingsModal.classList.remove('active');
                    });
                }

                if (closeProfileBtn) {
                    closeProfileBtn.addEventListener('click', function () {
                        userProfileModal.classList.remove('active');
                    });
                }

                if (saveProfileBtn) {
                    saveProfileBtn.addEventListener('click', function () {
                        try {
                            if (typeof handleSaveUserProfile === 'function') {
                                handleSaveUserProfile();
                            } else {
                                userProfileModal.classList.remove('active');
                            }
                        } catch (e) {
                            console.error('Fout bij opslaan profiel:', e);
                            userProfileModal.classList.remove('active');
                        }
                    });
                }

                if (closeHelpBtn) {
                    closeHelpBtn.addEventListener('click', function () {
                        helpModal.classList.remove('active');
                    });
                }

                // Tab functionality voor settings
                if (settingsTabs) {
                    settingsTabs.forEach(tab => {
                        tab.addEventListener('click', function () {
                            const tabId = this.getAttribute('data-tab');

                            // Update active tab
                            settingsTabs.forEach(t => {
                                if (t.getAttribute('data-tab') === tabId) {
                                    t.classList.add('active');
                                } else {
                                    t.classList.remove('active');
                                }
                            });

                            // Update visible content
                            settingsTabContents.forEach(content => {
                                if (content.id === tabId) {
                                    content.classList.add('active');

                                    // If this is the work schedule tab, initialize the UI
                                    if (tabId === 'work-schedule') {
                                        try {
                                            if (typeof initWorkScheduleUI === 'function') {
                                                initWorkScheduleUI();
                                            } else {
                                                console.error('initWorkScheduleUI function is not defined');
                                            }
                                        } catch (e) {
                                            console.error('Error initializing work schedule UI:', e);
                                        }
                                    }
                                } else {
                                    content.classList.remove('active');
                                }
                            });
                        });
                    });
                }

                // Tab functionality voor help
                if (helpTabs) {
                    helpTabs.forEach(tab => {
                        tab.addEventListener('click', function () {
                            const tabId = this.getAttribute('data-tab');

                            // Update active tab
                            helpTabs.forEach(t => {
                                if (t.getAttribute('data-tab') === tabId) {
                                    t.classList.add('active');
                                } else {
                                    t.classList.remove('active');
                                }
                            });

                            // Update visible content
                            helpTabContents.forEach(content => {
                                if (content.id === tabId) {
                                    content.classList.add('active');
                                } else {
                                    content.classList.remove('active');
                                }
                            });
                        });
                    });
                }

                // FAQ items
                document.querySelectorAll('.faq-question').forEach(question => {
                    question.addEventListener('click', function () {
                        this.classList.toggle('active');
                        const answer = this.nextElementSibling;
                        if (this.classList.contains('active')) {
                            answer.style.display = 'block';
                        } else {
                            answer.style.display = 'none';
                        }
                    });
                });

                // Dagen-indicators beheer knop toevoegen aan admin menu
                const adminDropdownContent = document.querySelector('#adminDropdown .dropdown-content');
                if (adminDropdownContent) {
                    // Controleer of het item al bestaat
                    if (!document.getElementById('manageDagenIndicatorsBtn')) {
                        const indicatorMenuItem = document.createElement('a');
                        indicatorMenuItem.className = 'dropdown-item';
                        indicatorMenuItem.id = 'manageDagenIndicatorsBtn';
                        indicatorMenuItem.innerHTML = `
							<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
								<circle cx="9" cy="12" r="2"></circle>
								<circle cx="15" cy="12" r="2"></circle>
							</svg>
							Dag-indicatoren beheren
						`;

                        // Voeg na de redenen beheren menuitem
                        const reasonsMenuItem = document.getElementById('manageReasonsBtn');
                        if (reasonsMenuItem) {
                            adminDropdownContent.insertBefore(indicatorMenuItem, reasonsMenuItem.nextSibling);
                        } else {
                            adminDropdownContent.appendChild(indicatorMenuItem);
                        }
                    }
                }

                // Event handler direct toevoegen aan manageDagenIndicatorsBtn om de modal te openen
                const manageDagenIndicatorsBtn = document.getElementById('manageDagenIndicatorsBtn');
                if (manageDagenIndicatorsBtn) {
                    // Verwijder eerst eventuele bestaande event listeners
                    const newBtn = manageDagenIndicatorsBtn.cloneNode(true);
                    manageDagenIndicatorsBtn.parentNode.replaceChild(newBtn, manageDagenIndicatorsBtn);

                    // Voeg nieuwe event listener toe
                    newBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Klik op Dag-indicatoren beheren gedetecteerd');

                        // Zoek de modal en open deze direct
                        const indicatorsModal = document.getElementById('indicatorsModal');
                        if (indicatorsModal) {
                            console.log('Modal element gevonden, openen...');
                            indicatorsModal.classList.add('active');

                            // Setup event handlers voor sluiten als ze nog niet bestaan
                            const closeBtn = indicatorsModal.querySelector('.modal-close');
                            const cancelBtn = indicatorsModal.querySelector('.modal-cancel');

                            if (closeBtn && !closeBtn._hasCloseHandler) {
                                closeBtn._hasCloseHandler = true;
                                closeBtn.addEventListener('click', () => {
                                    indicatorsModal.classList.remove('active');
                                });
                            }

                            if (cancelBtn && !cancelBtn._hasCloseHandler) {
                                cancelBtn._hasCloseHandler = true;
                                cancelBtn.addEventListener('click', () => {
                                    indicatorsModal.classList.remove('active');
                                });
                            }

                            // Als we de dagenIndicators module hebben, laad dan de tabs
                            if (window.dagenIndicators) {
                                console.log('DagenIndicators module gevonden, tabs worden geladen...');
                                // Maak de containers leeg
                                const tabsContainer = indicatorsModal.querySelector('.tabs');
                                const tabContentsContainer = indicatorsModal.querySelector('.tab-contents');

                                if (tabsContainer) tabsContainer.innerHTML = '';
                                if (tabContentsContainer) tabContentsContainer.innerHTML = '';

                                // Voeg tabs toe voor elke indicator
                                if (window.dagenIndicators.indicators && window.dagenIndicators.indicators.length > 0) {
                                    window.dagenIndicators.indicators.forEach((indicator, index) => {
                                        // Tab aanmaken
                                        const tab = document.createElement('div');
                                        tab.className = `tab ${index === 0 ? 'active' : ''}`;
                                        tab.setAttribute('data-target', indicator.id);
                                        tab.textContent = indicator.title;

                                        if (tabsContainer) tabsContainer.appendChild(tab);

                                        // Content container aanmaken
                                        const contentContainer = document.createElement('div');
                                        contentContainer.className = `tab-content ${index === 0 ? 'active' : ''}`;
                                        contentContainer.setAttribute('data-tab', indicator.id);

                                        if (tabContentsContainer) tabContentsContainer.appendChild(contentContainer);

                                        // Indicator configuratie renderen in eerste tab
                                        if (index === 0 && window.dagenIndicators.renderIndicatorConfig) {
                                            window.dagenIndicators.renderIndicatorConfig(contentContainer, indicator);
                                        }

                                        // Tab click event
                                        tab.addEventListener('click', () => {
                                            // Update actieve tab
                                            indicatorsModal.querySelectorAll('.tab').forEach(t => {
                                                t.classList.remove('active');
                                            });
                                            tab.classList.add('active');

                                            // Update actieve content
                                            indicatorsModal.querySelectorAll('.tab-content').forEach(c => {
                                                c.classList.remove('active');
                                            });
                                            contentContainer.classList.add('active');

                                            // Render de configuratie
                                            if (window.dagenIndicators.renderIndicatorConfig) {
                                                window.dagenIndicators.renderIndicatorConfig(contentContainer, indicator);
                                            }
                                        });
                                    });
                                } else {
                                    console.log('Geen indicators gevonden, standaard inhoud wordt getoond');
                                    // Toon bericht als er geen indicators zijn
                                    if (tabContentsContainer) {
                                        tabContentsContainer.innerHTML = '<div class="data-state">Geen dag-indicatoren gevonden</div>';
                                    }
                                }
                            } else {
                                console.error('DagenIndicators module niet beschikbaar');
                            }
                        } else {
                            console.error('Indicators modal niet gevonden in DOM');
                            alert('De dag-indicatoren beheer modal kon niet worden geopend');
                        }
                    });
                }

                // Verifieer of het admin menu zichtbaar is voor gemak van testen
                const adminDropdown = document.getElementById('adminDropdown');
                if (adminDropdown) {
                    adminDropdown.style.display = 'inline-block';
                }

                console.log('Gebruikersmenu event handlers handmatig geïnitialiseerd');
            }, 500); // Korte timeout om ervoor te zorgen dat alle elementen beschikbaar zijn
        });

        // Standaard werkuren instellen op 36
        document.addEventListener('DOMContentLoaded', function () {
            document.getElementById('weeklyHoursInput').value = 36;
            document.getElementById('settingsWeeklyHoursInput').value = 36;
        });
    </script>
</body>

</html>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verlof & Compensatie Behandelen</title>
    <script src="../js/configLijst.js"></script>
    <link rel="icon" href="icoon/favicon.svg" type="image/svg+xml">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        
        /* Loading animation */
        .loading-spinner {
            border: 3px solid #e5e7eb;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Tab styling */
        .tab-button.active {
            border-color: #3b82f6;
            color: #3b82f6;
            background-color: rgba(59, 130, 246, 0.05);
        }

        /* Status badges */
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }
        .status-nieuw {
            background-color: #dbeafe;
            color: #1d4ed8;
        }
        .status-goedgekeurd {
            background-color: #d1fae5;
            color: #047857;
        }
        .status-afgewezen {
            background-color: #fee2e2;
            color: #b91c1c;
        }

        /* Request card hover effects */
        .request-card {
            transition: all 0.2s ease-in-out;
        }
        .request-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Notification styles */
        .notification {
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        }
        .notification.show {
            transform: translateX(0);
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Loading Overlay -->
    <div id="loading-overlay" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl">
            <div class="flex items-center space-x-3">
                <div class="loading-spinner"></div>
                <span id="loading-message" class="text-gray-700 font-medium">Laden...</span>
            </div>
        </div>
    </div>

    <!-- Notification Container -->
    <div id="notification-container" class="fixed top-4 right-4 z-40 space-y-2"></div>

    <!-- Header -->
    <header class="bg-indigo-800 text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center">
                    <svg class="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                    </svg>
                    <h1 class="text-xl font-semibold">Verlof & Compensatie Behandelen</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <span id="user-info" class="text-sm text-indigo-200">Laden...</span>
                    <a href="../Verlofrooster.aspx" class="inline-flex items-center px-3 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-md text-sm font-medium transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                        </svg>
                        Terug naar rooster
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Permission Error Message -->
        <div id="permission-error" class="hidden bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div class="flex">
                <svg class="flex-shrink-0 w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Geen toegang</h3>
                    <p class="mt-1 text-sm text-red-700">U heeft geen rechten om aanvragen te behandelen. Neem contact op met de beheerder als u denkt dat dit een vergissing is.</p>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div id="stats-section" class="hidden grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">Verlof aanvragen</p>
                        <p id="verlof-count" class="text-2xl font-semibold text-gray-900">-</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">Compensatie uren</p>
                        <p id="compensatie-count" class="text-2xl font-semibold text-gray-900">-</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                            <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">Totaal openstaand</p>
                        <p id="total-count" class="text-2xl font-semibold text-gray-900">-</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div id="main-content" class="hidden bg-white rounded-lg shadow">
            <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6" aria-label="Tabs">
                    <button data-tab="verlof" class="tab-button py-4 px-1 border-b-2 border-transparent font-medium text-sm hover:text-gray-700 hover:border-gray-300 focus:outline-none">
                        <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                        Verlof/Ziekte Aanvragen
                        <span id="verlof-badge" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 hidden">0</span>
                    </button>
                    <button data-tab="compensatie" class="tab-button py-4 px-1 border-b-2 border-transparent font-medium text-sm hover:text-gray-700 hover:border-gray-300 focus:outline-none">
                        <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        Compensatie Uren
                        <span id="compensatie-badge" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 hidden">0</span>
                    </button>
                    <button data-tab="historisch" class="tab-button py-4 px-1 border-b-2 border-transparent font-medium text-sm hover:text-gray-700 hover:border-gray-300 focus:outline-none">
                        <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                        </svg>
                        Behandelde Aanvragen
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
                <!-- Verlof Tab -->
                <div id="content-verlof" class="tab-content">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900">Openstaande Verlof/Ziekte Aanvragen</h2>
                            <p class="text-sm text-gray-500">Aanvragen die wachten op uw goedkeuring</p>
                        </div>
                        <button onclick="refreshData()" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                            </svg>
                            Vernieuwen
                        </button>
                    </div>
                    <div id="verlof-content">
                        <div class="text-center py-12">
                            <div class="loading-spinner mx-auto"></div>
                            <p class="mt-4 text-gray-500">Verlofaanvragen laden...</p>
                        </div>
                    </div>
                </div>

                <!-- Compensatie Tab -->
                <div id="content-compensatie" class="tab-content hidden">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900">Openstaande Compensatie Uren</h2>
                            <p class="text-sm text-gray-500">Compensatie-uuraanvragen die wachten op uw goedkeuring</p>
                        </div>
                        <button onclick="refreshData()" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                            </svg>
                            Vernieuwen
                        </button>
                    </div>
                    <div id="compensatie-content">
                        <div class="text-center py-12 text-gray-500">
                            Selecteer deze tab om compensatie-uuraanvragen te laden
                        </div>
                    </div>
                </div>

                <!-- Historisch Tab -->
                <div id="content-historisch" class="tab-content hidden">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900">Behandelde Aanvragen</h2>
                            <p class="text-sm text-gray-500">Recent goedgekeurde of afgewezen aanvragen</p>
                        </div>
                        <button onclick="refreshData()" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                            </svg>
                            Vernieuwen
                        </button>
                    </div>
                    <div id="historisch-content">
                        <div class="text-center py-12 text-gray-500">
                            Selecteer deze tab om historische aanvragen te laden
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Confirmation Modal -->
    <div id="confirmation-modal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center">
                    <div id="modal-icon" class="flex-shrink-0 mx-auto w-10 h-10 rounded-full flex items-center justify-center">
                        <!-- Icon will be set by JavaScript -->
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                        <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">
                            Bevestig actie
                        </h3>
                        <div class="mt-2">
                            <p id="modal-message" class="text-sm text-gray-500">
                                Weet u zeker dat u deze actie wilt uitvoeren?
                            </p>
                        </div>
                        <div class="mt-3">
                            <label for="modal-comment" class="block text-sm font-medium text-gray-700">Opmerking (optioneel):</label>
                            <textarea id="modal-comment" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Voeg een opmerking toe..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                    <button id="modal-cancel" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Annuleren
                    </button>
                    <button id="modal-confirm" class="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2">
                        Bevestigen
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        let sharePointContext = {
            siteUrl: '',
            requestDigest: ''
        };
        let currentUser = null;
        let hasPermission = false;
        let currentTab = 'verlof';
        let requestData = {
            verlof: [],
            compensatie: [],
            historisch: []
        };

        // Status constants
        const STATUS = {
            NIEUW: 'Nieuw',
            GOEDGEKEURD: 'Goedgekeurd',
            AFGEWEZEN: 'Afgewezen'
        };

        // Required SharePoint groups for access
        const REQUIRED_GROUPS = [
            '1. Sharepoint beheer',
            '1.1. Mulder MT',
            '2.3. Senior beoordelen'
        ];

        // Initialize application
        document.addEventListener('DOMContentLoaded', async () => {
            showLoading('Applicatie initialiseren...');
            
            try {
                await initializeSharePointContext();
                await loadCurrentUser();
                await checkPermissions();
                
                if (hasPermission) {
                    setupEventListeners();
                    await loadInitialData();
                    showMainContent();
                } else {
                    showPermissionError();
                }
            } catch (error) {
                console.error('Initialization error:', error);
                showNotification('Fout bij laden van de applicatie: ' + error.message, 'error');
            } finally {
                hideLoading();
            }
        });

        // Initialize SharePoint context
        async function initializeSharePointContext() {
            try {
                // Extract base site URL (remove /CPW/Rooster part)
                const currentUrl = window.location.href;
                const cpwIndex = currentUrl.indexOf('/CPW/');
                if (cpwIndex === -1) {
                    throw new Error('Ongeldige URL structuur');
                }
                
                sharePointContext.siteUrl = currentUrl.substring(0, cpwIndex);
                console.log('SharePoint Site URL:', sharePointContext.siteUrl);

                // Get request digest
                const response = await fetch(`${sharePointContext.siteUrl}/_api/contextinfo`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose'
                    }
                });

                if (!response.ok) {
                    throw new Error(`SharePoint context fout: ${response.status}`);
                }

                const data = await response.json();
                sharePointContext.requestDigest = data.d.GetContextWebInformation.FormDigestValue;
            } catch (error) {
                throw new Error('Kan geen verbinding maken met SharePoint: ' + error.message);
            }
        }

        // Load current user information
        async function loadCurrentUser() {
            try {
                const response = await fetch(`${sharePointContext.siteUrl}/_api/web/currentuser?$expand=Groups`, {
                    headers: {
                        'Accept': 'application/json;odata=verbose'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    currentUser = data.d;
                    document.getElementById('user-info').textContent = currentUser.Title || 'Onbekende gebruiker';
                } else {
                    throw new Error('Kon gebruikersinformatie niet laden');
                }
            } catch (error) {
                console.warn('Could not load current user:', error);
                document.getElementById('user-info').textContent = 'Gebruiker onbekend';
            }
        }

        // Check if user has required permissions
        async function checkPermissions() {
            if (!currentUser || !currentUser.Groups) {
                hasPermission = false;
                return;
            }

            const userGroups = currentUser.Groups.results.map(group => group.Title);
            hasPermission = REQUIRED_GROUPS.some(requiredGroup => 
                userGroups.includes(requiredGroup)
            );

            console.log('User groups:', userGroups);
            console.log('Has permission:', hasPermission);
        }

        // Setup event listeners
        function setupEventListeners() {
            // Tab navigation
            document.querySelectorAll('.tab-button').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const tabName = e.target.closest('.tab-button').dataset.tab;
                    await switchTab(tabName);
                });
            });

            // Modal event listeners
            document.getElementById('modal-cancel').addEventListener('click', closeModal);
            document.getElementById('modal-confirm').addEventListener('click', executeModalAction);
            
            // Close modal when clicking outside
            document.getElementById('confirmation-modal').addEventListener('click', (e) => {
                if (e.target.id === 'confirmation-modal') {
                    closeModal();
                }
            });
        }

        // Switch to a specific tab
        async function switchTab(tabName) {
            if (currentTab === tabName) return;

            // Update tab appearance
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-gray-500');
                btn.classList.remove('text-blue-600', 'border-blue-500');
            });

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });

            const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
            const activeContent = document.getElementById(`content-${tabName}`);

            if (activeButton && activeContent) {
                activeButton.classList.add('active', 'text-blue-600', 'border-blue-500');
                activeButton.classList.remove('text-gray-500');
                activeContent.classList.remove('hidden');
                
                currentTab = tabName;
                
                // Load data for the selected tab if not already loaded
                if (requestData[tabName].length === 0) {
                    await loadTabData(tabName);
                }
            }
        }

        // Load initial data for all tabs
        async function loadInitialData() {
            await loadTabData('verlof');
            updateStatistics();
        }

        // Load data for a specific tab
        async function loadTabData(tabName) {
            showLoading(`Laden van ${getTabDisplayName(tabName)}...`);
            
            try {
                switch (tabName) {
                    case 'verlof':
                        await loadVerlofRequests();
                        break;
                    case 'compensatie':
                        await loadCompensatieRequests();
                        break;
                    case 'historisch':
                        await loadHistoricalRequests();
                        break;
                }
                renderTabContent(tabName);
                updateStatistics();
            } catch (error) {
                console.error(`Error loading ${tabName} data:`, error);
                showNotification(`Fout bij laden van ${getTabDisplayName(tabName)}: ${error.message}`, 'error');
            } finally {
                hideLoading();
            }
        }

        // Load verlof requests
        async function loadVerlofRequests() {
            const config = window.getLijstConfig ? window.getLijstConfig('Verlof') : null;
            if (!config) {
                throw new Error('Verlof configuratie niet gevonden');
            }

            const selectFields = [
                'Id', 'Title', 'Status', 'Medewerker', 'StartDatum', 'EindDatum', 
                'Reden', 'Omschrijving', 'AanvraagTijdstip', 'OpmerkingBehandelaar'
            ];

            const url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items?$select=${selectFields.join(',')}&$filter=Status eq '${STATUS.NIEUW}'&$orderby=AanvraagTijdstip asc&$top=1000`;

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json;odata=verbose'
                }
            });

            if (!response.ok) {
                throw new Error(`Fout bij ophalen verlofaanvragen: ${response.status}`);
            }

            const data = await response.json();
            requestData.verlof = data.d.results || [];
        }

        // Load compensatie requests
        async function loadCompensatieRequests() {
            const config = window.getLijstConfig ? window.getLijstConfig('CompensatieUren') : null;
            if (!config) {
                throw new Error('CompensatieUren configuratie niet gevonden');
            }

            const selectFields = [
                'Id', 'Title', 'Status', 'Medewerker', 'StartCompensatieUren', 
                'EindeCompensatieUren', 'UrenTotaal', 'Omschrijving', 'AanvraagTijdstip'
            ];

            const url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items?$select=${selectFields.join(',')}&$filter=Status eq '${STATUS.NIEUW}'&$orderby=AanvraagTijdstip asc&$top=1000`;

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json;odata=verbose'
                }
            });

            if (!response.ok) {
                throw new Error(`Fout bij ophalen compensatieaanvragen: ${response.status}`);
            }

            const data = await response.json();
            requestData.compensatie = data.d.results || [];
        }

        // Load historical requests
        async function loadHistoricalRequests() {
            try {
                const [verlofConfig, compensatieConfig] = [
                    window.getLijstConfig ? window.getLijstConfig('Verlof') : null,
                    window.getLijstConfig ? window.getLijstConfig('CompensatieUren') : null
                ];

                if (!verlofConfig || !compensatieConfig) {
                    throw new Error('Configuraties niet gevonden');
                }

                const verlofFields = ['Id', 'Title', 'Status', 'Medewerker', 'StartDatum', 'EindDatum', 'Reden', 'Modified'];
                const compensatieFields = ['Id', 'Title', 'Status', 'Medewerker', 'StartCompensatieUren', 'EindeCompensatieUren', 'UrenTotaal', 'Modified'];

                const filter = `(Status eq '${STATUS.GOEDGEKEURD}') or (Status eq '${STATUS.AFGEWEZEN}')`;

                const [verlofResponse, compensatieResponse] = await Promise.all([
                    fetch(`${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(verlofConfig.lijstTitel)}')/items?$select=${verlofFields.join(',')}&$filter=${filter}&$orderby=Modified desc&$top=100`, {
                        headers: { 'Accept': 'application/json;odata=verbose' }
                    }),
                    fetch(`${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(compensatieConfig.lijstTitel)}')/items?$select=${compensatieFields.join(',')}&$filter=${filter}&$orderby=Modified desc&$top=100`, {
                        headers: { 'Accept': 'application/json;odata=verbose' }
                    })
                ]);

                if (!verlofResponse.ok || !compensatieResponse.ok) {
                    throw new Error('Fout bij ophalen historische gegevens');
                }

                const [verlofData, compensatieData] = await Promise.all([
                    verlofResponse.json(),
                    compensatieResponse.json()
                ]);

                const verlofItems = (verlofData.d.results || []).map(item => ({ ...item, _type: 'verlof' }));
                const compensatieItems = (compensatieData.d.results || []).map(item => ({ ...item, _type: 'compensatie' }));

                const allItems = [...verlofItems, ...compensatieItems];
                allItems.sort((a, b) => new Date(b.Modified) - new Date(a.Modified));

                requestData.historisch = allItems;
            } catch (error) {
                throw new Error('Fout bij laden historische aanvragen: ' + error.message);
            }
        }

        // Render content for a specific tab
        function renderTabContent(tabName) {
            const container = document.getElementById(`${tabName}-content`);
            const data = requestData[tabName];

            if (!container) return;

            if (data.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">Geen aanvragen</h3>
                        <p class="mt-1 text-sm text-gray-500">Er zijn momenteel geen ${getTabDisplayName(tabName).toLowerCase()} om weer te geven.</p>
                    </div>
                `;
                return;
            }

            const requestsHtml = data.map(request => createRequestCard(request, tabName)).join('');
            container.innerHTML = `<div class="space-y-4">${requestsHtml}</div>`;
        }

        // Create HTML for a request card
        function createRequestCard(request, tabName) {
            const isHistorical = tabName === 'historisch';
            const requestType = isHistorical ? request._type : tabName;
            
            return `
                <div class="request-card bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-3">
                                <h3 class="text-lg font-medium text-gray-900">${request.Title || `Aanvraag #${request.Id}`}</h3>
                                <span class="status-badge status-${request.Status.toLowerCase().replace(/\s+/g, '-')}">${request.Status}</span>
                                ${requestType === 'compensatie' ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Compensatie</span>' : ''}
                                ${requestType === 'verlof' ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Verlof</span>' : ''}
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="font-medium text-gray-700">Medewerker:</span>
                                    <span class="text-gray-900">${request.Medewerker || 'Onbekend'}</span>
                                </div>
                                
                                ${requestType === 'verlof' ? `
                                    <div>
                                        <span class="font-medium text-gray-700">Reden:</span>
                                        <span class="text-gray-900">${request.Reden || 'Niet opgegeven'}</span>
                                    </div>
                                    <div>
                                        <span class="font-medium text-gray-700">Periode:</span>
                                        <span class="text-gray-900">${formatDateRange(request.StartDatum, request.EindDatum)}</span>
                                    </div>
                                ` : ''}
                                
                                ${requestType === 'compensatie' ? `
                                    <div>
                                        <span class="font-medium text-gray-700">Uren:</span>
                                        <span class="text-gray-900">${request.UrenTotaal || 'Niet opgegeven'}</span>
                                    </div>
                                    <div>
                                        <span class="font-medium text-gray-700">Periode:</span>
                                        <span class="text-gray-900">${formatDateTimeRange(request.StartCompensatieUren, request.EindeCompensatieUren)}</span>
                                    </div>
                                ` : ''}
                                
                                <div>
                                    <span class="font-medium text-gray-700">Ingediend:</span>
                                    <span class="text-gray-900">${formatDateTime(request.AanvraagTijdstip || request.Modified)}</span>
                                </div>
                                
                                ${isHistorical ? `
                                    <div>
                                        <span class="font-medium text-gray-700">Behandeld:</span>
                                        <span class="text-gray-900">${formatDateTime(request.Modified)}</span>
                                    </div>
                                ` : ''}
                            </div>
                            
                            ${request.Omschrijving ? `
                                <div class="mt-4">
                                    <span class="font-medium text-gray-700">Omschrijving:</span>
                                    <p class="text-gray-900 mt-1">${request.Omschrijving}</p>
                                </div>
                            ` : ''}
                            
                            ${request.OpmerkingBehandelaar ? `
                                <div class="mt-4">
                                    <span class="font-medium text-gray-700">Opmerking behandelaar:</span>
                                    <p class="text-gray-900 mt-1">${request.OpmerkingBehandelaar}</p>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${!isHistorical && request.Status === STATUS.NIEUW ? `
                            <div class="flex flex-col space-y-2 ml-6">
                                <button onclick="showConfirmationModal(${request.Id}, '${requestType}', '${STATUS.GOEDGEKEURD}')" 
                                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    Goedkeuren
                                </button>
                                <button onclick="showConfirmationModal(${request.Id}, '${requestType}', '${STATUS.AFGEWEZEN}')" 
                                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                    </svg>
                                    Afwijzen
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // Show confirmation modal
        function showConfirmationModal(requestId, requestType, newStatus) {
            const modal = document.getElementById('confirmation-modal');
            const modalIcon = document.getElementById('modal-icon');
            const modalTitle = document.getElementById('modal-title');
            const modalMessage = document.getElementById('modal-message');
            const modalConfirm = document.getElementById('modal-confirm');
            const modalComment = document.getElementById('modal-comment');

            // Clear previous comment
            modalComment.value = '';

            // Set modal content based on action
            if (newStatus === STATUS.GOEDGEKEURD) {
                modalIcon.innerHTML = '<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
                modalIcon.className = 'flex-shrink-0 mx-auto w-10 h-10 rounded-full bg-green-100 flex items-center justify-center';
                modalTitle.textContent = 'Aanvraag goedkeuren';
                modalMessage.textContent = `Weet u zeker dat u deze ${requestType}aanvraag wilt goedkeuren?`;
                modalConfirm.className = 'px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500';
                modalConfirm.textContent = 'Goedkeuren';
            } else {
                modalIcon.innerHTML = '<svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>';
                modalIcon.className = 'flex-shrink-0 mx-auto w-10 h-10 rounded-full bg-red-100 flex items-center justify-center';
                modalTitle.textContent = 'Aanvraag afwijzen';
                modalMessage.textContent = `Weet u zeker dat u deze ${requestType}aanvraag wilt afwijzen?`;
                modalConfirm.className = 'px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500';
                modalConfirm.textContent = 'Afwijzen';
            }

            // Store action data
            modal.dataset.requestId = requestId;
            modal.dataset.requestType = requestType;
            modal.dataset.newStatus = newStatus;

            modal.classList.remove('hidden');
        }

        // Close modal
        function closeModal() {
            document.getElementById('confirmation-modal').classList.add('hidden');
        }

        // Execute modal action
        async function executeModalAction() {
            const modal = document.getElementById('confirmation-modal');
            const requestId = modal.dataset.requestId;
            const requestType = modal.dataset.requestType;
            const newStatus = modal.dataset.newStatus;
            const comment = document.getElementById('modal-comment').value.trim();

            closeModal();
            showLoading(`Aanvraag ${newStatus.toLowerCase()}...`);

            try {
                await updateRequestStatus(requestId, requestType, newStatus, comment);
                showNotification(`Aanvraag succesvol ${newStatus.toLowerCase()}`, 'success');
                await refreshData();
            } catch (error) {
                console.error('Error updating request:', error);
                showNotification(`Fout bij ${newStatus.toLowerCase()} van aanvraag: ${error.message}`, 'error');
            } finally {
                hideLoading();
            }
        }

        // Update request status
        async function updateRequestStatus(requestId, requestType, newStatus, comment) {
            const configKey = requestType === 'verlof' ? 'Verlof' : 'CompensatieUren';
            const config = window.getLijstConfig ? window.getLijstConfig(configKey) : null;
            
            if (!config) {
                throw new Error(`Configuratie voor ${requestType} niet gevonden`);
            }

            const itemData = {
                '__metadata': { 'type': `SP.Data.${config.lijstTitel}ListItem` },
                'Status': newStatus
            };

            // Add comment if provided and it's a verlof request
            if (comment && requestType === 'verlof') {
                itemData['OpmerkingBehandelaar'] = comment;
            }

            const response = await fetch(
                `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items(${requestId})`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose',
                        'X-RequestDigest': sharePointContext.requestDigest,
                        'IF-MATCH': '*',
                        'X-HTTP-Method': 'MERGE'
                    },
                    body: JSON.stringify(itemData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message?.value || `Serverfout: ${response.status}`);
            }
        }

        // Refresh all data
        async function refreshData() {
            // Clear cached data
            requestData = { verlof: [], compensatie: [], historisch: [] };
            
            // Reload current tab and update statistics
            await loadTabData(currentTab);
        }

        // Update statistics in the header cards
        function updateStatistics() {
            const verlofCount = requestData.verlof.length;
            const compensatieCount = requestData.compensatie.length;
            const totalCount = verlofCount + compensatieCount;

            document.getElementById('verlof-count').textContent = verlofCount;
            document.getElementById('compensatie-count').textContent = compensatieCount;
            document.getElementById('total-count').textContent = totalCount;

            // Update badges
            updateBadge('verlof-badge', verlofCount);
            updateBadge('compensatie-badge', compensatieCount);
        }

        // Update badge visibility and count
        function updateBadge(badgeId, count) {
            const badge = document.getElementById(badgeId);
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        // Utility functions
        function getTabDisplayName(tabName) {
            const names = {
                'verlof': 'verlofaanvragen',
                'compensatie': 'compensatie-uren',
                'historisch': 'historische aanvragen'
            };
            return names[tabName] || tabName;
        }

        function formatDate(dateString) {
            if (!dateString) return 'Niet opgegeven';
            try {
                return new Date(dateString).toLocaleDateString('nl-NL');
            } catch {
                return 'Ongeldige datum';
            }
        }

        function formatDateTime(dateString) {
            if (!dateString) return 'Niet opgegeven';
            try {
                return new Date(dateString).toLocaleString('nl-NL');
            } catch {
                return 'Ongeldige datum/tijd';
            }
        }

        function formatDateRange(startDate, endDate) {
            const start = formatDate(startDate);
            const end = formatDate(endDate);
            return `${start} - ${end}`;
        }

        function formatDateTimeRange(startDateTime, endDateTime) {
            const start = formatDateTime(startDateTime);
            const end = formatDateTime(endDateTime);
            return `${start} - ${end}`;
        }

        function showLoading(message = 'Laden...') {
            document.getElementById('loading-message').textContent = message;
            document.getElementById('loading-overlay').classList.remove('hidden');
        }

        function hideLoading() {
            document.getElementById('loading-overlay').classList.add('hidden');
        }

        function showMainContent() {
            document.getElementById('stats-section').classList.remove('hidden');
            document.getElementById('main-content').classList.remove('hidden');
        }

        function showPermissionError() {
            document.getElementById('permission-error').classList.remove('hidden');
        }

        function showNotification(message, type = 'info') {
            const container = document.getElementById('notification-container');
            const notification = document.createElement('div');
            
            const bgColor = {
                success: 'bg-green-500',
                error: 'bg-red-500',
                warning: 'bg-yellow-500',
                info: 'bg-blue-500'
            }[type] || 'bg-blue-500';

            notification.className = `notification ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm`;
            notification.innerHTML = `
                <div class="flex justify-between items-start">
                    <span class="flex-1">${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            `;

            container.appendChild(notification);

            // Show notification with animation
            setTimeout(() => notification.classList.add('show'), 100);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }

        // Wait for configLijst.js to load
        if (typeof window.getLijstConfig !== 'function') {
            console.log('Waiting for configLijst.js to load...');
            let attempts = 0;
            const checkConfig = setInterval(() => {
                attempts++;
                if (typeof window.getLijstConfig === 'function') {
                    console.log('configLijst.js loaded successfully');
                    clearInterval(checkConfig);
                } else if (attempts > 50) {
                    console.error('configLijst.js failed to load');
                    showNotification('Configuratie kon niet worden geladen', 'error');
                    clearInterval(checkConfig);
                }
            }, 100);
        }

        // Export functions for onclick handlers
        window.showConfirmationModal = showConfirmationModal;
        window.refreshData = refreshData;
    </script>
</body>
</html>
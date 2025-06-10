<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verlofrooster - Beheercentrum</title>
    <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="../js/configLijst.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-blue: #2563eb;
            --primary-blue-dark: #1d4ed8;
            --success-green: #10b981;
            --error-red: #ef4444;
            --warning-yellow: #f59e0b;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            width: 100vw;
            overflow-x: auto;
        }

        /* Full viewport width optimization */
        .app-container {
            width: 100vw;
            min-height: 100vh;
            padding: 0;
            margin: 0;
            max-width: none !important;
        }

        .app-content {
            width: 100%;
            padding: 1rem 2rem;
            max-width: none;
        }

        /* Enhanced scrollbar styling */
        ::-webkit-scrollbar { 
            width: 10px; 
            height: 10px; 
        }
        ::-webkit-scrollbar-track { 
            background: #f1f5f9; 
            border-radius: 6px; 
        }
        ::-webkit-scrollbar-thumb { 
            background: linear-gradient(180deg, #cbd5e1, #94a3b8); 
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        ::-webkit-scrollbar-thumb:hover { 
            background: linear-gradient(180deg, #94a3b8, #64748b); 
        }

        /* Dark theme scrollbar */
        .dark ::-webkit-scrollbar-track { 
            background: #374151; 
        }
        .dark ::-webkit-scrollbar-thumb { 
            background: linear-gradient(180deg, #6b7280, #4b5563); 
            border: 1px solid #4b5563;
        }
        .dark ::-webkit-scrollbar-thumb:hover { 
            background: linear-gradient(180deg, #9ca3af, #6b7280); 
        }

        /* Enhanced tab styling */
        .tab-button {
            position: relative;
            transition: all 0.2s ease-in-out;
            border-bottom: 3px solid transparent;
        }
        
        .tab-button:hover {
            transform: translateY(-1px);
        }
        
        .tab-button.active {
            border-bottom-color: var(--primary-blue);
            background: linear-gradient(to bottom, rgba(37, 99, 235, 0.1), transparent);
        }

        .tab-content { 
            display: none; 
            animation: fadeIn 0.3s ease-in-out;
        }
        .tab-content.active { 
            display: block; 
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Enhanced loading animation */
        .loading-spinner {
            border: 3px solid #e5e7eb;
            border-top: 3px solid var(--primary-blue);
            border-radius: 50%;
            width: 28px;
            height: 28px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .dark .loading-spinner {
            border-color: #4b5563;
            border-top-color: #60a5fa;
        }

        /* Enhanced modal animations */
        .modal-overlay {
            backdrop-filter: blur(4px);
            transition: all 0.3s ease-in-out;
        }

        .modal-content {
            animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
            from { 
                opacity: 0; 
                transform: scale(0.95) translateY(-20px); 
            }
            to { 
                opacity: 1; 
                transform: scale(1) translateY(0); 
            }
        }

        /* Enhanced status indicators */
        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
            position: relative;
        }
        
        .status-indicator::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        .status-active { 
            background-color: var(--success-green); 
        }
        .status-active::after { 
            background-color: var(--success-green); 
        }

        .status-inactive { 
            background-color: var(--error-red); 
        }

        .status-pending { 
            background-color: var(--warning-yellow); 
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }

        /* Enhanced table styling */
        .table-container {
            width: 100%;
            overflow-x: auto;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table th {
            background: linear-gradient(135deg, #64748b, #475569);
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 1rem;
            text-align: left;
            border: none;
        }

        .data-table td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e5e7eb;
            transition: background-color 0.2s ease;
        }

        .data-table tbody tr:hover {
            background-color: rgba(59, 130, 246, 0.05);
            transform: scale(1.001);
        }

        .dark .data-table th {
            background: linear-gradient(135deg, #374151, #1f2937);
        }

        .dark .data-table td {
            border-bottom-color: #4b5563;
        }

        .dark .data-table tbody tr:hover {
            background-color: rgba(59, 130, 246, 0.1);
        }

        /* Enhanced form styling */
        .form-field {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #374151;
            font-size: 0.875rem;
        }

        .dark .form-label {
            color: #d1d5db;
        }

        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 2px solid #d1d5db;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            background-color: #ffffff;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary-blue);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            transform: translateY(-1px);
        }

        .dark .form-input {
            background-color: #374151;
            border-color: #4b5563;
            color: #ffffff;
        }

        .dark .form-input:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
        }

        /* Enhanced button styling */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            border: none;
            cursor: pointer;
            text-decoration: none;
        }

        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark));
            color: white;
        }

        .btn-success {
            background: linear-gradient(135deg, var(--success-green), #059669);
            color: white;
        }

        .btn-danger {
            background: linear-gradient(135deg, var(--error-red), #dc2626);
            color: white;
        }

        .btn-secondary {
            background: #f8fafc;
            color: #64748b;
            border: 1px solid #e2e8f0;
        }

        .dark .btn-secondary {
            background: #374151;
            color: #d1d5db;
            border-color: #4b5563;
        }

        /* Enhanced notification styling */
        .notification {
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Enhanced responsive design */
        @media (max-width: 768px) {
            .app-content {
                padding: 1rem;
            }
            
            .tab-button {
                padding: 0.5rem 0.75rem;
                font-size: 0.8rem;
            }
            
            .data-table th,
            .data-table td {
                padding: 0.5rem;
                font-size: 0.8rem;
            }
        }

        @media (max-width: 640px) {
            .tab-navigation {
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .tab-button {
                width: 100%;
                justify-content: center;
            }
        }

        /* Color input enhancement */
        .color-input-container {
            display: flex;
            gap: 0.75rem;
            align-items: center;
        }

        .color-picker {
            width: 4rem;
            height: 2.5rem;
            border-radius: 6px;
            border: 2px solid #d1d5db;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .color-picker:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Utility classes */
        .fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }

        .slide-up {
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    </style>
</head>
<body class="bg-gray-50 text-gray-900">
    <!-- Global Loading Overlay -->
    <div id="global-loading" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 modal-overlay flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 modal-content">
            <div class="flex items-center space-x-4">
                <div class="loading-spinner"></div>
                <span id="loading-message" class="text-gray-900 font-medium">Laden...</span>
            </div>
        </div>
    </div>

    <!-- Global Notification -->
    <div id="global-notification" class="hidden fixed top-4 right-4 max-w-md z-40 transition-all duration-300">
        <div class="notification bg-blue-500 text-white p-4">
            <div class="flex justify-between items-start">
                <span id="notification-message" class="font-medium"></span>
                <button onclick="hideNotification()" class="text-white hover:text-gray-200 ml-3 transition-colors">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Main App Container -->
    <div class="app-container">
        <div class="app-content">
            <!-- Header -->
            <header class="mb-8 fade-in">
                <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 class="text-4xl font-bold text-gray-900 mb-2">Verlofrooster Beheercentrum</h1>
                        <p class="text-gray-600 text-lg">Beheer medewerkers, teams, verlofredenen en andere kerngegevens</p>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-600 font-medium">
                            <span id="current-user">Gebruiker wordt geladen...</span>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                            <span id="connection-status">Verbinden...</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Tab Navigation -->
            <div class="mb-8 border-b border-gray-300" id="tab-navigation-wrapper">
                <nav class="flex flex-wrap gap-2 -mb-px tab-navigation" id="tab-navigation">
                    <button data-tab="medewerkers" class="tab-button py-3 px-4 text-sm font-medium text-center text-gray-600 rounded-t-lg hover:text-blue-600 hover:border-blue-600 whitespace-nowrap">
                        <svg class="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                        </svg>
                        Medewerkers
                    </button>
                    <button data-tab="dagen-indicators" class="tab-button py-3 px-4 text-sm font-medium text-center text-gray-600 rounded-t-lg hover:text-blue-600 hover:border-blue-600 whitespace-nowrap">
                        <svg class="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                        Dag Indicatoren
                    </button>
                    <button data-tab="functies" class="tab-button py-3 px-4 text-sm font-medium text-center text-gray-600 rounded-t-lg hover:text-blue-600 hover:border-blue-600 whitespace-nowrap">
                        <svg class="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        Functies
                    </button>
                    <button data-tab="verlofredenen" class="tab-button py-3 px-4 text-sm font-medium text-center text-gray-600 rounded-t-lg hover:text-blue-600 hover:border-blue-600 whitespace-nowrap">
                        <svg class="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                        </svg>
                        Verlofredenen
                    </button>
                    <button data-tab="teams" class="tab-button py-3 px-4 text-sm font-medium text-center text-gray-600 rounded-t-lg hover:text-blue-600 hover:border-blue-600 whitespace-nowrap">
                        <svg class="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                        </svg>
                        Teams
                    </button>
                    <button data-tab="seniors" class="tab-button py-3 px-4 text-sm font-medium text-center text-gray-600 rounded-t-lg hover:text-blue-600 hover:border-blue-600 whitespace-nowrap">
                        <svg class="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        Seniors
                    </button>
                    <button data-tab="uren-per-week" class="tab-button py-3 px-4 text-sm font-medium text-center text-gray-600 rounded-t-lg hover:text-blue-600 hover:border-blue-600 whitespace-nowrap">
                        <svg class="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                        </svg>
                        Uren Per Week
                    </button>
                    <button data-tab="incidenteel-zitting-vrij" class="tab-button py-3 px-4 text-sm font-medium text-center text-gray-600 rounded-t-lg hover:text-blue-600 hover:border-blue-600 whitespace-nowrap">
                        <svg class="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                        Incidenteel Zitting Vrij
                    </button>
                </nav>
            </div>

            <!-- Main Content -->
            <main id="tab-content-container" class="w-full slide-up">
                <!-- Content will be dynamically loaded here -->
            </main>

            <!-- Footer -->
            <footer class="text-center mt-16 py-8 border-t border-gray-300" id="page-footer">
                <a href="../verlofrooster.aspx" class="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                    ← Terug naar het Verlofrooster
                </a>
                <p class="text-xs text-gray-500 mt-3">
                    © <span id="current-year"></span> Verlofrooster Applicatie
                </p>
            </footer>
        </div>
    </div>

    <!-- Edit Modal -->
    <div id="edit-modal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 modal-overlay flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 modal-content">
            <div class="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 id="modal-title" class="text-xl font-semibold text-gray-900">Item bewerken</h3>
                <button id="modal-close" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <form id="modal-form" class="space-y-6">
                    <div id="modal-fields"></div>
                </form>
                <div id="modal-status" class="mt-4"></div>
            </div>
            <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button id="modal-cancel" class="btn btn-secondary">
                    Annuleren
                </button>
                <button id="modal-save" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Opslaan
                </button>
            </div>
        </div>
    </div>

    <!-- Confirmation Modal -->
    <div id="confirm-modal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 modal-overlay flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200 modal-content">
            <div class="p-6">
                <div class="flex items-center mb-6">
                    <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-semibold text-gray-900">Bevestiging vereist</h3>
                    </div>
                </div>
                <div class="mb-6">
                    <p id="confirm-message" class="text-gray-700"></p>
                </div>
                <div class="flex justify-end space-x-3">
                    <button id="confirm-cancel" class="btn btn-secondary">
                        Annuleren
                    </button>
                    <button id="confirm-delete" class="btn btn-danger">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        Verwijderen
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Enhanced configuration mapping for tabs to SharePoint lists
        const TAB_CONFIG = {
            'medewerkers': 'Medewerkers',
            'dagen-indicators': 'DagenIndicators', 
            'functies': 'keuzelijstFuncties',
            'verlofredenen': 'Verlofredenen',
            'teams': 'Teams',
            'seniors': 'Seniors',
            'uren-per-week': 'UrenPerWeek',
            'incidenteel-zitting-vrij': 'IncidenteelZittingVrij'
        };

        // Global state management
        let sharePointContext = {
            siteUrl: '',
            requestDigest: ''
        };
        let currentTab = null;
        let currentModalData = null;
        let gebruikersInstellingen = null;
        let isDarkTheme = false;

        // Enhanced theme management
        function applyTheme(theme) {
            isDarkTheme = theme === 'dark';
            const body = document.body;
            
            if (isDarkTheme) {
                body.classList.remove('bg-gray-50', 'text-gray-900');
                body.classList.add('bg-gray-900', 'text-gray-100', 'dark');
                updateElementsForDarkTheme();
            } else {
                body.classList.remove('bg-gray-900', 'text-gray-100', 'dark');
                body.classList.add('bg-gray-50', 'text-gray-900');
                updateElementsForLightTheme();
            }
            
            updateAllDynamicContentStyles();
            console.log(`Applied ${isDarkTheme ? 'dark' : 'light'} theme`);
        }

        function updateElementsForDarkTheme() {
            // Update loading overlay
            const loadingCard = document.querySelector('#global-loading .modal-content');
            if (loadingCard) {
                loadingCard.className = 'bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 modal-content';
                const loadingText = loadingCard.querySelector('span');
                if (loadingText) loadingText.className = 'text-gray-100 font-medium';
            }

            // Update headers
            const mainTitle = document.querySelector('h1');
            if (mainTitle) mainTitle.className = 'text-4xl font-bold text-white mb-2';
            
            const subtitle = document.querySelector('header p');
            if (subtitle) subtitle.className = 'text-gray-300 text-lg';

            document.getElementById('current-user').className = 'text-sm text-gray-300 font-medium';
            document.getElementById('connection-status').className = 'text-xs text-gray-400 mt-1';

            // Update navigation and footer
            const tabNavWrapper = document.getElementById('tab-navigation-wrapper');
            if (tabNavWrapper) tabNavWrapper.className = 'mb-8 border-b border-gray-700';
            
            const pageFooter = document.getElementById('page-footer');
            if (pageFooter) {
                pageFooter.className = 'text-center mt-16 py-8 border-t border-gray-700';
                const footerLink = pageFooter.querySelector('a');
                if (footerLink) footerLink.className = 'text-blue-400 hover:text-blue-300 hover:underline transition-colors';
            }
        }

        function updateElementsForLightTheme() {
            // Update loading overlay
            const loadingCard = document.querySelector('#global-loading .modal-content');
            if (loadingCard) {
                loadingCard.className = 'bg-white p-8 rounded-xl shadow-2xl border border-gray-200 modal-content';
                const loadingText = loadingCard.querySelector('span');
                if (loadingText) loadingText.className = 'text-gray-900 font-medium';
            }

            // Update headers
            const mainTitle = document.querySelector('h1');
            if (mainTitle) mainTitle.className = 'text-4xl font-bold text-gray-900 mb-2';
            
            const subtitle = document.querySelector('header p');
            if (subtitle) subtitle.className = 'text-gray-600 text-lg';

            document.getElementById('current-user').className = 'text-sm text-gray-600 font-medium';
            document.getElementById('connection-status').className = 'text-xs text-gray-500 mt-1';

            // Update navigation and footer
            const tabNavWrapper = document.getElementById('tab-navigation-wrapper');
            if (tabNavWrapper) tabNavWrapper.className = 'mb-8 border-b border-gray-300';
            
            const pageFooter = document.getElementById('page-footer');
            if (pageFooter) {
                pageFooter.className = 'text-center mt-16 py-8 border-t border-gray-300';
                const footerLink = pageFooter.querySelector('a');
                if (footerLink) footerLink.className = 'text-blue-600 hover:text-blue-700 hover:underline transition-colors';
            }
        }

        function updateAllDynamicContentStyles() {
            // Update tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                const baseClasses = 'tab-button py-3 px-4 text-sm font-medium text-center rounded-t-lg whitespace-nowrap';
                if (btn.classList.contains('active')) {
                    btn.className = `${baseClasses} active text-blue-600 border-blue-600`;
                } else {
                    btn.className = `${baseClasses} ${isDarkTheme ? 'text-gray-400 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'}`;
                }
            });

            // Update tab content
            const tabContainer = document.getElementById('tab-content-container');
            if (tabContainer && tabContainer.firstChild) {
                updateTableStyles(tabContainer);
                updateModalStyles();
                updateFormStyles();
            }
        }

        function updateTableStyles(container) {
            const tableWrapper = container.querySelector('.table-container');
            if (tableWrapper) {
                const table = tableWrapper.querySelector('table');
                if (table) {
                    table.className = `data-table ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`;
                    
                    // Update table rows
                    table.querySelectorAll('tbody tr').forEach(row => {
                        row.className = `transition-all duration-200 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`;
                        
                        // Update action buttons
                        row.querySelectorAll('button[title="Bewerken"]').forEach(btn => {
                            btn.className = `${isDarkTheme ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors p-1 rounded hover:bg-gray-100`;
                        });
                        
                        row.querySelectorAll('button[title="Verwijderen"]').forEach(btn => {
                            btn.className = `${isDarkTheme ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors p-1 rounded hover:bg-gray-100`;
                        });
                    });
                }
            }
        }

        function updateModalStyles() {
            // Update edit modal
            const editModal = document.getElementById('edit-modal');
            if (!editModal.classList.contains('hidden')) {
                const modalContent = editModal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.className = `${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden modal-content`;
                }
                
                const modalTitle = editModal.querySelector('#modal-title');
                if (modalTitle) modalTitle.className = `text-xl font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`;
                
                const modalFooter = editModal.querySelector('.border-t');
                if (modalFooter) modalFooter.className = `flex justify-end space-x-3 p-6 border-t ${isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`;
            }

            // Update confirm modal
            const confirmModal = document.getElementById('confirm-modal');
            if (!confirmModal.classList.contains('hidden')) {
                const modalContent = confirmModal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.className = `${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-2xl max-w-md w-full modal-content`;
                }
            }
        }

        function updateFormStyles() {
            // Update form fields in modal
            document.querySelectorAll('.form-field').forEach(field => {
                const label = field.querySelector('label');
                if (label) {
                    label.className = `form-label block font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`;
                }
                
                const input = field.querySelector('input, select, textarea');
                if (input && !input.type === 'color') {
                    input.className = `form-input w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;
                }
            });
        }

        // Enhanced field type detection with better Start/Einde handling
        function getFieldTypeInfo(field) {
            const fieldName = field.interneNaam.toLowerCase();
            const fieldType = field.type;
            
            // Enhanced detection for time/date fields based on field names
            if (fieldName.includes('start') || fieldName.includes('einde') || fieldName.includes('eind')) {
                if (fieldType === 'DateTime') {
                    return { inputType: 'datetime-local', validation: 'datetime' };
                } else {
                    return { inputType: 'time', validation: 'time', placeholder: '09:30' };
                }
            }
            
            // Phone number detection
            if (fieldName.includes('telefoon') || fieldName.includes('phone')) {
                return { 
                    inputType: 'tel', 
                    validation: 'phone', 
                    placeholder: '06 123 456 78', 
                    pattern: '[0-9\\s]+' 
                };
            }
            
            // Color field detection
            if (fieldName.includes('kleur') || fieldName.includes('color')) {
                return { 
                    inputType: 'color', 
                    validation: 'color', 
                    showHexInput: true 
                };
            }
            
            // Email detection
            if (fieldName.includes('mail') || fieldName.includes('email')) {
                return { inputType: 'email', validation: 'email' };
            }

            // Choice field handling
            if (fieldType === 'Choice') {
                if (fieldName.includes('patroon')) {
                    return { 
                        inputType: 'select', 
                        options: ['', 'Effen', 'Diagonale lijn (rechts)', 'Diagonale lijn (links)', 'Kruis', 'Plus', 'Louis Vuitton'] 
                    };
                }
                if (fieldName.includes('terugkeerpatroon')) {
                    return { 
                        inputType: 'select', 
                        options: ['', 'Dagelijks', 'Wekelijks', 'Maandelijks'] 
                    };
                }
            }
            
            // Lookup field handling
            if (fieldName === 'team') {
                return { inputType: 'select', populateFrom: 'Teams', populateField: 'Naam' };
            }
            if (fieldName === 'functie') {
                return { inputType: 'select', populateFrom: 'keuzelijstFuncties', populateField: 'Title' };
            }
            
            // DateTime field handling
            if (fieldType === 'DateTime') {
                if (field.format === 'DateOnly') {
                    return { inputType: 'date', validation: 'date' };
                }
                return { inputType: 'datetime-local', validation: 'datetime' };
            }
            
            if (fieldType === 'Date') {
                return { inputType: 'date', validation: 'date' };
            }

            // Default field type mapping
            return {
                inputType: fieldType === 'Note' ? 'textarea' :
                           fieldType === 'Number' || fieldType === 'Currency' ? 'number' :
                           fieldType === 'Boolean' ? 'select' : 'text'
            };
        }

        // Enhanced field hiding logic - improved ID detection
        function shouldHideField(fieldName) {
            if (!fieldName) return false;
            
            const normalizedName = fieldName.toLowerCase();
            
            // Hide exact ID matches but not fields ending with ID (like MedewerkerID)
            if (normalizedName === 'id') return true;
            
            // Don't hide fields that end with 'id' but are longer (like "MedewerkerID", "TeamID", etc.)
            return false;
        }

        // Enhanced username sanitization
        function sanitizeUsername(username) {
            if (!username) return '';
            
            let sanitized = String(username).trim();
            
            // Remove SharePoint claim prefix if present
            if (sanitized.includes('i:0#.w|')) {
                const parts = sanitized.split('i:0#.w|');
                if (parts.length > 1) sanitized = parts[1];
            } else if (sanitized.includes('|')) {
                const parts = sanitized.split('|');
                sanitized = parts[parts.length - 1] || sanitized;
            }
            
            // Extract domain\username format
            if (sanitized.includes('\\')) {
                const parts = sanitized.split('\\');
                if (parts.length > 1) sanitized = parts[1];
            }
            
            return sanitized.toLowerCase();
        }

        function formatUsernameForSaving(username) {
            if (!username) return '';
            
            const sanitized = sanitizeUsername(username);
            
            // If it doesn't already have the claim prefix, add it
            if (!String(username).includes('i:0#.w|')) {
                return `i:0#.w|${sanitized}`;
            }
            
            return username;
        }

        // Enhanced user settings loading
        async function loadUserSettings() {
            try {
                if (!sharePointContext.siteUrl) {
                    console.warn('SharePoint context niet beschikbaar voor gebruikersinstellingen');
                    applyTheme('light');
                    return;
                }

                const userResponse = await fetch(`${sharePointContext.siteUrl}/_api/web/currentuser`, {
                    headers: { 'Accept': 'application/json;odata=verbose' }
                });

                if (!userResponse.ok) throw new Error('Kon huidige gebruiker niet ophalen');
                
                const userData = await userResponse.json();
                const currentUser = userData.d;
                
                const settingsUrl = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('gebruikersInstellingen')/items?$filter=MedewerkerID eq '${encodeURIComponent(currentUser.LoginName)}'&$top=1`;
                
                const settingsResponse = await fetch(settingsUrl, {
                    headers: { 'Accept': 'application/json;odata=verbose' }
                });

                if (settingsResponse.ok) {
                    const settingsData = await settingsResponse.json();
                    if (settingsData.d.results && settingsData.d.results.length > 0) {
                        gebruikersInstellingen = settingsData.d.results[0];
                        const soortWeergave = gebruikersInstellingen.SoortWeergave;
                        console.log('Gebruikersinstellingen geladen:', soortWeergave);
                        if (soortWeergave) {
                            applyTheme(soortWeergave);
                            return;
                        }
                    }
                }
                
                console.log('Geen gebruikersinstellingen gevonden, standaard lichte thema wordt toegepast');
                applyTheme('light');
            } catch (error) {
                console.warn('Kon gebruikersinstellingen niet laden:', error);
                applyTheme('light');
            }
        }

        // Enhanced validation with better error messaging
        function validateField(field, value) {
            const fieldInfo = getFieldTypeInfo(field);
            const errors = [];
            
            if (field.isRequired && (!value || String(value).trim() === '')) {
                errors.push(`${field.titel} is verplicht`);
                return errors;
            }
            
            if (!value || String(value).trim() === '') return errors;
            
            switch (fieldInfo.validation) {
                case 'phone':
                    if (!/^[0-9\s]+$/.test(value)) {
                        errors.push(`${field.titel} mag alleen cijfers en spaties bevatten`);
                    }
                    if (value.replace(/\s/g, '').length < 8) {
                        errors.push(`${field.titel} moet minimaal 8 cijfers bevatten`);
                    }
                    break;
                    
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        errors.push(`${field.titel} moet een geldig e-mailadres zijn`);
                    }
                    break;
                    
                case 'color':
                    if (!/^#[0-9A-Fa-f]{6}$/i.test(value)) {
                        errors.push(`${field.titel} moet een geldige hex kleurcode zijn (bijv. #FF0000)`);
                    }
                    break;
                    
                case 'time':
                    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                        errors.push(`${field.titel} moet in HH:MM formaat zijn (bijv. 09:30)`);
                    }
                    break;
                    
                case 'datetime':
                    const date = new Date(value);
                    if (isNaN(date.getTime())) {
                        errors.push(`${field.titel} bevat een ongeldige datum/tijd`);
                    }
                    break;
                    
                case 'date':
                    const dateOnly = new Date(value);
                    if (isNaN(dateOnly.getTime())) {
                        errors.push(`${field.titel} bevat een ongeldige datum`);
                    }
                    break;
            }
            
            return errors;
        }

        // Enhanced form field creation with better styling
        async function createFormField(field, itemData, listConfig) {
            const container = document.createElement('div');
            container.className = 'form-field mb-6';

            const label = document.createElement('label');
            label.className = `form-label block font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`;
            label.textContent = field.titel;
            if (field.isRequired) {
                const required = document.createElement('span');
                required.className = 'text-red-500 ml-1';
                required.textContent = '*';
                label.appendChild(required);
            }

            let input;
            const rawValue = itemData ? itemData[field.interneNaam] : undefined;
            let displayValue = rawValue;

            const fieldInfo = getFieldTypeInfo(field);
            const fieldNameLower = field.interneNaam.toLowerCase();

            // Handle different field types for display values
            if (field.type === 'User' || field.type === 'Lookup') {
                displayValue = rawValue?.Title || rawValue?.Name || (typeof rawValue === 'string' ? rawValue : '');
                if (['username', 'gebruikersnaam', 'gnaam', 'medewerkerid', 'teamleiderid'].some(key => fieldNameLower.includes(key))) {
                    displayValue = sanitizeUsername(rawValue?.LoginName || displayValue);
                }
            } else if (field.type === 'DateTime') {
                if (rawValue) {
                    const date = new Date(rawValue);
                    if (!isNaN(date)) {
                        const isDateOnly = listConfig.velden.find(f => f.interneNaam === field.interneNaam)?.format === 'DateOnly';
                        if (isDateOnly || fieldInfo.inputType === 'date') {
                            displayValue = date.toISOString().split('T')[0];
                        } else {
                            displayValue = date.toISOString().slice(0, 16);
                        }
                    } else {
                        displayValue = '';
                    }
                } else {
                    displayValue = '';
                }
            }

            // Create input based on field type
            switch (fieldInfo.inputType) {
                case 'tel':
                    input = document.createElement('input');
                    input.type = 'tel';
                    input.placeholder = fieldInfo.placeholder || '06 123 456 78';
                    if (fieldInfo.pattern) input.pattern = fieldInfo.pattern;
                    input.value = displayValue || '';
                    break;

                case 'email':
                    input = document.createElement('input');
                    input.type = 'email';
                    input.value = displayValue || '';
                    break;

                case 'color':
                    const colorContainer = document.createElement('div');
                    colorContainer.className = 'color-input-container';
                    
                    input = document.createElement('input');
                    input.type = 'color';
                    input.value = displayValue || '#000000';
                    input.className = 'color-picker';
                    
                    const hexInput = document.createElement('input');
                    hexInput.type = 'text';
                    hexInput.placeholder = '#RRGGBB';
                    hexInput.value = displayValue || '';
                    hexInput.className = 'form-input flex-1';
                    hexInput.name = field.interneNaam;

                    input.addEventListener('input', () => {
                        hexInput.value = input.value.toUpperCase();
                    });
                    
                    hexInput.addEventListener('input', () => {
                        if (/^#[0-9A-Fa-f]{6}$/i.test(hexInput.value)) {
                            input.value = hexInput.value;
                        }
                    });
                    
                    colorContainer.appendChild(input);
                    colorContainer.appendChild(hexInput);
                    container.appendChild(label);
                    container.appendChild(colorContainer);
                    return container;

                case 'select':
                    input = document.createElement('select');
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = '-- Selecteer --';
                    input.appendChild(defaultOption);
                    
                    if (fieldInfo.options) {
                        fieldInfo.options.slice(1).forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt;
                            option.textContent = opt;
                            if (opt === displayValue) option.selected = true;
                            input.appendChild(option);
                        });
                    } else if (field.type === 'Boolean') {
                        const falseOption = document.createElement('option');
                        falseOption.value = 'false';
                        falseOption.textContent = 'Nee';
                        
                        const trueOption = document.createElement('option');
                        trueOption.value = 'true';
                        trueOption.textContent = 'Ja';
                        
                        let effectiveValue = displayValue;
                        if (itemData === null) {
                            if (fieldNameLower.includes('actief')) {
                                effectiveValue = true;
                            } else if (fieldNameLower.includes('terugkerend')) {
                                effectiveValue = false;
                            }
                        }

                        falseOption.selected = effectiveValue === false || String(effectiveValue) === 'false';
                        trueOption.selected = effectiveValue === true || String(effectiveValue) === 'true';
                        
                        input.appendChild(falseOption);
                        input.appendChild(trueOption);
                    } else if (fieldInfo.populateFrom) {
                        const loadingOpt = document.createElement('option');
                        loadingOpt.textContent = 'Laden...';
                        loadingOpt.disabled = true;
                        input.appendChild(loadingOpt);
                        
                        populateDropdownOptions(fieldInfo).then(options => {
                            input.removeChild(loadingOpt);
                            options.forEach(opt => {
                                const option = document.createElement('option');
                                option.value = opt;
                                option.textContent = opt;
                                if (opt === displayValue) option.selected = true;
                                input.appendChild(option);
                            });
                        });
                    }
                    break;

                case 'textarea':
                    input = document.createElement('textarea');
                    input.rows = 4;
                    input.value = displayValue || '';
                    break;

                case 'number':
                    input = document.createElement('input');
                    input.type = 'number';
                    input.value = displayValue || '';
                    break;

                case 'time':
                    input = document.createElement('input');
                    input.type = 'time';
                    input.value = displayValue || '';
                    break;

                case 'datetime-local':
                    input = document.createElement('input');
                    input.type = 'datetime-local';
                    input.value = displayValue || '';
                    break;

                case 'date':
                    input = document.createElement('input');
                    input.type = 'date';
                    input.value = displayValue || '';
                    break;

                default:
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = displayValue || '';
                    break;
            }
            
            input.name = field.interneNaam;
            if (field.isRequired) input.required = true;
            
            // Apply enhanced styling
            if (input.tagName.toLowerCase() !== 'select') {
                input.className = `form-input w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;
            } else {
                input.className = `form-input w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;
            }

            container.appendChild(label);
            container.appendChild(input);
            return container;
        }

        // Enhanced table content creation with better responsiveness
        function createTabContentHTML(tabName, config) {
            const displayName = getDisplayName(tabName);
            const singularName = getSingularName(tabName);
            
            return `
                <div class="space-y-8 w-full fade-in">
                    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                        <div>
                            <h2 class="text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-2">${displayName}</h2>
                            <p class="text-lg ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}">Beheer ${displayName.toLowerCase()} in het systeem</p>
                        </div>
                        <button onclick="openCreateModal('${tabName}')" class="btn btn-success">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                            </svg>
                            ${singularName} toevoegen
                        </button>
                    </div>
                    
                    <div class="table-container ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg">
                        <table class="data-table">
                            <thead id="table-header-${tabName}"></thead>
                            <tbody id="table-body-${tabName}"></tbody>
                        </table>
                        <div class="px-6 py-4 border-t ${isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <span id="table-status-${tabName}" class="text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}">Laden...</span>
                                <button onclick="refreshCurrentTab()" class="btn btn-secondary text-sm">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                                    </svg>
                                    Vernieuwen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Enhanced table data display with better formatting
        function displayTableData(tabName, config, items) {
            const headerElement = document.getElementById(`table-header-${tabName}`);
            const bodyElement = document.getElementById(`table-body-${tabName}`);
            const statusElement = document.getElementById(`table-status-${tabName}`);

            if (!headerElement || !bodyElement || !statusElement) {
                console.error('Tabelelementen niet gevonden voor tab:', tabName);
                return;
            }

            const visibleFields = (config.velden || []).filter(field => 
                !shouldHideField(field.interneNaam) && field.titel.toLowerCase() !== 'id'
            );

            // Create enhanced table header
            headerElement.innerHTML = `
                <tr>
                    ${visibleFields.map(field => `
                        <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
                            ${field.titel}
                        </th>
                    `).join('')}
                    <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-white">
                        Acties
                    </th>
                </tr>
            `;

            if (items.length === 0) {
                bodyElement.innerHTML = `
                    <tr>
                        <td colspan="${visibleFields.length + 1}" class="px-6 py-12 text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}">
                            <div class="flex flex-col items-center">
                                <svg class="w-16 h-16 mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path>
                                </svg>
                                <p class="text-lg font-medium">Geen items gevonden</p>
                                <p class="text-sm">Voeg een item toe om te beginnen</p>
                            </div>
                        </td>
                    </tr>
                `;
                statusElement.textContent = 'Geen items';
            } else {
                bodyElement.innerHTML = items.map(item => {
                    const itemDisplayName = getItemDisplayName(item, config).replace(/'/g, "\\'");
                    return `
                        <tr class="transition-all duration-200 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}">
                            ${visibleFields.map(field => `
                                <td class="px-6 py-4 text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}">
                                    ${formatFieldValue(item, field, config)}
                                </td>
                            `).join('')}
                            <td class="px-6 py-4 text-right">
                                <div class="flex justify-end space-x-2">
                                    <button onclick="openEditModal('${tabName}', ${item.Id})" 
                                            title="Bewerken" 
                                            class="p-2 rounded-lg transition-colors ${isDarkTheme ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-600' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'}">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                        </svg>
                                    </button>
                                    <button onclick="confirmDelete('${tabName}', ${item.Id}, '${itemDisplayName}')" 
                                            title="Verwijderen" 
                                            class="p-2 rounded-lg transition-colors ${isDarkTheme ? 'text-red-400 hover:text-red-300 hover:bg-gray-600' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
                
                statusElement.textContent = `${items.length} item${items.length !== 1 ? 's' : ''} geladen`;
            }
        }

        // Enhanced field value formatting
        function formatFieldValue(item, fieldConfig, listConfig) {
            let value = item[fieldConfig.interneNaam];
            
            if (value === null || value === undefined) {
                return `<span class="${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}">-</span>`;
            }

            const fieldNameLower = fieldConfig.interneNaam.toLowerCase();
            
            // Handle username fields
            if (['username', 'gebruikersnaam', 'gnaam', 'medewerkerid', 'teamleiderid'].some(key => fieldNameLower.includes(key))) {
                return `<span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">${sanitizeUsername(value.Title || value)}</span>`;
            }
            
            const fieldInfo = getFieldTypeInfo(fieldConfig);

            switch (fieldConfig.type) {
                case 'Boolean':
                    return value ? 
                        '<span class="inline-flex items-center"><span class="status-indicator status-active"></span>Ja</span>' : 
                        '<span class="inline-flex items-center"><span class="status-indicator status-inactive"></span>Nee</span>';
                        
                case 'DateTime':
                    try {
                        const date = new Date(value);
                        const isDateOnly = listConfig.velden.find(f => f.interneNaam === fieldConfig.interneNaam)?.format === 'DateOnly';
                        
                        if (isDateOnly) {
                            return `<span class="font-mono text-sm">${date.toLocaleDateString('nl-NL')}</span>`;
                        }
                        return `<span class="font-mono text-sm">${date.toLocaleString('nl-NL', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}</span>`;
                    } catch (e) {
                        return '<span class="text-red-500">Ongeldige datum</span>';
                    }
                    
                case 'User':
                case 'Lookup':
                    const displayText = value.Title || value.Name || (typeof value === 'string' ? value : '-');
                    return `<span class="font-medium">${displayText}</span>`;
            }

            // Special formatting for different field types
            if (fieldInfo.validation === 'color' && value) {
                return `
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm" style="background-color: ${value}"></div>
                        <span class="font-mono text-sm">${value.toUpperCase()}</span>
                    </div>
                `;
            }
            
            if (fieldInfo.validation === 'phone' && value) {
                const cleaned = String(value).replace(/\s/g, '');
                if (cleaned.length === 10) {
                    const formatted = `${cleaned.slice(0,2)} ${cleaned.slice(2,5)} ${cleaned.slice(5,8)} ${cleaned.slice(8)}`;
                    return `<a href="tel:${cleaned}" class="text-blue-600 hover:text-blue-800 underline font-mono">${formatted}</a>`;
                }
                return `<span class="font-mono">${value}</span>`;
            }
            
            if (fieldInfo.validation === 'email' && value) {
                return `<a href="mailto:${value}" class="text-blue-600 hover:text-blue-800 underline">${value}</a>`;
            }
            
            if (fieldInfo.inputType === 'time' && value) {
                if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                    return `<span class="font-mono bg-gray-100 px-2 py-1 rounded text-sm">${value}</span>`;
                }
                return value;
            }

            const strValue = String(value);
            
            // Handle long text with better truncation
            if (strValue.length > 50) {
                return `
                    <span title="${strValue.replace(/"/g, '&quot;')}" class="cursor-help">
                        ${strValue.substring(0, 50)}...
                    </span>
                `;
            }
            
            // Handle multiline text
            if (fieldConfig.type === 'Note' && strValue.includes('\n')) {
                return `<div class="whitespace-pre-wrap max-w-xs text-sm">${strValue}</div>`;
            }
            
            return strValue;
        }

        // Rest of the JavaScript remains largely the same but with enhanced error handling
        // and better user experience improvements...

        // Initialize application
        document.addEventListener('DOMContentLoaded', async () => {
            document.getElementById('current-year').textContent = new Date().getFullYear();
            showLoading('Verbinding maken met SharePoint...');
            
            try {
                await initializeSharePointContext();
                await loadCurrentUser();
                
                showLoading('Gebruikersinstellingen laden...');
                await loadUserSettings();
                
                setupEventListeners();
                
                const firstTab = Object.keys(TAB_CONFIG)[0];
                if (firstTab) {
                    await switchTab(firstTab);
                } else {
                    showNotification('Geen tabs geconfigureerd.', 'error');
                }
                
                showNotification('Beheercentrum succesvol geladen', 'success');
            } catch (error) {
                console.error('Initialisatiefout:', error);
                showNotification('Fout bij laden van beheercentrum: ' + error.message, 'error');
                document.getElementById('connection-status').textContent = 'Verbindingsfout';
                applyTheme('light');
            } finally {
                hideLoading();
            }
        });

        // Enhanced SharePoint context initialization
        async function initializeSharePointContext() {
            try {
                const currentUrl = window.location.href;
                const urlParts = currentUrl.split('/CPW/'); 
                
                if (urlParts.length < 2) {
                    const pathSegments = new URL(currentUrl).pathname.split('/');
                    if (pathSegments.length > 2) {
                        sharePointContext.siteUrl = new URL(currentUrl).origin + pathSegments.slice(0, -2).join('/');
                        console.warn(`'/CPW/' segment not found in URL. Guessed site URL: ${sharePointContext.siteUrl}`);
                        
                        if (!sharePointContext.siteUrl.includes('/sites/')) {
                            throw new Error('Ongeldige URL structuur, kon site URL niet bepalen.');
                        }
                    } else {
                        throw new Error('Ongeldige URL structuur, kon site URL niet bepalen.');
                    }
                } else {
                    sharePointContext.siteUrl = urlParts[0];
                }

                document.getElementById('connection-status').textContent = `Verbonden met: ${sharePointContext.siteUrl}`;
                
                const response = await fetch(`${sharePointContext.siteUrl}/_api/contextinfo`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json;odata=verbose' }
                });
                
                if (!response.ok) throw new Error(`SharePoint contextfout: ${response.status}`);
                
                const data = await response.json();
                sharePointContext.requestDigest = data.d.GetContextWebInformation.FormDigestValue;
                console.log('SharePoint context geïnitialiseerd:', sharePointContext.siteUrl);
            } catch (error) {
                console.error('Fout bij initialiseren SharePoint context:', error.message);
                throw new Error('Kan geen verbinding maken met SharePoint: ' + error.message);
            }
        }

        async function loadCurrentUser() {
            try {
                const response = await fetch(`${sharePointContext.siteUrl}/_api/web/currentuser`, {
                    headers: { 'Accept': 'application/json;odata=verbose' }
                });
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('current-user').textContent = data.d.Title || 'Onbekende gebruiker';
                } else {
                    document.getElementById('current-user').textContent = 'Gebruiker onbekend (fout)';
                }
            } catch (error) {
                console.warn('Kon huidige gebruiker niet laden:', error);
                document.getElementById('current-user').textContent = 'Gebruiker onbekend';
            }
        }

        function setupEventListeners() {
            document.getElementById('tab-navigation').addEventListener('click', async (e) => {
                const button = e.target.closest('.tab-button');
                if (button) {
                    const tabName = button.dataset.tab;
                    await switchTab(tabName);
                }
            });

            document.getElementById('modal-close').addEventListener('click', closeModal);
            document.getElementById('modal-cancel').addEventListener('click', closeModal);
            document.getElementById('modal-save').addEventListener('click', saveModalData);
            
            document.getElementById('confirm-cancel').addEventListener('click', closeConfirmModal);
            document.getElementById('confirm-delete').addEventListener('click', executeDelete);

            document.getElementById('edit-modal').addEventListener('click', (e) => {
                if (e.target.id === 'edit-modal') closeModal();
            });
            document.getElementById('confirm-modal').addEventListener('click', (e) => {
                if (e.target.id === 'confirm-modal') closeConfirmModal();
            });
        }

        async function switchTab(tabName) {
            if (!TAB_CONFIG[tabName]) {
                showNotification('Onbekende tab: ' + tabName, 'error');
                return;
            }
            
            currentTab = tabName;
            
            // Update tab button states
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.tab === tabName) {
                    btn.classList.add('active');
                }
            });
            
            showLoading(`Laden van ${getDisplayName(tabName)}...`);
            
            try {
                await loadTabContent(tabName);
            } catch (error) {
                showNotification('Fout bij laden van gegevens: ' + error.message, 'error');
                document.getElementById('tab-content-container').innerHTML = `
                    <div class="text-center py-16">
                        <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-red-700 mb-2">Fout bij laden</h3>
                        <p class="text-red-600">Kon inhoud niet laden voor ${getDisplayName(tabName)}.</p>
                    </div>
                `;
            } finally {
                hideLoading();
                updateAllDynamicContentStyles();
            }
        }

        async function loadTabContent(tabName) {
            const listName = TAB_CONFIG[tabName];
            const config = window.getLijstConfig ? window.getLijstConfig(listName) : null;
            
            if (!config) throw new Error(`Configuratie niet gevonden voor ${listName}`);

            const container = document.getElementById('tab-content-container');
            container.innerHTML = createTabContentHTML(tabName, config);
            await loadListData(listName, config);
        }

        // Additional utility functions for data handling...
        async function populateDropdownOptions(fieldInfo) {
            if (!fieldInfo.populateFrom) return [];
            
            try {
                const url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(fieldInfo.populateFrom)}')/items?$select=${encodeURIComponent(fieldInfo.populateField)}&$top=1000`;
                const response = await fetch(url, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const uniqueValues = [...new Set(data.d.results
                        .map(item => item[fieldInfo.populateField])
                        .filter(Boolean)
                    )];
                    return uniqueValues.sort();
                }
            } catch (error) {
                console.warn(`Kon dropdown niet vullen voor ${fieldInfo.populateFrom}:`, error);
            }
            return [];
        }

        function getSelectFields(config) {
            const fields = ['Id'];
            if (config.velden) {
                config.velden.forEach(field => {
                    if (field.interneNaam && !fields.includes(field.interneNaam) && !shouldHideField(field.interneNaam)) {
                        if (field.type === 'Lookup' || field.type === 'User') {
                            fields.push(`${field.interneNaam}/${field.lookupKolom || 'Title'}`);
                            fields.push(`${field.interneNaam}/Id`);
                        }
                        fields.push(field.interneNaam);
                    }
                });
            }
            return [...new Set(fields)];
        }

        function getExpandFields(config) {
            const expandFields = [];
            if (config.velden) {
                config.velden.forEach(field => {
                    if ((field.type === 'Lookup' || field.type === 'User') && !shouldHideField(field.interneNaam)) {
                        if (field.interneNaam && field.interneNaam !== 'Author' && field.interneNaam !== 'Editor') {
                            expandFields.push(field.interneNaam);
                        }
                    }
                });
            }
            return [...new Set(expandFields)];
        }

        async function loadListData(listName, config) {
            try {
                const selectFields = getSelectFields(config);
                const expandFields = getExpandFields(config);
                
                let url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items`;
                url += `?$select=${selectFields.map(encodeURIComponent).join(',')}`;
                if (expandFields.length > 0) {
                    url += `&$expand=${expandFields.map(encodeURIComponent).join(',')}`;
                }
                url += '&$top=1000';

                const response = await fetch(url, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                if (!response.ok) throw new Error(`Fout bij ophalen data: ${response.status} ${response.statusText}`);

                const data = await response.json();
                displayTableData(currentTab, config, data.d.results || []);
            } catch (error) {
                console.error('Fout bij laden lijstdata:', error);
                document.getElementById(`table-status-${currentTab}`).textContent = 'Fout bij laden: ' + error.message;
                const bodyElement = document.getElementById(`table-body-${currentTab}`);
                if (bodyElement) {
                    bodyElement.innerHTML = `
                        <tr>
                            <td colspan="100%" class="text-red-500 p-8 text-center">
                                <div class="flex flex-col items-center">
                                    <svg class="w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                    </svg>
                                    <p class="font-medium">Data kon niet geladen worden</p>
                                    <p class="text-sm mt-1">${error.message}</p>
                                </div>
                            </td>
                        </tr>
                    `;
                }
                throw error;
            }
        }

        function getItemDisplayName(item, config) {
            return item.Title || item.Naam || 
                   (config.velden.find(f => f.titel === 'Naam' || f.titel === 'Titel') && 
                    item[config.velden.find(f => f.titel === 'Naam' || f.titel === 'Titel').interneNaam]) || 
                   `Item ${item.Id}`;
        }

        async function openCreateModal(tabName) {
            const listName = TAB_CONFIG[tabName];
            const config = window.getLijstConfig ? window.getLijstConfig(listName) : null;
            if (!config) { 
                showNotification('Configuratie niet gevonden', 'error'); 
                return; 
            }
            const singularName = getSingularName(tabName);
            await openModal(`${singularName} toevoegen`, config, null);
        }

        async function openEditModal(tabName, itemId) {
            const listName = TAB_CONFIG[tabName];
            const config = window.getLijstConfig ? window.getLijstConfig(listName) : null;
            if (!config) { 
                showNotification('Configuratie niet gevonden', 'error'); 
                return; 
            }

            showLoading('Item laden...');
            
            try {
                const selectFields = getSelectFields(config);
                const expandFields = getExpandFields(config);
                let url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items(${itemId})`;
                url += `?$select=${selectFields.map(encodeURIComponent).join(',')}`;
                if (expandFields.length > 0) url += `&$expand=${expandFields.map(encodeURIComponent).join(',')}`;

                const response = await fetch(url, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                if (!response.ok) throw new Error(`Fout bij ophalen item: ${response.status}`);
                
                const data = await response.json();
                const singularName = getSingularName(tabName);
                await openModal(`${singularName} bewerken`, config, data.d);
            } catch (error) {
                showNotification('Fout bij laden item: ' + error.message, 'error');
            } finally {
                hideLoading();
            }
        }

        async function openModal(title, config, itemData = null) {
            document.getElementById('modal-title').textContent = title;
            const fieldsContainer = document.getElementById('modal-fields');
            fieldsContainer.innerHTML = '';

            for (const field of (config.velden || [])) {
                if (shouldHideField(field.interneNaam) || field.titel.toLowerCase() === 'id') continue;
                const fieldElement = await createFormField(field, itemData, config);
                fieldsContainer.appendChild(fieldElement);
            }

            setupFieldValidation(fieldsContainer, config);
            currentModalData = { config: config, itemData: itemData, isEdit: !!itemData };
            document.getElementById('edit-modal').classList.remove('hidden');
            updateAllDynamicContentStyles();
        }

        function setupFieldValidation(container, config) {
            const inputs = container.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const field = config.velden?.find(f => f.interneNaam === input.name);
                if (!field) return;
                
                input.addEventListener('blur', () => {
                    const errors = validateField(field, input.value);
                    const existingError = input.parentNode.querySelector('.field-error');
                    if (existingError) existingError.remove();
                    
                    // Reset border classes
                    input.classList.remove('border-red-500', 'border-green-500');
                    const baseBorderClass = isDarkTheme ? 'border-gray-600' : 'border-gray-300';
                    input.classList.add(baseBorderClass);

                    if (errors.length > 0) {
                        input.classList.remove(baseBorderClass);
                        input.classList.add('border-red-500');
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'field-error text-red-500 text-xs mt-1';
                        errorDiv.textContent = errors[0];
                        input.parentNode.appendChild(errorDiv);
                    } else if (input.value.trim() !== '' || field.type === 'Boolean') {
                        input.classList.remove(baseBorderClass);
                        input.classList.add('border-green-500');
                    }
                });

                // Enhanced phone number formatting
                const fieldInfo = getFieldTypeInfo(field);
                if (fieldInfo.validation === 'phone') {
                    input.addEventListener('input', (e) => {
                        let value = e.target.value.replace(/[^0-9\s]/g, '');
                        // Basic auto-formatting for Dutch phone numbers
                        if (value.replace(/\s/g, '').length >= 2) {
                            value = value.replace(/\s/g, '').replace(/(\d{2})(\d{0,3})?(\d{0,3})?(\d{0,2})?/, (_, p1, p2, p3, p4) => 
                                [p1, p2, p3, p4].filter(Boolean).join(' ')
                            );
                        }
                        e.target.value = value;
                    });
                }
            });
        }

        function closeModal() {
            document.getElementById('edit-modal').classList.add('hidden');
            document.getElementById('modal-status').innerHTML = '';
            currentModalData = null;
        }

        async function saveModalData() {
            if (!currentModalData) return;

            const form = document.getElementById('modal-form');
            const formData = new FormData(form);
            const statusElement = document.getElementById('modal-status');
            statusElement.innerHTML = '';

            const allErrors = [];
            const validatedData = {};
            
            // Enhanced validation and data processing
            for (const field of (currentModalData.config.velden || [])) {
                if (shouldHideField(field.interneNaam) || field.titel.toLowerCase() === 'id' || field.readOnlyInModal) continue;
                
                let value = formData.get(field.interneNaam);
                const fieldErrors = validateField(field, value);
                
                if (fieldErrors.length > 0) {
                    allErrors.push(...fieldErrors);
                    continue;
                }

                let processedValue = value;
                const fieldNameLower = field.interneNaam.toLowerCase();
                const isUserFieldType = ['username', 'gebruikersnaam', 'gnaam', 'medewerkerid', 'teamleiderid'].some(key => fieldNameLower.includes(key));

                if (isUserFieldType && processedValue) {
                    if (field.type === 'User') {
                        processedValue = formatUsernameForSaving(value);
                    } else {
                        processedValue = formatUsernameForSaving(value);
                    }
                } else {
                    switch (field.type) {
                        case 'Boolean': 
                            processedValue = (value === 'true'); 
                            break;
                        case 'Number': 
                        case 'Currency':
                            processedValue = (value && value.trim() !== '') ? parseFloat(value) : null;
                            if (value && value.trim() !== '' && isNaN(processedValue)) {
                                allErrors.push(`${field.titel} moet een geldig nummer zijn`); 
                                continue;
                            }
                            break;
                        case 'DateTime':
                            if (value && value.trim() !== '') {
                                const date = new Date(value);
                                if (!isNaN(date)) processedValue = date.toISOString();
                                else { allErrors.push(`${field.titel} bevat een ongeldige datum/tijd`); continue; }
                            } else processedValue = null;
                            break;
                        default:
                            const fieldInfo = getFieldTypeInfo(field);
                            if (fieldInfo.inputType === 'time') {
                                // Time value is already in HH:MM format
                            } else if (fieldInfo.validation === 'color') {
                                // Color value is already in #RRGGBB format
                            }
                            if (value && value.trim() === '' && !field.isRequired) processedValue = null;
                            else if (!value && !field.isRequired) processedValue = null;
                    }
                }
                
                if (processedValue !== undefined) {
                    validatedData[field.interneNaam] = processedValue;
                }
            }

            if (allErrors.length > 0) {
                statusElement.innerHTML = `<div class="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">${allErrors.join('<br>')}</div>`;
                return;
            }

            showLoading('Opslaan...');
            
            const itemPayload = { 
                '__metadata': { 
                    'type': `SP.Data.${currentModalData.config.lijstTitel.replace(/ /g, '_x0020_')}ListItem` 
                } 
            };
            Object.assign(itemPayload, validatedData);

            const url = currentModalData.isEdit 
                ? `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(currentModalData.config.lijstTitel)}')/items(${currentModalData.itemData.Id})`
                : `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(currentModalData.config.lijstTitel)}')/items`;

            const headers = {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': sharePointContext.requestDigest
            };
            
            if (currentModalData.isEdit) {
                headers['IF-MATCH'] = currentModalData.itemData.__metadata?.etag || '*';
                headers['X-HTTP-Method'] = 'MERGE';
            }

            try {
                const response = await fetch(url, {
                    method: 'POST', 
                    headers: headers, 
                    body: JSON.stringify(itemPayload)
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error?.message?.value || `Fout bij opslaan: ${response.status}`);
                }
                
                showNotification(
                    currentModalData.isEdit ? 'Item succesvol bijgewerkt' : 'Item succesvol toegevoegd', 
                    'success'
                );
                closeModal();
                await refreshCurrentTab();
            } catch (error) {
                console.error('Opslaan fout:', error);
                statusElement.innerHTML = `<div class="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">${error.message}</div>`;
            } finally {
                hideLoading();
            }
        }

        function confirmDelete(tabName, itemId, itemName) {
            document.getElementById('confirm-message').textContent = 
                `Weet u zeker dat u "${itemName}" wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`;
            document.getElementById('confirm-modal').classList.remove('hidden');
            updateAllDynamicContentStyles();
            window.pendingDelete = { tabName, itemId, itemName };
        }

        function closeConfirmModal() {
            document.getElementById('confirm-modal').classList.add('hidden');
            window.pendingDelete = null;
        }

        async function executeDelete() {
            if (!window.pendingDelete) return;
            
            const { tabName, itemId, itemName } = window.pendingDelete;
            const listName = TAB_CONFIG[tabName];
            const config = window.getLijstConfig ? window.getLijstConfig(listName) : null;
            
            if (!config) { 
                showNotification('Configuratie niet gevonden', 'error'); 
                return; 
            }

            showLoading('Verwijderen...');
            closeConfirmModal();

            try {
                const response = await fetch(
                    `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items(${itemId})`,
                    { 
                        method: 'POST', 
                        headers: { 
                            'Accept': 'application/json;odata=verbose', 
                            'X-RequestDigest': sharePointContext.requestDigest, 
                            'IF-MATCH': '*', 
                            'X-HTTP-Method': 'DELETE' 
                        } 
                    }
                );
                
                if (!response.ok) throw new Error(`Fout bij verwijderen: ${response.status}`);
                
                showNotification(`"${itemName}" succesvol verwijderd`, 'success');
                await refreshCurrentTab();
            } catch (error) {
                console.error('Verwijderfout:', error);
                showNotification('Fout bij verwijderen: ' + error.message, 'error');
            } finally {
                hideLoading();
            }
        }

        async function refreshCurrentTab() {
            if (currentTab) await switchTab(currentTab);
        }

        // Enhanced display name functions
        function getDisplayName(tabName) {
            const names = { 
                'medewerkers': 'Medewerkers', 
                'dagen-indicators': 'Dag Indicatoren', 
                'functies': 'Functies', 
                'verlofredenen': 'Verlofredenen', 
                'teams': 'Teams', 
                'seniors': 'Seniors', 
                'uren-per-week': 'Uren Per Week', 
                'incidenteel-zitting-vrij': 'Incidenteel Zitting Vrij' 
            };
            return names[tabName] || tabName.charAt(0).toUpperCase() + tabName.slice(1);
        }

        function getSingularName(tabName) {
            const names = { 
                'medewerkers': 'Medewerker', 
                'dagen-indicators': 'Dag Indicator', 
                'functies': 'Functie', 
                'verlofredenen': 'Verlofreden', 
                'teams': 'Team', 
                'seniors': 'Senior', 
                'uren-per-week': 'Uren Per Week Item', 
                'incidenteel-zitting-vrij': 'Incidenteel Zitting Vrij Item' 
            };
            return names[tabName] || tabName;
        }

        // Enhanced loading and notification functions
        function showLoading(message = 'Laden...') {
            document.getElementById('loading-message').textContent = message;
            document.getElementById('global-loading').classList.remove('hidden');
        }

        function hideLoading() { 
            document.getElementById('global-loading').classList.add('hidden'); 
        }

        function showNotification(message, type = 'info') {
            const notification = document.getElementById('global-notification');
            const messageEl = document.getElementById('notification-message');
            const notificationCard = notification.firstElementChild;
            
            messageEl.textContent = message;
            notificationCard.className = 'notification text-white p-4'; // Reset classes
            
            switch (type) {
                case 'success': 
                    notificationCard.classList.add('bg-green-500'); 
                    break;
                case 'error': 
                    notificationCard.classList.add('bg-red-500'); 
                    break;
                case 'warning': 
                    notificationCard.classList.add('bg-yellow-500', 'text-gray-800'); 
                    break;
                default: 
                    notificationCard.classList.add('bg-blue-500');
            }
            
            notification.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 5000);
        }

        function hideNotification() { 
            document.getElementById('global-notification').classList.add('hidden'); 
        }

        // Enhanced username auto-fill function
        async function handleUsernameChange(inputElement, config) {
            const usernameValue = inputElement.value.trim();
            if (!usernameValue) return;

            try {
                const userUrl = `${sharePointContext.siteUrl}/_api/web/siteusers?$filter=LoginName eq '${encodeURIComponent(formatUsernameForSaving(usernameValue))}' or Title eq '${encodeURIComponent(usernameValue)}'&$top=1`;
                const response = await fetch(userUrl, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.d.results && data.d.results.length > 0) {
                        const user = data.d.results[0];
                        
                        // Auto-fill email if field exists and is empty
                        const emailField = document.querySelector('input[name="E_x002d_mail"], input[name="Email"]');
                        if (emailField && !emailField.value && user.Email) {
                            emailField.value = user.Email;
                            emailField.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        
                        // Auto-fill name if field exists and is empty
                        const nameField = document.querySelector('input[name="Naam"], input[name="Title"]');
                        if (nameField && !nameField.value && user.Title) {
                            nameField.value = user.Title;
                            nameField.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        
                        // Update the input field with the sanitized username
                        inputElement.value = sanitizeUsername(user.LoginName); 

                        console.log('Automatisch aangevulde gebruikersdata:', user);
                        showNotification('Gebruikersgegevens automatisch aangevuld', 'success');
                    }
                }
            } catch (error) {
                console.warn('Kon gebruikersdata niet automatisch aanvullen:', error);
            }
        }

        // Wait for configLijst.js with enhanced error handling
        if (typeof window.getLijstConfig !== 'function') {
            console.log('Wachten op configLijst.js...');
            let attempts = 0;
            const checkConfig = setInterval(() => {
                attempts++;
                if (typeof window.getLijstConfig === 'function') {
                    console.log('configLijst.js succesvol geladen');
                    clearInterval(checkConfig);
                } else if (attempts > 100) {
                    console.error('configLijst.js kon niet geladen worden na meerdere pogingen');
                    showNotification('Configuratiebestand (configLijst.js) kon niet worden geladen. De applicatie werkt mogelijk niet correct.', 'error');
                    clearInterval(checkConfig);
                    
                    document.getElementById('tab-content-container').innerHTML = `
                        <div class="text-center py-16">
                            <svg class="w-24 h-24 mx-auto text-red-500 mb-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <h2 class="text-2xl font-bold text-red-700 mb-4">Kritieke fout</h2>
                            <p class="text-red-600 mb-4">Configuratiebestand ontbreekt</p>
                            <p class="text-gray-600">Neem contact op met de beheerder.</p>
                        </div>
                    `;
                    hideLoading();
                }
            }, 100);
        }

        // Export global functions for onclick handlers
        window.openCreateModal = openCreateModal;
        window.openEditModal = openEditModal;
        window.confirmDelete = confirmDelete;
        window.refreshCurrentTab = refreshCurrentTab;
        window.hideNotification = hideNotification;

        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to close modals
            if (e.key === 'Escape') {
                if (!document.getElementById('edit-modal').classList.contains('hidden')) {
                    closeModal();
                }
                if (!document.getElementById('confirm-modal').classList.contains('hidden')) {
                    closeConfirmModal();
                }
            }
            
            // Ctrl+S to save in modal (prevent browser save)
            if (e.ctrlKey && e.key === 's' && !document.getElementById('edit-modal').classList.contains('hidden')) {
                e.preventDefault();
                saveModalData();
            }
            
            // Ctrl+R to refresh current tab
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                refreshCurrentTab();
            }
        });

        // Enhanced accessibility improvements
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, select, textarea, button')) {
                e.target.setAttribute('aria-describedby', 'keyboard-help');
            }
        });

        // Add keyboard help tooltip
        const keyboardHelp = document.createElement('div');
        keyboardHelp.id = 'keyboard-help';
        keyboardHelp.className = 'sr-only';
        keyboardHelp.textContent = 'Gebruik Tab om te navigeren, Enter om te selecteren, Escape om te sluiten, Ctrl+S om op te slaan';
        document.body.appendChild(keyboardHelp);

        console.log('Verlofrooster Beheercentrum JavaScript geladen en klaar voor gebruik');
    </script>
</body>
</html>
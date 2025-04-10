// SharePoint REST API configuration
window.SP_CONFIG = {
  siteUrl: "https://som.org.om.local/sites/MulderT/CustomPW/Verlof",
  apiUrl: "https://som.org.om.local/sites/MulderT/CustomPW/Verlof/_api/web",
  adminGroups: ["1. Sharepoint beheer", "1.1 Mulder MT", "Verkeerstoren"],
  lists: {
    medewerkers: {
      guid: "835ae977-8cd1-4eb8-a787-23aa2d76228d", // Fixed GUID - removed extra "c" at the beginning
      fields: {
        id: "ID",
        naam: "Naam",
        email: "E_x002d_mail",
        team: "Team",
        functie: "Functie",
        actief: "Actief",
        horen: "Horen",
        geboortedatum: "Geboortedatum",
        title: "Title",
        // Updated to Dutch field names to match the actual SharePoint list
        weeklyHours: "UrenPerWeek",
        workSchedule: "Werkschema",
        workDays: "Werkdagen",
        halfDayType: "HalveDagType",
        halfDayOfWeek: "HalveDagWeekdag",
      },
    },
    urenPerWeek: {
      guid: "55bf75d8-d9e6-4614-8ac0-c3528bdb0ea8", // New list for work hours
      fields: {
        medewerkerId: "MedewerkerID",
        // Monday fields
        maandagStart: "MaandagStart",
        maandagEind: "MaandagEind",
        maandagSoort: "MaandagSoort",
        maandagTotaal: "MaandagTotaal",
        // Tuesday fields
        dinsdagStart: "DinsdagStart",
        dinsdagEind: "DinsdagEind",
        dinsdagSoort: "DinsdagSoort",
        dinsdagTotaal: "DinsdagTotaal",
        // Wednesday fields
        woensdagStart: "WoensdagStart",
        woensdagEind: "WoensdagEind",
        woensdagSoort: "WoensdagSoort",
        woensdagTotaal: "WoensdagTotaal",
        // Thursday fields
        donderdagStart: "DonderdagStart",
        donderdagEind: "DonderdagEind",
        donderdagSoort: "DonderdagSoort",
        donderdagTotaal: "DonderdagTotaal",
        // Friday fields
        vrijdagStart: "VrijdagStart",
        vrijdagEind: "VrijdagEind",
        vrijdagSoort: "VrijdagSoort",
        vrijdagTotaal: "VrijdagTotaal",
      },
    },
    teams: {
      guid: "dc2911c5-b0b7-4092-9c99-5fe957fdf6fc",
      fields: {
        naam: "Naam",
        teamleider: "Teamleider",
        teamleiderId: "TeamleiderId",
        kleur: "Kleur",
        actief: "Actief",
      },
    },
    verlofredenen: {
      guid: "6ca65cc0-ad60-49c9-9ee4-371249e55c7d",
      fields: {
        naam: "Naam",
        kleur: "Kleur",
        verlofdag: "VerlofDag",
        goedgekeurd: "Goedgekeurd",
      },
    },
    verlof: {
      guid: "e12a068f-2821-4fe1-b898-e42e1418edf8", // Unchanged GUID
      fields: {
        medewerker: "Medewerker",
        reden: "Reden",
        startDatum: "StartDatum",
        eindDatum: "EindDatum",
        omschrijving: "Omschrijving",
        status: "Status",
        aanvragtijdstip: "Aanvragtijdstip",
      },
    },
    seniors: {
      guid: "2e9b5974-7d69-4711-b9e6-f8db85f96f5f",
      fields: {
        medewerker: "Medewerker",
        medewerkerId: "MedewerkerId",
        team: "Team",
        teamId: "TeamId",
        title: "Title",
      },
    },
    dagenIndicators: {
      guid: "45528ed2-cdff-4958-82e4-e3eb032fd0aa",
      fields: {
        titel: "Titel",
        kleur: "Kleur",
        patroon: "Patroon",
      },
    },
  },
  // Day type indicators mapping
  dayTypeIndicators: {
    VVD: {
      name: "Vaste vrije dag",
      color: "#10b981", // Green
      description: "Dag waarop niet gewerkt wordt (0 uren)",
    },
    VVM: {
      name: "Vaste vrije middag",
      color: "#8b5cf6", // Purple
      description: "Dag waarop alleen in de ochtend gewerkt wordt",
    },
    VVO: {
      name: "Vaste vrije ochtend",
      color: "#ec4899", // Pink
      description: "Dag waarop alleen in de middag gewerkt wordt",
    },
  },
};

// For CommonJS environments (optional, won't affect browser behavior)
if (typeof module !== "undefined") {
  module.exports = window.SP_CONFIG;
}

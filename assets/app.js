/* AetherSync — shared app logic.
   NOTE: This is a front-end-only demo. Login is simulated with localStorage
   (any non-empty Crew ID + passcode is accepted) so the prototype can be
   evaluated without a backend. Replace withAuth() with a real auth service
   before any real deployment. */

var AS = (function () {
  "use strict";

  /* ---------------- storage helpers ---------------- */
  function get(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function set(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }
  function getJSON(key) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function setJSON(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }

  /* ---------------- auth ---------------- */
  function currentCrewId() { return get('aethersync_crew_id'); }

  function login(crewId, passcode) {
    if (!crewId.trim() || !passcode.trim()) return false;
    set('aethersync_crew_id', crewId.trim());
    return true;
  }

  function logout() {
    try { localStorage.removeItem('aethersync_crew_id'); } catch (e) {}
    window.location.href = 'index.html';
  }

  /* ---------------- baseline ---------------- */
  function hasBaseline(crewId) {
    return !!getJSON('aethersync_baseline_' + crewId);
  }
  function saveBaseline(crewId, data) {
    setJSON('aethersync_baseline_' + crewId, data);
  }
  function getBaseline(crewId) {
    return getJSON('aethersync_baseline_' + crewId);
  }

  /* ---------------- auth guard ---------------- */
  function requireAuth(needsBaseline) {
    var id = currentCrewId();
    if (!id) { window.location.href = 'index.html'; return null; }
    if (needsBaseline && !hasBaseline(id)) {
      window.location.href = 'baseline.html';
      return null;
    }
    return id;
  }

  /* ---------------- sensor reading storage (per crew, per day) ---------------- */
  function todayKey(crewId) {
    return 'aethersync_sensor_' + crewId + '_' + new Date().toISOString().slice(0, 10);
  }
  function saveSensorReading(crewId, reading) {
    setJSON(todayKey(crewId), {
      restingHR: reading.restingHR,
      spo2: reading.spo2,
      sleepHours: reading.sleepHours,
      capturedAt: new Date().toISOString()
    });
  }
  function getTodaySensor(crewId) {
    return getJSON(todayKey(crewId));
  }

  /* ---------------- offline trusted knowledge base ---------------- */
  var KB = [
    { idx: [43, 47], keys: ["headache", "head ache", "migraine"],
      answer: "Headaches during long-duration missions are often linked to fluid shift, dehydration, or short sleep. Given a recent sleep deviation, this is likely related rather than an isolated event.",
      source: "Index [43, 47] — Cardiovascular & Sleep guidance · confidence: moderate" },
    { idx: [45], keys: ["short of breath", "breathless", "spo2", "oxygen", "breathing"],
      answer: "Mild breathlessness can relate to SpO2 fluctuation or exertion in altered-gravity conditions. If current SpO2 is within range, this is most likely transient.",
      source: "Index [45] — Oxygenation-related guidance · confidence: moderate" },
    { idx: [43], keys: ["heart rate", "palpitation", "racing heart", "hr high"],
      answer: "Elevated heart rate without other symptoms is commonly linked to activity, stress response, or early-mission cardiovascular adaptation.",
      source: "Index [43] — Cardiovascular-related guidance · confidence: moderate" },
    { idx: [48], keys: ["can't sleep", "cannot sleep", "insomnia", "not sleeping", "sleep", "tired", "low energy"],
      answer: "Reduced sleep duration is common during high workload periods or light-cycle disruption. Consider adjusting pre-sleep routine and flag this in your next check-in if it persists beyond 3 days.",
      source: "Index [48] — Sleep & Circadian guidance · confidence: high" },
    { idx: [52], keys: ["stress", "anxious", "anxiety", "overwhelmed", "isolation", "lonely"],
      answer: "Isolation and confinement are known contributors to mood and stress changes on long-duration missions. Structured check-ins and communication with crew or ground support are recommended.",
      source: "Index [52] — Behavioral Health guidance · confidence: high" },
    { idx: [46], keys: ["nausea", "dizzy", "dizziness", "vertigo"],
      answer: "Dizziness or nausea can relate to vestibular adaptation in altered gravity, especially early in a mission. Stay hydrated and avoid sudden movements; monitor for recurrence.",
      source: "Index [46] — Neuro-Vestibular guidance · confidence: moderate" },
    { idx: [49], keys: ["bone", "joint pain", "joint", "muscle pain", "muscle"],
      answer: "Musculoskeletal discomfort can relate to bone/muscle density changes under reduced load. Continue prescribed resistance exercise; this will be cross-checked at the next periodic scan.",
      source: "Index [49] — Musculoskeletal guidance · confidence: moderate" },
    { idx: [45, 43], keys: ["radiation", "radiation exposure", "rad dose"],
      answer: "Current radiation dose is within the expected range for this mission phase. No associated health action is indicated at this time.",
      source: "Index [43, 45] — Radiation & Cardiovascular cross-reference · confidence: high" },
    { idx: [47], keys: ["fever", "chills", "temperature", "hot", "cold"],
      answer: "Fever or chills in a closed habitat can indicate an immune response or environmental factor. Hydrate, rest, and re-check temperature in 4 hours. If it persists, this will be escalated to ground medical review.",
      source: "Index [47] — Immune & Environmental guidance · confidence: moderate" }
  ];

  function findAnswer(text) {
    var q = text.toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      var entry = KB[i];
      for (var k = 0; k < entry.keys.length; k++) {
        if (q.indexOf(entry.keys[k]) !== -1) return entry;
      }
    }
    return null;
  }

  /* ---------------- symptom matching (same KB, richer return) ---------------- */
  function matchSymptom(symptomText) {
    var q = (symptomText || '').toLowerCase().trim();
    if (!q) return null;
    for (var i = 0; i < KB.length; i++) {
      var entry = KB[i];
      for (var k = 0; k < entry.keys.length; k++) {
        if (q.indexOf(entry.keys[k]) !== -1) {
          return {
            entry: entry,
            idx: entry.idx,
            source: entry.source,
            answer: entry.answer,
            matchedOn: entry.keys[k]
          };
        }
      }
    }
    return null;
  }

  /* ---------------- compact index build + store ---------------- */
  function getLogCounter(crewId) {
    var v = get('aethersync_logcount_' + crewId);
    return v ? parseInt(v, 10) : 0;
  }
  function bumpLogCounter(crewId) {
    var next = getLogCounter(crewId) + 1;
    set('aethersync_logcount_' + crewId, next.toString());
    return next;
  }

  function buildCompactIndex(crewId, sensorData, symptomLabel, match, selfStatus) {
    var day = 135 + getLogCounter(crewId);
    var now = new Date();
    var period = now.getHours() >= 12 ? 'PM' : 'AM';
    var status = selfStatus === 'normal' ? 'NORMAL' : 'WATCH';
    var idxPart = match ? '[' + match.idx.join(',') + ']' : 'NOT_FOUND';
    var symptomPart = symptomLabel ? '"' + symptomLabel.slice(0, 30) + '"' : '';

    var line = '[' + day + ', SENSOR+SELF, ' + status +
               (symptomPart ? ', ' + symptomPart : '') +
               ', ' + idxPart + ']';

    return {
      day: day,
      period: period,
      status: status,
      symptom: symptomLabel,
      idx: match ? match.idx : [],
      source: match ? match.source : null,
      line: line,
      createdAt: new Date().toISOString()
    };
  }

  function saveIndexEntry(crewId, entry) {
    var listKey = 'aethersync_index_' + crewId;
    var list = getJSON(listKey) || [];
    list.unshift(entry);
    if (list.length > 50) list = list.slice(0, 50);
    setJSON(listKey, list);
  }

  function getIndexEntries(crewId) {
    return getJSON('aethersync_index_' + crewId) || [];
  }

  /* ---------------- simulated sensor reading ---------------- */
  function simulateReading() {
    return {
      restingHR: (63 + Math.round(Math.random() * 12)).toString(),
      spo2: (96 + Math.round(Math.random() * 3)).toString(),
      sleepHours: (5.8 + Math.random() * 2.2).toFixed(1)
    };
  }

  /* ---------------- public API ---------------- */
  return {
    login: login,
    logout: logout,
    currentCrewId: currentCrewId,
    hasBaseline: hasBaseline,
    saveBaseline: saveBaseline,
    getBaseline: getBaseline,
    requireAuth: requireAuth,
    findAnswer: findAnswer,
    simulateReading: simulateReading,
    saveSensorReading: saveSensorReading,
    getTodaySensor: getTodaySensor,
    matchSymptom: matchSymptom,
    buildCompactIndex: buildCompactIndex,
    saveIndexEntry: saveIndexEntry,
    getIndexEntries: getIndexEntries,
    bumpLogCounter: bumpLogCounter
  };
})();

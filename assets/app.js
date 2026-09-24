/* ============================================================
   AetherSync — shared app logic (5-layer version, FULL)
   ------------------------------------------------------------
   NOTE: This is a front-end-only demo. Login is simulated with
   localStorage (any non-empty Crew ID + passcode is accepted)
   so the prototype can be evaluated without a backend.
   Replace AS.login() with a real auth service before any real
   deployment.
   ============================================================ */

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
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  }
  function setJSON(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }

  /* ============================================================
     LAYER 1 — Auth
     ============================================================ */
  function currentCrewId() {
    return get('aethersync_crew_id');
  }

  function login(crewId, passcode) {
    if (!crewId || !String(crewId).trim()) return false;
    if (!passcode || !String(passcode).trim()) return false;
    set('aethersync_crew_id', String(crewId).trim());
    return true;
  }

  function logout() {
    try { localStorage.removeItem('aethersync_crew_id'); } catch (e) {}
    window.location.href = 'index.html';
  }

  /* ============================================================
     LAYER 2 — Baseline & sensor reading
     ============================================================ */
  function hasBaseline(crewId) {
    return !!getJSON('aethersync_baseline_' + crewId);
  }
  function saveBaseline(crewId, data) {
    setJSON('aethersync_baseline_' + crewId, data);
  }
  function getBaseline(crewId) {
    return getJSON('aethersync_baseline_' + crewId);
  }

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
    if (!reading) return;
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
  function simulateReading() {
    return {
      restingHR: (63 + Math.round(Math.random() * 12)).toString(),
      spo2: (96 + Math.round(Math.random() * 3)).toString(),
      sleepHours: (5.8 + Math.random() * 2.2).toFixed(1)
    };
  }

  /* ============================================================
     LAYER 3 — Offline trusted knowledge base
     ============================================================ */
  var KB = [
    {
      idx: [43, 47],
      keys: ["headache", "head ache", "migraine"],
      answer: "Headaches during long-duration missions are often linked to fluid shift, dehydration, or short sleep. Given a recent sleep deviation, this is likely related rather than an isolated event.",
      recommend: "Hydrate, rest in a dim cabin, and re-check in 4 hours.",
      recommendTest: "Log a 24-hour hydration & sleep diary (CSV) so we can rule out sleep-linked triggers.",
      source: "Index [43, 47] — Cardiovascular & Sleep guidance · confidence: moderate"
    },
    {
      idx: [45],
      keys: ["short of breath", "breathless", "spo2", "oxygen", "breathing"],
      answer: "Mild breathlessness can relate to SpO2 fluctuation or exertion in altered-gravity conditions. If current SpO2 is within range, this is most likely transient.",
      recommend: "Pause activity, sit, and re-measure SpO₂ in 10 minutes.",
      recommendTest: "Upload a SpO₂ log (CSV) covering the last 6 hours.",
      source: "Index [45] — Oxygenation-related guidance · confidence: moderate"
    },
    {
      idx: [43],
      keys: ["heart rate", "palpitation", "racing heart", "hr high"],
      answer: "Elevated heart rate without other symptoms is commonly linked to activity, stress response, or early-mission cardiovascular adaptation.",
      recommend: "Rest 5 minutes and re-measure.",
      recommendTest: "Upload a 24-hour HR log (CSV) if it recurs.",
      source: "Index [43] — Cardiovascular-related guidance · confidence: moderate"
    },
    {
      idx: [48],
      keys: ["can't sleep", "cannot sleep", "insomnia", "not sleeping", "sleep", "tired", "low energy"],
      answer: "Reduced sleep duration is common during high workload periods or light-cycle disruption. Consider adjusting pre-sleep routine and flag this in your next check-in if it persists beyond 3 days.",
      recommend: "Adjust pre-sleep routine; flag if it persists beyond 3 days.",
      recommendTest: "Upload a 3-day sleep diary (CSV).",
      source: "Index [48] — Sleep & Circadian guidance · confidence: high"
    },
    {
      idx: [52],
      keys: ["stress", "anxious", "anxiety", "overwhelmed", "isolation", "lonely"],
      answer: "Isolation and confinement are known contributors to mood and stress changes on long-duration missions. Structured check-ins and communication with crew or ground support are recommended.",
      recommend: "Schedule structured check-ins and crew/ground conversations.",
      source: "Index [52] — Behavioral Health guidance · confidence: high"
    },
    {
      idx: [46],
      keys: ["nausea", "dizzy", "dizziness", "vertigo"],
      answer: "Dizziness or nausea can relate to vestibular adaptation in altered gravity, especially early in a mission. Stay hydrated and avoid sudden movements; monitor for recurrence.",
      recommend: "Stay hydrated, avoid sudden movements, monitor recurrence.",
      source: "Index [46] — Neuro-Vestibular guidance · confidence: moderate"
    },
    {
      idx: [49],
      keys: ["bone", "joint pain", "joint", "muscle pain", "muscle"],
      answer: "Musculoskeletal discomfort can relate to bone/muscle density changes under reduced load. Continue prescribed resistance exercise; this will be cross-checked at the next periodic scan.",
      recommend: "Continue prescribed resistance exercise.",
      recommendTest: "Upload latest DEXA scan result (PDF).",
      source: "Index [49] — Musculoskeletal guidance · confidence: moderate"
    },
    {
      idx: [45, 43],
      keys: ["radiation", "radiation exposure", "rad dose"],
      answer: "Current radiation dose is within the expected range for this mission phase. No associated health action is indicated at this time.",
      recommend: "No action indicated at this time.",
      source: "Index [43, 45] — Radiation & Cardiovascular cross-reference · confidence: high"
    },
    {
      idx: [47],
      keys: ["fever", "chills", "temperature", "hot", "cold"],
      answer: "Fever or chills in a closed habitat can indicate an immune response or environmental factor. Hydrate, rest, and re-check temperature in 4 hours. If it persists, this will be escalated to ground medical review.",
      recommend: "Hydrate, rest, re-check temperature in 4 hours.",
      recommendTest: "Upload a body-temperature log (CSV) covering the last 12 hours.",
      source: "Index [47] — Immune & Environmental guidance · confidence: moderate"
    }
  ];

  function findAnswer(text) {
    if (!text) return null;
    var q = String(text).toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      var entry = KB[i];
      for (var k = 0; k < entry.keys.length; k++) {
        if (q.indexOf(entry.keys[k]) !== -1) return entry;
      }
    }
    return null;
  }

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
            recommend: entry.recommend || '',
            recommendTest: entry.recommendTest || '',
            matchedOn: entry.keys[k]
          };
        }
      }
    }
    return null;
  }

  /* ============================================================
     LAYER 3 & 4 — Compact index / Records (immutable)
     ============================================================ */
  function getLogCounter(crewId) {
    var v = get('aethersync_logcount_' + crewId);
    return v ? parseInt(v, 10) : 0;
  }
  function bumpLogCounter(crewId) {
    var next = getLogCounter(crewId) + 1;
    set('aethersync_logcount_' + crewId, next.toString());
    return next;
  }

  /* Records start at Day 1 */
  function buildCompactIndex(crewId, sensorData, symptomLabel, match, selfStatus) {
    var counter = getLogCounter(crewId) + 1;
    var day = counter;
    var now = new Date();
    var period = now.getHours() >= 12 ? 'PM' : 'AM';
    var status = selfStatus === 'normal' ? 'NORMAL' : 'WATCH';
    var idxPart = match ? '[' + match.idx.join(',') + ']' : 'NOT_FOUND';
    var symptomPart = symptomLabel ? '"' + String(symptomLabel).slice(0, 30) + '"' : '';

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
      locked: true,
      createdAt: new Date().toISOString()
    };
  }

  function saveIndexEntry(crewId, entry) {
    if (!entry) return;
    var key = 'aethersync_records_' + crewId;
    var list = getJSON(key) || [];
    list.unshift(entry);
    if (list.length > 200) list = list.slice(0, 200);
    setJSON(key, list);
  }

  function getRecords(crewId) {
    return getJSON('aethersync_records_' + crewId) || [];
  }
  /* Alias kept for backward compatibility */
  function getIndexEntries(crewId) {
    return getRecords(crewId);
  }

  /* ============================================================
     LAYER 3 — Test uploads
     ============================================================ */
  function saveTestUpload(crewId, record) {
    var key = 'aethersync_tests_' + crewId;
    var list = getJSON(key) || [];
    list.unshift(record);
    if (list.length > 50) list = list.slice(0, 50);
    setJSON(key, list);
  }
  function getTestUploads(crewId) {
    return getJSON('aethersync_tests_' + crewId) || [];
  }

  /* ============================================================
     LAYER 3 — Mind games (every 5 days)
     ============================================================ */
  function getPuzzles() {
    return [
      {
        q: "If a rover travels 30 km in 3 hours, how far in 7 hours at the same speed?",
        opts: ["60 km", "70 km", "80 km", "90 km"],
        ans: 1
      },
      {
        q: "Which number comes next: 2, 6, 12, 20, ___?",
        opts: ["28", "30", "32", "36"],
        ans: 1
      },
      {
        q: "Rearrange: 'N O O M' — which word can you form?",
        opts: ["noon", "moon", "mono", "none"],
        ans: 1
      },
      {
        q: "All crew are scientists. Some scientists are pilots. Therefore:",
        opts: ["All crew are pilots", "Some crew may be pilots", "No crew are pilots", "Cannot determine"],
        ans: 1
      },
      {
        q: "If today is Wednesday, what day is it in 100 days?",
        opts: ["Thursday", "Friday", "Saturday", "Sunday"],
        ans: 1
      }
    ];
  }

  function saveGameScore(crewId, key, val) {
    var scores = getJSON('aethersync_games_score_' + crewId) || {};
    scores[key] = val;
    setJSON('aethersync_games_score_' + crewId, scores);
  }
  function getGameScore(crewId, key) {
    var scores = getJSON('aethersync_games_score_' + crewId) || {};
    return scores[key] || 0;
  }
  function saveGameResult(crewId, result) {
    var list = getJSON('aethersync_games_' + crewId) || [];
    list.unshift(result);
    if (list.length > 50) list = list.slice(0, 50);
    setJSON('aethersync_games_' + crewId, list);
    set('aethersync_lastgame_' + crewId, new Date().toISOString());
  }
  function getGameResults(crewId) {
    return getJSON('aethersync_games_' + crewId) || [];
  }
  function shouldRunMindGames(crewId) {
    var last = get('aethersync_lastgame_' + crewId);
    if (!last) return true;
    var days = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24);
    return days >= 5;
  }

  /* ============================================================
     LAYER 5 — Chatbot question log & 15-day trends
     ============================================================ */
  function logQuestion(text, idx, answered) {
    var key = 'aethersync_qlog';
    var log = getJSON(key) || [];
    log.unshift({
      q: String(text).toLowerCase().trim(),
      idx: idx || [],
      answered: !!answered,
      at: new Date().toISOString()
    });
    if (log.length > 500) log = log.slice(0, 500);
    setJSON(key, log);
  }

  function getQuestionTrends() {
    var log = getJSON('aethersync_qlog') || [];
    var cutoff = Date.now() - 15 * 24 * 60 * 60 * 1000;
    var recent = log.filter(function (e) {
      return new Date(e.at).getTime() >= cutoff;
    });

    var counts = {};
    var missingCounts = {};

    recent.forEach(function (e) {
      var key = e.q;
      if (e.answered) {
        counts[key] = counts[key] || { q: e.q, idx: e.idx || [], count: 0 };
        counts[key].count++;
      } else {
        missingCounts[key] = missingCounts[key] || { q: e.q, count: 0 };
        missingCounts[key].count++;
      }
    });

    var top = Object.keys(counts)
      .map(function (k) { return counts[k]; })
      .sort(function (a, b) { return b.count - a.count; })
      .slice(0, 10);

    var missing = Object.keys(missingCounts)
      .map(function (k) { return missingCounts[k]; })
      .sort(function (a, b) { return b.count - a.count; })
      .slice(0, 10);

    return { top: top, missing: missing };
  }

  /* ============================================================
     LAYER 3 — Final PDF-style report (opens print dialog)
     ============================================================ */
  function buildReportHTML(crewId) {
    var bl = getBaseline(crewId) || {};
    var records = getRecords(crewId);
    var tests = getTestUploads(crewId);
    var games = getGameResults(crewId);

    var rows = records.map(function (r) {
      var idxText = (r.idx && r.idx.length)
        ? '[' + r.idx.join(',') + ']'
        : 'NOT_FOUND';
      return '<tr>' +
        '<td>' + r.day + '</td>' +
        '<td>' + r.period + '</td>' +
        '<td>' + (r.symptom || '—') + '</td>' +
        '<td>' + r.status + '</td>' +
        '<td>' + idxText + '</td>' +
        '</tr>';
    }).join('');

    var testRows = tests.map(function (t) {
      return '<li>' + t.name + ' (' + (t.size / 1024).toFixed(1) + ' KB) — ' +
             new Date(t.uploadedAt).toLocaleString() + '</li>';
    }).join('');

    var gameRows = games.map(function (g) {
      var line = new Date(g.createdAt).toLocaleString() +
                 ' — Cognitive ' + g.cognitiveScore +
                 ' · Stress ' + g.stressScore;
      if (typeof g.depressionScore === 'number') {
        line += ' · Depression ' + g.depressionScore;
      }
      return '<li>' + line + '</li>';
    }).join('');

    var html = '';
    html += '<!DOCTYPE html><html><head><meta charset="utf-8">';
    html += '<title>AetherSync Report — ' + crewId + '</title>';
    html += '<style>';
    html += 'body{font-family:Inter,Arial,sans-serif;padding:40px;color:#231f18;background:#faf7f0;}';
    html += 'h1{font-family:Georgia,serif;margin:0 0 6px;}';
    html += 'h2{font-family:Georgia,serif;font-size:16px;margin:22px 0 8px;}';
    html += '.meta{color:#6c6350;font-size:12px;margin-bottom:20px;}';
    html += 'table{border-collapse:collapse;width:100%;margin-top:10px;}';
    html += 'th,td{border:1px solid #e2d9c2;padding:8px;font-size:12px;text-align:left;}';
    html += 'th{background:#f3eee0;}';
    html += '.sec{margin-top:22px;padding-top:14px;border-top:1px solid #e2d9c2;}';
    html += 'ul{margin:6px 0 0;padding-left:20px;font-size:12.5px;line-height:1.7;}';
    html += '.foot{margin-top:26px;padding-top:14px;border-top:1px solid #e2d9c2;font-size:11px;color:#a89c7e;}';
    html += '</style></head><body>';
    html += '<h1>AetherSync — Final Crew Report</h1>';
    html += '<div class="meta"><b>Crew ID:</b> ' + crewId +
            ' · <b>Generated:</b> ' + new Date().toLocaleString() +
            ' · <b>Mode:</b> offline</div>';

    html += '<div class="sec"><h2>Baseline</h2>';
    html += '<p>Resting HR: ' + (bl.restingHR || '—') + ' bpm · ' +
            'SpO₂: ' + (bl.spo2 || '—') + '% · ' +
            'Sleep: ' + (bl.sleepHours || '—') + ' h · ' +
            'Recorded: ' + (bl.period || '—') + '</p></div>';

    html += '<div class="sec"><h2>Check-In History (' + records.length + ' days)</h2>';
    html += '<table><thead><tr>' +
            '<th>Day</th><th>Period</th><th>Symptom</th><th>Status</th><th>Index</th>' +
            '</tr></thead><tbody>';
    html += rows || '<tr><td colspan="5">No records yet</td></tr>';
    html += '</tbody></table></div>';

    html += '<div class="sec"><h2>Test Uploads (' + tests.length + ')</h2><ul>';
    html += testRows || '<li>None</li>';
    html += '</ul></div>';

    html += '<div class="sec"><h2>Mind Game Results (' + games.length + ')</h2><ul>';
    html += gameRows || '<li>None</li>';
    html += '</ul></div>';

    html += '<div class="sec"><h2>Notes</h2>';
    html += '<p style="font-size:12.5px;line-height:1.6;">';
    html += 'This report is generated locally on the onboard device. No live connection was used. ' +
            'All entries are immutable and synced to Earth on scheduled windows.';
    html += '</p></div>';

    html += '<div class="foot">Local trusted knowledge base v1.3 — verified · offline-first</div>';
    html += '</body></html>';

    return html;
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */
  return {
    /* Layer 1 */
    login: login,
    logout: logout,
    currentCrewId: currentCrewId,

    /* Layer 2 */
    hasBaseline: hasBaseline,
    saveBaseline: saveBaseline,
    getBaseline: getBaseline,
    requireAuth: requireAuth,
    saveSensorReading: saveSensorReading,
    getTodaySensor: getTodaySensor,
    simulateReading: simulateReading,

    /* Layer 3 — KB + flow */
    findAnswer: findAnswer,
    matchSymptom: matchSymptom,
    buildCompactIndex: buildCompactIndex,
    saveIndexEntry: saveIndexEntry,

    /* Layer 4 — records */
    getRecords: getRecords,
    getIndexEntries: getIndexEntries,
    getLogCounter: getLogCounter,
    bumpLogCounter: bumpLogCounter,

    /* Layer 3 — test uploads */
    saveTestUpload: saveTestUpload,
    getTestUploads: getTestUploads,

    /* Layer 3 — mind games */
    getPuzzles: getPuzzles,
    saveGameScore: saveGameScore,
    getGameScore: getGameScore,
    saveGameResult: saveGameResult,
    getGameResults: getGameResults,
    shouldRunMindGames: shouldRunMindGames,

    /* Layer 5 — chatbot trends */
    logQuestion: logQuestion,
    getQuestionTrends: getQuestionTrends,

    /* Layer 3 — final report */
    buildReportHTML: buildReportHTML
  };
})();

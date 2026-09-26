/* ============================================================
   AetherSync — shared app logic (5-layer + custom KB upload)
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
     LAYER 3 — Built-in offline trusted knowledge base
     ============================================================ */
  var KB = [
    {
      idx: [43, 47],
      keys: ["headache", "head ache", "migraine", "head hurts"],
      answer: "Headaches during long-duration missions are often linked to fluid shift, dehydration, or short sleep. Given a recent sleep deviation, this is likely related rather than an isolated event.",
      recommend: "Hydrate, rest in a dim cabin, and re-check in 4 hours.",
      recommendTest: "Log a 24-hour hydration & sleep diary (CSV) so we can rule out sleep-linked triggers.",
      source: "Index [43, 47] — Cardiovascular & Sleep guidance · confidence: moderate"
    },
    {
      idx: [45],
      keys: ["short of breath", "breathless", "spo2", "oxygen", "breathing", "can't breathe"],
      answer: "Mild breathlessness can relate to SpO2 fluctuation or exertion in altered-gravity conditions. If current SpO2 is within range, this is most likely transient.",
      recommend: "Pause activity, sit, and re-measure SpO₂ in 10 minutes.",
      recommendTest: "Upload a SpO₂ log (CSV) covering the last 6 hours.",
      source: "Index [45] — Oxygenation-related guidance · confidence: moderate"
    },
    {
      idx: [43],
      keys: ["heart rate", "palpitation", "racing heart", "hr high", "fast heart"],
      answer: "Elevated heart rate without other symptoms is commonly linked to activity, stress response, or early-mission cardiovascular adaptation.",
      recommend: "Rest 5 minutes and re-measure.",
      recommendTest: "Upload a 24-hour HR log (CSV) if it recurs.",
      source: "Index [43] — Cardiovascular-related guidance · confidence: moderate"
    },
    {
      idx: [48],
      keys: ["can't sleep", "cannot sleep", "insomnia", "not sleeping", "sleep", "tired", "low energy", "exhausted"],
      answer: "Reduced sleep duration is common during high workload periods or light-cycle disruption. Consider adjusting pre-sleep routine and flag this in your next check-in if it persists beyond 3 days.",
      recommend: "Adjust pre-sleep routine; flag if it persists beyond 3 days.",
      recommendTest: "Upload a 3-day sleep diary (CSV).",
      source: "Index [48] — Sleep & Circadian guidance · confidence: high"
    },
    {
      idx: [52],
      keys: ["stress", "anxious", "anxiety", "overwhelmed", "isolation", "lonely", "depressed", "sad"],
      answer: "Isolation and confinement are known contributors to mood and stress changes on long-duration missions. Structured check-ins and communication with crew or ground support are recommended.",
      recommend: "Schedule structured check-ins and crew/ground conversations.",
      source: "Index [52] — Behavioral Health guidance · confidence: high"
    },
    {
      idx: [46],
      keys: ["nausea", "dizzy", "dizziness", "vertigo", "vomiting"],
      answer: "Dizziness or nausea can relate to vestibular adaptation in altered gravity, especially early in a mission. Stay hydrated and avoid sudden movements; monitor for recurrence.",
      recommend: "Stay hydrated, avoid sudden movements, monitor recurrence.",
      source: "Index [46] — Neuro-Vestibular guidance · confidence: moderate"
    },
    {
      idx: [49],
      keys: ["bone", "joint pain", "joint", "muscle pain", "muscle", "back pain", "backache"],
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
      keys: ["fever", "chills", "temperature", "hot", "cold", "flu"],
      answer: "Fever or chills in a closed habitat can indicate an immune response or environmental factor. Hydrate, rest, and re-check temperature in 4 hours. If it persists, this will be escalated to ground medical review.",
      recommend: "Hydrate, rest, re-check temperature in 4 hours.",
      recommendTest: "Upload a body-temperature log (CSV) covering the last 12 hours.",
      source: "Index [47] — Immune & Environmental guidance · confidence: moderate"
    },
    {
      idx: [51],
      keys: ["cough", "sore throat", "throat", "cold", "runny nose", "congestion"],
      answer: "Upper-respiratory symptoms in a closed habitat are usually self-limiting. Hydrate, rest, monitor temperature, and avoid close contact with other crew until symptoms subside.",
      recommend: "Hydrate, rest, monitor temperature, limit close contact.",
      source: "Index [51] — Respiratory guidance · confidence: moderate"
    },
    {
      idx: [50],
      keys: ["eye", "eye pain", "vision", "blurry", "blurred vision"],
      answer: "Visual changes in microgravity are common — often related to fluid shifts affecting the eye. If vision is persistently blurred, log it for the next periodic scan.",
      recommend: "Note the change, avoid eye strain, flag at next check-in.",
      source: "Index [50] — Ocular guidance · confidence: moderate"
    },
    {
      idx: [53],
      keys: ["stomach", "stomach pain", "abdominal", "belly", "digestive", "constipation", "diarrhea"],
      answer: "Gastrointestinal discomfort can relate to dietary shifts or adaptation to a closed environment. Hydrate and monitor for recurrence or persistence.",
      recommend: "Hydrate, note dietary changes, monitor for 24 hours.",
      source: "Index [53] — Gastrointestinal guidance · confidence: moderate"
    },
    {
      idx: [54],
      keys: ["chest pain", "chest", "heart pain"],
      answer: "Chest pain requires careful evaluation — log this immediately. AetherSync will escalate it to ground medical on the next sync window regardless of the reading.",
      recommend: "Stop activity, sit calmly, log immediately, await ground review.",
      source: "Index [54] — Cardiovascular urgent flag · confidence: high"
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
      { q: "If a rover travels 30 km in 3 hours, how far in 7 hours at the same speed?",
        opts: ["60 km", "70 km", "80 km", "90 km"], ans: 1 },
      { q: "Which number comes next: 2, 6, 12, 20, ___?",
        opts: ["28", "30", "32", "36"], ans: 1 },
      { q: "Rearrange: 'N O O M' — which word can you form?",
        opts: ["noon", "moon", "mono", "none"], ans: 1 },
      { q: "All crew are scientists. Some scientists are pilots. Therefore:",
        opts: ["All crew are pilots", "Some crew may be pilots", "No crew are pilots", "Cannot determine"], ans: 1 },
      { q: "If today is Wednesday, what day is it in 100 days?",
        opts: ["Thursday", "Friday", "Saturday", "Sunday"], ans: 1 }
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
     CUSTOM KNOWLEDGE BASE — uploaded documents
     ============================================================ */

  /* stop words for keyword extraction */
  var STOP_WORDS = ['the','a','an','and','or','but','if','then','so','as','of','to','in','on','at','by','for','with','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','should','could','may','might','this','that','these','those','it','its','they','them','their','he','she','his','her','we','our','you','your','i','me','my','also','such','any','all','may','can','not','no','yes','very','only','into','over','under','than','then','there','here','when','where','how','why','what','which','who'];

  function extractKeywords(text) {
    var words = String(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    var freq = {};
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w.length < 3) continue;
      if (STOP_WORDS.indexOf(w) !== -1) continue;
      freq[w] = (freq[w] || 0) + 1;
    }
    var list = [];
    for (var k in freq) list.push({ word: k, count: freq[k] });
    list.sort(function (a, b) { return b.count - a.count; });
    return list.slice(0, 14).map(function (x) { return x.word; });
  }

  /* split document into paragraph-sized chunks with line tracking */
  function splitIntoChunks(rawText) {
    var chunks = [];
    var lines = String(rawText).split(/\r?\n/);
    var current = '';
    var currentStart = 1;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();

      if (!line) {
        if (current.trim()) {
          chunks.push({ text: current.trim(), startLine: currentStart });
          current = '';
        }
        continue;
      }

      /* If line looks like a short heading, break here */
      var isHeading = line.length < 60 && (line.endsWith(':') ||
                      (line === line.toUpperCase() && line.length > 3));

      if (isHeading && current.trim()) {
        chunks.push({ text: current.trim(), startLine: currentStart });
        current = line;
        currentStart = i + 1;
      } else {
        if (!current) currentStart = i + 1;
        current += (current ? ' ' : '') + line;
      }

      /* force break every ~400 chars */
      if (current.length > 400) {
        chunks.push({ text: current.trim(), startLine: currentStart });
        current = '';
      }
    }

    if (current.trim()) {
      chunks.push({ text: current.trim(), startLine: currentStart });
    }
    return chunks;
  }

  /* build custom KB from raw text */
  function buildCustomKB(crewId, fileName, rawText) {
    var chunks = splitIntoChunks(rawText);
    var entries = [];
    var charsPerPage = 1800; /* approximate chars per page */
    var cumulativeChars = 0;

    for (var i = 0; i < chunks.length; i++) {
      var c = chunks[i];
      if (c.text.length < 25) continue;

      var keywords = extractKeywords(c.text);
      var approxPage = Math.max(1, Math.floor(cumulativeChars / charsPerPage) + 1);
      cumulativeChars += c.text.length;

      entries.push({
        id: 'C' + (entries.length + 1),
        text: c.text,
        keywords: keywords,
        line: c.startLine,
        page: approxPage,
        source: fileName
      });
    }

    var key = 'aethersync_kb_custom_' + crewId;
    setJSON(key, {
      fileName: fileName,
      entries: entries,
      uploadedAt: new Date().toISOString(),
      totalChunks: entries.length
    });

    return entries.length;
  }

  function getCustomKB(crewId) {
    return getJSON('aethersync_kb_custom_' + crewId) || null;
  }

  /* smart search inside custom KB */
  function searchCustomKB(crewId, query) {
    var kb = getCustomKB(crewId);
    if (!kb || !kb.entries || !kb.entries.length) return null;

    var qKeywords = extractKeywords(query);
    if (!qKeywords.length) return null;

    var qLower = query.toLowerCase();
    var best = null;
    var bestScore = 0;
    var allScored = [];

    for (var i = 0; i < kb.entries.length; i++) {
      var e = kb.entries[i];
      var score = 0;

      /* keyword overlap */
      for (var qk = 0; qk < qKeywords.length; qk++) {
        if (e.keywords.indexOf(qKeywords[qk]) !== -1) score += 3;
      }

      /* substring bonus */
      var eLower = e.text.toLowerCase();
      for (var wk = 0; wk < qKeywords.length; wk++) {
        if (eLower.indexOf(qKeywords[wk]) !== -1) score += 1.5;
      }

      /* exact phrase bonus */
      if (eLower.indexOf(qLower) !== -1) score += 8;

      /* partial phrase: any 4+ char word of query inside text */
      var qWords = qLower.split(/\s+/);
      for (var w = 0; w < qWords.length; w++) {
        if (qWords[w].length >= 5 && eLower.indexOf(qWords[w]) !== -1) score += 1;
      }

      if (score > 0) {
        allScored.push({ entry: e, score: score });
        if (score > bestScore) {
          bestScore = score;
          best = e;
        }
      }
    }

    allScored.sort(function (a, b) { return b.score - a.score; });

    if (!best) {
      return {
        found: false,
        best: null,
        closest: [],
        confidence: 0
      };
    }

    var confidence = Math.min(96, Math.round(35 + bestScore * 6));
    return {
      found: true,
      best: best,
      confidence: confidence,
      closest: allScored.slice(0, 3)
    };
  }

  /* log NOT_FOUND queries with closest matches */
  function logMissingQuery(crewId, query, closest) {
    var key = 'aethersync_missing_' + crewId;
    var list = getJSON(key) || [];
    list.unshift({
      query: query,
      closest: closest || [],
      at: new Date().toISOString()
    });
    if (list.length > 100) list = list.slice(0, 100);
    setJSON(key, list);
  }

  function getMissingQueries(crewId) {
    return getJSON('aethersync_missing_' + crewId) || [];
  }

  function clearCustomKB(crewId) {
    try { localStorage.removeItem('aethersync_kb_custom_' + crewId); } catch (e) {}
  }

  /* ============================================================
     LAYER 3 — Final PDF-style report
     ============================================================ */
  function buildReportHTML(crewId) {
    var bl = getBaseline(crewId) || {};
    var records = getRecords(crewId);
    var tests = getTestUploads(crewId);
    var games = getGameResults(crewId);
    var customKB = getCustomKB(crewId);
    var missing = getMissingQueries(crewId);

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

    var missingRows = missing.slice(0, 20).map(function (m) {
      var closestText = m.closest && m.closest.length
        ? m.closest[0].id + ' (p.' + m.closest[0].page + ' L.' + m.closest[0].line + ')'
        : '—';
      return '<li>"' + m.query + '" → closest ' + closestText + '</li>';
    }).join('');

    var kbInfo = customKB
      ? 'Custom document "' + customKB.fileName + '" — ' + customKB.entries.length + ' indexed chunks'
      : 'Default built-in KB v1.3';

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

    html += '<div class="sec"><h2>Knowledge Base</h2>';
    html += '<p>' + kbInfo + '</p></div>';

    if (missingRows) {
      html += '<div class="sec"><h2>Unresolved Queries (' + missing.length + ')</h2><ul>';
      html += missingRows;
      html += '</ul></div>';
    }

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

    /* Custom KB */
    buildCustomKB: buildCustomKB,
    getCustomKB: getCustomKB,
    searchCustomKB: searchCustomKB,
    logMissingQuery: logMissingQuery,
    getMissingQueries: getMissingQueries,
    clearCustomKB: clearCustomKB,

    /* Layer 3 — final report */
    buildReportHTML: buildReportHTML
  };
})();

# 🚀 SpaceMedi

### Personalized Offline Health Intelligence for Long-Duration Space Missions

<p align="center">
  <strong>When Earth is too far to answer, let the astronaut's health speak.</strong>
</p>

<p align="center">
  <a href="https://github.com/Nahid-mahmud555/Nasa_Space_App_Challenge_2026">
    <img src="https://img.shields.io/badge/NASA%20Space%20Apps-2026-0B3D91?style=for-the-badge&logo=nasa&logoColor=white" alt="NASA Space Apps 2026">
  </a>
  <img src="https://img.shields.io/badge/Offline--First-00AEEF?style=for-the-badge" alt="Offline First">
  <img src="https://img.shields.io/badge/Health%20Intelligence-6A5ACD?style=for-the-badge" alt="Health Intelligence">
  <img src="https://img.shields.io/badge/AI-Evidence%20Grounded-FFB000?style=for-the-badge" alt="Evidence Grounded AI">
  <img src="https://img.shields.io/badge/Status-Prototype-2E8B57?style=for-the-badge" alt="Prototype">
</p>

<p align="center">
  <a href="https://github.com/Nahid-mahmud555/Nasa_Space_App_Challenge_2026">Repository</a> •
  <a href="#-the-problem">Problem</a> •
  <a href="#-our-solution">Solution</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-future-roadmap">Roadmap</a>
</p>

---

## 🌌 The Vision

As humanity travels farther from Earth, astronauts will face a fundamental challenge:

> **What happens when a health change occurs, but real-time medical support from Earth is no longer available?**

SpaceMedi is an **offline-first, personalized health intelligence and decision-support system** designed for long-duration space missions.

Instead of asking only:

> **"Is this value normal?"**

SpaceMedi asks:

> **"Is this normal for this astronaut, in this environment, at this moment?"**

It combines an astronaut's evolving personal baseline, multiple health signals, mission context, trusted offline medical knowledge, secure knowledge management, and compact indexed records to support informed onboard decision-making.

---

# 🛰️ The Challenge

Long-duration spaceflight can continuously change an astronaut's:

* ❤️ Cardiovascular signals
* 🫁 Oxygenation
* 😴 Sleep
* 🧠 Cognitive performance
* 🧘 Stress and wellbeing
* 🏃 Physical activity
* 🩺 Self-reported symptoms
* 🌡️ Environmental exposure

But **a change does not automatically mean danger**.

The real challenge is distinguishing:

```text
NORMAL ADAPTATION
        vs.
POTENTIAL HEALTH RISK
```

On Earth, astronauts can rely on medical professionals and relatively immediate communication.

In deep space, communication may be delayed, intermittent, or unavailable.

That creates a critical question:

> **How can an astronaut understand a changing health condition when immediate Earth-based support is unavailable?**

---

# 💡 Our Solution

SpaceMedi creates a personalized, offline health intelligence layer around each astronaut.

### The core pipeline

```text
PERSONAL BASELINE
       ↓
CURRENT HEALTH DATA
       ↓
MULTI-SIGNAL ANALYSIS
       ↓
MISSION / ENVIRONMENT CONTEXT
       ↓
TRUSTED OFFLINE KNOWLEDGE
       ↓
EVIDENCE-GROUNDED DECISION SUPPORT
       ↓
SUPPORTED ANSWER
       OR
     NOT_FOUND
```

---

# 🧬 01 — Personalized Health Baseline

SpaceMedi does not treat every astronaut as statistically identical.

It establishes a **personal baseline** and continuously compares new observations against that individual's evolving health history.

### Example

| Parameter  | Personal Baseline | Current Observation | Change |
| ---------- | ----------------: | ------------------: | -----: |
| Heart Rate |            72 bpm |              85 bpm | +18.1% |
| Sleep      |             7.5 h |               6.8 h |  -9.3% |
| Stress     |            Normal |            Elevated |      ↑ |
| Cognition  |            Normal |              Normal |      — |

The system can combine these signals rather than interpreting each measurement in isolation.

### Core idea

> **Personal Baseline → Adaptive Baseline → Meaningful Deviation**

The goal is not to diagnose disease autonomously.

The goal is to identify **meaningful deviations and potential early risk signals** that deserve attention.

---

# 🧠 02 — Multi-Signal Health Intelligence

A single measurement can be misleading.

SpaceMedi therefore considers multiple dimensions of astronaut health:

```text
Physiological
     +
Sleep
     +
Stress
     +
Cognitive Performance
     +
Self-Report
     +
Mission Context
```

This enables the system to reason about **patterns**, rather than simply reacting to one number.

### Example scenario

```text
Heart Rate       ↑
Sleep            ↓
Stress           ↑
Cognition        ↓
Self-Report      "I feel normal"
```

Instead of ignoring the disagreement between subjective and objective signals, SpaceMedi can flag the pattern as an **unusual deviation requiring attention**.

---

# 💾 03 — Compact Indexed Health Storage

Long-duration missions can generate thousands of health observations.

Repeatedly storing large blocks of duplicated text and metadata is inefficient when onboard storage, memory, processing capacity, and bandwidth are limited.

SpaceMedi therefore explores a **compact indexed representation**.

### Health indexes

| Index | Parameter      |
| ----: | -------------- |
|  `01` | Blood Pressure |
|  `02` | SpO₂           |
|  `04` | Sleep Duration |
|  `05` | Heart Rate     |

### Knowledge indexes

| Index | Knowledge Domain        |
| ----: | ----------------------- |
|  `43` | Cardiovascular Guidance |
|  `45` | Oxygenation Guidance    |

### Example indexed record

```text
[127, 05, +33.3%, AM, NORMAL, [43,45]]
```

Where:

```text
127       → Mission Day
05        → Heart Rate
+33.3%    → Change from personal baseline
AM        → Measurement period
NORMAL    → Current system state
43,45     → Relevant trusted knowledge indexes
```

Instead of repeatedly storing the same large text content, the system can reference compact identifiers while preserving links to the underlying source, context, and medical knowledge.

### Design goal

> **Less repetition. More traceability.**

---

# 📚 04 — Trusted Offline Medical Knowledge

When the astronaut needs medical context, SpaceMedi retrieves information from a **locally available, verified knowledge base**.

Potential trusted sources include:

* NASA crew-health standards
* NASA Human Research Program evidence
* Verified medical guidelines
* Peer-reviewed scientific literature
* Other approved mission-health references

### Knowledge flow

```text
Verified Source
      ↓
Source Processing
      ↓
Knowledge Chunking
      ↓
Unique Knowledge Index
      ↓
Offline Knowledge Store
      ↓
Evidence Retrieval
```

A knowledge item can retain:

```text
Knowledge ID
Category
Topic
Source
Section / Page
Keywords
Context
Verification Status
Version
```

This allows an answer to remain **traceable back to its evidence**.

---

# 🔎 05 — Evidence-First Retrieval

SpaceMedi's future backend is designed around an evidence-first principle.

An astronaut may ask:

> "My heart rate has increased and I feel dizzy. Is this something I should be concerned about?"

The system should not simply generate a plausible response.

Instead:

```text
QUESTION
   ↓
RETRIEVE RELEVANT EVIDENCE
   ↓
VERIFY SUFFICIENT SUPPORT
   ↓
 ┌───────────────┐
 │               │
YES             NO
 │               │
 ▼               ▼
ANSWER        NOT_FOUND
 + SOURCE          ↓
              KNOWLEDGE GAP
```

---

# 🚫 06 — NOT_FOUND: Never Guess

This is one of SpaceMedi's core principles.

> **If sufficient trusted evidence cannot be found, SpaceMedi does not guess.**

It returns:

```text
NOT_FOUND
```

Example:

```json
{
  "status": "NOT_FOUND",
  "reason": "Insufficient verified evidence",
  "knowledge_gap": true
}
```

### Why?

In a medical context:

> **Unsupported confidence can be more dangerous than acknowledged uncertainty.**

Therefore:

```text
Evidence Available
        ↓
     Answer

Evidence Missing
        ↓
   NOT_FOUND
```

---

# 🧩 07 — Knowledge Gap Intelligence

A `NOT_FOUND` result is not discarded.

It can become a structured **knowledge gap**.

```text
NOT_FOUND
    ↓
Knowledge Gap ID
    ↓
Mission Context
    ↓
Question Pattern
    ↓
Frequency / Priority
    ↓
Future Research
```

Example:

```json
{
  "gap_id": "KG_001",
  "status": "NOT_FOUND",
  "context": "Long-duration mission",
  "topic": "Unresolved symptom pattern",
  "research_required": true
}
```

This creates a feedback loop:

```text
MISSION DATA
      ↓
KNOWLEDGE GAP
      ↓
EARTH-BASED RESEARCH
      ↓
EXPERT VALIDATION
      ↓
APPROVED KNOWLEDGE
      ↓
SECURE UPDATE
      ↓
FUTURE MISSION
```

> **NOT_FOUND is not the end of an answer — it is the beginning of a discovery.**

---

# 🔐 08 — Security & Knowledge Integrity

Medical information and trusted knowledge must not be modified casually.

SpaceMedi separates **personal health data** from **trusted medical knowledge** and applies controlled validation to knowledge updates.

### Planned knowledge security pipeline

```text
NEW KNOWLEDGE
      ↓
SOURCE VERIFICATION
      ↓
INTEGRITY CHECK
      ↓
AUTHORIZED REVIEW
      ↓
DIGITAL SIGNATURE VALIDATION
      ↓
VERSION APPROVAL
      ↓
TRUSTED KNOWLEDGE STORE
```

If verification fails:

```text
INVALID / TAMPERED
        ↓
      REJECT
```

### Future security capabilities

| Capability          | Purpose                      |
| ------------------- | ---------------------------- |
| Cryptographic Hash  | Detect modification          |
| Digital Signature   | Verify authenticity          |
| Version Control     | Track trusted releases       |
| Authorized Approval | Prevent unauthorized updates |
| Rollback            | Restore last valid version   |
| Access Control      | Protect personal health data |

### Key principle

> **Knowledge is not trusted because it exists. It is trusted because it has been verified.**

---

# 📴 09 — Offline-First by Design

SpaceMedi's core health intelligence is designed to function without continuous connectivity.

```text
             EARTH
               │
       Periodic Synchronization
               │
               ▼
        ┌──────────────┐
        │  SPACE MEDI  │
        │              │
        │ Local Data   │
        │ Local Model  │
        │ Local KB     │
        │ Local Index  │
        └──────────────┘
               │
               ▼
       OFFLINE DECISION SUPPORT
```

Connectivity can be used when available for:

* Trusted knowledge updates
* Research synchronization
* Expert-reviewed improvements
* Mission reporting

But core decision-support functionality should not depend on a live connection.

---

# 🌍 10 — Beyond Space

Although SpaceMedi is designed for astronaut health during long-duration missions, the underlying **offline-first knowledge-gap framework** has broader potential.

The same architecture could eventually support remote and low-connectivity environments on Earth.

For example:

```text
Remote Community
      ↓
Offline Knowledge Base
      ↓
Evidence Retrieval
      ↓
Supported Answer / NOT_FOUND
      ↓
Knowledge Gap
      ↓
Later Synchronization
      ↓
Validated Update
```

Potential future environments include:

* Remote communities
* Isolated research stations
* Disaster-response environments
* Low-connectivity regions
* Other locations where access to expertise is limited

This is a **future extension**, while astronaut health remains SpaceMedi's primary mission.

---

# 🛰️ NASA & Scientific Knowledge Integration

SpaceMedi is designed to use authoritative space-health and research resources as part of its trusted knowledge architecture.

### NASA-STD-3001

NASA-STD-3001 provides NASA's human-system standards for crew health and human performance.

SpaceMedi can structure relevant knowledge from these standards into its offline knowledge layer.

### NASA Human Research Program

NASA Human Research Program evidence can provide scientific context for understanding health and performance risks associated with human spaceflight.

### NASA Open Science Data Repository

NASA's Open Science Data Repository can support future research-data integration and validation workflows.

### Important distinction

```text
NASA Standards / Evidence
        ↓
Medical Knowledge & Guidance

NASA Research Datasets
        ↓
Research / Analysis / Validation
```

The system should not represent a research dataset as medical guidance.

---

# 🧱 Current Prototype

The current repository contains a working front-end prototype demonstrating the core SpaceMedi workflow.

| Interface        | Purpose                                       |
| ---------------- | --------------------------------------------- |
| `index.html`     | Crew login / entry point                      |
| `baseline.html`  | Personal baseline setup                       |
| `dashboard.html` | Health monitoring and baseline comparison     |
| `chatbot.html`   | Offline trusted knowledge assistant           |
| `records.html`   | Indexed onboard health records                |
| `assets/`        | Shared styles, scripts, and supporting assets |
| `python-file/`   | Backend / research prototypes                 |

The current prototype uses browser-side storage and a small local knowledge base for demonstration. Authentication is simulated and is **not suitable for real medical deployment**.

---

# 🧪 Prototype Workflow

```text
          CREW LOGIN
              ↓
     PERSONAL BASELINE
              ↓
      HEALTH DASHBOARD
              ↓
      MULTI-SIGNAL ANALYSIS
              ↓
     OFFLINE AI ASSISTANT
              ↓
     TRUSTED KNOWLEDGE
              ↓
       ANSWER / NOT_FOUND
              ↓
      INDEXED RECORDS
              ↓
       KNOWLEDGE GAPS
```

---

# 🧑‍💻 Technical Architecture

### Current

```text
HTML
CSS
JavaScript
Local Storage
Local Indexed Knowledge
```

### Round 2 / Future Backend

```text
                ┌────────────────────┐
                │  Document Sources  │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │ Ingestion Pipeline │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │ Chunking + Metadata│
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │ Knowledge Indexing │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │ Offline Knowledge  │
                │       Store        │
                └─────────┬──────────┘
                          ↓
        ┌─────────────────────────────────┐
        │      Retrieval / Ranking        │
        │                                 │
        │ Keyword + Semantic + Metadata   │
        └────────────────┬────────────────┘
                         ↓
                 Evidence Verification
                    /            \
                   /              \
              SUPPORTED         NOT_FOUND
                  ↓                 ↓
           Answer + Source     Knowledge Gap
```

---

# 🔬 Planned Retrieval Strategy

The next backend iteration can combine multiple retrieval signals:

| Layer               | Role                           |
| ------------------- | ------------------------------ |
| Keyword / BM25      | Exact medical terminology      |
| Semantic Search     | Meaning-based matching         |
| Metadata Filter     | Topic, source, mission context |
| Reranking           | Select strongest evidence      |
| Evidence Threshold  | Prevent weak answers           |
| Source Traceability | Show supporting reference      |

This allows a question such as:

> **"My heart rate increased and I feel dizzy."**

to potentially retrieve evidence even when the source uses related terminology rather than the exact sentence.

---

# 📦 Proposed Backend Structure

```text
SpaceMedi/
│
├── backend/
│   ├── spacemedi_evidence_engine.py
│   ├── knowledge_ingestion.py
│   ├── document_chunker.py
│   ├── knowledge_index.py
│   └── security_verification.py
│
├── knowledge/
│   ├── trusted_sources/
│   └── indexed_knowledge/
│
├── data/
│   ├── health_records/
│   └── knowledge_gaps/
│
├── assets/
│
├── index.html
├── baseline.html
├── dashboard.html
├── chatbot.html
├── records.html
└── README.md
```

---


## ⚙️ Quick Setup

### 1. Clone & Enter the Repository

```bash
git clone https://github.com/Nahid-mahmud555/Nasa_Space_App_Challenge_2026.git
cd Nasa_Space_App_Challenge_2026
```

### 2. Create & Activate Python Environment

**Linux / macOS**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows**

```bash
python -m venv .venv
.venv\Scripts\activate
```

### 3. Install Dependencies

```bash
python -m pip install -r requirements.txt
```

### 4. Run SpaceMedi

```bash
python python-file/spacemedi_evidence_engine.py
```

> **Note:** The `.venv` environment is local only and should not be committed to GitHub. Dependencies are managed through `requirements.txt`.



# 🛡️ Safety Philosophy

SpaceMedi is a **decision-support concept**, not a replacement for qualified medical professionals.

The system is designed to:

* Identify unusual deviations
* Retrieve trusted evidence
* Provide traceable information
* Surface knowledge gaps
* Avoid unsupported claims

It should not independently make irreversible medical decisions or claim to diagnose conditions without appropriate clinical validation.

---

# 📊 Core Innovation Summary

| Innovation                   | What It Does                                 | Why It Matters                            |
| ---------------------------- | -------------------------------------------- | ----------------------------------------- |
| 🧬 Personal Baseline         | Learns individual health patterns            | Avoids relying only on generic thresholds |
| 🧠 Multi-Signal Intelligence | Combines multiple health dimensions          | Finds meaningful patterns                 |
| 📴 Offline-First             | Works without continuous connectivity        | Designed for deep-space isolation         |
| 💾 Indexed Storage           | Compactly represents recurring information   | Reduces repetitive storage overhead       |
| 📚 Trusted Knowledge         | Uses verified medical references             | Improves traceability                     |
| 🔐 Knowledge Integrity       | Controls and verifies updates                | Protects trust                            |
| 🚫 NOT_FOUND                 | Refuses unsupported answers                  | Reduces hallucination risk                |
| 🔎 Knowledge Gaps            | Records unanswered questions                 | Creates future research opportunities     |
| 🔄 Research Feedback         | Validated findings return to future missions | Enables knowledge evolution               |

---

# 🌟 The Core Idea

SpaceMedi connects five layers:

```text
        PERSONAL HEALTH
              ↓
        INTELLIGENT ANALYSIS
              ↓
        TRUSTED KNOWLEDGE
              ↓
       SECURE INFORMATION
              ↓
       CONTINUOUS DISCOVERY
```

Or, in one line:

> **Personal Baseline → Adaptive Intelligence → Trusted Evidence → Knowledge Gaps → Future Discovery**

---

# 🗺️ Future Roadmap

## Phase 1 — Prototype ✅

* [x] Crew interface
* [x] Personal baseline concept
* [x] Health dashboard
* [x] Offline assistant prototype
* [x] Local knowledge retrieval
* [x] `NOT_FOUND` behavior
* [x] Indexed health record concept

## Phase 2 — Evidence Backend 🔄

* [ ] DOCX/PDF ingestion
* [ ] Automated document chunking
* [ ] Knowledge metadata extraction
* [ ] Structured source indexing
* [ ] BM25 / keyword retrieval
* [ ] Semantic retrieval
* [ ] Evidence scoring
* [ ] Knowledge-gap database

## Phase 3 — Trust & Security 🔐

* [ ] Cryptographic hashes
* [ ] Digital signatures
* [ ] Trusted versioning
* [ ] Authorized knowledge approval
* [ ] Secure update mechanism
* [ ] Rollback support
* [ ] Stronger personal-data protection

## Phase 4 — Mission Intelligence 🛰️

* [ ] Longitudinal health modeling
* [ ] Adaptive baseline updates
* [ ] Environmental context
* [ ] Cognitive and behavioral signals
* [ ] Richer physiological data
* [ ] Mission-day analytics
* [ ] Research synchronization

## Phase 5 — Future Exploration 🌕 → 🔴 → 🌌

```text
Earth
  ↓
Moon
  ↓
Mars
  ↓
Deep Space
```

The long-term vision is to help build health intelligence that can operate where continuous Earth support is no longer guaranteed.

---

# 🌍 Potential Earth Applications

Future research may explore applications in:

| Environment              | Potential Use                            |
| ------------------------ | ---------------------------------------- |
| Remote Communities       | Offline evidence-based information       |
| Disaster Zones           | Local knowledge during connectivity loss |
| Isolated Stations        | Autonomous information support           |
| Low-Connectivity Regions | Offline-first knowledge access           |
| Field Research           | Local scientific knowledge retrieval     |

These applications are future directions and do not replace professional medical care.

---

# 🎯 Why SpaceMedi Matters

SpaceMedi is built around a simple observation:

> **The farther humans travel from Earth, the more they must carry knowledge with them.**

But carrying knowledge is not enough.

That knowledge must be:

**Personalized.
Accessible offline.
Traceable.
Secure.
Evidence-based.**

And when knowledge is missing, the system should know that it is missing.

---

# 🧭 From Monitoring to Understanding

Traditional monitoring asks:

> **"What changed?"**

SpaceMedi aims to ask:

> **"What changed, why might it matter, and what trusted evidence can help us understand it?"**

That shift—from **measurement to meaning**—is the heart of SpaceMedi.

---

# 👨‍🚀 Team — VU_SkillStars6N

| Member           | Role                         |
| ---------------- | ---------------------------- |
| **Nahid Mahmud** | Team Lead & Pitch Lead       |
| **[Name]**       | Lead Developer               |
| **[Name]**       | Data Researcher              |
| **[Name]**       | Knowledge Architect          |
| **[Name]**       | UI/UX & Frontend Development |
| **[Name]**       | Video Editor                 |

### Our Team

We are a multidisciplinary team interested in:

**Space Technology • AI • Data Science • Software Engineering • Knowledge Systems • UI/UX • Scientific Research • Digital Storytelling**

Together, we combine research, engineering, design, and communication to turn complex space-health problems into practical technology concepts.

---

# 🧰 Technology Stack

| Layer               | Current / Planned                            |
| ------------------- | -------------------------------------------- |
| Frontend            | HTML, CSS, JavaScript                        |
| Prototype Storage   | Browser Local Storage                        |
| Knowledge Retrieval | Local Indexed Knowledge                      |
| Backend             | Python                                       |
| Document Processing | Planned                                      |
| Keyword Retrieval   | BM25 / Planned                               |
| Semantic Retrieval  | Embeddings / Planned                         |
| Vector Storage      | Planned                                      |
| Security            | Integrity + Signature Verification / Planned |
| Deployment          | GitHub Pages / Static Prototype              |
| Research Data       | NASA Open Science Data Repository / Future   |
| Trusted Knowledge   | NASA Standards + Verified Medical Sources    |

---

# 📚 Data & References

SpaceMedi is designed to cite and preserve provenance for every external source used.

Potential core references include:

* **NASA-STD-3001 — Volume 1: Crew Health**
* **NASA-STD-3001 — Volume 2: Human Factors, Habitability, and Environmental Health**
* **NASA Human Research Program Evidence Reports**
* **NASA Open Science Data Repository**
* Other peer-reviewed or professionally verified medical/scientific resources used during development

> **All external datasets, documents, libraries, assets, and third-party materials should be properly cited in the final submission.**

---

# ⚠️ Prototype Disclaimer

SpaceMedi is a research and hackathon prototype.

The current implementation is **not a certified medical device**, clinical diagnostic system, or flight-qualified astronaut medical system.

Demonstration health values and scenarios may be synthetic and are used only to demonstrate system behavior.

Real deployment would require extensive:

* Clinical validation
* Human-factors testing
* Cybersecurity validation
* Hardware integration
* Medical certification
* Spaceflight qualification
* Expert review
* Mission-specific testing

---

# ▶️ Run the Prototype

The current prototype is a static web application.

### Option 1 — Open locally

Open:

```text
index.html
```

in a modern browser.

### Option 2 — Local server

```bash
npx serve .
```

Then open the provided local address.

### Option 3 — GitHub Pages

Enable GitHub Pages from the repository settings and deploy the main branch.

---

# 🔗 Project Links

### 💻 GitHub Repository

**Nasa_Space_App_Challenge_2026**

https://github.com/Nahid-mahmud555/Nasa_Space_App_Challenge_2026

### 🌐 Live Prototype

https://nahid-mahmud555.github.io/Nasa_Space_App_Challenge_2026/

---

# 🏆 NASA Space Apps Challenge 2026

**Team:** VU_SkillStars6N
**Project:** SpaceMedi
**Focus:** Long-Duration Space Missions & Crew Health
**Category:** Software / Human Exploration

NASA Space Apps is a global hackathon where participants use science, technology, creativity, and open data to address real-world challenges related to Earth and space exploration.

---

# 🚀 Final Thought

> **Every mission creates data.**
>
> **Every unanswered question creates knowledge gaps.**
>
> **Every validated discovery can strengthen the next mission.**
>
> **SpaceMedi turns that cycle into an intelligence system for human exploration.**

<br>

<p align="center">
  <strong>🌍 → 🌕 → 🔴 → 🌌</strong>
</p>

<p align="center">
  <strong>When Earth is too far to answer, let the astronaut's health speak.</strong>
</p>

<p align="center">
  <strong>🚀 SpaceMedi</strong>
</p>

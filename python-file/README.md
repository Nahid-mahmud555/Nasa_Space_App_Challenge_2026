#  SpaceMedi — Round 2 Backend

### Personalized Offline Health Intelligence for Long-Duration Space Missions

> **When Earth is too far to answer, let the astronaut's health speak.** ihiho

SpaceMedi is an offline-first health intelligence and decision-support system designed for astronauts during long-duration space missions, where communication with Earth may be delayed, limited, or unavailable.

This Round 2 backend focuses on building the **trusted knowledge, evidence retrieval, indexed storage, security, and knowledge-gap pipeline** behind SpaceMedi.

---

##  Round 2 Objective

The goal of this stage is to move SpaceMedi beyond a prototype interface toward a structured backend architecture that can:

- Process trusted medical documents
- Break large documents into meaningful knowledge units
- Assign unique indexes to health and medical knowledge
- Retrieve relevant evidence from an offline knowledge base
- Provide answers only when sufficient trusted evidence exists
- Return `NOT_FOUND` instead of guessing
- Record unanswered questions as knowledge gaps
- Support secure and validated knowledge updates

---

#  Core Principle

SpaceMedi follows one critical rule:

> **If trusted evidence exists → provide an evidence-grounded answer.**
>
> **If sufficient trusted evidence does not exist → return `NOT_FOUND`.**

The system is designed to avoid unsupported medical responses rather than generating an answer simply because a question was asked.

---

#  Backend Architecture

```text
                    VERIFIED SOURCES
                          │
                          ▼
               ┌─────────────────────┐
               │ Knowledge Ingestion │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Document Chunking   │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Knowledge Indexing  │
               └──────────┬──────────┘
                          │
                          ▼
               ┌─────────────────────┐
               │ Trusted Knowledge   │
               │      Store          │
               └──────────┬──────────┘
                          │
             Astronaut Question
                          │
                          ▼
               ┌─────────────────────┐
               │ Evidence Retrieval  │
               └──────────┬──────────┘
                          │
                    Evidence Check
                     /          \
                   YES           NO
                    │             │
                    ▼             ▼
              ANSWER +       NOT_FOUND
               SOURCE            │
                                  ▼
                           KNOWLEDGE GAP
                                  │
                                  ▼
                           FUTURE RESEARCH

from dataclasses import dataclass
from typing import List
import re


# ==========================================
# KNOWLEDGE CHUNK
# ==========================================

@dataclass
class KnowledgeChunk:
    chunk_id: str
    category: str
    source: str
    text: str
    keywords: List[str]


# ==========================================
# KNOWLEDGE STORE
# ==========================================

class KnowledgeStore:

    def __init__(self):
        self.chunks = []

    def add_chunk(self, chunk):
        self.chunks.append(chunk)

    def search(self, query):

        query_words = set(
            re.findall(r"\w+", query.lower())
        )

        best_chunk = None
        best_score = 0

        for chunk in self.chunks:

            score = len(
                query_words.intersection(
                    set(chunk.keywords)
                )
            )

            if score > best_score:
                best_score = score
                best_chunk = chunk

        return best_chunk, best_score


# ==========================================
# KNOWLEDGE GAP LOG
# ==========================================

class KnowledgeGapLogger:

    def __init__(self):
        self.gaps = []

    def add_gap(self, question):

        self.gaps.append({
            "question": question,
            "status": "NOT_FOUND"
        })


# ==========================================
# SPACEMEDI ENGINE
# ==========================================

class SpaceMedi:

    def __init__(self):

        self.store = KnowledgeStore()

        self.gaps = KnowledgeGapLogger()

        self.minimum_score = 2

    def ask(self, question):

        chunk, score = self.store.search(question)

        if chunk is None or score < self.minimum_score:

            self.gaps.add_gap(question)

            return {
                "status": "NOT_FOUND",
                "message":
                "Insufficient verified evidence.",
                "knowledge_gap": True
            }

        return {
            "status": "FOUND",
            "answer": chunk.text,
            "source": chunk.source,
            "chunk_id": chunk.chunk_id
        }


# ==========================================
# LOAD VERIFIED NASA KNOWLEDGE
# ==========================================

engine = SpaceMedi()

engine.store.add_chunk(
    KnowledgeChunk(
        chunk_id="CARDIO_001",
        category="Cardiovascular",
        source="NASA_STD_3001",
        text="""
        Increased heart rate can occur
        during adaptation to a new space
        environment.
        """,
        keywords=[
            "heart",
            "rate",
            "cardiovascular",
            "pulse",
            "adaptation"
        ]
    )
)

engine.store.add_chunk(
    KnowledgeChunk(
        chunk_id="SLEEP_001",
        category="Sleep",
        source="NASA_STD_3001",
        text="""
        Sleep duration and sleep quality
        may change during spaceflight.
        """,
        keywords=[
            "sleep",
            "fatigue",
            "rest",
            "insomnia"
        ]
    )
)


# ==========================================
# EXAMPLE QUESTIONS
# ==========================================

question1 = """
My heart rate increased recently
"""

print(
    engine.ask(question1)
)

question2 = """
Unknown radiation symptom xyz
"""

print(
    engine.ask(question2)
)

print(
    engine.gaps.gaps
)

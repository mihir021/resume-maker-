import re

STOPWORDS = {
    "how", "do", "i", "can", "is", "the", "a", "an",
    "to", "my", "please", "me", "you"
}


def semantic_key(text: str) -> str:
    words = re.findall(r"[a-zA-Z]+", text.lower())
    keywords = sorted(w for w in words if w not in STOPWORDS)
    return "_".join(keywords)

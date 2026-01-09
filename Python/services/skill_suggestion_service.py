from DS.trie import Trie

skill_trie = Trie()

COMMON_SKILLS = [
    "python", "java", "javascript", "flask", "django",
    "spring", "sql", "mongodb", "react", "nodejs",
    "machine learning", "data structures", "algorithms"
]

for skill in COMMON_SKILLS:
    skill_trie.insert(skill)

def suggest_skills(prefix):
    return skill_trie.starts_with(prefix)

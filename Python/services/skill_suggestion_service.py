from DS.trie import Trie

skill_trie = Trie()

COMMON_SKILLS = [
    "Python", "Java", "Javascript", "Flask", "Django",
    "Spring","SpringBoot", "SQL", "MongoDB", "React", "NodeJS",
    "Machine Learning", "Data Structures", "Algorithms","MERN","HTML","CSS"
]

for skill in COMMON_SKILLS:
    skill_trie.insert(skill)

def suggest_skills(prefix):
    return skill_trie.starts_with(prefix)

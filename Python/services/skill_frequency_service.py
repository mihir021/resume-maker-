from DS.hashmap import HashMap
from services.resume_service import ResumeService

resume_service = ResumeService()

def get_skill_frequency(user_email):
    resumes = resume_service.get_user_resumes(user_email)

    skill_map = HashMap()

    for resume_meta in resumes:
        resume = resume_service.get_resume_by_id(
            user_email,
            resume_meta["_id"]
        )

        skills = resume.get("data", {}).get("step4", [])
        skill_map.put_all(skills)

    return skill_map.get_map()

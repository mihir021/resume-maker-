def calculate_resume_score(resume):
    score = 0
    breakdown = {}

    data = resume.get("data", {})

    # ---------------- STEP 1: PROFILE ----------------
    step1 = data.get("step1", {})

    profile_fields = ["name", "title", "summary"]
    profile_score = sum(1 for f in profile_fields if step1.get(f)) * 5
    breakdown["Profile"] = min(profile_score, 15)
    score += breakdown["Profile"]

    # ---------------- SUMMARY QUALITY ----------------
    summary = step1.get("summary", "")
    if len(summary) >= 80:
        breakdown["Summary"] = 15
    elif len(summary) >= 40:
        breakdown["Summary"] = 10
    elif len(summary) > 0:
        breakdown["Summary"] = 5
    else:
        breakdown["Summary"] = 0
    score += breakdown["Summary"]

    # ---------------- STEP 4: SKILLS ----------------
    step4 = data.get("step4", [])
    breakdown["Skills"] = min(len(step4) * 3, 20)
    score += breakdown["Skills"]

    # ---------------- STEP 3: EXPERIENCE ----------------
    step3 = data.get("step3", [])
    if len(step3) >= 2:
        breakdown["Experience"] = 20
    elif len(step3) == 1:
        breakdown["Experience"] = 10
    else:
        breakdown["Experience"] = 0
    score += breakdown["Experience"]

    # ---------------- STEP 2: EDUCATION ----------------
    step2 = data.get("step2", {})
    breakdown["Education"] = 10 if step2 else 0
    score += breakdown["Education"]

    # ---------------- PROJECTS (FROM EXPERIENCE DESC) ----------------
    project_count = 0
    for exp in step3:
        if len(exp.get("description", "")) > 50:
            project_count += 1

    breakdown["Projects"] = min(project_count * 5, 10)
    score += breakdown["Projects"]

    # ---------------- ATS KEYWORDS ----------------
    keywords = ["java", "python", "flask", "sql", "api"]
    text = summary.lower()
    matches = sum(1 for k in keywords if k in text)

    breakdown["ATS"] = min(matches * 2, 10)
    score += breakdown["ATS"]

    return score, breakdown

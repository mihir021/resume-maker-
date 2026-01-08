from config.db import db


class AdminAnalyticsService:

    def get_analytics(self):
        # ---------- USERS OVER TIME ----------
        users_over_time = list(db["users"].aggregate([
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$created_at"
                        }
                    },
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]))

        # ---------- RESUMES OVER TIME ----------
        resumes_over_time = list(db["resumes"].aggregate([
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$created_at"
                        }
                    },
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]))

        # ---------- TOP USERS (RAW / ENCODED EMAIL) ----------
        top_users = list(db["resumes"].aggregate([
            {
                "$group": {
                    "_id": "$user_email",   # STILL ENCODED
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]))

        return {
            "users_over_time": users_over_time,
            "resumes_over_time": resumes_over_time,
            "top_users": top_users
        }

# api/models.py
from django.db import models
from django.contrib.auth.models import User

# --- Ensure this class definition exists and is spelled correctly ---
class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, default="Untitled Resume")
    resume_data = models.JSONField() # Stores the main resume content as JSON
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Provides a readable name in the Django admin
        return f"{self.user.username}'s Resume - {self.title}"
# -------------------------------------------------------------------

# --- NEW: Analysis Model ---
class Analysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_role = models.CharField(max_length=255)
    # We'll upload files to a 'uploads/resumes/' folder
    resume_file = models.FileField(upload_to='uploads/resumes/')
    
    # Store the scores separately for easy querying/charts later
    ats_score_general = models.IntegerField()
    ats_score_jd_match = models.IntegerField(null=True, blank=True)
    
    # Store the complete detailed report (skills, missing keywords, etc.)
    analysis_result = models.JSONField() 
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.job_role} ({self.created_at.strftime('%Y-%m-%d')})"
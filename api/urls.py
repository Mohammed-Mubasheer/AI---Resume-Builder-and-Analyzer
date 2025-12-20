# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HelloApiView,
    RegisterView,
    EnhanceWithAIView,
    ResumeViewSet,
    ResumeAnalysisView # Make sure this is imported
)

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume')

urlpatterns = [
    path('', include(router.urls)),
    path('hello/', HelloApiView.as_view(), name='hello'),
    path('register/', RegisterView.as_view(), name='register'),
    path('enhance/', EnhanceWithAIView.as_view(), name='enhance'),
    # --- Verify this line ---
    path('analyze/', ResumeAnalysisView.as_view(), name='analyze_resume'),
    # -----------------------
]
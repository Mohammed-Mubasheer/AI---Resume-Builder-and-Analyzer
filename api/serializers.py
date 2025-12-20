# api/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Resume # Make sure Resume model is imported

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
        # 'password' is write-only, so it won't be sent back in a response
        extra_kwargs = {'password': {'write_only': True}}

    # This method is used by RegisterView when validating data,
    # but the actual user creation happens in the view using create_user
    # to ensure password hashing. We keep this method for potential future
    # uses or if we refactor RegisterView to use serializer.save().
    def create(self, validated_data):
        # Note: In our current RegisterView, we call User.objects.create_user directly.
        # If RegisterView used serializer.save(), this method would be executed.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # Handle optional email
            password=validated_data['password']
        )
        return user

# --- Resume Serializer ---
class ResumeSerializer(serializers.ModelSerializer):
    # Optionally make user field represent username for readability, if needed
    # user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Resume
        # Include all fields from the Resume model
        fields = ['id', 'user', 'title', 'resume_data', 'created_at', 'updated_at']
        # User field should not be directly editable through the API, it's set automatically
        read_only_fields = ['user']
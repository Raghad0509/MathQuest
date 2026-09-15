from rest_framework import mixins, viewsets

from stats.services import ensure_statistics
from users.models import UserProfile
from users.serializers import UserProfileSerializer


class UserProfileViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def perform_create(self, serializer):
        profile = serializer.save()
        ensure_statistics(profile)

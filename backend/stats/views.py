from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from stats.serializers import StatisticsSerializer
from stats.services import ensure_statistics
from users.models import UserProfile


@api_view(["GET"])
def user_statistics(request, user_id: int):
    user = get_object_or_404(UserProfile, id=user_id)
    stats = ensure_statistics(user)
    serializer = StatisticsSerializer(stats)
    return Response(serializer.data)

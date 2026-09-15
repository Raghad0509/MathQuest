from rest_framework.routers import DefaultRouter

from users.views import UserProfileViewSet

router = DefaultRouter()
router.register(r"profiles", UserProfileViewSet, basename="profiles")

urlpatterns = router.urls

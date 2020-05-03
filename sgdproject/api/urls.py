from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'category', views.CategoryViewSet)
router.register(r'collection-center', views.CollectionCenterViewSet)
router.register(r'provider', views.ProviderViewSet)
router.register(r'provider-contact', views.ProviderContactViewSet)
router.register(r'donation', views.DonationViewSet)
router.register(r'user', views.UserViewSet)
router.register(r'volunteer', views.VolunteerViewSet)
router.register(r'support-group', views.SupportGroupViewSet)
router.register(r'group-member', views.GroupMemberViewSet)
router.register(r'campaign', views.CampaignViewSet)
router.register(r'distribution', views.DistributionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
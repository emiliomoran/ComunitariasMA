from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from .serializers import CategorySerializer, CollectionCenterSerializer, ProviderSerializer, ProviderContactSerializer, DonationSerializer, UserSerializer,VolunteerSerializer, SupportGroupSerializer, GroupMemberSerializer, CampaignSerializer, DistributionSerializer
from .models import Category, CollectionCenter, Provider, ProviderContact, Donation, User, Volunteer, SupportGroup, GroupMember, Campaign, Distribution
# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

class CollectionCenterViewSet(viewsets.ModelViewSet):
    queryset = CollectionCenter.objects.all().order_by('name')
    serializer_class = CollectionCenterSerializer
	
class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all().order_by('name')
    serializer_class = ProviderSerializer
	
class ProviderContactViewSet(viewsets.ModelViewSet):
    queryset = ProviderContact.objects.all().order_by('lastName')
    serializer_class = ProviderContactSerializer
	
class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all().order_by('collectionCenter')
    serializer_class = DonationSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer

""" class UserChangePassword(APIView):
    def patch(self, request):
        serialized = UserSerializer(data=request.DATA)
        if serialized.is_valid():
            serialized.save()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        else:
            return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST) """
class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all().order_by('lastName')
    serializer_class = VolunteerSerializer

class SupportGroupViewSet(viewsets.ModelViewSet):
    queryset = SupportGroup.objects.all().order_by('name')
    serializer_class = SupportGroupSerializer

class GroupMemberViewSet(viewsets.ModelViewSet):
    queryset = GroupMember.objects.all().order_by('lastName')
    serializer_class = GroupMemberSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all().order_by('name')
    serializer_class = CampaignSerializer

class DistributionViewSet(viewsets.ModelViewSet):
    queryset = Distribution.objects.all()
    serializer_class = DistributionSerializer
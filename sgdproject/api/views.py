from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from .serializers import CategorySerializer, CollectionCenterSerializer, ProviderSerializer, ProviderContactSerializer, DonationSerializer, UserSerializer,VolunteerSerializer, SupportGroupSerializer, GroupMemberSerializer, CampaignSerializer, DistributionSerializer, ActivitySerializer, ScopeSerializer
from .models import Category, CollectionCenter, Provider, ProviderContact, Donation, User, Volunteer, SupportGroup, GroupMember, Campaign, Distribution, Activity, Scope
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
#from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
from rest_framework_jwt.utils import jwt_decode_handler
# Create your views here.

class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        try:
            #print("request", request.headers['Token'])
            decoded_payload = jwt_decode_handler(request.headers['Token'])
            #print(decoded_payload)
            user = User.objects.get(id=decoded_payload['user_id'])
            #print(user)
            if user is not None:
                return True
            return False            
        except:
            #print("ERROR")
            #return Response(status=status.HTTP_401_UNAUTHORIZED)
            return False

class CategoryViewSet(viewsets.ModelViewSet):
    #permission_classes = (IsAuthenticated,)

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

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by('name')
    serializer_class = ActivitySerializer
class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all().order_by('lastName')
    serializer_class = VolunteerSerializer

class SupportGroupViewSet(viewsets.ModelViewSet):
    queryset = SupportGroup.objects.all().order_by('name')
    serializer_class = SupportGroupSerializer

class GroupMemberViewSet(viewsets.ModelViewSet):
    queryset = GroupMember.objects.all().order_by('lastName')
    serializer_class = GroupMemberSerializer

class ScopeViewSet(viewsets.ModelViewSet):
    queryset = Scope.objects.all().order_by('name')
    serializer_class = ScopeSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all().order_by('name')
    serializer_class = CampaignSerializer

class DistributionViewSet(viewsets.ModelViewSet):
    queryset = Distribution.objects.all()
    serializer_class = DistributionSerializer

class UserLogin(viewsets.ViewSet):    
    #permission_classes = (permissions.AllowAny,)
    #queryset = None
    
    def create(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        try:
            user = User.objects.get(username=username, deleted=None)
        except User.DoesNotExist:
            user = None        
        #print(user)
        if user is not None:
            if check_password(password, user.password):
                jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
                jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

                payload = jwt_payload_handler(user)
                #print(payload)
                payload['role'] = user.role
                token = jwt_encode_handler(payload)
                return Response({'token': token,
                        'username': user.username})

            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_404_NOT_FOUND)
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Category, CollectionCenter, Provider, ProviderContact, Donation, User, Volunteer, SupportGroup, GroupMember, Campaign, Distribution

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__" #Delete field to not show

class CollectionCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionCenter
        fields = "__all__"

class ProviderContactSerializer(serializers.ModelSerializer):
	class Meta:
		model = ProviderContact
		fields = "__all__"

class ProviderSerializer(serializers.ModelSerializer):
    #donationList = CategorySerializer(read_only=True, many=True)
    #contacts = ProviderContactSerializer(source='providercontact_set', many=True)
    contacts = ProviderContactSerializer(many=True, read_only=True)
    #categories = CategorySerializer(many=True, read_only=False)
    class Meta:
        model = Provider
        fields = "__all__"
		
class DonationSerializer(serializers.ModelSerializer):
    #provider = ProviderSerializer(many=False, read_only=False)
    #category = CategorySerializer(many=False, read_only=False)
    #collectionCenter = CollectionCenterSerializer(many=False, read_only=False)
    photo_url = serializers.SerializerMethodField()
    class Meta:
        model = Donation
        fields = "__all__"
    
    def get_photo_url(self, donation):
        request = self.context.get('request')
        photo_url = donation.photo.url
        return request.build_absolute_uri(photo_url)

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True, style={'input_type':'password'})
    class Meta:
        model = User
        fields = "__all__"

class VolunteerSerializer(serializers.ModelSerializer):
    ACTIVITIES_CHOICES = [("1","Armar kits"),("2","Manejar vehículos"),("3","Actualización de datos"),("4","Servicios(médicos, psicólogos)"),]
    activites = serializers.MultipleChoiceField(choices=ACTIVITIES_CHOICES)
    class Meta:
        model = Volunteer
        fields = "__all__"

class GroupMemberSerializer(serializers.ModelSerializer):    
    class Meta:
        model = GroupMember
        fields = "__all__"

class SupportGroupSerializer(serializers.ModelSerializer):
    members = GroupMemberSerializer(many=True, read_only=True)
    class Meta:
        model = SupportGroup
        fields = "__all__"

class CampaignSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(use_url=True)
    class Meta:
        model = Campaign
        fields = "__all__"

    """def get_photo_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.photo.url)"""

class DistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distribution
        fields = "__all__"
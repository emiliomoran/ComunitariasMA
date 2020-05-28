from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Category, CollectionCenter, Provider, ProviderContact, Donation, User, Volunteer, SupportGroup, GroupMember, Campaign, Distribution, Activity, Scope
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.exceptions import AuthenticationFailed

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
    #photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Donation
        fields = "__all__"
    
    """def get_photo_url(self, donation):
        request = self.context.get('request')
        photo_url = donation.photo.url
        return request.build_absolute_uri(photo_url)"""

class UserSerializer(serializers.ModelSerializer):
    """ username = serializers.CharField(validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True, style={'input_type':'password'}) """
    currentPassword = serializers.CharField(required=False, write_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'role','password', 'createdAt', 'createdBy', 'currentPassword', 'deleted')
        extra_kwargs = {            
            'password': {'write_only': True},
            'currentPassword': {'write_only': True}
        }

    def create(self, validated_data):
        #print(validated_data)
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        #print(validated_data)
        #print(instance)
        #print(instance.password)
        if validated_data.get("username"): 
            print(validated_data)
            instance.username = validated_data.get('username', instance.username)
            instance.role = validated_data.get('role', instance.role)

        if validated_data.get("password"):
            if validated_data.get("currentPassword"):
                #Change password
                if check_password(validated_data.get("currentPassword"), instance.password):
                    #print("Valido")
                    instance.password = make_password(validated_data.get("password"))
                else:
                    raise AuthenticationFailed('Current password does not match')

            else:
                #print("Recovery password")
                instance.password = make_password(validated_data.get("password"))        
        instance.save()        
        return instance
              
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = "__all__" #Delete field to not show
class VolunteerSerializer(serializers.ModelSerializer):    
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

class ScopeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scope
        fields = "__all__"

class CampaignSerializer(serializers.ModelSerializer):
    #photo = serializers.ImageField(use_url=True)
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
from rest_framework import serializers
from .models import Category, CollectionCenter, Provider, ProviderContact, Donation

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
    categories = CategorySerializer(many=True, read_only=True)    
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
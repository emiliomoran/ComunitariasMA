from rest_framework import serializers
from .models import Category, CollectionCenter, Provider, ProviderContact, Donation

class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'description', 'state', 'createdAt', 'createdBy') #Delete field to not show

class CollectionCenterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CollectionCenter
        fields = ('name', 'address', 'latitude', 'longitude', 'state', 'createdAt', 'createdBy')

class ProviderSerializer(serializers.HyperlinkedModelSerializer):
	donationList = CategorySerializer(read_only=True, many=True)
	contacts = ProviderContactSerializer(source='providercontact_set', many=True) 
	
	class Meta:
		model = Provider
		fields = ('businessName', 'address', 'phoneNumer', 'email', 'donationList', 'contacts', 'state', 'createdAt', 'createdBy')

class ProviderContactSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = ProviderContact
		fields = ('firstName', 'lastName', 'phoneNumer', 'social', 'business', 'state', 'createdAt', 'createdBy')
		
class DonationSerializer(serializers.HyperlinkedModelSerializer):
	provider = ProviderSerializer(read_only)
	category = CategorySerializer(read_only)
	collectionCenter = CollectionCenterSerializer(read_only)
	photo_url = serializers.SerializerMethodField('get_photo_url')
	
	class Meta:
		model = Donation
		fields = ('provider', 'category', 'description', 'collectionCenter', 'beginDate', 'expirationDate', 'photo', 'photo_url', 'state', 'createdAt', 'createdBy')
	
	def get_photo_url(self, obj):
        return obj.photo.url
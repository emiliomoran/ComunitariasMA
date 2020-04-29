from rest_framework import serializers
from .models import Category, CollectionCenter

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
		model ProviderContact
		fields = ('firstName', 'lastName', 'phoneNumer', 'social', 'business', 'state', 'createdAt', 'createdBy')
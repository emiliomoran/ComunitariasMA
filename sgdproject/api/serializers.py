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
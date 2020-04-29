from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CategorySerializer, CollectionCenterSerializer, ProviderSerializer, ProviderContactSerializer
from .models import Category, CollectionCenter, Provider, ProviderContact
# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

class CollectionCenterViewSet(viewsets.ModelViewSet):
    queryset = CollectionCenter.objects.all().order_by('name')
    serializer_class = CollectionCenterSerializer
	
class ProviderViewSet(viewsets.ModelViewSet):
	queryset = Provider.objects.all().order_by('businessName')
    serializer_class = ProviderSerializer
	
class ProviderContactViewSet(viewsets.ModelViewSet):
	queryset = ProviderContact.objects.all().order_by('lastName')
    serializer_class = ProviderContactSerializer
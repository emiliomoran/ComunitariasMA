from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CategorySerializer, CollectionCenterSerializer
from .models import Category, CollectionCenter
# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

class CollectionCenterViewSet(viewsets.ModelViewSet):
    queryset = CollectionCenter.objects.all().order_by('name')
    serializer_class = CollectionCenterSerializer
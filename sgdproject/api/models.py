from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=250, null=True, blank=True)
    state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)


    def __str__(self):
        return self.name

class CollectionCenter(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    latitude = models.FloatField()
    longitude = models.FloatField()
    state = models.IntegerField(blank=True, default=1)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    def __str__(self):
        return self.name
		
class Provider(models.Model):
    name = models.CharField(max_length=50, unique=True)
    address = models.CharField(max_length=500)
    phoneNumber = models.CharField(max_length=20)
    email = models.CharField(max_length=50)
    categories = models.ManyToManyField(Category, related_name="categories")
    state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
		
class ProviderContact(models.Model):
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    phoneNumber = models.CharField(max_length=20)
    social = models.CharField(max_length=50, null=True)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name="contacts")
    state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)
    def __str__(self):
        return self.firstName + " " + self.lastName


		
class Donation(models.Model):
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.CharField(max_length=500, )
    collectionCenter = models.ForeignKey(CollectionCenter, on_delete=models.CASCADE)
    beginDate = models.DateTimeField(blank=True, null=True)
    expirationDate = models.DateTimeField(blank=True, null=True)
    photo = models.ImageField(upload_to = 'donations/')
    state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)
    
    def __str__(self):
        return self.description
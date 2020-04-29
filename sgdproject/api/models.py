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
	businessName = models.CharField(max_lenght=50, unique=True)
	address = models.CharField(max_length=500)
	phoneNumer = models.CharField(max_lenght=20)
	email = models.CharField(max_lenght=50)
	donationList = models.ManyToManyField(Category)
	state = models.IntegerField(default=1, blank=True)
	createdAt = models.DateTimeField(auto_now_add=True, blank=True)
	createdBy = models.CharField(max_length=50)
	
	def __str__(self):
        return self.name
		
class ProviderContact(models.Model):
	firstName = models.CharField(max_lenght=50)
	lastName = models.CharField(max_lenght=50)
	phoneNumer = models.CharField(max_lenght=20)
	social = models.CharField(max_lenght=50)
	business = models.ForeignKey(Provider, on_delete=models.CASCADE)
	state = models.IntegerField(default=1, blank=True)
	createdAt = models.DateTimeField(auto_now_add=True, blank=True)
	createdBy = models.CharField(max_length=50)
	
	def __str__(self):
        return self.name
		
		
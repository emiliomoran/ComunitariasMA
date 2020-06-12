from django.db import models
from safedelete.models import SafeDeleteModel
#from safedelete.models import HARD_DELETE_NOCASCADE, SOFT_DELETE, SOFT_DELETE_CASCADE
from safedelete.managers import SafeDeleteManager
from safedelete import DELETED_VISIBLE_BY_PK, SOFT_DELETE, SOFT_DELETE_CASCADE
from safedelete.signals import pre_softdelete

# Managers
class CategoryManager(SafeDeleteManager):
    _safedelete_visibility = DELETED_VISIBLE_BY_PK

class CollectionCenterManager(SafeDeleteManager):
    _safedelete_visibility = DELETED_VISIBLE_BY_PK

class ProviderManager(SafeDeleteManager):
    _safedelete_visibility = DELETED_VISIBLE_BY_PK

class UserManager(SafeDeleteManager):
    _safedelete_visibility = DELETED_VISIBLE_BY_PK

class VolunteerManager(SafeDeleteManager):
    _safedelete_visibility = DELETED_VISIBLE_BY_PK

class SupportGroupManager(SafeDeleteManager):
    _safedelete_visibility = DELETED_VISIBLE_BY_PK

# Create your models here.
class Category(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=250, null=True, blank=True)
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    objects = CategoryManager()

    def __str__(self):
        return self.name

class CollectionCenter(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    contactName = models.CharField(max_length=50)
    contactPhone = models.CharField(max_length=20)
    photo = models.ImageField(blank=True, null=True, upload_to = 'collectioncenter/')    
    latitude = models.FloatField()
    longitude = models.FloatField()    
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    objects = CollectionCenterManager()

    def __str__(self):
        return self.name
		
class Provider(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    name = models.CharField(max_length=50, unique=True)
    address = models.CharField(max_length=500)
    phoneNumber = models.CharField(max_length=20)
    email = models.CharField(max_length=50)
    categories = models.ManyToManyField(Category, related_name="categories")
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    objects = ProviderManager()

    def __str__(self):
        return self.name
    
		
class ProviderContact(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    phoneNumber = models.CharField(max_length=20)
    social = models.CharField(max_length=50, null=True)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name="contacts")
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    def __str__(self):
        return self.firstName + " " + self.lastName

class User(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    username = models.CharField(max_length=50, unique=True)
    password = models.TextField()
    email = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=50, default="Admin") #Admin, Group, DataVolunteer, Volunteer
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    objects = UserManager()

    def __str__(self):
        return self.username

class Donation(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.CharField(max_length=500, )
    collectionCenter = models.ForeignKey(CollectionCenter, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    beginDate = models.DateField(blank=True, null=True)
    expirationDate = models.DateField(blank=True, null=True)
    photo = models.ImageField(blank=True, null=True, upload_to = 'donation/')
    state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)
    
    def __str__(self):
        return self.description

class Activity(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=250, null=True, blank=True)
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Volunteer(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    phoneNumber = models.CharField(max_length=20)
    social = models.TextField(blank=True)
    schedule = models.TextField(null=False, blank=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    activities = models.ManyToManyField(Activity, related_name="activities")
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    objects = VolunteerManager()

    def __str__(self):
        return self.firstName + '' + self.lastName


class SupportGroup(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    name = models.CharField(max_length=50)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #members = models.TextField()
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    objects = SupportGroupManager()

    def __str__(self):
        return self.name


class GroupMember(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    phoneNumber = models.CharField(max_length=20)
    supportgroup = models.ForeignKey(SupportGroup, on_delete=models.CASCADE, related_name="members")
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    def __str__(self):
        return self.firstName + '' + self.lastName

class Scope(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=250, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Campaign(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    name = models.CharField(max_length=50)
    contactName = models.CharField(max_length=50)
    description = models.TextField()
    scope = models.ForeignKey(Scope, on_delete=models.CASCADE)
    photo = models.ImageField(blank=True, null=True, upload_to = 'campaigns/')
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    def delete(self, *arg, **kwargs):
        self.photo.delete()
        super().delete(*arg,**kwargs)


class Distribution(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    MANAGER_TYPE_CHOICES = [(None,"---------"),("1","Grupo de Apoyo"), ("2","Voluntario"),]
    departureAddress = models.CharField(max_length=50)
    destinationAddress = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    manager_type = models.CharField(max_length=2, choices=MANAGER_TYPE_CHOICES)
    information = models.TextField()
    destination_photo = models.ImageField(blank=True, null=True, upload_to = 'distribution/')
    #state = models.IntegerField(default=1, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    def __str__(self):
        return self.departureAddress

#Signals

def remove_provider(sender, instance, **kwargs):
    provider_id = instance.id
    #print("provider_id", provider_id)
    ProviderContact.objects.filter(provider=provider_id).delete()

def remove_support_group(sender, instance, **kwargs):
    supportGroup_id = instance.id
    user_id = instance.user.id
    print("id", supportGroup_id)
    print("user", user_id)
    GroupMember.objects.filter(supportgroup=supportGroup_id).delete()
    User.objects.filter(id=user_id).delete()

def remove_volunteer(sender, instance, **kwargs):
    user_id = instance.user.id
    print("user", user_id)
    User.objects.filter(id=user_id).delete()


pre_softdelete.connect(remove_provider, sender=Provider)
pre_softdelete.connect(remove_support_group, sender=SupportGroup)
pre_softdelete.connect(remove_volunteer, sender=Volunteer)
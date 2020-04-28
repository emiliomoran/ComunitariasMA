from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=250, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, blank=True)
    createdBy = models.CharField(max_length=50)

    def __str__(self):
        return self.name

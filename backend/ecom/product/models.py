from django.db import models
from django.utils.text import slugify
from django.db.models.signals import post_save
from django.dispatch import receiver
from multiselectfield import MultiSelectField

class Product(models.Model):
    CATEGORY_CHOICES = (
        ('cloth', 'Cloth'),
        ('jewellery', 'Jewellery'),
    )

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Images (files)
    image_main = models.ImageField(upload_to='products/', verbose_name="Main Image", blank=True, null=True)  # compulsory
    image_2 = models.ImageField(upload_to='products/', blank=True, null=True)
    image_3 = models.ImageField(upload_to='products/', blank=True, null=True)
    image_4 = models.ImageField(upload_to='products/', blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "All Product"
        verbose_name_plural = "All Products"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.category})"
    
@receiver(post_save, sender=Product)
def create_category_object(sender, instance, created, **kwargs):
    if created:
        if instance.category == 'cloth':
            Cloth.objects.create(product=instance)
        elif instance.category == 'jewellery':
            Jewellery.objects.create(product=instance)

SIZE_CHOICES = (
    ("S", "S"),
    ("M", "M"),
    ("L", "L"),
    ("XL", "XL"),
    ("XXL", "XXL"),
    ("FREE", "FREE")
)

class Cloth(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, blank=True, null=True)
    sizes = MultiSelectField(choices=SIZE_CHOICES, blank=True, null=True)
    style = models.CharField(max_length=100, blank=True, null=True)
    fit_type = models.CharField(max_length=100, blank=True, null=True)
    length = models.CharField(max_length=100, blank=True, null=True)
    sleeves_length = models.CharField(max_length=100, blank=True, null=True)
    collar = models.CharField(max_length=100, blank=True, null=True)
    material = models.CharField(max_length=100, blank=True, null=True)
    hemline = models.CharField(max_length=100, blank=True, null=True)
    material_stretch = models.CharField(max_length=100, blank=True, null=True)
    pattern_type = models.CharField(max_length=100, blank=True, null=True)
    weight = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    package = models.TextField(blank=True, null=True)
    transparency = models.CharField(max_length=100, blank=True, null=True)
    made_in = models.CharField(max_length=100, blank=True, null=True, default="India")

    def __str__(self):
        return f"{self.product.name} - Cloth"


class Jewellery(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, blank=True, null=True)
    material = models.CharField(max_length=100, blank=True, null=True) 
    colour = models.CharField(max_length=100, blank=True, null=True)
    sizes = MultiSelectField(choices=SIZE_CHOICES, blank=True, null=True)
    weight = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    package = models.TextField(blank=True, null=True)
    made_in = models.CharField(max_length=100, blank=True, null=True, default="India")

    def __str__(self):
        return f"{self.product.name} - Jewellery"

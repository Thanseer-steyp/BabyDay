from rest_framework import serializers
from product.models import Product, Cloth, Jewellery

# Serializer for Product (common fields)
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'  # includes all fields from the model
        read_only_fields = ['slug'] 

# Serializer for Cloth (including sizes)
class ClothSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = Cloth
        fields = '__all__'

# Serializer for Jewellery (including material)
class JewellerySerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = Jewellery
        fields = '__all__'

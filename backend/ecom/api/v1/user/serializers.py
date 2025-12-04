from rest_framework import serializers
from user.models import Cart
from api.v1.public.serializers import ProductSerializer

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'product', 'quantity']

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.conf import settings
# import razorpay
# from user.models import Order
# from product.models import Cloth,Jewellery






# class CreateRazorpayOrderView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         product_type = request.data.get("product_type")
#         product_id = request.data.get("product_id")

#         # fetch correct product
#         if product_type == "cloth":
#             product = Cloth.objects.get(id=product_id)
#         elif product_type == "jewellery":
#             product = Jewellery.objects.get(id=product_id)
#         else:
#             return Response({"error": "Invalid product type"}, status=400)

#         client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

#         razorpay_order = client.order.create({
#             "amount": product.price * 100,
#             "currency": "INR",
#         })

#         # Create Order
#         Order.objects.create(
#             user=request.user,
#             product_type=product_type,
#             product_id=product_id,
#             razorpay_order_id=razorpay_order['id']
#         )

#         return Response({
#             "order_id": razorpay_order['id'],
#             "amount": product.price * 100,
#             "key": settings.RAZORPAY_KEY_ID,
#             "product": product.name
#         })


# class VerifyPaymentView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         data = request.data

#         order = Order.objects.get(razorpay_order_id=data['razorpay_order_id'])
#         order.razorpay_payment_id = data['razorpay_payment_id']
#         order.paid = True
#         order.save()

#         return Response({"message": "Payment verified"})




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from user.models import Cart
from product.models import Product
from .serializers import CartSerializer

class CartListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Cart.objects.filter(user=request.user)
        serializer = CartSerializer(items, many=True)
        return Response(serializer.data, status=200)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        cart_item, created = Cart.objects.get_or_create(
            user=request.user, product=product
        )

        if not created:
            cart_item.quantity += 1
            cart_item.save()

        return Response({"message": "Added to cart"}, status=200)


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):
        try:
            cart_item = Cart.objects.get(user=request.user, product__id=product_id)
        except Cart.DoesNotExist:
            return Response({"error": "Item not in cart"}, status=404)

        cart_item.delete()

        return Response({"message": "Removed from cart"}, status=200)

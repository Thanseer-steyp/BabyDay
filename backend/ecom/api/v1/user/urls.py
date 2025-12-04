from django.urls import path
# from api.v1.user.views import (
#     CreateRazorpayOrderView,
#     VerifyPaymentView,
# )
from .views import CartListView, AddToCartView, RemoveFromCartView

urlpatterns = [
    # path("create-order/", CreateRazorpayOrderView.as_view()),
    # path("verify-payment/", VerifyPaymentView.as_view()),
    path("cart/", CartListView.as_view(), name="cart-list"),
    path("add-to-cart/<int:product_id>/", AddToCartView.as_view(), name="cart-add"),
    path("remove-from-cart/<int:product_id>/", RemoveFromCartView.as_view(), name="cart-remove"),
]

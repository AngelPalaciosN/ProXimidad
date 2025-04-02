from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import serializers
import random

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

@api_view(['POST'])
def register(request):
    password = str(random.randint(100000, 999999))
    print(f'Generated password for user: {password}') 

    serializer = UserSerializer(data={**request.data, 'password': password})
    if serializer.is_valid():
        user = serializer.save()
        return Response({'id': user.id, 'username': user.username, 'password': password}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

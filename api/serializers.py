from rest_framework import serializers
from .models import NormalizedRecord, RawIngestionRecord

class NormalizedRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalizedRecord
        fields = '__all__'

class StatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalizedRecord
        fields = ['status']

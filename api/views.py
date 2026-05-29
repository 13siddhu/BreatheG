import csv
import json
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import IngestionEvent, RawIngestionRecord, NormalizedRecord
from .serializers import NormalizedRecordSerializer, StatusUpdateSerializer

class SAPUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=400)
        
        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)
        
        event = IngestionEvent.objects.create(source_type='SAP')
        
        for row in reader:
            raw = RawIngestionRecord.objects.create(ingestion_event=event, raw_payload=row)
            
            # Normalization Logic
            # Vendor,Material,Order Quantity,Order Unit,Plant,Order Date
            material = row.get('Material', '')
            scope = 'SCOPE_1' if 'Fuel' in material else 'SCOPE_3'
            
            val_str = row.get('Order Quantity', '0')
            try:
                val = float(val_str)
            except:
                val = 0.0

            NormalizedRecord.objects.create(
                raw_record=raw,
                source_type='SAP',
                scope=scope,
                activity_date=row.get('Order Date') or None,
                normalized_value=val,
                normalized_unit=row.get('Order Unit', ''),
                status='PENDING'
            )
        return Response({"status": "success"})

class UtilityUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=400)
        
        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)
        
        event = IngestionEvent.objects.create(source_type='UTILITY')
        
        for row in reader:
            raw = RawIngestionRecord.objects.create(ingestion_event=event, raw_payload=row)
            
            val_str = row.get('Usage (kWh)', '0')
            try:
                val = float(val_str)
            except:
                val = 0.0

            NormalizedRecord.objects.create(
                raw_record=raw,
                source_type='UTILITY',
                scope='SCOPE_2',
                activity_date=row.get('Date') or None,
                normalized_value=val,
                normalized_unit='kWh',
                status='PENDING'
            )
        return Response({"status": "success"})

class ConcurWebhookView(APIView):
    def post(self, request):
        # In a realistic scenario, a webhook delivers JSON payload directly in the request body.
        data = request.data
        if not data:
            return Response({"error": "No JSON payload provided"}, status=400)
            
        event = IngestionEvent.objects.create(source_type='CONCUR')
        
        bookings = data.get('Itinerary', {}).get('Bookings', [])
        for booking in bookings:
            segments = booking.get('Segments', {}).get('Air', [])
            for seg in segments:
                raw = RawIngestionRecord.objects.create(ingestion_event=event, raw_payload=seg)
                
                NormalizedRecord.objects.create(
                    raw_record=raw,
                    source_type='CONCUR',
                    scope='SCOPE_3',
                    activity_date=seg.get('Departure', {}).get('Date', '')[:10] or None,
                    normalized_value=1200.0, # mocked distance in km
                    normalized_unit='km',
                    status='PENDING'
                )
        return Response({"status": "success"})

class RecordListView(generics.ListAPIView):
    queryset = NormalizedRecord.objects.all().order_by('-created_at')
    serializer_class = NormalizedRecordSerializer

class RecordUpdateView(generics.UpdateAPIView):
    queryset = NormalizedRecord.objects.all()
    serializer_class = StatusUpdateSerializer

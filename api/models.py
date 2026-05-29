import uuid
from django.db import models

class DataSource(models.fields.CharField):
    pass

class IngestionEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source_type = models.CharField(max_length=50, choices=[('SAP', 'SAP'), ('UTILITY', 'UTILITY'), ('CONCUR', 'CONCUR')])
    uploaded_at = models.DateTimeField(auto_now_add=True)

class RawIngestionRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ingestion_event = models.ForeignKey(IngestionEvent, on_delete=models.CASCADE, related_name='raw_records')
    raw_payload = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

class NormalizedRecord(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    SCOPE_CHOICES = [
        ('SCOPE_1', 'Scope 1'),
        ('SCOPE_2', 'Scope 2'),
        ('SCOPE_3', 'Scope 3'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    raw_record = models.OneToOneField(RawIngestionRecord, on_delete=models.CASCADE, related_name='normalized')
    source_type = models.CharField(max_length=50) # Denormalized for easy querying
    scope = models.CharField(max_length=20, choices=SCOPE_CHOICES)
    activity_date = models.DateField(null=True, blank=True)
    normalized_value = models.FloatField(null=True, blank=True)
    normalized_unit = models.CharField(max_length=50, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

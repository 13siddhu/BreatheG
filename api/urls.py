from django.urls import path
from .views import SAPUploadView, UtilityUploadView, ConcurWebhookView, RecordListView, RecordUpdateView

urlpatterns = [
    path('ingest/sap/', SAPUploadView.as_view()),
    path('ingest/utility/', UtilityUploadView.as_view()),
    path('ingest/concur/', ConcurWebhookView.as_view()),
    path('records/', RecordListView.as_view()),
    path('records/<uuid:pk>/', RecordUpdateView.as_view()),
]

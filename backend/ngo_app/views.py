from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Volunteer

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def register_volunteer(request):
    """
    Receives FormData from React and saves to Database.
    Automatically sends an email notification to Admin.
    """
    try:
        volunteer = Volunteer.objects.create(
            name=request.data.get("name"),
            email=request.data.get("email"),
            phone=request.data.get("phone"),
            volunteer_type=request.data.get("volunteer_type", "field"),
            id_type=request.data.get("id_type"),
            id_document=request.FILES.get("id_document"),
            message=request.data.get("message")
        )

        # STEP 5: AUTOMATIC ADMIN NOTIFICATION
        admin_email = getattr(settings, "ADMIN_EMAIL", "admin@swastiksrijan.in")
        subject = f"New Volunteer Registration: {volunteer.name}"
        message = (
            f"A new volunteer has registered.\n\n"
            f"Name: {volunteer.name}\n"
            f"Email: {volunteer.email}\n"
            f"Type: {volunteer.volunteer_type}\n\n"
            f"Please review the document and verify in the Django Admin panel:\n"
            f"http://localhost:8000/admin/ngo_app/volunteer/{volunteer.id}/change/"
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            fail_silently=True,
        )

        return Response({
            "status": "success",
            "message": "Registration submitted successfully. Awaiting admin review."
        }, status=201)

    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=400)

@api_view(["GET"])
def verify_certificate(request, cert_id):
    """
    Public API to verify a certificate by its ID.
    """
    try:
        volunteer = Volunteer.objects.get(cert_id=cert_id, is_verified=True)
        return Response({
            "valid": True,
            "name": volunteer.name,
            "role": volunteer.volunteer_type,
            "date": volunteer.created_at.strftime("%B %d, %Y")
        })
    except Volunteer.DoesNotExist:
        return Response({
            "valid": False,
            "message": "Invalid Certificate ID"
        }, status=404)

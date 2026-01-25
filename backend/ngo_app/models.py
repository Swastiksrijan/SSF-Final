from django.db import models

class Volunteer(models.Model):
    ID_CHOICES = [
        ("College ID", "College ID"),
        ("NGO ID", "NGO ID"),
        ("Driving License", "Driving License"),
        ("Voter ID", "Voter ID"),
    ]

    VOLUNTEER_TYPES = [
        ("field", "Field Volunteer"),
        ("program", "Program Volunteer"),
        ("professional", "Professional Volunteer"),
        ("digital", "Digital Volunteer"),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    volunteer_type = models.CharField(max_length=20, choices=VOLUNTEER_TYPES, default="field")
    id_type = models.CharField(max_length=20, choices=ID_CHOICES)
    id_document = models.FileField(upload_to="id_documents/")
    message = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    cert_id = models.CharField(max_length=50, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.volunteer_type})"

    def approve(self):
        """Logic to approve and generate a Cert ID"""
        if not self.is_verified:
            self.is_verified = True
            # Example ID generation: SSF-VOL-2026-XXXX
            count = Volunteer.objects.filter(is_verified=True).count() + 1
            self.cert_id = f"SSF-VOL-2026-{str(count).padStart(4, '0')}"
            self.save()

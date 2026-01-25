from django.contrib import admin
from django.utils.html import format_html
from .models import Volunteer

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "volunteer_type", "is_verified", "cert_id", "created_at")
    list_filter = ("is_verified", "volunteer_type", "id_type")
    search_fields = ("name", "email", "phone", "cert_id")
    readonly_fields = ("view_document", "cert_id")

    fieldsets = (
        ("Personal Info", {
            "fields": ("name", "email", "phone", "message")
        }),
        ("Identity Verification", {
            "fields": ("id_type", "id_document", "view_document")
        }),
        ("Approval Status", {
            "fields": ("is_verified", "cert_id")
        }),
    )

    def view_document(self, obj):
        if obj.id_document:
            return format_html('<a href="{}" target="_blank">View Uploaded ID Proof</a>', obj.id_document.url)
        return "No document uploaded"
    
    view_document.short_description = "ID Review"

    def save_model(self, request, obj, form, change):
        """Automatically generate Cert ID when verified is ticked"""
        if obj.is_verified and not obj.cert_id:
            # Generate ID: SSF-VOL-2026-0001
            count = Volunteer.objects.filter(is_verified=True).count() + 1
            obj.cert_id = f"SSF-VOL-2026-{str(count).zfill(4)}"
        super().save_model(request, obj, form, change)

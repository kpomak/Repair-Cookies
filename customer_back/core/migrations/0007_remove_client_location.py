# Generated by Django 4.2.3 on 2023-07-30 21:02

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0006_order_amount_due_by_order_payment_completed_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="client",
            name="location",
        ),
    ]

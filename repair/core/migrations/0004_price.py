# Generated by Django 4.2.2 on 2023-07-21 07:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0003_order_model"),
    ]

    operations = [
        migrations.CreateModel(
            name="Price",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("TELEPHONE", "телефон"),
                            ("LAPTOP", "ноутбук"),
                            ("TABLET", "планшет"),
                        ],
                        default="",
                        max_length=48,
                        verbose_name="Категория техники",
                    ),
                ),
                (
                    "repair_lvl",
                    models.IntegerField(
                        choices=[
                            (1, "внешний осмотр, диагностика"),
                            (2, "Ремонт с разбором телефона, замена не паяных деталей"),
                            (3, "Замена дисплея, тачскрина"),
                            (4, "Электро-механический ремонт"),
                        ],
                        default=0,
                        max_length=1,
                        verbose_name="Уровень ремонта",
                    ),
                ),
                (
                    "price",
                    models.FloatField(
                        default=0, max_length=10, verbose_name="Стоимость ремонта"
                    ),
                ),
            ],
        ),
    ]

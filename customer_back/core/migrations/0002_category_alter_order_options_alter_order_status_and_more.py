# Generated by Django 4.2.2 on 2023-06-25 15:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=200)),
                ('slug', models.SlugField(default='Техника', max_length=200, unique=True)),
            ],
            options={
                'verbose_name': 'Категория',
                'verbose_name_plural': 'Категории',
                'ordering': ('name',),
            },
        ),
        migrations.AlterModelOptions(
            name='order',
            options={'verbose_name': 'Заказ', 'verbose_name_plural': 'Заказы'},
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('IP', ' В обработке'), ('AP', 'Ожидает оплаты'), ('P', 'Принят к исполнению'), ('S', 'Отправлен')], default='IP', max_length=2),
        ),
        migrations.AddField(
            model_name='order',
            name='category',
            field=models.ForeignKey(default='техника', on_delete=django.db.models.deletion.CASCADE, related_name='техника', to='core.category'),
        ),
    ]

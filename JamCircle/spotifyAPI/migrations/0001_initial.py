# Generated by Django 5.0.1 on 2024-01-26 00:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SpotifyToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=50, unique=True)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('refresh_token', models.CharField(max_length=100)),
                ('expires_in', models.DateTimeField()),
                ('token_type', models.CharField(max_length=50)),
            ],
        ),
    ]

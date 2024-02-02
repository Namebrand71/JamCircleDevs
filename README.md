# Setup Instructions

## Database: Download and install postgres

### Windows

[Windows Download Link](https://www.postgresql.org/download/windows/)

### MacOS

Make sure you have brew installed

Then `brew install postgresql`

### Once postgres is installed

1. Create a user called jamcircle

Open psql as postgres with `psql -U postgres`

Create user jamcircle with `CREATE USER jamcircle with PASSWORD 'jamcircle';`

Create database jamcircle with `CREATE DATABASE jamcircle OWNER jamcircle;`

Give perms with `GRANT ALL PRIVILEGES ON DATABASE jamcircle TO jamcircle;`

In settings.py replace database config with:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'jamcircle',
        'USER': 'jamcircle',
        'PASSWORD': 'jamcircle',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```

## Virtual Environment

Create a virtual environment called jamcircle and install these packages (also located in requirements.txt)

```
asgiref==3.7.2
certifi==2023.11.17
charset-normalizer==3.3.2
Django==5.0.1
django-cors-headers==4.3.1
djangorestframework==3.14.0
idna==3.6
psycopg2==2.9.9
pytz==2023.3.post1
requests==2.31.0
sqlparse==0.4.4
urllib3==2.1.0
```

# Running the Project

1. Run `python manage.py makemigrations`
2. Run `python manage.py migrate`
3. Run `python manage.py runserver`
4. Run `npm run dev` inside Jamcircle/frontend directory

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

1. change the default value in the model for `passcode` and `agora_uid` to empty strings in `musicrooms/models.py` and `user/models.py` respectively.
1. `python manage.py makemigrations api user reviews musicrooms spotifyAPI`
1. `python manage.py migrate`
1. Revert the above default value changes.

1. `python manage.py makemigrations user musicrooms`
1. `python manage.py migrate`
1. Inside frontend directory: run `npm install`
1. Inside frontend directory run `npm run dev`
1. At base directory: run `python manage.py runserver`
1. Project will be available at `127.0.0.1:8000`

<!-- 1. Run `python manage.py makemigrations`
1. Run `python manage.py migrate`
1. Run `python manage.py runserver`
1. Inside frontend directory: run `npm install`
1. Inside frontend directory: run `npm run dev` -->

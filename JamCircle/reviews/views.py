from django.shortcuts import render


# Create your views here.

def song_page(request, spotify_content_id):
    # You can add any necessary logic here, e.g., fetching data from the database

    # Render the template that contains your React app
    return render(request, 'frontend/index.html', {'spotify_content_id': spotify_content_id})

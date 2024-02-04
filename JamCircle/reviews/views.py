from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse
from spotifyAPI.util import spotify_api_request
from .models import Review

# Create your views here.


def song_page(request, spotify_content_id):
    # You can add any necessary logic here, e.g., fetching data from the database

    # Render the template that contains your React app
    return render(request, 'frontend/index.html', {'spotify_content_id': spotify_content_id})


@api_view(['POST'])
def get_track_info(request):
    print("get_track_info called with arg: ",
          request.data.get('spotify_content_id'))

    print("SESSIONID: ", request.session.session_key)

    endpoint = '/tracks/' + request.data.get('spotify_content_id')

    response = spotify_api_request(
        request.session.session_key, endpoint, False, False)
    print(response)

    return JsonResponse(response)


@api_view(['POST'])
def get_reviews(request):
    spotify_content_id = request.data.get('spotify_content_id')
    print("ACCESSING REVIEWS FOR ", spotify_content_id)
    reviews = Review.objects.filter(
        spotify_content_id=spotify_content_id).values()
    print(reviews)
    return JsonResponse(list(reviews), safe=False)

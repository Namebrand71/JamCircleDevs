from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse
from spotifyAPI.util import spotify_api_request
from .models import Review
from spotifyAPI.models import SpotifyToken
from user.models import User
# Create your views here.


def artist_page(request, spotify_content_id):
    '''
    Renders the react component for an artist page

    @param request: http request
    @param spotify_content_id: the artist ID for spotify api
    @return: render of frontend component
    '''
    return render(request, 'frontend/index.html', {'spotify_content_id': spotify_content_id})


def song_page(request, spotify_content_id):
    '''
    Renders the react component for song pages

    @param request: http request
    @param spotify_content_id: the song ID for spotify api
    @return: render of frontend component
    '''
    return render(request, 'frontend/index.html', {'spotify_content_id': spotify_content_id})


def album_page(request, spotify_content_id):
    '''
    Renders the react component for album pages

    @param request: http request
    @param spotify_content_id: the album ID for spotify api
    @return: render of frontend component
    '''
    return render(request, 'frontend/index.html', {'spotify_content_id': spotify_content_id})


@api_view(['POST'])
def get_artist_info(request):
    '''
    Retrieves artist info from spotify API and returns JSON of artist

    @param request: http request, contains content id
    @return: SpotifyAPI JSON containing artist info
    '''
    print("get_artist_info called with arg: ",
          request.data.get('spotify_content_id'))

    print("SESSIONID: ", request.session.session_key)

    endpoint = '/artists/' + request.data.get('spotify_content_id')

    response = spotify_api_request(
        request.session.session_key, endpoint, False, False)
    print(response)

    return JsonResponse(response)


@api_view(['POST'])
def get_track_info(request):
    '''
    Retrieves track info from spotify API and returns JSON of track

    @param request: http request, contains content id
    @return: SpotifyAPI JSON containing track info
    '''
    print("get_track_info called with arg: ",
          request.data.get('spotify_content_id'))

    print("SESSIONID: ", request.session.session_key)

    endpoint = '/tracks/' + request.data.get('spotify_content_id')

    response = spotify_api_request(
        request.session.session_key, endpoint, False, False)
    print(response)

    return JsonResponse(response)

@api_view(['POST'])
def get_album_info(request):
    '''
    Retrieves album info from spotify API and returns JSON of album

    @param request: http request, contains content id
    @return: SpotifyAPI JSON containing album info
    '''
    #print("get_album_info called with arg: ", request.data.get('spotify_content_id'))
    #print("SESSIONID: ", request.session.session_key)

    endpoint = '/albums/' + request.data.get('spotify_content_id')
    response = spotify_api_request(request.session.session_key, endpoint, False, False)
    #print(response)

    return JsonResponse(response)


@api_view(['POST'])
def get_reviews(request):
    '''
    Retrieves the reviews for a given spotify content

    @param request: HTTP request, containts spotify_content_id to display reviews
    @return: JSON formatted list of reviews tied to a given content
    '''
    spotify_content_id = request.data.get('spotify_content_id')
    #print("ACCESSING REVIEWS FOR ", spotify_content_id)

    # Fetch reviews with related user data
    reviews = Review.objects.filter(spotify_content_id=spotify_content_id).select_related('author')
    reviews_list = []
    for review in reviews:
        author_display_name = review.author.display_name if review.author else 'Unknown'
        review_data = {
            "author_display_name": author_display_name,
            "rating": review.rating,
            "text": review.text,
            "posted_at": review.posted_at,
        }
        reviews_list.append(review_data)

    return JsonResponse(reviews_list, safe=False)


@api_view(['POST'])
def post_review(request):
    '''
    Stores a new review into reviews database for a piece of content

    @param request: HTTP Request, contains the review data
    @response: Success or error message
    '''
    data = request.data
    session_id = request.session.session_key
    try:
        token = SpotifyToken.objects.get(session_id=session_id)
        user = User.objects.get(token=token)
        review = Review.objects.create(
            spotify_content_id=data['spotify_content_id'],
            author=user,
            rating=data['rating'],
            text=data['text']
        )
        return JsonResponse({'message': 'Review Posted Successfully', "user_id": user.id})
    except SpotifyToken.DoesNotExist:
        return JsonResponse({"error": "Invalid session_id"}, status=400)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

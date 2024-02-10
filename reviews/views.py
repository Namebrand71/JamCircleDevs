from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse
from spotifyAPI.util import spotify_api_request
from .models import Review
from spotifyAPI.models import SpotifyToken
from user.models import User

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

    # Fetch reviews with related user data
    reviews = Review.objects.filter(
        spotify_content_id=spotify_content_id).select_related('author')

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

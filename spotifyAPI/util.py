from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta, datetime
from requests import Request, post, put, get
from .auth import CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from django.http import JsonResponse
from .models import SpotifyToken, ListeningData
from user.models import User
from django.db.models import Sum
from django.utils.dateparse import parse_datetime

def is_authenticated(session_id):
    '''
    Checks if a user is authenticated

    @param session_id: The session_id of the user
    @return: If a user is authenticated along with their access token and expire time (if authenticated)
    '''
    token = get_user_token(session_id)
    print(token)
    print("is_authenticated called")
    print("Time now: ", timezone.now())
    if token:
        print("Expires at: ", token.expires_at)
        if token.expires_at < timezone.now():
            print("token has expired, getting a new token now")
            refresh_token(session_id)
            token = get_user_token(session_id)
        return {'isAuthenticated': True, 'accessToken': token.access_token, 'expiresAt': token.expires_at}
    return {'isAuthenticated': False}


def is_authenticated_api(request):
    '''
    Endpoint for checking user authentication

    @param request: HTTP Request
    @return: JSON authentication response
    '''
    session_id = request.session.session_key
    is_auth = is_authenticated(session_id)
    return JsonResponse({'isAuthenticated': is_auth})


def logout_api(request):
    '''
    Endpoint for logout request

    @param request: HTTP Request
    @return: JSON response of success or error
    '''
    try:
        session_id = request.session.session_key
        SpotifyToken.objects.filter(session_id=session_id).delete()
        return JsonResponse({'message': 'Logged out successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def refresh_token(session_id):
    '''
    Refreshes a user token

    @param session_id: session_id of user
    @return: none
    '''
    refresh_token = get_user_token(session_id).refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')

    refresh_token = response.get('refresh_token')
    token_type = response.get('token_type')
    update_user_token(session_id, access_token, token_type, None, refresh_token)


def get_user_token(session_id):
    '''
    Retrieves the token of active user

    @param session_id: session id of user
    @return: user token or none
    '''
    
    user_tokens = SpotifyToken.objects.filter(session_id=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_user_token(session_id, access_token, token_type, expires_at, refresh_token):
    '''
    Updates or creates the token of current user

    @param session_id: session ID of user
    @param access_token: New access token
    @param token_type: Type of new token
    @param expires_at: Expiration time of new token
    @param refresh_token: the refresh token
    @return: updates or newly created token object
    '''
    token = get_user_token(session_id)
    if not expires_at:
        expires_at = timezone.now() + timedelta(seconds=3600)

    if token:
        token.access_token = access_token
        token.expires_at = expires_at
        token.token_type = token_type  # Unsure if this needs to be updated
        token.save(update_fields=['access_token', 'expires_at'])
    else:
        token = SpotifyToken(session_id=session_id, access_token=access_token,
                             refresh_token=refresh_token, expires_at=expires_at, token_type=token_type)
        token.save()
    return token


def spotify_api_request(session_id, endpoint, ifPost=False, ifPut=False):
    '''
    Formulates and sends an api request to Spotify's API

    @param session_id: session ID of user
    @param endpoint: endpoint to access in spotify API
    @param ifPost: Bool for if POST request
    @param ifPut: Bool for if PUT request
    @return: JSON response from spotify API
    '''
    
    token = get_user_token(session_id)
    header = {'Content-Type': 'application/json',
              'Authorization': "Bearer " + token.access_token}

    if ifPost:
        post(SPOTIFY_URL + endpoint, headers=header)
    if ifPut:
        put(SPOTIFY_URL + endpoint, headers=header)
    response = get(SPOTIFY_URL + endpoint, headers=header)
    # Might not get something back
    if response.status_code == 401:
        refresh_token(session_id)
        token = get_user_token(session_id)
        response = get(SPOTIFY_URL + endpoint)
        print("RESPONSE:       ", response)
    return response.json()


def get_top_10_artist(request):
    '''
    Retrieves the top 10 artists of session user

    @param request: HTTP request, containing session_key
    @return: JSON response containing 10 artist items from SpotifyAPI
    '''
    session_id = request.session.session_key
    #  response = spotify_api_request(session_id, '/me/top/tracks?time_range=long&limit=10&offset=0', False, False)
    response = spotify_api_request(
        session_id, "/me/top/artists?time_range=short_term&limit=10&offset=0", False, False)
    # print("TOPTEN response: ", response)
    artist_list = response.get('items')
    # TODO: Check for 502 status code, if so return an error
    return JsonResponse(artist_list, safe=False)


def get_top_10_tracks(request):
    '''
    Retrieves the top 10 tracks of session user

    @param request: HTTP request, containing session_key
    @return: JSON response containing 10 track items from SpotifyAPI
    '''
    session_id = request.session.session_key
    #  response = spotify_api_request(session_id, '/me/top/tracks?time_range=long&limit=10&offset=0', False, False)
    response = spotify_api_request(
        session_id, "/me/top/tracks?time_range=short_term&limit=10&offset=0", False, False)
    # print(response)
    track_list = response.get('items')
    return JsonResponse(track_list, safe=False)

def save_spotify_listening_history(user, response_data):
    '''
    Saves a user's spotify listening history into our user model

    @param user: the user to store to
    @param response_data: The JSON listening data from a call to SpotifyAPI
                          liestning history
    @return: None
    '''
    for item in response_data['items']:
        track = item['track']
        album = track['album']
        artists = ', '.join(artist['name'] for artist in track['artists'])
        played_at = parse_datetime(item['played_at'])
        album_image_url = album['images'][0]['url'] if album['images'] else None
        external_urls = {
            'spotify_track': track['external_urls']['spotify'],
            'spotify_album': album['external_urls']['spotify'],
        }
        history_exists = ListeningData.objects.filter(
            user=user,
            track_spotify_id=track['id'],
            played_at=played_at
        ).exists()

        if not history_exists:
            ListeningData.objects.create(
                user=user,
                track_name=track['name'],
                track_spotify_id=track['id'],
                artist_names=artists,
                album_name=album['name'],
                album_spotify_id=album['id'],
                played_at=played_at,
                track_popularity=track['popularity'],
                album_image_url=album_image_url,
                track_preview_url=track.get(
                    'preview_url'),
                external_urls=external_urls,
                duration_ms=track['duration_ms'],
                explicit=track['explicit'],
            )

def get_spotify_activity(request):
    '''
    Retrieves the recent listening history of a user (last 50 items) 
    and saves it to model (makes call to save_spotify_listening_history)

    @param request: HTTP request, contains session_key
    @return: None
    '''

    endpoint = '/me/player/recently-played?limit=50'

    token = get_user_token(request.session.session_key)
    user = User.objects.filter(token=token).first()

    response = spotify_api_request(
        request.session.session_key, endpoint, False, False)
    print(response)
    save_spotify_listening_history(user, response)
    print(
        f"Total listening time for {user.display_name}: {get_total_listening_time(user)}")

def get_total_listening_time(user):
    '''
    Reads the total listening time of a specified user from out database

    @param user: The specified user
    @return: Their total listening time in ms
    '''
    total_time = ListeningData.objects.filter(user=user).aggregate(
        total_time_listened=Sum('duration_ms'))['total_time_listened']
    if total_time is None:
        total_time = 0
    return total_time

def get_playlists(request):
    '''
    Retrives a user's created playlists from spotify

    @param request: HTTP request, contains session_key
    @return: JSON of playilst items from SpotifyAPI call
    '''
    session_id = request.session.session_key
    token = get_user_token(session_id)
    if not token:
        return JsonResponse({"error": "No token found"}, status=403)

    response = spotify_api_request(
        session_id, "/me/playlists", False, False)

    if 'items' not in response:
        return JsonResponse({"error": "Failed to fetch playlists from Spotify"}, status=response.get('status', 500))

    playlists = response['items']
    formatted_playlists = []
    for playlist in playlists:
        image_url = playlist['images'][0]['url'] if playlist['images'] else None
        formatted_playlists.append({
            'name': playlist['name'],
            'owner': playlist['owner']['display_name'],
            'image_url': image_url
        })

    return JsonResponse(formatted_playlists, safe=False)

def check_following(session_id, user_list):
    '''
    Given a list of users, checks if session user is following them

    @param session_id: session ID of current user
    @param user_list: list of users to check
    @return: JSON response of spotify API endpoint that checks a user's following
    '''
    for x in user_list:
        idString = idString + "%2C" + x
    idString = idString[3:]

    requestEndpoint = '/me/following/contains?type=user&ids=' + idString

    response = spotify_api_request(session_id, requestEndpoint, False, False)
    return response.json


def get_user_json(session_id):
    '''
    Retrive the SpotifyAPI JSON associated to the host of the session

    @param session_id: The id of the session holder
    @return: JSON response from SpotifyAPI
    '''
    response = spotify_api_request(session_id, "/me", False, False)
    print(response)
    return response

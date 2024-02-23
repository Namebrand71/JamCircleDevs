from django.shortcuts import render, redirect
from django.http import HttpResponse
from .auth import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.http import JsonResponse
from requests import Request, post
import requests
import json
from rest_framework import status
from rest_framework.response import Response
from .util import *
from .models import SpotifyToken, ListeningData
from user.models import User
from user.views import get_total_listening_time, getUserFromSession
from django.utils import timezone
from datetime import timedelta, datetime
from django.utils.dateparse import parse_datetime
import pytz
from base64 import b64encode


class SpotifyLogin(APIView):
    def get(self, request, format=None):
        scopes = "user-read-private user-read-email user-top-read user-read-recently-played user-read-currently-playing"

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotfy_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    expires_at = timezone.now() + timedelta(hours=1)
    token = user_token_func(request.session.session_key, access_token,
                            token_type, expires_at, refresh_token)

    user_data = getUserJSON(request.session.session_key)

    pre_top_10_tracks = json.loads(getTop10Tracks(request).content.decode())
    top_10_tracks = [
        {
            'id': track['id'],
            'name': track['name'],
            'artist_names': [artist['name'] for artist in track['album']['artists']]
        }
        for track in pre_top_10_tracks
    ]

    playlists = json.loads(getPlaylists(request).content.decode())

    pre_top_10_artists = json.loads(getTop10Artist(request).content.decode())
    top_10_artists = [{'id': item['id'], 'name': item['name'],
                       'image_url': item['images'][0]['url']} for item in pre_top_10_artists]

    user_defaults = {
        'display_name': user_data.get('display_name'),
        'email': user_data.get('email'),
        'profile_pic_url': user_data['images'][0]['url'] if user_data['images'] else None,
        'country': user_data.get('country'),
        'product_type': user_data.get('product'),
        'token': token,
        'top_10_artists': top_10_artists,
        'top_10_tracks': top_10_tracks,
        'playlists': playlists,
    }

    user, created = User.objects.update_or_create(
        spotify_id=user_data['id'], defaults=user_defaults)

    return redirect('frontend:profile')


class Authenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class GetSpotifyProfile(APIView):
    def get(self, request, format=None):
        print("GetSpotifyProfile endpoint hit!")
        if not request.session.exists(request.session.session_key):
            request.session.create()
        session_key = request.session.session_key
        print("Session key: ", session_key)
        token = SpotifyToken.objects.filter(session_id=session_key).first()

        if is_authenticated(session_key):
            profile_response = getUserJSON(session_key)
            if profile_response:
                return Response(profile_response, status=200)
            print("Failed to fetch spotify profile")
            return Response({'error': 'Failed to fetch Spotify profile'}, status=400)
        else:
            return Response({'error': 'Authentication with Spotify failed or no token found'}, status=403)


@api_view(['GET'])
def search_spotify_tracks(request, search_query):
    url_suffix = f"/search?q={search_query}&type=track"
    session_id = request.session.session_key
    response = spotify_api_request(
        session_id=session_id, endpoint=url_suffix, ifPost=False, ifPut=False)
    return JsonResponse(response)


@api_view(['GET'])
def search_spotify_albums(request, search_query):
    print("GET ALBUMS CALLED")
    url_suffix = f"/search?q={search_query}&type=album"
    session_id = request.session.session_key
    response = spotify_api_request(
        session_id=session_id, endpoint=url_suffix, ifPost=False, ifPut=False)
    return JsonResponse(response)


@api_view(['GET'])
def search_spotify_artists(request, search_query):
    print("GET ARTISTS CALLED")
    url_suffix = f"/search?q={search_query}&type=artist"
    session_id = request.session.session_key
    response = spotify_api_request(
        session_id=session_id, endpoint=url_suffix, ifPost=False, ifPut=False)
    print(response)
    return JsonResponse(response)


def fetch_spotify_activity(request):
    print("fetch_spotify_activity called")

    user_list = ''
    endpoint = '/me/player/recently-played?limit=50'

    for user in User.objects.all():
        user_list += user.display_name
        user_token = user.token
        header = {'Content-Type': 'application/json',
                  'Authorization': "Bearer " + user_token.access_token}
        response = get(SPOTIFY_URL + endpoint, headers=header)

        if response.status_code == 200:
            response_data = response.json()
            save_spotify_listening_history(user, response_data)
        else:
            print(f"Failed to fetch Spotify activity for {user.display_name}")

        print(
            f"Total listening time for {user.display_name}: {get_total_listening_time(user)}")

        # print(response.json())

    return JsonResponse(response.json(), safe=False)


def save_spotify_listening_history(user, response_data):
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


def get_currently_playing(request):
    print("get_currently_playing called")
    session_id = request.session.session_key
    token = get_user_token(session_id=session_id)
    endpoint = "/me/player/currently-playing"

    header = {'Content-Type': 'application/json',
              'Authorization': "Bearer " + token.access_token}

    response = get(SPOTIFY_URL + endpoint, headers=header)

    print("CURRENTLY PLAYING TRACK RESPONSE: ", response)
    if response.status_code == 204:
        return JsonResponse({
            'songName': "song_name",
            'artistNames': 'artist_names',
            'albumCoverImageUrl': 'album_cover_image_url',
            'track_id': 'track_id',
        })

    data = response.json()

    song_name = data['item']['name']
    artist_names = ', '.join([artist['name']
                             for artist in data['item']['artists']])
    album_cover_image_url = data['item']['album']['images'][0]['url'] if data['item']['album']['images'] else None
    track_id = data['item']['id']

    # return JsonResponse({
    #     'songName': "song_name",
    #     'artistNames': "artist_names",
    #     'albumCoverImageUrl': "album_cover_image_url"
    # })

    print("track name: ", song_name)
    print("artist names: ", artist_names)
    print("album_url: ", album_cover_image_url)
    print("track id: ", track_id)

    return JsonResponse({
        'songName': song_name,
        'artistNames': artist_names,
        'albumCoverImageUrl': album_cover_image_url,
        'track_id': track_id,
        'isPlaying': True,
    })


# def spotify_api_request(session_id, endpoint, ifPost=False, ifPut=False):
#     token = get_user_token(session_id)
#     header = {'Content-Type': 'application/json',
#               'Authorization': "Bearer " + token.access_token}

#     if ifPost:
#         post(SPOTIFY_URL + endpoint, headers=header)
#     if ifPut:
#         put(SPOTIFY_URL + endpoint, headers=header)
#     response = get(SPOTIFY_URL + endpoint, headers=header)
#     # Might not get something back
#     if response.status_code == 401:
#         refresh_token(session_id)
#         token = get_user_token(session_id)
#         response = get(SPOTIFY_URL + endpoint)
#         print("RESPONSE:       ", response)
#     return response.json()

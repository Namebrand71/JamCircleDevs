from .models import User, Friend_Request
from django.utils import timezone
from datetime import timedelta
from requests import Request
from django.http import HttpResponse
#Give request and char id of the request receiver
def send_friend_request(request, to_user_id):
    from_user = User.objects.get(user_id=request.user)
    to_user = User.objects.get(user_id=to_user_id)
    friend_request, exist = Friend_Request.objects.get_or_create(from_user=from_user, to_user=to_user)


    if exist:
        return HttpResponse('Friend Request Already Sent')
    else:
        to_user.pending_friend_requests.add(friend_request)
        from_user.pending_friend_requests.add(friend_request)
        return HttpResponse('Friend Request Made!')

def accept_friend_request(request, from_user_id):
    to_user = User.objects.get(request.user)
    from_user = User.objects.get(from_user_id)
    friend_request, exists = to_user.pending_friend_requests.get(from_user=from_user)
    if exists:
        to_user.friends.add(from_user)
        from_user.friends.add(to_user)
        to_user.pending_friend_requests.delete(from_user=from_user)
        from_user.pending_friend_requests.delete(to_user=to_user)
        HttpResponse('Friend Request Accepted!')
    else:
        HttpResponse('error accepting friend request')

def reject_friend_request(request, from_user_id):
    to_user = User.objects.get(request.user)
    from_user = User.objects.get(from_user_id)
    friend_request, exists = to_user.pending_friend_requests.get(from_user=from_user)
    if exists:
        to_user.pending_friend_requests.delete(from_user=from_user)
        from_user.pending_friend_requests.delete(to_user=to_user)
        HttpResponse('Friend Request Rejected!')
    else:
        HttpResponse('error rejectinging friend request')

def cancel_friend_request(request, to_user_id):
    to_user = User.objects.get(to_user_id)
    from_user = User.objects.get(request.user)
    friend_request, exists = from_user.pending_friend_requests.get(to_user=to_user)
    if exists:
        to_user.pending_friend_requests.delete(from_user=from_user)
        from_user.pending_friend_requests.delete(to_user=to_user)
        HttpResponse('Friend Request Canceled!')
    else:
        HttpResponse('error canceling friend request')

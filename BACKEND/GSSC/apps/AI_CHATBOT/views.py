from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import UserChat
from .services import get_ai_response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_old_chat(request):
    try:
        chat = request.user.chat
    except UserChat.DoesNotExist:
        return Response(
            {"message": "No previous chat found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(chat.chat_data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request):
    user_query = request.data.get("query")

    if not user_query:
        return Response(
            {"error": "Query is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    ai_response = get_ai_response(user_query)

    chat, _ = UserChat.objects.get_or_create(user=request.user)

    chat_data = chat.chat_data or {}
    next_index = len(chat_data) + 1

    chat_data[f"response{next_index}"] = {
        "userresponse": user_query,
        "airesponse": ai_response,
    }

    chat.chat_data = chat_data
    chat.save()

    return Response(
        {"airesponse": ai_response},
        status=status.HTTP_200_OK
    )

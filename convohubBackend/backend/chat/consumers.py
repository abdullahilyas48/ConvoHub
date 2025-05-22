import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from .models import Message
from rooms.models import Room
from urllib.parse import parse_qs


class RoomChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
           
            query_string = parse_qs(self.scope['query_string'].decode())
            token = query_string.get('token', [None])[0]

            if not token:
                
                await self.close()
                return

            
            try:
                validated_token = AccessToken(token)
                self.scope['user'] = await sync_to_async(User.objects.get)(id=validated_token['user_id'])
            except Exception as e:
                print(f"Token validation error: {e}")
                await self.close()
                return

           
            self.room_id = self.scope['url_route']['kwargs']['pk']
            self.room_group_name = f'chat_room_{self.room_id}'

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

        except Exception as e:
            print(f"Error during WebSocket connection: {e}")
            await self.close()

    async def disconnect(self, close_code):
        try:
           
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            print(f"Error during WebSocket disconnection: {e}")

    async def receive(self, text_data):
        try:
            
            text_data_json = json.loads(text_data)
            message_content = text_data_json.get('message')
            user = self.scope.get('user')

            if not message_content or not user.is_authenticated:
                print("Invalid message or unauthenticated user")
                return

            # Save the message to the database
            await self.save_message(user, message_content, self.room_id)

            # Broadcast the message to the room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_content,
                    'user_id': user.id,
                }
            )
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
        except Exception as e:
            print(f"Error during message reception: {e}")

    async def chat_message(self, event):
        try:
            message_content = event.get('message')
            user_id = event.get('user_id')

            # Send the message to WebSocket
            await self.send(text_data=json.dumps({
                'message': message_content,
                'user_id': user_id,
            }))
        except Exception as e:
            print(f"Error during message broadcast: {e}")

    @sync_to_async
    def save_message(self, user, content, room_id):
        try:
            room = Room.objects.get(id=room_id)
            Message.objects.create(user=user, room=room, content=content)
        except Room.DoesNotExist:
            print(f"Room with id {room_id} does not exist")
        except Exception as e:
            print(f"Error saving message: {e}")

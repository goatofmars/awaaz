from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpRequest
# import json

# this app does not have an db

def success(body):
    build = Response({
        'result':'success',
        'data':body
    })
    return build

@api_view(['GET','POST'])
def hello(request):
    return success({"message": "Hello, world!"})


projects = {
    'sdf809888':{
        'title':'',
        'discription':'',
        'tasks':{
            'sd0f8098s908sdf':{
                'title':'',
                'discription':'',
                'subtasks':{
                    '23424525346g54tg':{
                        'title':'',
                        'discription':''
                    }
                }
            }
        }
    }
}

@api_view(['GET','POST'])
def list(request):
    return success(projects)


# @api_view(['GET','POST'])
# def hello(request):
#     if request.method == 'POST':
#             return Response({"message": "Got some data!", "data": request.data})
#     else:
#         return Response({"message": "Hello, world!"})

from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.cache import never_cache
from django.http import HttpRequest
# import json

# this app does not have an db

def success(body):
    build = Response({
        'result':'success',
        'data':body
    })
    return build

def error(e):
    build = Response({
        'result':'error',
        'error':e
    })
    return build

@never_cache
@api_view(['GET','POST'])
def hello(request):
    return success({"message": "Hello, world!"})


projects = []

@never_cache
@api_view(['GET','POST'])
def list(request):
    print(">>> list projects successfull")
    return success(projects)

@never_cache
@api_view(['GET','POST'])
def submit(request):
    projects.insert(1,request.data);
    print(">>> submit project successfull")
    return success(request.data)

@never_cache
@api_view(['GET','POST'])
def get(request):
    hold = False;
    for project in projects:
        if project["id"] == request.data["project"]:
            hold = project
    if hold == False:
        return error("not_found")
    else:
        print(">>> get project successfull")
        return success(hold)

@never_cache
@api_view(['GET','POST'])
def update(request):
    found = False
    count = 0
    for project in projects:
        if project["id"] == request.data["id"]:
            found = True
            projects[count] = request.data
            print(">>> update project successfull")
            break
        count += 1
    if found == False:
        projects.insert(1,request.data);
    return success(request.data)


# @api_view(['GET','POST'])
# def hello(request):
#     if request.method == 'POST':
#             return Response({"message": "Got some data!", "data": request.data})
#     else:
#         return Response({"message": "Hello, world!"})

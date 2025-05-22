from rest_framework.response import Response

def return_class(dictionary):
    """
    Formats the response and returns a DRF Response object.
    
    Args:
        dictionary (dict): A dictionary containing the response data.
    
    Returns:
        Response: A DRF Response object with the appropriate data and status code.
    """
    data = dictionary.get('data', {})
    message = dictionary.get('message', '')
    status_code = dictionary.get('status', 200)
    meta = {'message': message, 'status': status_code}

    response_data = {'data': data, 'meta': meta}
    return Response(response_data, status=status_code)

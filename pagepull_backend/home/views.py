import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model, login
import json
from .firebase_auth import verify_firebase_token
from .scrape import (
    scrape_website_data,
    split_dom_content,
    clean_body_content,
    extract_body_content
)
from .gen import extract_content

User = get_user_model()
logger = logging.getLogger(__name__)

@csrf_exempt
def get_dom_data(request):
    if request.method == 'POST':
        logger.debug("get_dom_data view called")
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        url = data.get('url')
        if not url:
            return JsonResponse({'error': 'No URL provided'}, status=400)

        try:
            result = scrape_website_data(url)
            body_content = extract_body_content(result)
            cleaned_content = clean_body_content(body_content)
        except Exception as e:
            logger.error(f"Error scraping website: {str(e)}")
            return JsonResponse({'error': f'Error scraping website: {str(e)}'}, status=500)

        if not cleaned_content:
            return JsonResponse({'error': 'No data found or failed to clean content'}, status=400)

        request.session['DOM_content'] = cleaned_content
        print(cleaned_content)
        return JsonResponse({'DOM_content': cleaned_content})

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def get_generated_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        prompt = data.get('Prompt')
        if not prompt:
            return JsonResponse({'error': 'No prompt provided'}, status=400)

        DOM_content = data.get('DOM_content')
        if not DOM_content:
            return JsonResponse({'error': 'No DOM content available in session'}, status=400)

        try:
            dom_chunks = split_dom_content(DOM_content)
            result = extract_content(dom_chunks, prompt)
        except Exception as e:
            logger.error(f"Error processing content: {str(e)}")
            return JsonResponse({'error': f'Error processing content: {str(e)}'}, status=500)

        return JsonResponse({'get_data': result})

    return JsonResponse({'error': 'Invalid request method'}, status=405)
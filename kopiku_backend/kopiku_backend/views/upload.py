from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest
from .base import BaseView
import os
import uuid
import shutil

class UploadViews(BaseView):
    def __init__(self, request):
        super().__init__(request)
        
    @view_config(route_name='upload_menu_image', request_method='POST', renderer='json')
    def upload_menu_image(self):
        """Upload a menu item image."""
        # Verify admin token
        self._verify_admin_token()
        
        # Check if the request contains a file
        if 'image' not in self.request.POST:
            return HTTPBadRequest(json_body={'error': 'No image file provided'})
            
        image_file = self.request.POST['image']
        
        # Validate file type
        valid_types = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        if image_file.type not in valid_types:
            return HTTPBadRequest(json_body={'error': 'Invalid file type. Only JPEG, PNG and WEBP are allowed.'})
        
        # Validate file size (max 2MB)
        if len(image_file.file.read()) > 2 * 1024 * 1024:  # 2MB
            return HTTPBadRequest(json_body={'error': 'File size exceeds 2MB limit'})
        
        # Reset file pointer after reading
        image_file.file.seek(0)
        
        # Generate a unique filename
        filename = f"menu-{uuid.uuid4()}{os.path.splitext(image_file.filename)[1]}"
        
        # Define the upload directory path
        upload_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads', 'menu-images')
        
        # Ensure the upload directory exists
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(upload_dir, filename)
        with open(file_path, 'wb') as output_file:
            shutil.copyfileobj(image_file.file, output_file)
        
        # Generate URL for the uploaded file
        image_url = f"/static/uploads/menu-images/{filename}"
        
        return {
            'success': True,
            'imageUrl': image_url
        }

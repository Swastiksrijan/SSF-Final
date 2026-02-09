
from PIL import Image
import os

def crop_transparent_image(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        
        # Get the bounding box of the non-zero regions
        bbox = img.getbbox()
        
        if bbox:
            print(f"Original size: {img.size}")
            print(f"Bounding box found: {bbox}")
            
            # Crop the image to the bounding box
            cropped_img = img.crop(bbox)
            
            print(f"New size: {cropped_img.size}")
            
            # Save the cropped image
            cropped_img.save(image_path)
            print(f"Successfully cropped and saved: {image_path}")
        else:
            print("Image is completely transparent or empty.")
            
    except Exception as e:
        print(f"Error processing image: {e}")

# Path to the logo
image_path = r"c:\Users\USER\Downloads\SSF-Final-main\SSF-Final-main\src\assets\Home-logo.png"

if os.path.exists(image_path):
    crop_transparent_image(image_path)
else:
    print(f"File not found: {image_path}")

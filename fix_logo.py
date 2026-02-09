
from PIL import Image
import os
import numpy as np

def process_logo(image_path):
    try:
        print(f"Processing: {image_path}")
        img = Image.open(image_path).convert("RGBA")
        data = np.array(img)

        # Define white threshold (to catch off-whites/JPEG artifacts)
        # Any pixel where R,G,B > 240 is considered "White"
        r, g, b, a = data.T
        white_areas = (r > 240) & (g > 240) & (b > 240)
        
        # Turn transparent
        data[..., 3][white_areas.T] = 0
        
        # Create new image from modified data
        img_transparent = Image.fromarray(data)
        
        # Now Crop the transparent areas
        bbox = img_transparent.getbbox()
        
        if bbox:
            print(f"Original size: {img.size}")
            print(f"Cropping to content: {bbox}")
            final_img = img_transparent.crop(bbox)
            final_img.save(image_path)
            print("Success! Saved transparent, cropped logo.")
        else:
            print("Error: Image resulted in empty content.")
            
    except Exception as e:
        print(f"Error: {e}")

# Target File
image_path = r"c:\Users\USER\Downloads\SSF-Final-main\SSF-Final-main\src\assets\Home-logo.png"

if os.path.exists(image_path):
    process_logo(image_path)
else:
    print(f"File not found: {image_path}")

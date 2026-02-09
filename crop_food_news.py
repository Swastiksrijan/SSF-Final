from PIL import Image
import os

def crop_image(input_path, output_path):
    try:
        img = Image.open(input_path)
        width, height = img.size
        
        # Crop out the bottom 25% to remove the unrelated headline
        left = 0
        top = 0
        right = width
        bottom = int(height * 0.75) 
        
        cropped_img = img.crop((left, top, right, bottom))
        cropped_img.save(output_path)
        print(f"Successfully cropped image to {output_path}")
    except Exception as e:
        print(f"Error cropping image: {e}")

if __name__ == "__main__":
    crop_image("public/images/real/online-food-support-clipping.jpg", "public/images/real/online-food-support-cropped.jpg")

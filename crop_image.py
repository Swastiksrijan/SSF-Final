from PIL import Image

def crop_image(input_path, output_path):
    try:
        img = Image.open(input_path)
        width, height = img.size
        
        # Estimated crop values based on typical screenshot layout
        # Top: Remove status bar (approx 5-8%)
        # Bottom: Remove "Plasma Donation" card (approx 25-30%)
        
        left = 0
        top = int(height * 0.18)  # Remove top status bar & header
        right = width
        bottom = int(height * 0.55) # Remove bottom article
        
        cropped_img = img.crop((left, top, right, bottom))
        cropped_img.save(output_path)
        print(f"Successfully cropped image to {output_path}")
    except Exception as e:
        print(f"Error cropping image: {e}")

if __name__ == "__main__":
    crop_image("public/images/real/computer-donation-clipping.jpg", "public/images/real/computer-donation-crop-v1.jpg")

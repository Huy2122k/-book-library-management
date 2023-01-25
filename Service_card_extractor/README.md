
## How to run the code

### Step 1: Install anaconda, python and git
Check out this link: https://youtu.be/ZRC2nzP1w_4

### Step 2: Create conda environment and install requirements
1. Create conda environment with cpu or gpu
```bash
# Change directory to installation
cd installation

# for CPU
conda env create -f conda-cpu.yml
conda activate yolov4-cpu

# for GPU
conda env create -f conda-gpu.yml
conda activate yolov4-gpu
```
2. Install requirements
```bash
# for CPU
pip install -r requirements.txt

# for GPU
pip install -r requirements-gpu.txt
```
3. Back to the base folder
```bash
cd ..
```

### Step 3: Download and convert custom Yolo weights for id cards
1. Download my pre-trained weights at: https://drive.google.com/drive/folders/1TwrMzlOS2HuOv628ZOQeqANTQRpUapwh?usp=sharing
2. Put the weights file into: ./yolov4_card_detection/data/
3. Put the names file into: ./yolov4_card_detection/data/classes/
4. Open ./yolov4_card_detection/core/config.py, change line 15 to
```
__C.YOLO.BASE = os.getcwd().replace(os.sep, '/')
```
5. Convert the Yolo weights from darknet to tensorflow
```bash
cd yolov4_card_detection
python save_model.py --weights ./data/yolov4-cards.weights --output ./checkpoints/custom-416 --input_size 416 --model yolov4
cd .. 
```
6. Ensure the conversion is successful by checking ./yolov4_card_detection/checkpoints folder
7. Undo step 4.4 (change line 15 back to)
```
__C.YOLO.BASE = os.getcwd().replace(os.sep, '/') + "/yolov4_card_detection"
```
8. Note: to train with your custom data, check out this tutorial from theAIguys: https://youtu.be/mmj3nxGT2YQ

### Step 4: Run the code
```bash
python app.py
```

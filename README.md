# Animal Identifier

An AI-powered web application that identifies animals from uploaded images and provides information about their potential danger to humans, along with relevant Wikipedia references.

## Features

- Image upload and animal detection using Hugging Face's Vision API
- Analysis of whether the detected animal is dangerous to humans using OpenAI's GPT-4
- Wikipedia references for additional information
- Special handling for the legendary Rabbit of Caerbannog
- Support for multiple animal types including:
  - Cat
  - Dog
  - Elephant
  - Lion
  - Tiger
  - Bear
  - Zebra
  - Giraffe
  - Penguin
  - Kangaroo
  - Rabbit

## Technologies Used

- Next.js 13+
- TypeScript
- OpenAI GPT-4
- Hugging Face Inference API
- Tailwind CSS

## Prerequisites

Before running this project, you need:

- Node.js 14 or higher
- npm or yarn package manager
- OpenAI API key
- Hugging Face API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/animal-identifier.git
cd animal-identifier
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload a JPG/JPEG image containing an animal
2. Click "Analyze Image"
3. View the results, including:
   - Detected animal type
   - Confidence score
   - Analysis of potential danger
   - Link to relevant Wikipedia article

## API Endpoints

### `/api/classify`
- POST endpoint for image classification
- Accepts base64 encoded JPG/JPEG images
- Returns animal classification and confidence score

### `/api/analyze`
- POST endpoint for animal danger analysis
- Accepts animal name
- Returns danger analysis and Wikipedia reference

## Limitations

- Only supports JPG/JPEG image formats
- Limited to specific set of recognizable animals
- Requires active internet connection for API calls
- API usage costs apply (OpenAI and Hugging Face)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-4 API
- Hugging Face for Vision API
- Next.js team for the framework
- Monty Python for the Rabbit of Caerbannog reference

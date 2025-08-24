# AI Interview Assistant

Chrome extension that helps answer interview questions with AI in real-time through a floating overlay.

## Key Features

- **Auto Detection**: Automatically detects interview questions from various platforms
- **AI-Powered**: Generate answers using OpenAI GPT or Google Gemini
- **Floating Overlay**: Interface that can be locked and positioned over the screen
- **Real-time**: Works in real-time during interview sessions
- **Platform Support**: Supports HireVue, myInterview, Spark Hire, and other platforms
- **Multi-language**: Indonesian and English language support

## Installation

### Method 1: From Source Code
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select this project folder
5. Extension will appear in Chrome toolbar

### Method 2: From Chrome Web Store
(Available after publication)

## How to Run

### Prerequisites
- Google Chrome browser (version 88 or higher)
- Valid API key from OpenAI or Google Gemini
- Internet connection

### Step-by-Step Installation and Setup

#### 1. Install the Extension
```bash
# Clone the repository
git clone https://github.com/nerufuyo/neruanswer.git
cd neruanswer

# Or download ZIP and extract
```

#### 2. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"** button
4. Select the `neruanswer` folder
5. Extension icon should appear in toolbar

#### 3. Configure API Key
1. Click the extension icon in Chrome toolbar
2. Select AI provider (OpenAI or Gemini)
3. Enter your API key:
   - **OpenAI**: Create account at [OpenAI](https://platform.openai.com/) → API Keys
   - **Gemini**: Get key from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. Click **Test** button to verify key works
5. Enable the extension with main toggle

#### 4. Test the Extension
1. Navigate to any supported interview platform
2. The extension should show green indicator for supported platforms
3. Try manual detection with "Detect Question" button
4. Overlay should appear in top-right corner

### Quick Start Guide

1. **Enable Extension**: Click toolbar icon → toggle ON
2. **Visit Interview Site**: Go to HireVue, myInterview, etc.
3. **Start Interview**: Begin your practice or real interview
4. **Auto Detection**: Questions will be detected automatically
5. **Get AI Answers**: Answers appear in floating overlay
6. **Copy & Use**: Click copy button to get answer text

## Initial Setup

1. **Click extension icon** in Chrome toolbar
2. **Choose AI Provider**: OpenAI or Google Gemini
3. **Enter API Key**:
   - OpenAI: Get from [platform.openai.com](https://platform.openai.com/api-keys)
   - Gemini: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **Test API Key** by clicking test button
5. **Enable extension** with main toggle
6. **Configure preferences** as needed

## Environment Configuration

Copy `.env.example` file to `.env` and adjust configuration:

```bash
cp .env.example .env
```

Edit `.env` file as needed:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
DEFAULT_LANGUAGE=en
AUTO_DETECT_QUESTIONS=true
```

## Development Setup (For Developers)

### Local Development
```bash
# 1. Clone and setup
git clone https://github.com/nerufuyo/neruanswer.git
cd neruanswer

# 2. Configure environment
cp .env.example .env
# Edit .env file with your API keys

# 3. Load in Chrome
# - Go to chrome://extensions/
# - Enable Developer mode
# - Click "Load unpacked"
# - Select neruanswer folder
```

### Testing and Debugging
```bash
# Enable debug mode in .env
DEBUG_MODE=true

# Test on platforms:
# - HireVue: hirevue.com
# - myInterview: myinterview.com  
# - Spark Hire: spark-hire.com
```

### Building for Distribution
```bash
# Create production build
zip -r neruanswer-v1.0.zip . -x "*.git*" "*.env*" "node_modules/*" "*.DS_Store*"
```

## How to Use

### Automatic Mode (Recommended)
1. Open interview platform (HireVue, myInterview, etc.)
2. Activate extension through popup or click icon
3. Overlay will appear in top right corner
4. Extension will automatically detect new questions
5. AI answer will appear in overlay within seconds

### Manual Mode
1. Activate extension
2. Click "Detect Question" in popup to force detection
3. Or click "Regenerate" in overlay for new answer

### Overlay Controls
- **Minimize**: Minimize/maximize overlay
- **Lock/Unlock**: Lock/unlock overlay position
- **Close**: Hide overlay
- **Copy**: Copy answer to clipboard
- **Regenerate**: Generate new answer

## Supported Platforms

### Fully Supported
- HireVue
- myInterview
- Spark Hire
- VidCruiter
- Talview
- Interview.com

### Partially Supported
- Zoom (requires manual detection)
- Google Meet (requires manual detection)
- Microsoft Teams (requires manual detection)

### Not Supported
- Platforms with heavy encryption
- Platforms that block extensions

## Troubleshooting

### Extension Not Appearing
- Make sure extension is activated in popup
- Refresh interview page
- Check if platform is supported

### Not Detecting Questions
- Click "Detect Question" in popup
- Make sure question is clearly visible on screen
- Try scrolling or clicking question area

### Failed to Generate Answer
- Check API key is correct
- Test API key in popup
- Make sure internet connection is available
- Check API quota limits

### Overlay Not Appearing
- Click extension icon and activate
- Refresh page
- Check if overlay is minimized

### Common Setup Issues

#### "Extension Not Loading"
```bash
# Solution:
1. Make sure you selected the correct folder (neruanswer)
2. Check that manifest.json exists in the folder
3. Disable other interview-related extensions
4. Restart Chrome if needed
```

#### "API Key Invalid" 
```bash
# For OpenAI:
1. Visit https://platform.openai.com/api-keys
2. Create new API key
3. Make sure you have billing set up
4. Copy key exactly (starts with sk-)

# For Gemini:
1. Visit https://makersuite.google.com/app/apikey  
2. Create API key for Gemini
3. Enable Generative AI API in Google Cloud
```

#### "Questions Not Detected"
```bash
# Solutions:
1. Check if website is supported (see platform list)
2. Try manual detection button
3. Make sure question text is visible on screen
4. Check browser console for errors (F12)
```

#### "Permission Denied Errors"
```bash
# Solution:
1. Make sure extension has permissions
2. Check chrome://extensions/ settings
3. Enable "Allow in incognito" if needed
4. Restart browser after permission changes
```

## Advanced Configuration

### AI Settings
```json
{
  "aiProvider": "openai",
  "apiKey": "your-api-key",
  "responseLanguage": "en",
  "maxResponseLength": 200
}
```

### Overlay Settings
```json
{
  "overlayPosition": { "x": 20, "y": 20 },
  "overlayLocked": false,
  "autoDetect": true
}
```

## Privacy & Security

- **Local Storage**: All data stored locally in browser
- **No Data Sharing**: No data sent to third-party servers
- **API Keys**: Stored encrypted in local storage
- **Question History**: Only stored locally, can be deleted anytime

## Contributing

Contributions are welcome! Please:

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## Changelog

### v1.0.0 (2024-12-XX)
- Initial release
- Support for major interview platforms
- AI integration with OpenAI and Gemini
- Floating overlay with drag & drop
- Auto-detection of questions
- Multi-language support

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Disclaimer

This extension is created for learning purposes and interview practice. Please ensure usage complies with the policies of the interview platform being used. The developer is not responsible for misuse of this extension.

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/neruanswer/issues)
- **Documentation**: [Wiki](https://github.com/your-repo/neruanswer/wiki)
- **Email**: support@neruanswer.com

---

**Made with care for interview preparation**

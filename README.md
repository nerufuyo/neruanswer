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

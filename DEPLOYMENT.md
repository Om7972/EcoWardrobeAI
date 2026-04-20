# EcoWardrobe AI - Production Deployment Guide

## Overview

This guide covers deploying EcoWardrobe AI to production with full multi-AI integration, weather services, and calendar integration.

## Features Implemented

### Multi-AI Integration
- **Primary AI**: Google Gemini Pro (configured)
- **Fallback AIs**: Groq, Anthropic Claude, OpenAI GPT-3.5
- **Automatic Failover**: If one AI service fails, automatically tries the next
- **Quota Management**: Handles API quota exceeded errors gracefully

### Weather Integration
- **OpenWeather API**: Real-time weather data and forecasts
- **Weather-based Outfits**: AI generates outfits based on current weather
- **Location Support**: Works with any city/location worldwide

### Calendar Integration
- **Google Calendar API**: Reads upcoming events
- **Event-based Styling**: AI suggests outfits based on event type and formality
- **Smart Categorization**: Automatically categorizes events (work, formal, casual, etc.)

### Production Features
- **Docker Support**: Complete containerization
- **PM2 Process Management**: Cluster mode with auto-restart
- **Nginx Reverse Proxy**: Load balancing and SSL termination
- **Rate Limiting**: API protection against abuse
- **Logging**: Comprehensive application logging
- **Health Checks**: Monitoring endpoints

## Prerequisites

1. **Node.js 18+** and **pnpm**
2. **Docker** and **Docker Compose** (for containerized deployment)
3. **PM2** (for process management): `npm install -g pm2`
4. **MongoDB Atlas** account (already configured)
5. **API Keys** (all provided in .env file):
   - Google Gemini API Key
   - Groq API Key
   - Anthropic API Key
   - OpenAI API Key
   - OpenWeather API Key
   - Google Calendar API Key

## Environment Setup

### 1. Environment Files

The project includes three environment configurations:

- `.env` - Development environment
- `.env.production` - Production environment template
- `.env.local` - Local overrides (create if needed)

### 2. API Keys Configuration

All API keys are already configured in the `.env` file:

```bash
# AI Services
GEMINI_API_KEY=your_api_key_here
GROQ_API_KEY=your_api_key_here
ANTHROPIC_API_KEY=your_api_key_here
OPENAI_API_KEY=your_api_key_here

# External APIs
OPENWEATHER_API_KEY=your_api_key_here
GOOGLE_CALENDAR_API_KEY=your_api_key_here

# Database
MONGODB_URI=your_api_key_here
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Quick Start
```bash
# Build and run with Docker Compose
npm run docker:compose

# Or manually
npm run docker:build
npm run docker:run
```

#### Full Production Stack
```bash
# Start all services (app, nginx, redis)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: PM2 Deployment

#### Build and Deploy
```bash
# Install dependencies
pnpm install

# Build for production
npm run build

# Start with PM2
npm run start:pm2

# Monitor
npm run logs:pm2

# Restart
npm run restart:pm2

# Stop
npm run stop:pm2
```

### Option 3: Manual Deployment

#### Build and Start
```bash
# Install dependencies
pnpm install

# Build application
npm run build

# Start production server
npm run start:prod
```

## Service Configuration

### AI Service Priority

The multi-AI service tries providers in this order:
1. **Gemini** (primary, most cost-effective)
2. **Groq** (fast, good for real-time responses)
3. **OpenAI** (reliable fallback)
4. **Anthropic** (high-quality responses)

### Weather Service

- **Provider**: OpenWeather API
- **Features**: Current weather, 5-day forecast, location-based
- **Fallback**: Mock weather data if API unavailable

### Calendar Service

- **Provider**: Google Calendar API
- **Features**: Event reading, smart categorization, styling suggestions
- **Fallback**: Mock events if API unavailable

## API Endpoints

### AI Services
- `POST /api/ai/chat` - Multi-AI chat
- `POST /api/ai/outfit-suggestion` - Outfit generation
- `POST /api/ai/style-advice` - Style recommendations
- `POST /api/ai/fabric-analysis` - Fabric analysis
- `POST /api/ai/sustainability-tips` - Eco-friendly tips
- `POST /api/ai/weather-outfit` - Weather-based outfits
- `POST /api/ai/event-styling` - Event-based styling
- `GET /api/ai/weather-forecast` - Weather forecast
- `GET /api/ai/calendar-styling` - Calendar event styling

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/protected/profile` - Get user profile
- `PUT /api/protected/profile` - Update user profile

## Monitoring and Maintenance

### Health Checks
- Application: `GET /api/ping`
- Nginx: `GET /health`

### Logs
- Application logs: `./logs/`
- PM2 logs: `pm2 logs`
- Docker logs: `docker-compose logs`

### Performance Monitoring
- **PM2 Dashboard**: `pm2 monit`
- **Memory Usage**: Automatic restart at 1GB
- **CPU Usage**: Cluster mode for load distribution

## Security Features

### Rate Limiting
- API routes: 10 requests/second
- Auth routes: 5 requests/minute
- Configurable per environment

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Referrer-Policy: strict-origin-when-cross-origin

### CORS Configuration
- Development: All origins allowed
- Production: Specific domain only

## Troubleshooting

### Common Issues

#### AI Service Errors
- **Quota Exceeded**: Service automatically falls back to next provider
- **API Key Invalid**: Check environment variables
- **Network Issues**: Service returns demo responses

#### Database Connection
- **MongoDB Atlas**: Ensure IP whitelist includes server IP
- **Connection String**: Verify credentials and cluster name

#### Weather/Calendar APIs
- **API Key Issues**: Verify keys in environment
- **Rate Limits**: Services include fallback data

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm run start:prod

# Check service status
curl http://localhost:8080/api/ping
```

## Scaling Considerations

### Horizontal Scaling
- Use Docker Swarm or Kubernetes
- Configure load balancer (nginx included)
- Separate database and Redis instances

### Performance Optimization
- Enable Redis caching
- Use CDN for static assets
- Implement API response caching
- Monitor and optimize AI API usage

## Backup and Recovery

### Database Backup
- MongoDB Atlas automatic backups enabled
- Point-in-time recovery available

### Application Backup
- Source code in version control
- Environment variables documented
- Docker images versioned

## Support and Maintenance

### Regular Tasks
1. Monitor API usage and costs
2. Update dependencies monthly
3. Review and rotate API keys quarterly
4. Monitor application logs for errors
5. Check database performance metrics

### Emergency Procedures
1. **Service Down**: PM2 auto-restart enabled
2. **Database Issues**: MongoDB Atlas support
3. **API Limits**: Automatic fallback configured
4. **Security Issues**: Rate limiting and monitoring active

## Production Checklist

- [ ] All API keys configured and tested
- [ ] Database connection verified
- [ ] SSL certificates installed (if using HTTPS)
- [ ] Domain name configured
- [ ] Monitoring and alerting set up
- [ ] Backup procedures tested
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Health checks working

## Contact and Support

For deployment issues or questions:
1. Check application logs first
2. Verify API key configurations
3. Test individual services (AI, weather, calendar)
4. Review this deployment guide
5. Check service status pages for external APIs
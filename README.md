# SolarScan AI 🌞

AI-powered rooftop solar analysis platform that uses satellite imagery to assess solar installation potential, providing detailed recommendations and ROI calculations.

![SolarScan AI](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Features

- **AI-Powered Analysis**: Uses Google Gemini Flash Vision to analyze rooftop images
- **Real-time Processing**: Live updates during analysis with progress tracking
- **Comprehensive Reports**: Detailed solar potential assessments with confidence scores
- **Financial Modeling**: ROI calculations, payback periods, and incentive analysis
- **Installer Network**: Connect with certified solar installers
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Dashboard**: Live statistics and analysis updates

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **NextAuth.js** for authentication

### Backend
- **Next.js API Routes**
- **Prisma ORM** for database management
- **NeonDB PostgreSQL** for data storage
- **Google Gemini Flash Vision** for AI analysis
- **Cloudinary** for image storage

### Real-time Features
- **Polling-based updates** for live analysis status
- **Real-time dashboard statistics**
- **Live progress tracking**

## 📋 Prerequisites

- Node.js 18.0 or higher
- PostgreSQL database (NeonDB recommended)
- Google AI API key for analysis
- Cloudinary account for image storage
- Vercel account for deployment (optional)

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# AI Analysis
OPENROUTER_API_KEY=your_openrouter_api_key

# Image Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
\`\`\`

## 🚀 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/solarscan-ai.git
   cd solarscan-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up the database**
   \`\`\`bash
   npx prisma generate
   npx prisma migrate dev
   \`\`\`

4. **Seed the database (optional)**
   \`\`\`bash
   npx prisma db seed
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Examples

### Residential Solar Assessment

1. **Upload Image**: Upload a satellite image of your property
2. **AI Analysis**: AI analyzes roof area, orientation, and shading
3. **Get Results**: Receive potential capacity and production estimates
4. **Financial Analysis**: View ROI and payback period calculations
5. **Find Installers**: Connect with certified solar installers

### Commercial Property Evaluation

- Bulk property analysis for multiple locations
- Commercial-grade financial modeling
- Tax incentive calculations
- Installer network for commercial projects

### Solar Installer Workflow

1. Customer uploads property image
2. Installer reviews AI analysis
3. Installer provides customized quote
4. Customer compares multiple quotes
5. Installation project begins

## 🏗️ Project Structure

\`\`\`
solarscan-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── analysis/          # Analysis results pages
│   └── properties/        # Property management
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication config
│   ├── db.ts             # Database connection
│   └── ai-analysis.ts    # AI analysis logic
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
└── types/                # TypeScript type definitions
\`\`\`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User sign in

### Properties
- `GET /api/properties` - Get user properties
- `POST /api/properties` - Create new property
- `GET /api/properties/[id]` - Get specific property

### Analysis
- `POST /api/analyze` - Start AI analysis
- `GET /api/analyses/[id]` - Get analysis results
- `GET /api/analyses/[id]/status` - Get real-time analysis status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/analyses/recent` - Get recent analyses

## 🧪 Database Schema

### Key Tables

- **Users** - Authentication and profile data
- **Properties** - Property information and location
- **Images** - Uploaded satellite imagery
- **Analyses** - AI analysis results
- **Recommendations** - Installation recommendations
- **FinancialCalculations** - ROI and cost data
- **Installers** - Solar installer directory
- **Quotes** - Installation quotes and proposals

## 🔮 Future Roadmap

### Short-term (3-6 months)
- [ ] Enhanced AI accuracy through model fine-tuning
- [ ] Mobile app for iOS and Android
- [ ] Real-time weather integration

### Medium-term (6-12 months)
- [ ] 3D roof modeling for precise panel placement
- [ ] Battery storage analysis and recommendations
- [ ] Marketplace integration for equipment

### Long-term (12+ months)
- [ ] AI-powered design optimization
- [ ] Predictive maintenance capabilities
- [ ] Global expansion with local regulations

## 🤝 Contributing

We welcome contributions from the community! Please check our [GitHub repository](https://github.com/your-username/solarscan-ai) for:

- Open issues
- Contribution guidelines
- Development setup instructions

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full documentation](https://solarscan-ai.vercel.app/documentation)
- **Issues**: [GitHub Issues](https://github.com/your-username/solarscan-ai/issues)
- **Email**: vishalmaurya850@gmail.com
- **Phone**: +91 9628525211

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the excellent ORM
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Google AI](https://ai.google.dev/) for the powerful vision models
- [NeonDB](https://neon.tech/) for the serverless PostgreSQL

---

**Built with ❤️ for a sustainable future**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/solarscan-ai)
\`\`\`

This comprehensive README.md file includes all the essential information from the documentation page, properly formatted for GitHub with:

- Clear project description and features
- Complete installation instructions
- Technology stack details
- Usage examples
- API documentation
- Project structure
- Contributing guidelines
- Future roadmap
- Support information

The README follows best practices with badges, clear sections, code examples, and proper formatting to help developers quickly understand and contribute to the project.
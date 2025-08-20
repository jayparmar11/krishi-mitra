export type NewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  markdown: string;
};

const news: NewsItem[] = [
  {
    id: "1",
    title: "Scrapping Cotton Import Duty Sparks Farmer Outcry",
    date: "2025-08-19",
    excerpt: "SKM condemns the government’s removal of the 11% cotton import duty as a ‘death warrant’ for domestic growers, citing a ₹2,365 gap in MSP.",
    markdown: `# Scrapping Cotton Import Duty Sparks Farmer Outcry

The Sanyukt Kisan Morcha (SKM) has strongly opposed the central government’s immediate decision to eliminate the 11% import duty on cotton, warning it amounts to a “death warrant” for domestic growers. They argue this move will depress cotton prices and exacerbate farmer distress, especially as the current MSP of ₹7,710 per quintal falls ₹2,365 short of what farmers deem fair. The SKM has urged village-level organization to demand duty reversal and proper MSP implementation.`,
  },
  {
    id: "2",
    title: "U.S. Tariffs Push Shrimp Farmers to Explore Alternatives",
    date: "2025-08-19",
    excerpt: "Facing steep U.S. tariffs up to 50%, shrimp exporters have cut farmer prices, forcing many to consider fish farming or local ventures.",
    markdown: `# U.S. Tariffs Push Shrimp Farmers to Explore Alternatives

India’s shrimp industry—especially in Andhra Pradesh—is in crisis as U.S. tariffs now reach 25%, with another 25% hitting on August 27. These tariffs have made Indian shrimp far less competitive compared to countries like Ecuador (which faces only 15%). Exporters have responded by slashing prices, squeezing farmer margins and prompting many to consider shifting to alternate livelihoods such as fish farming or launching small local businesses. The industry is calling for government support to offset rising operating costs and loan burdens.`,
  },
  {
    id: "3",
    title: "IIIT-Allahabad Unveils AI Tech for Real-Time Crop Disease Detection",
    date: "2025-08-19",
    excerpt: "New AI-IoT tool (CVGG-16) achieves 97.25% accuracy in detecting diseases in maize and potato, using federated learning for privacy.",
    markdown: `# IIIT-Allahabad Unveils AI Tech for Real-Time Crop Disease Detection

Researchers at IIIT-Allahabad have developed CVGG-16, an AI-powered model leveraging IoT, deep learning, and federated learning to detect crop diseases in real time. This innovation analyzes leaf images alongside environmental data—soil moisture, temperature, humidity—to achieve up to 97.25% detection accuracy. Tested across varied field conditions near Prayagraj and effective for crops like maize and potatoes, the model preserves data privacy by processing information locally. Plans include rolling out mobile apps with regional language support to empower small and marginal farmers.`,
  },

  {
    id: "4",
    title: "Crackdown Begins on Spurious Farm Inputs",
    date: "2025-08-19",
    excerpt: "Union Agriculture Minister orders nationwide raids and sealing of shops selling fake fertilisers, seeds, and pesticides, calling them a farmer 'curse.'",
    markdown: `# Crackdown Begins on Spurious Farm Inputs

Agriculture Minister Shivraj Singh Chouhan has termed the sale of fake fertilisers, seeds, and pesticides a "curse for farmers." In a high-level review at Krishi Bhavan, he directed immediate raids, and mandates sealing of facilities found distributing such substandard inputs, in collaboration with state agencies to safeguard cultivators.`,
  },
  {
    id: "5",
    title: "NSS to Survey Farm Households and Debt in 2026",
    date: "2025-08-19",
    excerpt: "NSS to conduct Situation Assessment Survey of Agricultural Households alongside All India Debt & Investment Survey in 2026 to inform agri policy.",
    markdown: `# NSS to Survey Farm Households and Debt in 2026

The National Sample Survey (NSS) will roll out a comprehensive Situation Assessment Survey of Agricultural Households, paired with the All India Debt & Investment Survey (AIDIS) in 2026. The data—covering investment patterns, debt levels, and financial health—is expected to support more targeted agricultural and economic policy-making.`,
  },
  {
    id: "6",
    title: "Over 34 Lakh Farmers Benefit from Crop Insurance Scheme",
    date: "2025-08-19",
    excerpt: "PMFBY has disbursed compensation to over 34.48 lakh farmers nationwide, with 9.7 lakh farmers in Rajasthan alone receiving payouts.",
    markdown: `# Over 34 Lakh Farmers Benefit from Crop Insurance Scheme

Under the Pradhan Mantri Fasal Bima Yojana (PMFBY), more than 34.48 lakh farmers across India have received compensation for crop losses, including 9.7 lakh in Rajasthan. Union Agriculture Minister highlighted the significance of direct bank transfers and reaffirmed agriculture’s central role in the economy.`,
  },
  {
    id: "7",
    title: "STEM Monsoon Outlook Promises Relief for Farmers",
    date: "2025-08-19",
    excerpt: "IMD forecasts average rainfall in August and surplus in September; 83M ha already sown vs. last year’s — a 4% increase.",
    markdown: `# Monsoon Outlook Promises Relief for Farmers

The India Meteorological Department (IMD) forecasts average rainfall for August and a surplus in September, following a 5% above-average July. With 83 million hectares already sown—up 4% year-over-year—the monsoon’s favorable trajectory could benefit key crops like rice, corn, soybeans, and sugarcane.`,
  },
  {
    id: "8",
    title: "Policy Shift: Ethics Over Yield, Focus on Pulses & Oilseeds",
    date: "2025-08-19",
    excerpt: "Agriculture Secretary urges policy evolution—shift from production-centric to ethics-based model with sustainable pulses and oilseeds self-reliance.",
    markdown: `# Policy Shift: Ethics Over Yield, Focus on Pulses & Oilseeds

Union Agriculture Secretary Devesh Chaturvedi advocates a shift from pure output-driven policy to an ethically grounded approach that balances food security with environmental sustainability. He emphasized fostering self-reliance through sustainable pulses and oilseeds production.`,
  },
  {
    id: "9",
    title: "Cabinet Approves ₹24,000 Crore PM Dhan-Dhaanya Yojana",
    date: "2025-08-19",
    excerpt: "Six-year scheme to uplift 100 underperforming agri districts with ₹24k cr annual support from 2025-26 for infrastructure, crop diversification, sustainability.",
    markdown: `# Cabinet Approves ₹24,000 Crore PM Dhan-Dhaanya Yojana

The Union Cabinet has sanctioned the PM Dhan-Dhaanya Krishi Yojana, allocating ₹24,000 crore annually from FY 2025-26 for six years. Aimed at improving agriculture in 100 underperforming districts, the scheme focuses on infrastructure, credit access, diversification, and sustainable farming practices.`,
  },
  {
    id: "10",
    title: "Uttar Pradesh Targets $1 Trillion with Agri Reforms",
    date: "2025-08-19",
    excerpt: "UP integrates agriculture into its $1 trn goal—maize MSP, farm loan waivers, irrigation expansion, PMFBY payments, free power for tubewells.",
    markdown: `# Uttar Pradesh Targets $1 Trillion with Agri Reforms

Uttar Pradesh lays out an ambitious roadmap with agriculture at its core. Key steps include MSP-backed maize procurement, a ₹36,000 crore loan waiver for 86 lakh farmers, expanded irrigation, PMFBY disbursements, and free electricity for tubewells—all contributing to the state's $1 trillion economic vision.`,
  },
  {
    id: "11",
    title: "Summer Crop Management Tips",
    date: "2025-08-01",
    excerpt: "Key agronomy practices to boost yield during summer months.",
    markdown: `# Summer Crop Management Tips

Here are some practical tips to help you manage your crops during the hot summer months:

- Ensure timely irrigation and mulching.
- Monitor pests regularly and use integrated pest management.
- Apply balanced fertilization based on soil tests.

Happy harvesting!`,
  },
  {
    id: "12",
    title: "New Government Subsidy for Small Farmers",
    date: "2025-07-20",
    excerpt: "Govt launches a new subsidy for drip irrigation systems.",
    markdown: `# New Government Subsidy for Small Farmers

The government has announced a new subsidy program to support small farmers adopting drip irrigation. Eligible farmers can apply at their local agriculture office.

## Benefits

- Saves water
- Increases crop yield
- Reduces labor costs

For details, check the official notification.`,
  },
];

export default news;

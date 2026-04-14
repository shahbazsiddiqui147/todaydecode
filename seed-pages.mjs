import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pages = [
  {
    slug: 'about-us',
    title: 'About Us',
    metaTitle: 'About Us | Today Decode — Independent Geopolitical Think Tank',
    metaDescription: 'About Us | Today Decode — Independent Geopolitical Think Tank',
    content: `
      <section>
        <h2>Our Mission</h2>
        <p>Today Decode is an independent research institution dedicated to bridging the gap between academic rigor and policy relevance. We provide clear, data-driven analysis of the forces shaping our global landscape.</p>
      </section>
      <section>
        <h2>What We Do</h2>
        <p>We focus on four core research areas: <strong>Economy</strong>, <strong>Energy</strong>, <strong>Security</strong>, and <strong>Technology</strong>. Our research is presented in structured formats designed for decision-makers, emphasizing clarity and actionable insights.</p>
      </section>
      <section>
        <h2>Our Approach</h2>
        <p>Intellectual independence is our guiding principle. We utilize open-source intelligence, advanced data metrics, and a robust scenario analysis framework to identify risks and emerging trends before they reach a boiling point.</p>
      </section>
      <section>
        <h2>Our Contributors</h2>
        <p>Today Decode draws upon a global network of analysts, academics, and investigative journalists. If you are interested in contributing, please review our <a href="/submission-guidelines/" class="text-accent-red hover:underline">Submission Guidelines</a>.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>For inquiries, partnerships, or media requests, please visit our <a href="/contact/" class="text-accent-red hover:underline">Contact Page</a>.</p>
      </section>
    `.trim()
  },
  {
    slug: 'editorial-standards',
    title: 'Editorial Standards',
    metaTitle: 'Editorial Standards | Today Decode',
    metaDescription: 'Editorial Standards | Today Decode',
    content: `
      <section>
        <h2>Accuracy and Evidence</h2>
        <p>Every claim must be verifiable. We prioritize primary sources and disclose any limitations in our data or methodology. Fact-checking is an integral part of our publication process.</p>
      </section>
      <section>
        <h2>Independence</h2>
        <p>Today Decode does not accept sponsored content or allow external funders to influence our research findings. Our analysts maintain full intellectual independence.</p>
      </section>
      <section>
        <h2>Balanced Analysis</h2>
        <p>Geopolitics is rarely binary. We strive to present multiple perspectives and utilize a three-tiered scenario framework (Best Case, Most Likely, Worst Case) to avoid reductive conclusions.</p>
      </section>
      <section>
        <h2>Transparency</h2>
        <p>We explain our methods and the models we use. When we make a mistake, we acknowledge it openly and correct it promptly.</p>
      </section>
      <section>
        <h2>Corrections</h2>
        <p>Accuracy is paramount. We encourage feedback and provide a transparent process for correcting factual errors.</p>
      </section>
      <section>
        <h2>Originality</h2>
        <p>We do not tolerate plagiarism. All AI-assisted research must be disclosed, and final analysis remains the product of human expertise.</p>
      </section>
      <section>
        <h2>Tone and Style</h2>
        <p>Our voice is analytical, not rhetorical. We avoid sensationalism and partisan framing, focusing on objective indicators and strategic impacts.</p>
      </section>
    `.trim()
  },
  {
    slug: 'submission-guidelines',
    title: 'Submission Guidelines',
    metaTitle: 'Submission Guidelines | Today Decode — Contribute Research & Analysis',
    metaDescription: 'Submission Guidelines | Today Decode — Contribute Research & Analysis',
    content: `
      <section>
        <h2>Who Can Contribute</h2>
        <p>We welcome submissions from analysts, academics, journalists, and industry experts at all career stages. We value regional expertise and deep sectoral knowledge.</p>
      </section>
      <section>
        <h2>Publication Formats</h2>
        <ul>
          <li><strong>Policy Brief (1200-2500w):</strong> Decision-oriented summaries for executive leadership.</li>
          <li><strong>Strategic Report (3000-12000w):</strong> Deep-dive geopolitical and economic analysis.</li>
          <li><strong>Commentary (800-1200w):</strong> Expert-led perspective on shifting global currents.</li>
          <li><strong>Scenario Analysis (1500-3000w):</strong> Multi-path outcome forecasting for strategic planning.</li>
          <li><strong>Risk Assessment (1200-2000w):</strong> Evaluation of regional and sectoral volatility.</li>
          <li><strong>Data Insight (600-1000w):</strong> Empirical analysis driven by proprietary metric tracking.</li>
          <li><strong>Annual Outlook (4000-8000w):</strong> High-level institutional forecasting for the year ahead.</li>
          <li><strong>Policy Toolkit (1500-3000w):</strong> Methodologies for operational response.</li>
          <li><strong>News Brief (400-800w):</strong> Concise reporting on breaking developments.</li>
          <li><strong>Current Affairs (800-1500w):</strong> Timely analysis of evolving global developments.</li>
        </ul>
      </section>
      <section>
        <h2>Submission Requirements</h2>
        <p>Submissions must include a working title, a 200-word executive summary, full citations (footnotes or hyperlinks), a selected publication format, and a brief author biography.</p>
      </section>
      <section>
        <h2>How to Submit</h2>
        <ol>
          <li>Create a contributor account via our <a href="/auth/signup/" class="text-accent-red hover:underline">portal</a>.</li>
          <li>Submit your draft through the "New Article" interface.</li>
          <li>The Editorial Desk will review your submission within 7 days.</li>
        </ol>
      </section>
      <section>
        <h2>Review Process</h2>
        <p>All submissions undergo peer and editorial review. We may request revisions to ensure alignment with our standards and formatting requirements.</p>
      </section>
      <section>
        <h2>Rights and Attribution</h2>
        <p>Authors retain the right to be identified. Today Decode requires a non-exclusive license to publish and archive the work.</p>
      </section>
    `.trim()
  },
  {
    slug: 'methodology',
    title: 'Methodology',
    metaTitle: 'Research Methodology | Today Decode',
    metaDescription: 'Research Methodology | Today Decode',
    content: `
      <section>
        <h2>Research Framework</h2>
        <p>Our research is organized across a matrix of 4 core themes (Economy, Energy, Security, Technology) and 6 global regions (GLOBAL, MENA, APAC, EUROPE, AMERICAS, AFRICA).</p>
      </section>
      <section>
        <h2>Analytical Process</h2>
        <ol>
          <li><strong>Identify:</strong> Monitor global indicators for emerging trends.</li>
          <li><strong>Research:</strong> Aggregating primary data and open-source intelligence.</li>
          <li><strong>Analyze:</strong> Applying scenario modeling and risk scoring metrics.</li>
          <li><strong>Review:</strong> Peer and editorial verification of all findings.</li>
          <li><strong>Publish:</strong> Distribution via the Today Decode platform.</li>
        </ol>
      </section>
      <section>
        <h2>Risk Scoring</h2>
        <p>We utilize two primary metrics: <strong>Risk Score (0-100)</strong> measuring probability and <strong>Impact Score (0-100)</strong> measuring consequence. These scores provide a quantitative baseline for strategic assessment.</p>
      </section>
      <section>
        <h2>Scenario Modeling</h2>
        <p>All major reports include a Best Case, Most Likely, and Worst Case scenario. This framework helps decision-makers prepare for a range of potential outcomes.</p>
      </section>
      <section>
        <h2>Sources and Citations</h2>
        <p>Primary sources are prioritized. All indirect data must be cross-referenced across multiple reliable sources to ensure accuracy.</p>
      </section>
      <section>
        <h2>Limitations</h2>
        <p>We acknowledge the inherent uncertainty in geopolitical forecasting. Our findings are subject to update as new information emerges or conditions shift.</p>
      </section>
    `.trim()
  },
  {
    slug: 'contact',
    title: 'Contact',
    metaTitle: 'Contact | Today Decode',
    metaDescription: 'Contact | Today Decode',
    content: `
      <section>
        <h2>General Inquiries</h2>
        <p>For general questions, please email us at <a href="mailto:admin@flowetra.com" class="text-accent-red hover:underline">admin@flowetra.com</a>.</p>
      </section>
      <section>
        <h2>Contributor Applications</h2>
        <p>Experts interested in joining our network should review our <a href="/submission-guidelines/" class="text-accent-red hover:underline">Submission Guidelines</a> and create an account via our <a href="/auth/signup/" class="text-accent-red hover:underline">signup portal</a>.</p>
      </section>
      <section>
        <h2>Institutional Partnerships</h2>
        <p>Today Decode is open to collaboration with universities, other think tanks, and policy research institutions.</p>
      </section>
      <section>
        <h2>Media Inquiries</h2>
        <p>We provide a 24-hour response window for media requests and analyst commentary.</p>
      </section>
      <section>
        <h2>Corrections and Feedback</h2>
        <p>We value accurate reporting. Please submit any feedback or requests for correction directly to the Editorial Desk.</p>
      </section>
    `.trim()
  }
];

async function main() {
  console.log('Starting page seed...');
  for (const page of pages) {
    const upsertedPage = await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
    console.log(`Upserted page: ${upsertedPage.title} (${upsertedPage.slug})`);
  }
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

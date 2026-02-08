export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1 className="text-5xl text-md-6xl mb-6 gradient-text" style={{ fontWeight: 'bold' }}>
            Your Resume, AI-Optimized
          </h1>
          
          <p className="text-large text-gray mb-8" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            Build an ATS-optimized resume in minutes. Let AI do the heavy lifting while you focus on landing interviews.
          </p>
          
          <div className="flex flex-col flex-md-row gap-4 items-center justify-center">
            <button className="button-primary" style={{ fontSize: '1.125rem' }}>
              Start Free
            </button>
            <button className="button-secondary" style={{ fontSize: '1.125rem' }}>
              Watch Demo
            </button>
          </div>

          <p className="text-gray mb-16" style={{ fontSize: '0.875rem', marginTop: '1.5rem' }}>
            ✓ No credit card required • ✓ Takes 5 minutes • ✓ Free forever plan
          </p>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="section" style={{ background: 'rgba(30, 41, 59, 0.3)' }}>
        <div className="container">
          <h2 className="text-4xl text-center mb-4 gradient-text" style={{ fontWeight: 'bold' }}>
            Why Choose ResizeMe?
          </h2>
          
          <p className="text-center text-gray mb-16 text-large" style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>
            Everything you need to land your dream job, powered by cutting-edge AI.
          </p>

          <div className="grid grid-3">
            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h3 className="text-xl text-white mb-4" style={{ fontWeight: 'bold' }}>ATS-Optimized</h3>
              <p className="text-gray">Pass applicant tracking systems with our AI-powered formatting and keyword optimization.</p>
            </div>

            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <h3 className="text-xl text-white mb-4" style={{ fontWeight: 'bold' }}>AI Cover Letter</h3>
              <p className="text-gray">Generate personalized cover letters in seconds. Tailored to each job description.</p>
            </div>

            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h3 className="text-xl text-white mb-4" style={{ fontWeight: 'bold' }}>Interview Prep</h3>
              <p className="text-gray">Get AI-powered mock interviews and personalized tips to ace your next meeting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <h2 className="text-4xl text-center mb-4 gradient-text" style={{ fontWeight: 'bold' }}>
            How It Works
          </h2>
          
          <p className="text-center text-gray mb-16 text-large" style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>
            From resume to dream job in three simple steps.
          </p>

          <div className="grid grid-3">
            <div className="card">
              <div style={{ fontSize: '3rem', color: '#a855f7', fontWeight: 'bold', marginBottom: '1rem' }}>01</div>
              <h3 className="text-xl text-white mb-4" style={{ fontWeight: 'bold' }}>Upload Your Resume</h3>
              <p className="text-gray">Start with your existing resume or create one from scratch. Our AI analyzes every detail.</p>
            </div>

            <div className="card">
              <div style={{ fontSize: '3rem', color: '#a855f7', fontWeight: 'bold', marginBottom: '1rem' }}>02</div>
              <h3 className="text-xl text-white mb-4" style={{ fontWeight: 'bold' }}>AI Optimization</h3>
              <p className="text-gray">Our AI engine optimizes formatting, keywords, and content for maximum ATS compatibility.</p>
            </div>

            <div className="card">
              <div style={{ fontSize: '3rem', color: '#a855f7', fontWeight: 'bold', marginBottom: '1rem' }}>03</div>
              <h3 className="text-xl text-white mb-4" style={{ fontWeight: 'bold' }}>Download & Apply</h3>
              <p className="text-gray">Download your polished resume and tailored cover letter. Start applying with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" style={{ background: 'rgba(30, 41, 59, 0.3)' }}>
        <div className="container">
          <h2 className="text-4xl text-center mb-4 gradient-text" style={{ fontWeight: 'bold' }}>
            Simple, Transparent Pricing
          </h2>
          
          <p className="text-center text-gray mb-16 text-large" style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>
            Choose the plan that fits your career goals.
          </p>

          <div className="grid grid-3">
            <div className="card">
              <h3 className="text-2xl text-white mb-4" style={{ fontWeight: 'bold' }}>Free</h3>
              <div className="mb-6">
                <span className="text-4xl text-white" style={{ fontWeight: 'bold' }}>$0</span>
                <span className="text-gray" style={{ marginLeft: '0.5rem' }}>/Forever</span>
              </div>
              
              <button className="button-secondary" style={{ width: '100%', marginBottom: '2rem' }}>
                Get Started
              </button>
              
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="flex items-center text-gray" style={{ marginBottom: '1rem' }}>
                  <span style={{ color: '#10b981', marginRight: '0.75rem' }}>✓</span>
                  Basic resume optimization
                </li>
                <li className="flex items-center text-gray" style={{ marginBottom: '1rem' }}>
                  <span style={{ color: '#10b981', marginRight: '0.75rem' }}>✓</span>
                  ATS compatibility check
                </li>
              </ul>
            </div>

            <div className="card" style={{ 
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(30, 41, 59, 0.8))',
              border: '2px solid #a855f7',
              transform: 'scale(1.05)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#22d3ee',
                color: '#0f172a',
                padding: '0.25rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                Most Popular
              </div>
              
              <h3 className="text-2xl text-white mb-4" style={{ fontWeight: 'bold' }}>Pro</h3>
              <div className="mb-6">
                <span className="text-4xl text-white" style={{ fontWeight: 'bold' }}>$19</span>
                <span className="text-gray" style={{ marginLeft: '0.5rem' }}>/Month</span>
              </div>
              
              <button className="button-primary" style={{ width: '100%', marginBottom: '2rem', background: '#22d3ee', color: '#0f172a' }}>
                Get Started
              </button>
              
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="flex items-center text-gray" style={{ marginBottom: '1rem' }}>
                  <span style={{ color: '#10b981', marginRight: '0.75rem' }}>✓</span>
                  Everything in Free
                </li>
                <li className="flex items-center text-gray" style={{ marginBottom: '1rem' }}>
                  <span style={{ color: '#10b981', marginRight: '0.75rem' }}>✓</span>
                  Unlimited resumes
                </li>
                <li className="flex items-center text-gray" style={{ marginBottom: '1rem' }}>
                  <span style={{ color: '#10b981', marginRight: '0.75rem' }}>✓</span>
                  AI cover letter generation
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-2xl text-white mb-4" style={{ fontWeight: 'bold' }}>Premium</h3>
              <div className="mb-6">
                <span className="text-4xl text-white" style={{ fontWeight: 'bold' }}>$49</span>
                <span className="text-gray" style={{ marginLeft: '0.5rem' }}>/Month</span>
              </div>
              
              <button className="button-secondary" style={{ width: '100%', marginBottom: '2rem' }}>
                Get Started
              </button>
              
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="flex items-center text-gray" style={{ marginBottom: '1rem' }}>
                  <span style={{ color: '#10b981', marginRight: '0.75rem' }}>✓</span>
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray" style={{ marginBottom: '1rem' }}>
                  <span style={{ color: '#10b981', marginRight: '0.75rem' }}>✓</span>
                  Personal career coach
                </li>
                <li className="flex items-center text-gray" style={{ marginBottom: '1rem' }}>
                  <span style={{ color: '#10b981', marginRight: '0.75rem' }}>✓</span>
                  LinkedIn optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ 
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(34, 211, 238, 0.2))',
        borderTop: '1px solid #334155'
      }}>
        <div className="container text-center">
          <h2 className="text-4xl mb-4 gradient-text" style={{ fontWeight: 'bold' }}>
            Ready to Land Your Dream Job?
          </h2>
          
          <p className="text-large text-gray mb-8" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join thousands of professionals who've transformed their job search with ResizeMe. Start free today — no credit card required.
          </p>
          
          <button className="button-primary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
            Start Free
          </button>

          <p className="text-gray" style={{ fontSize: '0.875rem', marginTop: '1.5rem' }}>
            ✓ Takes 5 minutes • ✓ Free forever plan • ✓ Premium features included
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: '#020617',
        borderTop: '1px solid #334155',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <p className="text-gray" style={{ fontSize: '0.875rem' }}>© 2024 ResizeMe. All rights reserved.</p>
          <div className="flex gap-4 justify-center" style={{ marginTop: '1rem' }}>
            <a href="#" className="text-gray" style={{ textDecoration: 'none' }}>Twitter</a>
            <a href="#" className="text-gray" style={{ textDecoration: 'none' }}>LinkedIn</a>
            <a href="#" className="text-gray" style={{ textDecoration: 'none' }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
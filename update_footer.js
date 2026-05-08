const fs = require('fs');
const path = require('path');

const dir = __dirname;
const newFooter = `<!-- FOOTER -->
<footer class="site-footer">
  <div class="footer-top">
    <div class="footer-brand">
      <div class="logo" style="margin-bottom:8px">EXPRESSO<span style="color:var(--accent)">AI</span></div>
      <p>The Operating System for Human Behavioral Intelligence. Measure, train, and scale communication performance.</p>
      <div class="social-links">
        <a href="#" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
        <a href="#" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
      </div>
    </div>
    
    <div class="footer-links-group">
      <div class="footer-col">
        <h4>Product</h4>
        <a href="platform.html">Platform</a>
        <a href="simulations.html">Simulations</a>
        <a href="enterprise.html">Enterprise</a>
        <a href="api.html">Developer API</a>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <a href="faq.html">FAQ</a>
        <a href="index.html#contact">Contact Us</a>
      </div>
    </div>
  </div>
  
  <div class="footer-bottom">
    <div class="footer-copyright">© 2026 Expresso AI. All rights reserved.</div>
    <div class="status-badge">
      <span class="status-dot"></span> All systems operational
    </div>
  </div>
</footer>`;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the old footer
  content = content.replace(/<!-- FOOTER -->[\s\S]*?<\/footer>/g, newFooter);
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});

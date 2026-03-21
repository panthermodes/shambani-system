// Simple script to remove duplicate headers and sidebars from dashboards
const fs = require('fs');
const path = require('path');

const dashboards = [
  'BuyerDashboard.tsx',
  'LogisticsDashboard.tsx', 
  'MachineryDealerDashboard.tsx',
  'ExtensionOfficerDashboard.tsx',
  'CasualLabourerDashboard.tsx',
  'SuperAdminDashboard.tsx'
];

dashboards.forEach(file => {
  const filePath = path.join(__dirname, file);
  console.log(`Processing ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the complex return structure with simple content-only structure
  const returnStart = content.indexOf('return (');
  const returnEnd = content.lastIndexOf('  );');
  
  if (returnStart !== -1 && returnEnd !== -1) {
    const beforeReturn = content.substring(0, returnStart);
    const afterReturn = content.substring(returnEnd + 4);
    
    // Find the main content section
    const mainContentStart = content.indexOf('{activeSection === "overview" && (');
    const mainContentEnd = content.lastIndexOf('        </main>');
    
    if (mainContentStart !== -1 && mainContentEnd !== -1) {
      const mainContent = content.substring(mainContentStart, mainContentEnd + 14);
      
      const newReturn = `return (
    <div className="space-y-6">
      ${mainContent.replace(/        /g, '      ')}
    </div>
  );`;
      
      const newContent = beforeReturn + newReturn + afterReturn;
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Updated ${file}`);
    } else {
      console.log(`❌ Could not find main content in ${file}`);
    }
  } else {
    console.log(`❌ Could not find return statement in ${file}`);
  }
});

console.log('Done!');

#!/usr/bin/env node

/**
 * Clean CEO Dashboard Builder for Breathe Create Design
 *
 * This script creates a beautifully organized, functional CEO dashboard
 * to replace the current messy single-page setup.
 */

const NOTION_TOKEN = 'ntn_b7786913709bnb3l8za1vJvvPFD32gV34LzfGgLJhD4db0';
const NOTION_VERSION = '2022-06-28';
const DASHBOARD_PAGE_ID = '1c71d022-dfad-8034-8069-ee939013cfe7';

/**
 * Make a request to the Notion API
 */
async function notionRequest(endpoint, method = 'GET', body = null) {
  const url = `https://api.notion.com/v1${endpoint}`;

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Notion API Error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

/**
 * Append blocks to a page
 */
async function appendBlocks(pageId, blocks) {
  return await notionRequest(`/blocks/${pageId}/children`, 'PATCH', {
    children: blocks
  });
}

/**
 * Create a database
 */
async function createDatabase(parentPageId, title, properties, icon = null) {
  const body = {
    parent: { page_id: parentPageId },
    title: [{ text: { content: title } }],
    properties
  };

  if (icon) {
    body.icon = icon;
  }

  return await notionRequest('/databases', 'POST', body);
}

/**
 * Dashboard Header Content
 */
function createDashboardHeader() {
  return [
    {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: [{ text: { content: '🎯 Breathe Create Design - CEO Dashboard' } }],
        color: 'blue'
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            text: {
              content: 'Your calm, organized hub to run a smarter, more intentional business.'
            }
          }
        ],
        color: 'gray'
      }
    },
    {
      object: 'block',
      type: 'divider',
      divider: {}
    }
  ];
}

/**
 * Quick Stats Callout
 */
function createQuickStats() {
  return [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: '📊 Quick Overview' } }]
      }
    },
    {
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [
          { text: { content: '👥 Active Clients: ' }, annotations: { bold: true } },
          { text: { content: 'Track in Client Projects database below\n' } },
          { text: { content: '💰 This Month Revenue: ' }, annotations: { bold: true } },
          { text: { content: 'Auto-calculated from your projects\n' } },
          { text: { content: '✅ This Week\'s Tasks: ' }, annotations: { bold: true } },
          { text: { content: 'Manage in Tasks & Actions database' } }
        ],
        icon: { emoji: '📊' },
        color: 'blue_background'
      }
    },
    {
      object: 'block',
      type: 'divider',
      divider: {}
    }
  ];
}

/**
 * Client Projects Database
 */
const clientProjectsDB = {
  title: '👥 Client Projects',
  icon: { emoji: '👥' },
  properties: {
    'Client Name': { title: {} },
    'Package Type': {
      select: {
        options: [
          { name: 'Starter Site - $3,500', color: 'blue' },
          { name: 'Growth Site - $5,500', color: 'purple' },
          { name: 'Authority Site - $8,500+', color: 'pink' }
        ]
      }
    },
    'Status': {
      select: {
        options: [
          { name: 'Discovery', color: 'gray' },
          { name: 'Contract Pending', color: 'yellow' },
          { name: 'In Progress', color: 'blue' },
          { name: 'In Review', color: 'purple' },
          { name: 'Revisions', color: 'orange' },
          { name: 'Final Approval', color: 'pink' },
          { name: 'Completed', color: 'green' },
          { name: 'On Hold', color: 'red' }
        ]
      }
    },
    'Start Date': { date: {} },
    'Target Launch': { date: {} },
    'Project Value': { number: { format: 'dollar' } },
    'Payment Status': {
      select: {
        options: [
          { name: 'Not Paid', color: 'red' },
          { name: 'Deposit Paid', color: 'yellow' },
          { name: 'Paid in Full', color: 'green' },
          { name: 'Payment Plan', color: 'blue' }
        ]
      }
    },
    'Next Action': { rich_text: {} },
    'Client Email': { email: {} },
    'Moxie Link': { url: {} },
    'Notes': { rich_text: {} }
  }
};

/**
 * Tasks & Actions Database
 */
const tasksDB = {
  title: '✅ Tasks & Actions',
  icon: { emoji: '✅' },
  properties: {
    'Task': { title: {} },
    'Due Date': { date: {} },
    'Priority': {
      select: {
        options: [
          { name: 'Urgent', color: 'red' },
          { name: 'High', color: 'orange' },
          { name: 'Medium', color: 'yellow' },
          { name: 'Low', color: 'gray' }
        ]
      }
    },
    'Category': {
      select: {
        options: [
          { name: 'Client Work', color: 'blue' },
          { name: 'Business Admin', color: 'purple' },
          { name: 'Marketing', color: 'pink' },
          { name: 'Systems & Tools', color: 'green' }
        ]
      }
    },
    'Related To': { rich_text: {} },
    'Status': {
      select: {
        options: [
          { name: 'To Do', color: 'gray' },
          { name: 'In Progress', color: 'blue' },
          { name: 'Waiting', color: 'yellow' },
          { name: 'Done', color: 'green' }
        ]
      }
    },
    'Notes': { rich_text: {} }
  }
};

/**
 * Weekly Focus Database
 */
const weeklyFocusDB = {
  title: '📅 Weekly Focus',
  icon: { emoji: '📅' },
  properties: {
    'Week Of': { title: {} },
    'Top 3 Priorities': { rich_text: {} },
    'Client Deliverables': { rich_text: {} },
    'Business Tasks': { rich_text: {} },
    'Revenue Goal': { number: { format: 'dollar' } },
    'Actual Revenue': { number: { format: 'dollar' } },
    'Wins': { rich_text: {} },
    'Lessons': { rich_text: {} }
  }
};

/**
 * Revenue Tracker Database
 */
const revenueDB = {
  title: '💰 Revenue Tracker',
  icon: { emoji: '💰' },
  properties: {
    'Month': { title: {} },
    'Revenue': { number: { format: 'dollar' } },
    'Expenses': { number: { format: 'dollar' } },
    'Net Profit': { number: { format: 'dollar' } },
    'Number of Clients': { number: {} },
    'Average Project Value': { number: { format: 'dollar' } },
    'Notes': { rich_text: {} }
  }
};

/**
 * Create section divider
 */
function createSection(title, description, emoji) {
  return [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: `${emoji} ${title}` } }],
        color: 'blue'
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ text: { content: description } }],
        color: 'gray'
      }
    }
  ];
}

/**
 * Main Dashboard Builder
 */
async function main() {
  console.log('\n🚀 Building Your Clean CEO Dashboard...\n');
  console.log('='.repeat(60));
  console.log();

  try {
    // Step 1: Add header
    console.log('📝 Creating dashboard header...');
    const headerBlocks = createDashboardHeader();
    await appendBlocks(DASHBOARD_PAGE_ID, headerBlocks);
    console.log('   ✓ Header added');
    await delay(500);

    // Step 2: Add quick stats
    console.log('📊 Adding quick overview section...');
    const statsBlocks = createQuickStats();
    await appendBlocks(DASHBOARD_PAGE_ID, statsBlocks);
    console.log('   ✓ Quick stats added');
    await delay(500);

    // Step 3: Create Active Work section
    console.log('\n🎯 Creating ACTIVE WORK HUB...');
    const activeWorkSection = createSection(
      'ACTIVE WORK HUB',
      'Track all client projects and daily tasks in one organized place.',
      '🎯'
    );
    await appendBlocks(DASHBOARD_PAGE_ID, activeWorkSection);
    await delay(500);

    // Create Client Projects Database
    console.log('   Creating Client Projects database...');
    const clientDB = await createDatabase(
      DASHBOARD_PAGE_ID,
      clientProjectsDB.title,
      clientProjectsDB.properties,
      clientProjectsDB.icon
    );
    console.log(`   ✓ Client Projects database created (${clientDB.id})`);
    await delay(800);

    // Create Tasks Database
    console.log('   Creating Tasks & Actions database...');
    const tasksDatabase = await createDatabase(
      DASHBOARD_PAGE_ID,
      tasksDB.title,
      tasksDB.properties,
      tasksDB.icon
    );
    console.log(`   ✓ Tasks database created (${tasksDatabase.id})`);
    await delay(800);

    // Step 4: Create Business Operations section
    console.log('\n📋 Creating BUSINESS OPERATIONS section...');
    const opsSection = createSection(
      'BUSINESS OPERATIONS',
      'Your packages, contracts, templates, and processes.',
      '📋'
    );
    await appendBlocks(DASHBOARD_PAGE_ID, opsSection);

    const opsCallout = [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            { text: { content: 'Quick Access Links\n\n', styles: { bold: true } } },
            { text: { content: '📦 Package Pricing & Info\n' } },
            { text: { content: '📝 Contract Templates (by package)\n' } },
            { text: { content: '📋 Moxie Project Templates\n' } },
            { text: { content: '📧 Email Templates\n' } },
            { text: { content: '🔄 Client Onboarding Process\n' } },
            { text: { content: '👋 Client Offboarding Process\n' } }
          ],
          icon: { emoji: '🗂️' },
          color: 'gray_background'
        }
      }
    ];
    await appendBlocks(DASHBOARD_PAGE_ID, opsCallout);
    console.log('   ✓ Operations section added');
    await delay(500);

    // Step 5: Create Tracking section
    console.log('\n📈 Creating TRACKING & METRICS section...');
    const trackingSection = createSection(
      'TRACKING & METRICS',
      'Monitor your business performance and growth.',
      '📈'
    );
    await appendBlocks(DASHBOARD_PAGE_ID, trackingSection);
    await delay(500);

    // Create Weekly Focus Database
    console.log('   Creating Weekly Focus tracker...');
    const weeklyDB = await createDatabase(
      DASHBOARD_PAGE_ID,
      weeklyFocusDB.title,
      weeklyFocusDB.properties,
      weeklyFocusDB.icon
    );
    console.log(`   ✓ Weekly Focus tracker created (${weeklyDB.id})`);
    await delay(800);

    // Create Revenue Tracker
    console.log('   Creating Revenue Tracker...');
    const revDB = await createDatabase(
      DASHBOARD_PAGE_ID,
      revenueDB.title,
      revenueDB.properties,
      revenueDB.icon
    );
    console.log(`   ✓ Revenue Tracker created (${revDB.id})`);
    await delay(800);

    // Step 6: Create Resources section
    console.log('\n📚 Creating RESOURCES LIBRARY section...');
    const resourcesSection = createSection(
      'RESOURCES LIBRARY',
      'All your tools, guides, and reference materials organized.',
      '📚'
    );
    await appendBlocks(DASHBOARD_PAGE_ID, resourcesSection);

    const resourcesCallout = [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            { text: { content: 'Resource Categories\n\n', styles: { bold: true } } },
            { text: { content: '🎨 Design Resources (canvases, inspiration, assets)\n' } },
            { text: { content: '✍️ Content & Copy (prompts, captions, templates)\n' } },
            { text: { content: '🤖 AI Tools (ChatGPT prompts, God of Prompt)\n' } },
            { text: { content: '🎯 Brand Strategy (positioning, voice, messaging)\n' } },
            { text: { content: '🛠️ SEO & Technical (consolidated guide)\n' } },
            { text: { content: '📧 Email Marketing\n' } }
          ],
          icon: { emoji: '🗃️' },
          color: 'blue_background'
        }
      }
    ];
    await appendBlocks(DASHBOARD_PAGE_ID, resourcesCallout);
    console.log('   ✓ Resources section added');
    await delay(500);

    // Final summary
    console.log();
    console.log('='.repeat(60));
    console.log('✅ DASHBOARD BUILD COMPLETE!\n');
    console.log('📊 What was created:\n');
    console.log('   ✓ Clean dashboard header');
    console.log('   ✓ Quick overview section');
    console.log('   ✓ Client Projects database (track all clients)');
    console.log('   ✓ Tasks & Actions database (manage daily work)');
    console.log('   ✓ Weekly Focus tracker (plan your weeks)');
    console.log('   ✓ Revenue Tracker (monitor business performance)');
    console.log('   ✓ Business Operations hub');
    console.log('   ✓ Resources Library structure\n');
    console.log('🎯 NEXT STEPS:\n');
    console.log('   1. Open your Creative CEO Dashboard in Notion');
    console.log('   2. See your new clean structure at the top');
    console.log('   3. Start adding clients to the Client Projects database');
    console.log('   4. Add this week\'s tasks to the Tasks database');
    console.log('   5. Organize your existing content into the new sections');
    console.log('   6. Archive or delete the old messy content below\n');
    console.log('🎉 Your dashboard is now beautiful and functional!\n');

  } catch (error) {
    console.error();
    console.error('❌ Error:', error.message);
    console.error();
    console.error('💡 Troubleshooting:');
    console.error('   1. Verify your Notion integration token is correct');
    console.error('   2. Ensure "Claude Integration" is connected to the page');
    console.error('   3. Check that integration has all required capabilities');
    console.error();
    process.exit(1);
  }
}

/**
 * Delay helper to avoid rate limiting
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { notionRequest, createDatabase, appendBlocks };

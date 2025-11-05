#!/usr/bin/env node

/**
 * Comprehensive CEO Dashboard Creator for Notion
 *
 * This script enhances your existing Creative CEO Dashboard or creates
 * a beautiful, fully functional dashboard with all essential CEO tools.
 *
 * Run: node create-ceo-dashboard.js
 */

const NOTION_TOKEN = 'ntn_b7786913709bnb3l8za1vJvvPFD32gV34LzfGgLJhD4db0';
const NOTION_VERSION = '2022-06-28';
const DASHBOARD_PAGE_ID = '1c71d022-dfad-8034-8069-ee939013cfe7'; // Creative CEO Dashboard

// Color scheme for beautiful dashboard
const COLORS = {
  blue: 'blue',
  purple: 'purple',
  pink: 'pink',
  red: 'red',
  orange: 'orange',
  yellow: 'yellow',
  green: 'green',
  gray: 'gray'
};

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

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Notion API Error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

/**
 * Get page details
 */
async function getPage(pageId) {
  return await notionRequest(`/pages/${pageId}`);
}

/**
 * Get page content (blocks)
 */
async function getPageBlocks(pageId) {
  return await notionRequest(`/blocks/${pageId}/children`);
}

/**
 * Search for pages and databases
 */
async function searchNotion(query = '') {
  return await notionRequest('/search', 'POST', {
    query,
    page_size: 100
  });
}

/**
 * Create a new database
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
 * Append blocks to a page
 */
async function appendBlocks(pageId, blocks) {
  return await notionRequest(`/blocks/${pageId}/children`, 'PATCH', {
    children: blocks
  });
}

/**
 * CEO Dashboard Structure
 */
const dashboardComponents = {
  // Key Metrics Database
  keyMetrics: {
    title: '📊 Key Business Metrics',
    icon: { emoji: '📊' },
    properties: {
      'Metric': { title: {} },
      'Current Value': { rich_text: {} },
      'Target': { rich_text: {} },
      'Status': {
        select: {
          options: [
            { name: 'On Track', color: 'green' },
            { name: 'At Risk', color: 'yellow' },
            { name: 'Behind', color: 'red' },
            { name: 'Exceeded', color: 'blue' }
          ]
        }
      },
      'Last Updated': { date: {} },
      'Quarter': {
        select: {
          options: [
            { name: 'Q1 2025', color: 'blue' },
            { name: 'Q2 2025', color: 'purple' },
            { name: 'Q3 2025', color: 'pink' },
            { name: 'Q4 2025', color: 'orange' }
          ]
        }
      }
    }
  },

  // Strategic Goals Database
  strategicGoals: {
    title: '🎯 Strategic Goals & OKRs',
    icon: { emoji: '🎯' },
    properties: {
      'Goal': { title: {} },
      'Category': {
        select: {
          options: [
            { name: 'Revenue', color: 'green' },
            { name: 'Growth', color: 'blue' },
            { name: 'Operations', color: 'purple' },
            { name: 'Team', color: 'pink' },
            { name: 'Product', color: 'orange' }
          ]
        }
      },
      'Priority': {
        select: {
          options: [
            { name: 'Critical', color: 'red' },
            { name: 'High', color: 'orange' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'gray' }
          ]
        }
      },
      'Progress': { number: { format: 'percent' } },
      'Owner': { rich_text: {} },
      'Due Date': { date: {} },
      'Status': {
        status: {
          options: [
            { name: 'Not Started', color: 'gray' },
            { name: 'In Progress', color: 'blue' },
            { name: 'Blocked', color: 'red' },
            { name: 'Completed', color: 'green' }
          ]
        }
      }
    }
  },

  // Team Management Database
  team: {
    title: '👥 Team & Leadership',
    icon: { emoji: '👥' },
    properties: {
      'Name': { title: {} },
      'Role': { rich_text: {} },
      'Department': {
        select: {
          options: [
            { name: 'Leadership', color: 'purple' },
            { name: 'Creative', color: 'pink' },
            { name: 'Operations', color: 'blue' },
            { name: 'Marketing', color: 'orange' },
            { name: 'Finance', color: 'green' }
          ]
        }
      },
      'Email': { email: {} },
      'Start Date': { date: {} },
      'Performance': {
        select: {
          options: [
            { name: 'Exceptional', color: 'blue' },
            { name: 'Exceeds', color: 'green' },
            { name: 'Meets', color: 'yellow' },
            { name: 'Needs Improvement', color: 'red' }
          ]
        }
      }
    }
  },

  // Project Tracker Database
  projects: {
    title: '🚀 Active Projects',
    icon: { emoji: '🚀' },
    properties: {
      'Project Name': { title: {} },
      'Description': { rich_text: {} },
      'Status': {
        status: {
          options: [
            { name: 'Planning', color: 'gray' },
            { name: 'Active', color: 'blue' },
            { name: 'On Hold', color: 'yellow' },
            { name: 'Completed', color: 'green' },
            { name: 'Cancelled', color: 'red' }
          ]
        }
      },
      'Priority': {
        select: {
          options: [
            { name: 'Critical', color: 'red' },
            { name: 'High', color: 'orange' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'gray' }
          ]
        }
      },
      'Budget': { number: { format: 'dollar' } },
      'Start Date': { date: {} },
      'End Date': { date: {} },
      'Team Lead': { rich_text: {} },
      'Progress': { number: { format: 'percent' } }
    }
  },

  // Financial Overview Database
  financials: {
    title: '💰 Financial Overview',
    icon: { emoji: '💰' },
    properties: {
      'Item': { title: {} },
      'Category': {
        select: {
          options: [
            { name: 'Revenue', color: 'green' },
            { name: 'Expenses', color: 'red' },
            { name: 'Investment', color: 'blue' },
            { name: 'Profit', color: 'purple' }
          ]
        }
      },
      'Amount': { number: { format: 'dollar' } },
      'Month': {
        select: {
          options: [
            { name: 'January', color: 'blue' },
            { name: 'February', color: 'blue' },
            { name: 'March', color: 'green' },
            { name: 'April', color: 'green' },
            { name: 'May', color: 'green' },
            { name: 'June', color: 'yellow' },
            { name: 'July', color: 'yellow' },
            { name: 'August', color: 'yellow' },
            { name: 'September', color: 'orange' },
            { name: 'October', color: 'orange' },
            { name: 'November', color: 'red' },
            { name: 'December', color: 'red' }
          ]
        }
      },
      'Year': { rich_text: {} },
      'Notes': { rich_text: {} }
    }
  },

  // Client/Customer Database
  clients: {
    title: '🤝 Clients & Partnerships',
    icon: { emoji: '🤝' },
    properties: {
      'Client Name': { title: {} },
      'Industry': { rich_text: {} },
      'Status': {
        select: {
          options: [
            { name: 'Active', color: 'green' },
            { name: 'Prospect', color: 'blue' },
            { name: 'On Hold', color: 'yellow' },
            { name: 'Former', color: 'gray' }
          ]
        }
      },
      'Contract Value': { number: { format: 'dollar' } },
      'Start Date': { date: {} },
      'Contact': { email: {} },
      'Satisfaction': {
        select: {
          options: [
            { name: 'Very Satisfied', color: 'green' },
            { name: 'Satisfied', color: 'blue' },
            { name: 'Neutral', color: 'yellow' },
            { name: 'Needs Attention', color: 'red' }
          ]
        }
      }
    }
  },

  // Meeting Notes Database
  meetings: {
    title: '📅 Meeting Notes & Decisions',
    icon: { emoji: '📅' },
    properties: {
      'Meeting Title': { title: {} },
      'Date': { date: {} },
      'Type': {
        select: {
          options: [
            { name: 'Leadership', color: 'purple' },
            { name: 'Team Sync', color: 'blue' },
            { name: 'Client Meeting', color: 'green' },
            { name: 'Strategy Session', color: 'pink' },
            { name: 'One-on-One', color: 'yellow' }
          ]
        }
      },
      'Attendees': { rich_text: {} },
      'Action Items': { rich_text: {} },
      'Follow-up Required': { checkbox: {} }
    }
  }
};

/**
 * Create intro content blocks
 */
function createIntroBlocks() {
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
              content: 'Welcome to your comprehensive CEO command center. This dashboard provides real-time insights into your business operations, strategic goals, and key metrics.'
            }
          }
        ]
      }
    },
    {
      object: 'block',
      type: 'divider',
      divider: {}
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: '📊 Quick Overview' } }],
        color: 'purple'
      }
    },
    {
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [
          {
            text: {
              content: 'Use this dashboard to track business performance, manage strategic initiatives, oversee team operations, and make data-driven decisions.'
            }
          }
        ],
        icon: { emoji: '💡' },
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
 * Main function to create the dashboard
 */
async function main() {
  console.log('🚀 Breathe Create Design - CEO Dashboard Setup');
  console.log('='.repeat(60));
  console.log();

  try {
    // Step 1: Test connection
    console.log('📡 Testing connection to Notion...');
    const page = await getPage(DASHBOARD_PAGE_ID);
    const pageTitle = page.properties?.title?.title?.[0]?.plain_text ||
                      page.properties?.Name?.title?.[0]?.plain_text ||
                      'Creative CEO Dashboard';

    console.log(`✅ Successfully connected!`);
    console.log(`📄 Found page: "${pageTitle}"`);
    console.log();

    // Step 2: Get current content
    console.log('📖 Reading current dashboard structure...');
    const blocks = await getPageBlocks(DASHBOARD_PAGE_ID);
    console.log(`   Found ${blocks.results.length} existing blocks`);
    console.log();

    // Step 3: Add intro content
    console.log('✨ Adding dashboard introduction...');
    const introBlocks = createIntroBlocks();
    await appendBlocks(DASHBOARD_PAGE_ID, introBlocks);
    console.log('   ✓ Introduction added');
    console.log();

    // Step 4: Create databases
    console.log('🗄️  Creating comprehensive databases...');
    const databases = {};

    for (const [key, config] of Object.entries(dashboardComponents)) {
      try {
        console.log(`   Creating: ${config.title}`);
        const db = await createDatabase(
          DASHBOARD_PAGE_ID,
          config.title,
          config.properties,
          config.icon
        );
        databases[key] = db;
        console.log(`   ✓ ${config.title} created (ID: ${db.id})`);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.log(`   ⚠️  Could not create ${config.title}: ${error.message}`);
      }
    }

    console.log();
    console.log('='.repeat(60));
    console.log('✅ Dashboard setup complete!');
    console.log();
    console.log('📊 Databases created:');
    Object.keys(databases).forEach(key => {
      console.log(`   • ${dashboardComponents[key].title}`);
    });
    console.log();
    console.log('🎉 Your Creative CEO Dashboard has been enhanced!');
    console.log('   Visit Notion to start using your new dashboard.');
    console.log();

  } catch (error) {
    console.error();
    console.error('❌ Error:', error.message);
    console.error();
    console.error('💡 Troubleshooting:');
    console.error('   1. Verify your Notion integration token is correct');
    console.error('   2. Ensure the page is shared with your "Claude Integration"');
    console.error('   3. Check that your integration has the required permissions:');
    console.error('      - Read content');
    console.error('      - Update content');
    console.error('      - Insert content');
    console.error('   4. Verify the page ID is correct');
    console.error();
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { notionRequest, createDatabase, appendBlocks };

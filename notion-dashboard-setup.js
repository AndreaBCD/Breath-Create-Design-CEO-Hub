#!/usr/bin/env node

/**
 * Notion CEO Dashboard Setup Script
 * This script creates a comprehensive CEO dashboard in your Notion workspace
 */

const NOTION_TOKEN = 'ntn_T778691370989ALDZBMgmaLdKm9PXPmOviF0WLyEBgCfog';
const NOTION_VERSION = '2022-06-28';

// First, let's test the connection and list available databases
async function testConnection() {
  const response = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: {
        property: 'object',
        value: 'database'
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('\n✅ Successfully connected to Notion!');
  console.log(`\n📊 Found ${data.results.length} databases in your workspace:\n`);

  data.results.forEach((db, index) => {
    const title = db.title?.[0]?.plain_text || 'Untitled';
    console.log(`${index + 1}. ${title} (ID: ${db.id})`);
  });

  return data.results;
}

// Create a new page in a specified parent (page or database)
async function createPage(parentId, title, content) {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      parent: { page_id: parentId },
      properties: {
        title: {
          title: [{ text: { content: title } }]
        }
      },
      children: content
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create page: ${response.status} - ${error}`);
  }

  return await response.json();
}

// List all pages (not just databases)
async function listAllPages() {
  const response = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 100
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list pages: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log(`\n📄 Found ${data.results.length} pages in your workspace:\n`);

  data.results.forEach((page, index) => {
    const title = page.properties?.title?.title?.[0]?.plain_text ||
                  page.properties?.Name?.title?.[0]?.plain_text ||
                  'Untitled';
    console.log(`${index + 1}. ${title} (ID: ${page.id})`);
  });

  return data.results;
}

// Main execution
async function main() {
  try {
    console.log('🚀 Breath Create Design - CEO Hub Setup\n');
    console.log('=' .repeat(50));

    // Test connection
    const databases = await testConnection();

    // List all pages
    const pages = await listAllPages();

    console.log('\n' + '='.repeat(50));
    console.log('\n📋 Next Steps:');
    console.log('1. Choose a page where you want to create the CEO Dashboard');
    console.log('2. Share that page with your integration (if not already shared)');
    console.log('3. Run this script with the page ID as an argument\n');
    console.log('Example: node notion-dashboard-setup.js <page-id>\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Verify your Notion integration token is correct');
    console.log('2. Make sure you\'ve shared at least one page with your integration');
    console.log('3. Check that your integration has the correct permissions\n');
  }
}

// Run the script
main();

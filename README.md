# Using the Onsite Tracking Workflows

This guide explains how to use the GitHub Actions workflows to track your onsite days and vacation days.

## Setting Up the Workflows

1. Create a `.github/workflows` directory in your repository
2. Add the two workflow files:
   - `record-onsite.yml`
   - `record-vacation.yml`

## Recording an Onsite Day

There are two ways to record that you went into the office:

### Option 1: Using the GitHub UI

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select the "Record Onsite Day" workflow
4. Click the "Run workflow" button
5. Optional: Enter a specific date (YYYY-MM-DD format) or leave blank for today
6. Optional: Add notes about this onsite day
7. Click "Run workflow"

### Option 2: Using the GitHub CLI

```bash
gh workflow run "Record Onsite Day" -f date="2025-02-21" -f notes="Team meeting day"
```

## Recording a Vacation Day

Similarly, to record a vacation day:

### Option 1: Using the GitHub UI

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select the "Record Vacation Day" workflow
4. Click the "Run workflow" button
5. Optional: Enter a specific date (YYYY-MM-DD format) or leave blank for today
6. Optional: Add notes about this vacation day
7. Click "Run workflow"

### Option 2: Using the GitHub CLI

```bash
gh workflow run "Record Vacation Day" -f date="2025-03-15" -f notes="Spring break"
```

## What the Workflows Do

### Record Onsite Day

When you run this workflow:

1. It increments the badge count for the specified month
2. Updates the completion percentage 
3. Adds an entry to the logs with the date and any notes
4. Commits the changes to your repository
5. Rebuilds and redeploys your site

The workflow won't increment the count if you've already reached your required onsite days for the month.

### Record Vacation Day

When you run this workflow:

1. It increments the off days count for the specified month
2. Adds an entry to the logs with the date and any notes
3. Commits the changes to your repository
4. Rebuilds and redeploys your site

## Viewing Your Records

After running either workflow:

1. Your GitHub Pages site will be updated automatically
2. The changes will appear in the dashboard
3. The logs will show your attendance history
4. The stats will reflect the current status

## Advanced Usage

### Adding Multiple Days at Once

If you need to add multiple days at once, simply run the workflow multiple times with different dates.

### Automating Regular Updates

You can also set up additional workflows with schedules if you have regular office days:

```yaml
on:
  schedule:
    # Every Tuesday and Thursday at 9 AM UTC
    - cron: '0 9 * * 2,4'
```

## Troubleshooting

If the workflow fails:

- Check that the date format is correct (YYYY-MM-DD)
- Verify that the data file path is correct in the script
- Check the workflow run logs for specific error messages
  
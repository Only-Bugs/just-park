#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Configuration
const CODE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte"];
const SKIP_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  "coverage",
  ".vscode",
  ".idea",
];
const IMPORTANT_FILES = [
  "package.json",
  "index.html",
  "readme.md",
  ".env",
  ".gitignore",
  "dockerfile",
  "makefile",
];

class CodeCleaner {
  constructor(targetDir, options = {}) {
    this.targetDir = path.resolve(targetDir);
    this.options = {
      removeComments: true,
      removeConsole: true,
      deleteEmpty: true,
      dryRun: false,
      ...options,
    };
    this.stats = {
      filesProcessed: 0,
      filesModified: 0,
      dirsDeleted: 0,
      commentsRemoved: 0,
      consolesRemoved: 0,
    };
  }

  cleanCodeContent(content) {
    let cleanedContent = content;
    let commentsRemoved = 0;
    let consolesRemoved = 0;

    if (this.options.removeComments) {
      // Count comments before removal
      const singleLineComments = (content.match(/\/\/.*$/gm) || []).length;
      const multiLineComments = (content.match(/\/\*[\s\S]*?\*\//g) || [])
        .length;
      commentsRemoved = singleLineComments + multiLineComments;

      // Remove single-line comments (// ...)
      cleanedContent = cleanedContent.replace(/\/\/.*$/gm, "");

      // Remove multi-line comments (/* ... */)
      cleanedContent = cleanedContent.replace(/\/\*[\s\S]*?\*\//g, "");
    }

    if (this.options.removeConsole) {
      // Count console statements before removal
      const consoleMatches = cleanedContent.match(
        /console\.(log|warn|error|info|debug|trace|dir|table|time|timeEnd|group|groupEnd|clear|count|countReset|assert)\s*\([^)]*\)\s*;?/g
      );
      consolesRemoved = consoleMatches ? consoleMatches.length : 0;

      // Remove console statements
      cleanedContent = cleanedContent.replace(
        /console\.(log|warn|error|info|debug|trace|dir|table|time|timeEnd|group|groupEnd|clear|count|countReset|assert)\s*\([^)]*\)\s*;?/g,
        ""
      );
    }

    // Clean up empty lines and trailing whitespace
    cleanedContent = cleanedContent.replace(/^\s*[\r\n]/gm, "");
    cleanedContent = cleanedContent.replace(/[ \t]+$/gm, "");

    this.stats.commentsRemoved += commentsRemoved;
    this.stats.consolesRemoved += consolesRemoved;

    return cleanedContent;
  }

  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const cleanedContent = this.cleanCodeContent(content);

      this.stats.filesProcessed++;

      if (content !== cleanedContent) {
        if (!this.options.dryRun) {
          fs.writeFileSync(filePath, cleanedContent, "utf8");
        }
        this.stats.filesModified++;
        console.log(`📝 Cleaned: ${path.relative(this.targetDir, filePath)}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  hasAnyExports(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");

      const exportPatterns = [
        /export\s+(?:default\s+)?/,
        /module\.exports\s*=/,
        /exports\./,
        /export\s*{/,
        /export\s*\*/,
        /class\s+\w+/,
        /function\s+\w+/,
        /const\s+\w+\s*=/,
        /let\s+\w+\s*=/,
        /var\s+\w+\s*=/,
      ];

      return exportPatterns.some((pattern) => pattern.test(content));
    } catch (error) {
      return false;
    }
  }

  isEmpty(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);

      const meaningfulItems = items.filter((item) => {
        if (
          item.startsWith(".") &&
          !IMPORTANT_FILES.includes(item.toLowerCase())
        ) {
          return false;
        }

        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          return !this.isEmpty(fullPath);
        } else {
          return !item.endsWith(".tmp") && !item.endsWith(".log");
        }
      });

      return meaningfulItems.length === 0;
    } catch (error) {
      return false;
    }
  }

  isDirectoryUseful(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isFile()) {
          // Check for important files
          if (IMPORTANT_FILES.includes(item.toLowerCase())) {
            return true;
          }

          // Check code files for exports
          const ext = path.extname(fullPath).toLowerCase();
          if (CODE_EXTENSIONS.includes(ext)) {
            if (this.hasAnyExports(fullPath)) {
              return true;
            }
          }

          // Check for other meaningful files
          if (
            stat.size > 0 &&
            !item.startsWith(".") &&
            !item.endsWith(".tmp")
          ) {
            return true;
          }
        } else if (stat.isDirectory() && !SKIP_DIRS.includes(item)) {
          if (this.isDirectoryUseful(fullPath)) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      return true; // Conservative approach
    }
  }

  processDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);

      // Process files first
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isFile()) {
          const ext = path.extname(fullPath).toLowerCase();
          if (CODE_EXTENSIONS.includes(ext)) {
            this.processFile(fullPath);
          }
        } else if (stat.isDirectory() && !SKIP_DIRS.includes(item)) {
          this.processDirectory(fullPath);
        }
      }

      // Then check if we should delete empty directories
      if (this.options.deleteEmpty) {
        this.checkAndDeleteEmpty(dirPath);
      }
    } catch (error) {
      console.error(`❌ Error processing directory ${dirPath}:`, error.message);
    }
  }

  checkAndDeleteEmpty(dirPath) {
    try {
      // Skip root directory
      if (dirPath === this.targetDir) {
        return;
      }

      const items = fs.readdirSync(dirPath);

      // Process subdirectories first
      for (const item of items) {
        const fullPath = path.join(dirPath, item);

        if (fs.statSync(fullPath).isDirectory() && !SKIP_DIRS.includes(item)) {
          this.checkAndDeleteEmpty(fullPath);
        }
      }

      // Check if directory should be deleted
      if (this.isEmpty(dirPath) || !this.isDirectoryUseful(dirPath)) {
        console.log(
          `🗑️  Deleting empty directory: ${path.relative(
            this.targetDir,
            dirPath
          )}`
        );
        if (!this.options.dryRun) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
        this.stats.dirsDeleted++;
      }
    } catch (error) {
      console.error(`❌ Error checking directory ${dirPath}:`, error.message);
    }
  }

  run() {
    console.log(`\n🧹 Starting code cleanup in: ${this.targetDir}`);
    console.log(
      `📋 Options: Comments: ${this.options.removeComments}, Console: ${this.options.removeConsole}, Empty dirs: ${this.options.deleteEmpty}`
    );
    console.log(
      `${
        this.options.dryRun ? "🔍 DRY RUN MODE - No files will be modified" : ""
      }\n`
    );

    if (!fs.existsSync(this.targetDir)) {
      console.error(`❌ Directory does not exist: ${this.targetDir}`);
      return;
    }

    this.processDirectory(this.targetDir);

    // Print summary
    console.log("\n📊 Cleanup Summary:");
    console.log(`   Files processed: ${this.stats.filesProcessed}`);
    console.log(`   Files modified: ${this.stats.filesModified}`);
    console.log(`   Comments removed: ${this.stats.commentsRemoved}`);
    console.log(`   Console logs removed: ${this.stats.consolesRemoved}`);
    console.log(`   Directories deleted: ${this.stats.dirsDeleted}`);
    console.log("\n✅ Cleanup complete!");
  }
}

// CLI handling
function showHelp() {
  console.log(`
🧹 Code Cleanup Tool

Usage: node cleanup.js [directory] [options]

Options:
  --no-comments     Don't remove comments
  --no-console      Don't remove console statements  
  --no-delete       Don't delete empty directories
  --dry-run         Show what would be done without making changes
  --help            Show this help message

Examples:
  node cleanup.js                    # Clean current directory
  node cleanup.js ./src              # Clean src directory
  node cleanup.js . --dry-run        # Preview changes
  node cleanup.js . --no-delete      # Only clean code, don't delete dirs
`);
}

// Parse command line arguments
const args = process.argv.slice(2);
let targetDir = ".";
const options = {
  removeComments: true,
  removeConsole: true,
  deleteEmpty: true,
  dryRun: false,
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === "--help") {
    showHelp();
    process.exit(0);
  } else if (arg === "--no-comments") {
    options.removeComments = false;
  } else if (arg === "--no-console") {
    options.removeConsole = false;
  } else if (arg === "--no-delete") {
    options.deleteEmpty = false;
  } else if (arg === "--dry-run") {
    options.dryRun = true;
  } else if (!arg.startsWith("--")) {
    targetDir = arg;
  }
}

// Run the cleaner
const cleaner = new CodeCleaner(targetDir, options);
cleaner.run();

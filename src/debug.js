// debug.js - Script untuk mencari route yang bermasalah
const fs = require('fs');
const path = require('path');

console.log("🔍 Starting route debugging...");

// Function to scan files for problematic route patterns
function scanFileForRoutes(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const problematicPatterns = [];
        
        lines.forEach((line, index) => {
            // Check for problematic route patterns
            const routePattern = /\.(get|post|put|delete|patch)\s*\(\s*["'`]([^"'`]+)["'`]/g;
            let match;
            
            while ((match = routePattern.exec(line)) !== null) {
                const route = match[2];
                const lineNumber = index + 1;
                
                // Check for problematic patterns
                if (route.includes(':') && (
                    route.includes('(') ||  // Parameter with regex
                    route.includes('[') ||  // Parameter with character class
                    route.includes('*') ||  // Wildcard issues
                    route.includes('+') ||  // Plus issues
                    route.includes('?') ||  // Question mark issues
                    route.match(/:[^\/\s]*[^a-zA-Z0-9_-]/) // Invalid parameter characters
                )) {
                    problematicPatterns.push({
                        file: filePath,
                        line: lineNumber,
                        route: route,
                        method: match[1],
                        content: line.trim()
                    });
                }
            }
        });
        
        return problematicPatterns;
    } catch (error) {
        console.error(`❌ Error scanning ${filePath}:`, error.message);
        return [];
    }
}

// Function to scan directory recursively
function scanDirectory(dir) {
    const results = [];
    
    try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                results.push(...scanDirectory(filePath));
            } else if (file.endsWith('.js')) {
                results.push(...scanFileForRoutes(filePath));
            }
        });
    } catch (error) {
        console.error(`❌ Error scanning directory ${dir}:`, error.message);
    }
    
    return results;
}

// Scan current project
console.log("📁 Scanning project files for problematic routes...");

const projectRoot = process.cwd();
const problematicRoutes = scanDirectory(projectRoot);

if (problematicRoutes.length > 0) {
    console.log("🚨 Found problematic route patterns:");
    console.log("=".repeat(50));
    
    problematicRoutes.forEach((issue, index) => {
        console.log(`\n${index + 1}. File: ${issue.file}`);
        console.log(`   Line: ${issue.line}`);
        console.log(`   Method: ${issue.method.toUpperCase()}`);
        console.log(`   Route: ${issue.route}`);
        console.log(`   Code: ${issue.content}`);
        console.log(`   Issue: Route parameter contains invalid characters or regex`);
    });
    
    console.log("\n💡 Suggestions:");
    console.log("1. Replace complex route patterns with simple ones:");
    console.log("   ❌ app.get('/users/:id([0-9]+)', handler)");
    console.log("   ✅ app.get('/users/:id', handler)");
    console.log("\n2. Validate parameters in the handler instead:");
    console.log("   if (!/^\\d+$/.test(req.params.id)) return res.status(400)...");
    
} else {
    console.log("✅ No obvious route pattern issues found.");
    console.log("\n🔍 Other possible causes:");
    console.log("1. Check for undefined middleware functions");
    console.log("2. Check for corrupt node_modules");
    console.log("3. Check for version conflicts");
}

// Check for common issues
console.log("\n🔧 Checking for other common issues...");

// Check package.json for version conflicts
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Check Express version
    if (dependencies.express) {
        console.log(`📦 Express version: ${dependencies.express}`);
    }
    
    // Check for path-to-regexp version
    if (dependencies['path-to-regexp']) {
        console.log(`📦 path-to-regexp version: ${dependencies['path-to-regexp']}`);
    }
    
} catch (error) {
    console.log("⚠️ Could not read package.json");
}

// Check for main entry point
console.log("\n📝 Checking main entry points...");
const mainFiles = ['app.js', 'index.js', 'server.js', 'src/app.js', 'src/index.js'];

mainFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ Found: ${file}`);
        
        // Quick scan for app.use statements
        try {
            const content = fs.readFileSync(file, 'utf8');
            const appUseLines = content.split('\n').filter(line => 
                line.includes('app.use') && line.includes('/')
            );
            
            if (appUseLines.length > 0) {
                console.log(`   Routes found in ${file}:`);
                appUseLines.forEach(line => {
                    console.log(`   - ${line.trim()}`);
                });
            }
        } catch (error) {
            console.log(`   ❌ Error reading ${file}`);
        }
    }
});

console.log("\n🎯 Quick fixes to try:");
console.log("1. Replace authRouter.js with emergency version");
console.log("2. Use emergency app.js");
console.log("3. Clear node_modules: rm -rf node_modules package-lock.json && npm install");
console.log("4. Try different Express version: npm install express@4.18.2");

console.log("\n✅ Debug scan complete!");
// DOM Elements
const equationInput = document.getElementById('equationInput');
const solveBtn = document.getElementById('solveBtn');
const graphBtn = document.getElementById('graphBtn');
const simplifyBtn = document.getElementById('simplifyBtn');
const factorBtn = document.getElementById('factorBtn');
const clearInput = document.getElementById('clearInput');
const historyBtn = document.getElementById('historyBtn');
const clearHistory = document.getElementById('clearHistory');
const closeHistory = document.getElementById('closeHistory');
const copyResult = document.getElementById('copyResult');
const exportBtn = document.getElementById('exportBtn');
const plotGraph = document.getElementById('plotGraph');
const clearGraph = document.getElementById('clearGraph');
const themeToggle = document.getElementById('themeToggle');
const helpBtn = document.getElementById('helpBtn');
const closeHelp = document.getElementById('closeHelp');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const resetView = document.getElementById('resetView');
const loadingOverlay = document.getElementById('loadingOverlay');
const helpModal = document.getElementById('helpModal');
const resultsContent = document.getElementById('resultsContent');
const graphContainer = document.getElementById('graphContainer');
const historyList = document.getElementById('historyList');
const historyPanel = document.getElementById('historyPanel');
const showHelp = document.getElementById('showHelp');

// Graph range elements
const xMinInput = document.getElementById('xMin');
const xMaxInput = document.getElementById('xMax');
const yMinInput = document.getElementById('yMin');
const yMaxInput = document.getElementById('yMax');
const xRangeSlider = document.getElementById('xRange');
const yRangeSlider = document.getElementById('yRange');

// Variables - History stored in memory (session only)
let equationHistory = [];
let graphData = [];
let currentVariable = 'x';
let isDarkMode = false;
let historyIdCounter = 1;

// Initialize the calculator
function initCalculator() {
    // Set default example - trigonometric function
    equationInput.value = 'sin(x)';
    
    // Add event listeners
    setupEventListeners();
    
    // Initialize graph
    initGraph();
    
    // Set up variable buttons
    setupVariableButtons();
    
    // Set up math keyboard
    setupMathKeyboard();
    
    // Set up example buttons
    setupExampleButtons();
    
    // Update history display
    updateHistoryDisplay();
    
    // Load theme preference
    loadThemePreference();
    
    // Plot initial example
    setTimeout(() => {
        plotEquation();
    }, 500);
}

// Setup all event listeners
function setupEventListeners() {
    // Main action buttons
    solveBtn.addEventListener('click', solveEquation);
    graphBtn.addEventListener('click', plotEquation);
    simplifyBtn.addEventListener('click', simplifyExpression);
    factorBtn.addEventListener('click', factorExpression);
    
    // Input controls
    clearInput.addEventListener('click', () => {
        equationInput.value = '';
        equationInput.focus();
        showMessage('Input cleared', 'info');
    });
    
    // History controls
    historyBtn.addEventListener('click', () => {
        historyPanel.classList.toggle('hidden');
    });
    
    closeHistory.addEventListener('click', () => {
        historyPanel.classList.add('hidden');
    });
    
    clearHistory.addEventListener('click', clearHistoryList);
    
    // Result controls
    copyResult.addEventListener('click', copyResults);
    exportBtn.addEventListener('click', exportResults);
    
    // Graph controls
    plotGraph.addEventListener('click', plotEquation);
    clearGraph.addEventListener('click', clearGraphData);
    zoomIn.addEventListener('click', () => zoomGraph(0.8));
    zoomOut.addEventListener('click', () => zoomGraph(1.2));
    resetView.addEventListener('click', resetGraphView);
    
    // Theme and help
    themeToggle.addEventListener('click', toggleTheme);
    helpBtn.addEventListener('click', () => showModal(helpModal));
    closeHelp.addEventListener('click', () => hideModal(helpModal));
    showHelp.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(helpModal);
    });
    
    // Range inputs synchronization
    setupRangeInputs();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            hideModal(e.target);
        }
    });
}

// Setup range inputs synchronization
function setupRangeInputs() {
    // X range inputs
    xMinInput.addEventListener('change', () => {
        const min = parseFloat(xMinInput.value) || -10;
        const max = parseFloat(xMaxInput.value) || 10;
        xRangeSlider.value = Math.abs(min);
        updateGraphDisplay();
    });
    
    xMaxInput.addEventListener('change', () => {
        const min = parseFloat(xMinInput.value) || -10;
        const max = parseFloat(xMaxInput.value) || 10;
        xRangeSlider.value = Math.abs(max);
        updateGraphDisplay();
    });
    
    xRangeSlider.addEventListener('input', () => {
        const range = parseFloat(xRangeSlider.value);
        xMinInput.value = -range;
        xMaxInput.value = range;
        updateGraphDisplay();
    });
    
    // Y range inputs
    yMinInput.addEventListener('change', () => {
        const min = parseFloat(yMinInput.value) || -5;
        const max = parseFloat(yMaxInput.value) || 5;
        yRangeSlider.value = Math.abs(min);
        updateGraphDisplay();
    });
    
    yMaxInput.addEventListener('change', () => {
        const min = parseFloat(yMinInput.value) || -5;
        const max = parseFloat(yMaxInput.value) || 5;
        yRangeSlider.value = Math.abs(max);
        updateGraphDisplay();
    });
    
    yRangeSlider.addEventListener('input', () => {
        const range = parseFloat(yRangeSlider.value);
        yMinInput.value = -range;
        yMaxInput.value = range;
        updateGraphDisplay();
    });
}

// Keyboard shortcuts handler
function handleKeyboardShortcuts(e) {
    // Ctrl+H to toggle history
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        historyPanel.classList.toggle('hidden');
    }
    
    // Ctrl+C to copy result
    if (e.ctrlKey && e.key === 'c') {
        const activeElement = document.activeElement;
        if (activeElement !== equationInput) {
            e.preventDefault();
            copyResults();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
            hideModal(helpModal);
        }
        if (!historyPanel.classList.contains('hidden')) {
            historyPanel.classList.add('hidden');
        }
    }
    
    // Enter to solve equation when input is focused
    if (e.key === 'Enter' && document.activeElement === equationInput) {
        e.preventDefault();
        solveEquation();
    }
}

// Setup variable buttons
function setupVariableButtons() {
    document.querySelectorAll('.var-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.var-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentVariable = btn.dataset.var;
            showMessage(`Solving for variable: ${currentVariable}`, 'info');
        });
    });
}

// Setup math keyboard
function setupMathKeyboard() {
    document.querySelectorAll('.math-key').forEach(key => {
        key.addEventListener('click', () => {
            const value = key.dataset.value;
            insertAtCursor(value);
        });
    });
}

// Setup example buttons
function setupExampleButtons() {
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const example = btn.dataset.example;
            equationInput.value = example;
            
            // Auto-select variable based on example
            if (example.includes('x')) currentVariable = 'x';
            if (example.includes('y')) currentVariable = 'y';
            document.querySelectorAll('.var-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.var === currentVariable);
            });
            
            // Auto plot the example
            plotEquation();
        });
    });
}

// Insert text at cursor position
function insertAtCursor(text) {
    const input = equationInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    
    // Insert the text
    input.value = input.value.substring(0, start) + text + input.value.substring(end);
    
    // Move cursor to after inserted text
    input.selectionStart = input.selectionEnd = start + text.length;
    
    // Focus back on input
    input.focus();
}

// Solve equation
async function solveEquation() {
    const equation = equationInput.value.trim();
    
    if (!equation) {
        showError('Please enter an equation to solve');
        return;
    }
    
    showLoading();
    
    try {
        const result = await processEquation(equation, 'solve');
        displayResults(result);
        addToHistory(equation, result);
        showMessage('Equation solved successfully!', 'success');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Simplify expression
async function simplifyExpression() {
    const expression = equationInput.value.trim();
    
    if (!expression) {
        showError('Please enter an expression to simplify');
        return;
    }
    
    showLoading();
    
    try {
        const result = await processEquation(expression, 'simplify');
        displayResults(result);
        addToHistory(expression, result);
        showMessage('Expression simplified!', 'success');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Factor expression
async function factorExpression() {
    const expression = equationInput.value.trim();
    
    if (!expression) {
        showError('Please enter an expression to factor');
        return;
    }
    
    showLoading();
    
    try {
        const result = await processEquation(expression, 'factor');
        displayResults(result);
        addToHistory(expression, result);
        showMessage('Expression factored!', 'success');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Process equation
async function processEquation(input, operation) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                let result;
                
                switch (operation) {
                    case 'solve':
                        result = solveMathEquation(input);
                        break;
                    case 'simplify':
                        result = simplifyMathExpression(input);
                        break;
                    case 'factor':
                        result = factorMathExpression(input);
                        break;
                    default:
                        throw new Error('Invalid operation');
                }
                
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }, 500);
    });
}

// Solve math equation
function solveMathEquation(equation) {
    const isEquation = equation.includes('=');
    
    if (!isEquation) {
        throw new Error('Please enter an equation (use = sign)');
    }
    
    const sides = equation.split('=');
    const leftSide = sides[0].trim();
    const rightSide = sides[1].trim();
    
    // Rearrange to left - right = 0
    const expr = math.simplify(`(${leftSide}) - (${rightSide})`);
    
    // Try to solve for variable
    let solutions;
    try {
        solutions = math.solve(expr, currentVariable);
    } catch (error) {
        // For trigonometric equations, try special solving
        if (equation.includes('sin') || equation.includes('cos') || equation.includes('tan')) {
            solutions = solveTrigonometricEquation(equation);
        } else {
            solutions = approximateSolution(expr);
        }
    }
    
    const steps = [
        `Original equation: ${equation}`,
        `Rearranged equation: ${expr.toString()} = 0`,
        `Solving for variable: ${currentVariable}`
    ];
    
    let solutionText;
    if (Array.isArray(solutions)) {
        if (solutions.length === 0) {
            solutionText = 'No real solutions found';
        } else if (solutions.length === 1) {
            solutionText = `${currentVariable} = ${formatNumber(solutions[0])}`;
        } else {
            solutionText = `${currentVariable} = ${solutions.map(s => formatNumber(s)).join(', ')}`;
        }
    } else if (solutions === 'No real roots found') {
        solutionText = 'No real solutions found';
    } else {
        solutionText = `${currentVariable} = ${formatNumber(solutions)}`;
    }
    
    return {
        type: 'solution',
        equation: equation,
        steps: steps,
        solution: solutionText,
        solutions: Array.isArray(solutions) ? solutions : [solutions],
        variable: currentVariable
    };
}

// Solve trigonometric equation
function solveTrigonometricEquation(equation) {
    const sides = equation.split('=');
    const leftSide = sides[0].trim();
    const rightSide = sides[1].trim();
    
    // Simple trigonometric solutions
    if (equation.includes('sin(x)=')) {
        const value = parseFloat(rightSide);
        if (Math.abs(value) <= 1) {
            const primary = Math.asin(value);
            const solutions = [primary, Math.PI - primary];
            // Add periodic solutions
            const periodicSolutions = [];
            for (let k = -3; k <= 3; k++) {
                periodicSolutions.push(primary + 2 * Math.PI * k);
                periodicSolutions.push(Math.PI - primary + 2 * Math.PI * k);
            }
            return periodicSolutions.filter(s => s >= -10 && s <= 10);
        }
    } else if (equation.includes('cos(x)=')) {
        const value = parseFloat(rightSide);
        if (Math.abs(value) <= 1) {
            const primary = Math.acos(value);
            const solutions = [primary, -primary];
            // Add periodic solutions
            const periodicSolutions = [];
            for (let k = -3; k <= 3; k++) {
                periodicSolutions.push(primary + 2 * Math.PI * k);
                periodicSolutions.push(-primary + 2 * Math.PI * k);
            }
            return periodicSolutions.filter(s => s >= -10 && s <= 10);
        }
    } else if (equation.includes('tan(x)=')) {
        const value = parseFloat(rightSide);
        const primary = Math.atan(value);
        const solutions = [];
        // Add periodic solutions
        for (let k = -3; k <= 3; k++) {
            solutions.push(primary + Math.PI * k);
        }
        return solutions.filter(s => s >= -10 && s <= 10);
    }
    
    return 'No trigonometric solution found';
}

// Approximate solution numerically
function approximateSolution(expr) {
    const f = x => {
        try {
            return expr.evaluate({[currentVariable]: x});
        } catch (e) {
            return NaN;
        }
    };
    
    const testPoints = [-10, -8, -6, -5, -4, -3, -2, -1, -0.5, 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10];
    let solutions = [];
    
    for (let i = 0; i < testPoints.length - 1; i++) {
        const x1 = testPoints[i];
        const x2 = testPoints[i + 1];
        
        try {
            const y1 = f(x1);
            const y2 = f(x2);
            
            if (typeof y1 === 'number' && typeof y2 === 'number' && !isNaN(y1) && !isNaN(y2)) {
                if (Math.abs(y1) < 0.0001) {
                    solutions.push(x1);
                } else if (Math.abs(y2) < 0.0001) {
                    solutions.push(x2);
                } else if (y1 * y2 < 0) {
                    // Sign change detected, use bisection
                    let a = x1, b = x2;
                    for (let j = 0; j < 20; j++) {
                        const mid = (a + b) / 2;
                        const fmid = f(mid);
                        if (Math.abs(fmid) < 0.0001) {
                            solutions.push(mid);
                            break;
                        } else if (f(a) * fmid < 0) {
                            b = mid;
                        } else {
                            a = mid;
                        }
                        if (j === 19) solutions.push((a + b) / 2);
                    }
                }
            }
        } catch (e) {
            // Skip errors
        }
    }
    
    // Remove duplicates
    solutions = solutions.filter((sol, index, self) => 
        self.findIndex(s => Math.abs(s - sol) < 0.001) === index
    );
    
    return solutions.length > 0 ? solutions : 'No real roots found';
}

// Simplify math expression - ENHANCED FOR TRIG FUNCTIONS
function simplifyMathExpression(expression) {
    try {
        // Replace ^ with ** for Math.js
        const cleanExpression = expression.replace(/\^/g, '**');
        
        // Parse and simplify
        const expr = math.simplify(cleanExpression);
        
        const steps = [
            `Original expression: ${expression}`,
            `Simplified form: ${expr.toString()}`
        ];

        // Add trigonometric identities information
        if (expression.includes('sin') || expression.includes('cos') || expression.includes('tan')) {
            steps.push('Trigonometric properties:');
            
            if (expression.includes('sin^2') || expression.includes('sin(x)^2')) {
                steps.push(' sin²(x) = 1 - cos²(x)');
            }
            
            if (expression.includes('cos^2') || expression.includes('cos(x)^2')) {
                steps.push(' cos²(x) = 1 - sin²(x)');
            }
            
            if (expression.includes('sin(2x)') || expression.includes('sin(2*x)')) {
                steps.push(' sin(2x) = 2 sin(x) cos(x)');
            }
            
            if (expression.includes('cos(2x)') || expression.includes('cos(2*x)')) {
                steps.push(' cos(2x) = cos²(x) - sin²(x)');
                steps.push(' = 2 cos²(x) - 1');
                steps.push(' = 1 - 2 sin²(x)');
            }
            
            steps.push('Periodicity: sin(x+2π) = sin(x), cos(x+2π) = cos(x)');
            steps.push('Range: -1 ≤ sin(x) ≤ 1, -1 ≤ cos(x) ≤ 1');
            
            if (expression.includes('tan')) {
                steps.push('tan(x) has period π and range (-∞, ∞)');
                steps.push('Vertical asymptotes at x = π/2 + nπ');
            }
        }
        
        // Try to evaluate for sample values
        try {
            const sampleValues = [-Math.PI, -Math.PI/2, 0, Math.PI/2, Math.PI];
            steps.push('Sample evaluations:');
            
            sampleValues.forEach(x => {
                try {
                    const value = expr.evaluate({x: x});
                    steps.push(` When x = ${formatNumber(x)}: ${formatNumber(value)}`);
                } catch (e) {
                    steps.push(` When x = ${formatNumber(x)}: undefined`);
                }
            });
        } catch (e) {
            // Ignore evaluation errors
        }
        
        return {
            type: 'simplification',
            expression: expression,
            steps: steps,
            simplified: expr.toString()
        };
    } catch (error) {
        throw new Error(`Cannot simplify expression: ${error.message}`);
    }
}

// Factor math expression - ENHANCED FOR TRIG FUNCTIONS
function factorMathExpression(expression) {
    try {
        const cleanExpression = expression.replace(/\^/g, '**');
        const expr = math.parse(cleanExpression);
        
        const steps = [`Original expression: ${expression}`];
        
        // Try to simplify first
        const simplified = math.simplify(expr);
        if (simplified.toString() !== cleanExpression) {
            steps.push(`Simplified: ${simplified.toString()}`);
        }
        
        // Special handling for trigonometric expressions
        if (expression.includes('sin') || expression.includes('cos')) {
            steps.push('Trigonometric factorization:');
            
            // Check for common trigonometric identities
            if (expression.includes('sin^2') && expression.includes('cos^2')) {
                steps.push('Using identity: sin²(x) + cos²(x) = 1');
                const factored = expression.replace(/sin\^2\(x\)\s*\+\s*cos\^2\(x\)/g, '1');
                if (factored !== expression) {
                    return {
                        type: 'factoring',
                        expression: expression,
                        steps: steps,
                        factored: factored
                    };
                }
            }
            
            // Check for double angle formulas
            if (expression.includes('2*sin') && expression.includes('cos')) {
                steps.push('Using identity: 2 sin(x) cos(x) = sin(2x)');
            }
            
            // Check for sum-to-product formulas
            if (expression.includes('sin') && expression.includes('+') && expression.includes('sin')) {
                steps.push('Consider sum-to-product formulas:');
                steps.push(' sin(A) + sin(B) = 2 sin((A+B)/2) cos((A-B)/2)');
                steps.push(' sin(A) - sin(B) = 2 cos((A+B)/2) sin((A-B)/2)');
            }
        }
        
        steps.push('Expression is already in simplest form.');
        
        return {
            type: 'factoring',
            expression: expression,
            steps: steps,
            factored: simplified.toString()
        };
        
    } catch (error) {
        throw new Error(`Cannot factor expression: ${error.message}`);
    }
}

// Format number for display - ENHANCED FOR TRIG VALUES
function formatNumber(num) {
    if (typeof num !== 'number') return num.toString();
    
    // Special formatting for π multiples
    if (Math.abs(num) < 0.0001) return '0';
    
    // Format π multiples nicely
    if (Math.abs(num / Math.PI - Math.round(num / Math.PI)) < 0.001) {
        const multiple = Math.round(num / Math.PI);
        if (multiple === 1) return 'π';
        if (multiple === -1) return '-π';
        if (multiple === 0) return '0';
        return `${multiple}π`;
    }
    
    // Format fractions of π
    const fractions = [
        {denom: 2, value: Math.PI/2},
        {denom: 3, value: Math.PI/3},
        {denom: 4, value: Math.PI/4},
        {denom: 6, value: Math.PI/6}
    ];
    
    for (const frac of fractions) {
        if (Math.abs(num - frac.value) < 0.001) return `π/${frac.denom}`;
        if (Math.abs(num + frac.value) < 0.001) return `-π/${frac.denom}`;
    }
    
    // Format multiples of π/2, π/3, etc.
    for (const frac of fractions) {
        for (let n = 2; n <= 4; n++) {
            const value = n * frac.value;
            if (Math.abs(num - value) < 0.001) return `${n}π/${frac.denom}`;
            if (Math.abs(num + value) < 0.001) return `-${n}π/${frac.denom}`;
        }
    }
    
    // Round to 4 decimal places for clean display
    const rounded = Math.round(num * 10000) / 10000;
    
    // Remove trailing zeros
    return parseFloat(rounded.toFixed(4)).toString();
}

// Display results
function displayResults(result) {
    let html = '';
    
    if (result.type === 'solution') {
        html = `
            <div class="solution-steps">
                <div class="step" style="--step-index: 0">
                    <div class="step-header">
                        <div class="step-number">1</div>
                        <div class="step-title">Equation</div>
                    </div>
                    <div class="step-content">${result.equation}</div>
                </div>
                
                ${result.steps.map((step, i) => `
                    <div class="step" style="--step-index: ${i + 1}">
                        <div class="step-header">
                            <div class="step-number">${i + 2}</div>
                            <div class="step-title">Step ${i + 2}</div>
                        </div>
                        <div class="step-content">${step}</div>
                    </div>
                `).join('')}
                
                <div class="solution">
                    <i class="fas fa-check-circle"></i> <strong>Solution:</strong> ${result.solution}
                </div>
            </div>
        `;
    } else if (result.type === 'simplification') {
        html = `
            <div class="solution-steps">
                <div class="step" style="--step-index: 0">
                    <div class="step-header">
                        <div class="step-number">1</div>
                        <div class="step-title">Original Expression</div>
                    </div>
                    <div class="step-content">${result.expression}</div>
                </div>
                
                <div class="step" style="--step-index: 1">
                    <div class="step-header">
                        <div class="step-number">2</div>
                        <div class="step-title">Simplified Form</div>
                    </div>
                    <div class="step-content">${result.simplified}</div>
                </div>
                
                ${result.steps.slice(2).map((step, i) => `
                    <div class="step" style="--step-index: ${i + 2}">
                        <div class="step-header">
                            <div class="step-number">${i + 3}</div>
                            <div class="step-title">Additional Info</div>
                        </div>
                        <div class="step-content">${step}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (result.type === 'factoring') {
        html = `
            <div class="solution-steps">
                <div class="step" style="--step-index: 0">
                    <div class="step-header">
                        <div class="step-number">1</div>
                        <div class="step-title">Original Expression</div>
                    </div>
                    <div class="step-content">${result.expression}</div>
                </div>
                
                ${result.steps.map((step, i) => `
                    <div class="step" style="--step-index: ${i + 1}">
                        <div class="step-header">
                            <div class="step-number">${i + 2}</div>
                            <div class="step-title">Step ${i + 2}</div>
                        </div>
                        <div class="step-content">${step}</div>
                    </div>
                `).join('')}
                
                ${result.factored !== result.expression ? `
                    <div class="solution">
                        <i class="fas fa-check-circle"></i> <strong>Factored Form:</strong> ${result.factored}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    resultsContent.innerHTML = html;
    resultsContent.scrollTop = 0;
}

// Show error message
function showError(message) {
    resultsContent.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error</h3>
            <p>${message}</p>
            <p class="hint" style="margin-top: 10px;">Make sure your equation is properly formatted.</p>
        </div>
    `;
}

// Plot equation on graph - ENHANCED FOR TRIGONOMETRIC FUNCTIONS
function plotEquation() {
    const equation = equationInput.value.trim();
    
    if (!equation) {
        showError('Please enter an equation to graph');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        try {
            const trace = createGraphTrace(equation);
            if (trace) {
                // Check if this equation is already plotted
                const existingIndex = graphData.findIndex(t => t.name === equation);
                if (existingIndex !== -1) {
                    graphData[existingIndex] = trace; // Replace existing
                } else {
                    graphData.push(trace); // Add new
                }
                
                updateGraphDisplay();
                
                // Add to history
                addToHistory(equation, {type: 'graph', solution: 'Plotted on graph'});
                showMessage(`Equation "${equation}" plotted successfully!`, 'success');
            }
        } catch (error) {
            showError(`Cannot graph equation: ${error.message}`);
        } finally {
            hideLoading();
        }
    }, 300);
}

// Create graph trace - OPTIMIZED FOR TRIGONOMETRIC FUNCTIONS
function createGraphTrace(equation) {
    let xMin = parseFloat(xMinInput.value) || -10;
    let xMax = parseFloat(xMaxInput.value) || 10;
    const yMin = parseFloat(yMinInput.value) || -5;
    const yMax = parseFloat(yMaxInput.value) || 5;
    
    // Check for special equation types first
    const sides = equation.split('=');
    if (sides.length === 2) {
        const leftSide = sides[0].trim();
        const rightSide = sides[1].trim();
        
        // Check for x = constant (vertical line)
        if (leftSide === 'x' || rightSide === 'x') {
            const constantSide = leftSide === 'x' ? rightSide : leftSide;
            const xValue = parseFloat(constantSide);
            
            if (!isNaN(xValue)) {
                // Create vertical line at x = xValue
                const yValues = [];
                const xValues = [];
                
                // Generate points for vertical line
                const numPoints = 100;
                for (let i = 0; i <= numPoints; i++) {
                    const y = yMin + (yMax - yMin) * (i / numPoints);
                    yValues.push(y);
                    xValues.push(xValue);
                }
                
                const colors = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];
                const color = colors[graphData.length % colors.length];
                
                return {
                    x: xValues,
                    y: yValues,
                    mode: 'lines',
                    type: 'scatter',
                    name: equation,
                    line: {
                        color: color,
                        width: 3,
                        dash: 'solid'
                    },
                    hovertemplate: `x = ${xValue}<br>y = %{y:.2f}<extra></extra>`
                };
            }
        }
        
        // Check for y = constant (horizontal line)
        if (leftSide === 'y' || rightSide === 'y') {
            const constantSide = leftSide === 'y' ? rightSide : leftSide;
            const yValue = parseFloat(constantSide);
            
            if (!isNaN(yValue)) {
                // Create horizontal line at y = yValue
                const yValues = [];
                const xValues = [];
                
                // Generate points for horizontal line
                const numPoints = 100;
                for (let i = 0; i <= numPoints; i++) {
                    const x = xMin + (xMax - xMin) * (i / numPoints);
                    xValues.push(x);
                    yValues.push(yValue);
                }
                
                const colors = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];
                const color = colors[graphData.length % colors.length];
                
                return {
                    x: xValues,
                    y: yValues,
                    mode: 'lines',
                    type: 'scatter',
                    name: equation,
                    line: {
                        color: color,
                        width: 3,
                        dash: 'solid'
                    },
                    hovertemplate: `x = %{x:.2f}<br>y = ${yValue}<extra></extra>`
                };
            }
        }
    }
    
    // Detect function type for range adjustment
    const isTrigonometric = equation.includes('sin') || equation.includes('cos') || equation.includes('tan');
    const isInverseTrigonometric = equation.includes('asin') || equation.includes('acos') || equation.includes('atan');
    const isLogarithmic = equation.includes('log') || equation.includes('ln');
    const isExponential = equation.includes('exp') || (equation.includes('e') && equation.includes('^'));
    const isRational = equation.includes('/') && equation.includes('x');
    const isSquareRoot = equation.includes('sqrt(');
    
    // Adjust range for trigonometric functions
    if (isTrigonometric) {
        // For trigonometric functions, use -4π to 4π range
        if (xMax - xMin < 8 * Math.PI) {
            xMin = -4 * Math.PI;
            xMax = 4 * Math.PI;
            xMinInput.value = xMin.toFixed(2);
            xMaxInput.value = xMax.toFixed(2);
            xRangeSlider.value = Math.abs(xMax);
        }
    } else if (isInverseTrigonometric) {
        // Inverse trig functions have domain [-1, 1] for asin and acos
        xMin = -1.5;
        xMax = 1.5;
        xMinInput.value = xMin.toFixed(2);
        xMaxInput.value = xMax.toFixed(2);
        xRangeSlider.value = Math.abs(xMax);
    }
    
    // Adjust step size based on function type
    const range = xMax - xMin;
    let step;
    if (isTrigonometric) {
        step = Math.PI / 64; // Very fine step for smooth trigonometric curves
    } else if (isInverseTrigonometric) {
        step = range / 500; // Fine step for inverse trig
    } else if (isLogarithmic || isRational) {
        step = range / 500;
    } else {
        step = range / 300;
    }
    
    const xValues = [];
    const yValues = [];
    
    // Generate x values with special handling
    if (isLogarithmic) {
        // Logarithmic scale - more points near 0
        for (let i = 0; i <= 300; i++) {
            const t = i / 300;
            const x = xMin * Math.pow(xMax / xMin, t);
            xValues.push(x);
        }
    } else {
        // Regular linear spacing
        for (let x = xMin; x <= xMax; x += step) {
            xValues.push(x);
        }
    }
    
    try {
        // Prepare expression for evaluation
        let exprToEvaluate = equation;
        
        // Handle equations with = sign
        if (equation.includes('=')) {
            const sides = equation.split('=');
            const leftSide = sides[0].trim();
            const rightSide = sides[1].trim();
            
            // For simple y = f(x) form
            if (leftSide === 'y' || leftSide === 'y(x)') {
                exprToEvaluate = rightSide;
            } else if (rightSide === 'y' || rightSide === 'y(x)') {
                exprToEvaluate = leftSide;
            } else {
                // For equations like f(x) = g(x), plot f(x) - g(x) = 0
                exprToEvaluate = `(${leftSide}) - (${rightSide})`;
            }
        }
        
        // Replace ^ with ** for Math.js
        exprToEvaluate = exprToEvaluate.replace(/\^/g, '**');
        
        // Clean up trigonometric expressions
        exprToEvaluate = exprToEvaluate
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/asin\(/g, 'Math.asin(')
            .replace(/acos\(/g, 'Math.acos(')
            .replace(/atan\(/g, 'Math.atan(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/exp\(/g, 'Math.exp(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/cbrt\(/g, (match) => {
                return '(function(x){return x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3)}(';
            })
            .replace(/pi/g, 'Math.PI')
            .replace(/e\*\*/g, 'Math.exp(')
            .replace(/e\^/g, 'Math.exp(');
        
        // Evaluate for each x value
        for (let x of xValues) {
            try {
                // Special handling for tan(x) near asymptotes
                if (isTrigonometric && equation.includes('tan')) {
                    // Check if near π/2 + nπ where tan has asymptotes
                    const remainder = Math.abs((x + Math.PI/2) % Math.PI) - Math.PI/2;
                    if (Math.abs(remainder) < 0.01) {
                        yValues.push(null);
                        continue;
                    }
                }
                
                // Special handling for inverse trig functions
                if (isInverseTrigonometric) {
                    if (equation.includes('asin') || equation.includes('acos')) {
                        // Domain check for asin and acos
                        if (x < -1 || x > 1) {
                            yValues.push(null);
                            continue;
                        }
                    }
                }
                
                // Create evaluation function
                const evalFunc = new Function('x', 'Math', `
                    try {
                        return ${exprToEvaluate};
                    } catch(e) {
                        return null;
                    }
                `);
                
                const y = evalFunc(x, Math);
                
                // Handle the result
                if (y === null || y === undefined || !isFinite(y)) {
                    yValues.push(null);
                } else if (isTrigonometric && Math.abs(y) > 10) {
                    // For tan(x) near asymptotes
                    yValues.push(null);
                } else if (isInverseTrigonometric && (y > 2*Math.PI || y < -2*Math.PI)) {
                    yValues.push(null);
                } else {
                    yValues.push(y);
                }
            } catch (error) {
                yValues.push(null);
            }
        }
        
        // Choose color based on number of traces
        const colors = [
            '#6366f1', '#10b981', '#8b5cf6', '#f59e0b', 
            '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'
        ];
        const color = colors[graphData.length % colors.length];
        
        // Special line style for different functions
        let lineStyle = {
            color: color,
            width: 3
        };
        
        if (isTrigonometric) {
            lineStyle.shape = 'spline'; // Smoother curves for trig functions
        } else if (isInverseTrigonometric) {
            lineStyle.dash = 'dash'; // Dashed for inverse functions
        }
        
        return {
            x: xValues,
            y: yValues,
            mode: 'lines',
            type: 'scatter',
            name: equation,
            line: lineStyle,
            hovertemplate: 'x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>'
        };
        
    } catch (error) {
        console.error('Error creating graph trace:', error);
        throw new Error('Unable to plot this equation. Try simplifying it first.');
    }
}

// Update graph display - ENHANCED FOR TRIGONOMETRIC FUNCTIONS
function updateGraphDisplay() {
    if (graphData.length === 0) {
        graphContainer.innerHTML = `
            <div class="graph-placeholder">
                <i class="fas fa-chart-line"></i>
                <p>Enter an equation and click "Plot Graph" to visualize it</p>
                <p class="hint">Try: sin(x), cos(2x), tan(x), or 2*sin(x)+cos(x)</p>
            </div>
        `;
        return;
    }
    
    const xMin = parseFloat(xMinInput.value) || -10;
    const xMax = parseFloat(xMaxInput.value) || 10;
    const yMin = parseFloat(yMinInput.value) || -5;
    const yMax = parseFloat(yMaxInput.value) || 5;
    
    // Check if any trigonometric functions are plotted
    const hasTrigonometric = graphData.some(trace => 
        trace.name.includes('sin') || trace.name.includes('cos') || trace.name.includes('tan') ||
        trace.name.includes('asin') || trace.name.includes('acos') || trace.name.includes('atan')
    );
    
    const hasInverseTrigonometric = graphData.some(trace => 
        trace.name.includes('asin') || trace.name.includes('acos') || trace.name.includes('atan')
    );
    
    // Prepare tick values for trigonometric functions
    let tickvals, ticktext;
    if (hasTrigonometric && !hasInverseTrigonometric) {
        // Create π-based ticks for trig functions
        tickvals = [];
        ticktext = [];
        const piMultiples = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
        for (const multiple of piMultiples) {
            const value = multiple * Math.PI;
            if (value >= xMin && value <= xMax) {
                tickvals.push(value);
                if (multiple === 0) {
                    ticktext.push('0');
                } else if (multiple === 1) {
                    ticktext.push('π');
                } else if (multiple === -1) {
                    ticktext.push('-π');
                } else {
                    ticktext.push(`${multiple}π`);
                }
            }
        }
        
        // Add π/2, π/4 ticks if needed
        const fractions = [2, 4];
        for (const denom of fractions) {
            for (let num = -8; num <= 8; num++) {
                const value = (num * Math.PI) / denom;
                if (value >= xMin && value <= xMax && Math.abs(value) > 0.1) {
                    const absNum = Math.abs(num);
                    if (absNum === 1) {
                        tickvals.push(value);
                        ticktext.push(num > 0 ? `π/${denom}` : `-π/${denom}`);
                    } else if (absNum > 0 && absNum < 5) {
                        tickvals.push(value);
                        ticktext.push(`${num}π/${denom}`);
                    }
                }
            }
        }
        
        // Sort tick values
        tickvals.sort((a, b) => a - b);
        ticktext.sort((a, b) => {
            const aVal = parseFloat(a.replace('π', '1').replace('/', '*1/'));
            const bVal = parseFloat(b.replace('π', '1').replace('/', '*1/'));
            return aVal - bVal;
        });
    }
    
    const layout = {
        title: {
            text: 'Graph Visualization',
            font: {
                size: 18,
                color: isDarkMode ? '#fff' : '#1f2937'
            },
            x: 0.5,
            xanchor: 'center'
        },
        xaxis: {
            title: {
                text: 'x-axis',
                font: {
                    size: 14,
                    color: isDarkMode ? '#d1d5db' : '#4b5563'
                }
            },
            gridcolor: isDarkMode ? '#374151' : '#e5e7eb',
            zerolinecolor: isDarkMode ? '#4b5563' : '#9ca3af',
            zerolinewidth: 2,
            range: [xMin, xMax],
            showgrid: true,
            gridwidth: 1,
            tickvals: tickvals,
            ticktext: ticktext,
            tickmode: tickvals ? 'array' : 'auto'
        },
        yaxis: {
            title: {
                text: 'y-axis',
                font: {
                    size: 14,
                    color: isDarkMode ? '#d1d5db' : '#4b5563'
                }
            },
            gridcolor: isDarkMode ? '#374151' : '#e5e7eb',
            zerolinecolor: isDarkMode ? '#4b5563' : '#9ca3af',
            zerolinewidth: 2,
            range: [yMin, yMax],
            showgrid: true,
            gridwidth: 1
        },
        plot_bgcolor: isDarkMode ? '#1f2937' : '#f9fafb',
        paper_bgcolor: isDarkMode ? '#111827' : '#ffffff',
        showlegend: true,
        legend: {
            x: 1.02,
            y: 1,
            xanchor: 'left',
            yanchor: 'top',
            bordercolor: isDarkMode ? '#374151' : '#e5e7eb',
            borderwidth: 1,
            bgcolor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(249, 250, 251, 0.8)',
            font: {
                color: isDarkMode ? '#d1d5db' : '#4b5563'
            }
        },
        margin: {
            l: 80,
            r: 100,
            b: 80,
            t: 80,
            pad: 10
        },
        hovermode: 'closest',
        dragmode: 'zoom'
    };
    
    // Create the plot
    Plotly.newPlot(graphContainer, graphData, layout, {
        displayModeBar: true,
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        modeBarButtonsToAdd: [{
            name: 'Download Plot',
            icon: Plotly.Icons.camera,
            click: function(gd) {
                Plotly.downloadImage(gd, {
                    format: 'png',
                    filename: 'algebra-graph',
                    width: 1200,
                    height: 800,
                    scale: 2
                });
            }
        }]
    });
    
    // Add event listener for double-click to reset view
    graphContainer.on('plotly_doubleclick', function() {
        resetGraphView();
    });
}

// Initialize graph
function initGraph() {
    updateGraphDisplay();
}

// Zoom graph
function zoomGraph(factor) {
    const xMin = parseFloat(xMinInput.value);
    const xMax = parseFloat(xMaxInput.value);
    const yMin = parseFloat(yMinInput.value);
    const yMax = parseFloat(yMaxInput.value);
    
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    
    const newXRange = xRange * factor;
    const newYRange = yRange * factor;
    
    xMinInput.value = (xCenter - newXRange / 2).toFixed(2);
    xMaxInput.value = (xCenter + newXRange / 2).toFixed(2);
    yMinInput.value = (yCenter - newYRange / 2).toFixed(2);
    yMaxInput.value = (yCenter + newYRange / 2).toFixed(2);
    
    updateGraphDisplay();
    showMessage(`Zoomed ${factor < 1 ? 'in' : 'out'}`, 'info');
}

// Reset graph view
function resetGraphView() {
    // Check if there are trigonometric functions
    const hasTrigonometric = graphData.some(trace => 
        trace.name.includes('sin') || trace.name.includes('cos') || trace.name.includes('tan')
    );
    
    if (hasTrigonometric) {
        xMinInput.value = -4 * Math.PI;
        xMaxInput.value = 4 * Math.PI;
        yMinInput.value = -5;
        yMaxInput.value = 5;
        xRangeSlider.value = Math.PI * 4;
        yRangeSlider.value = 5;
    } else {
        xMinInput.value = -10;
        xMaxInput.value = 10;
        yMinInput.value = -5;
        yMaxInput.value = 5;
        xRangeSlider.value = 10;
        yRangeSlider.value = 5;
    }
    
    updateGraphDisplay();
    showMessage('Graph view reset', 'info');
}

// Clear graph data
function clearGraphData() {
    if (graphData.length === 0) {
        showMessage('Graph is already empty', 'info');
        return;
    }
    
    if (confirm('Clear all graphs from the plot?')) {
        graphData = [];
        updateGraphDisplay();
        showMessage('All graphs cleared', 'success');
    }
}

// Add to history
function addToHistory(equation, result) {
    const historyItem = {
        id: historyIdCounter++,
        equation: equation,
        solution: result.solution || result.simplified || result.factored || 'Graph plotted',
        type: result.type || 'graph',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date: new Date().toLocaleDateString()
    };
    
    equationHistory.unshift(historyItem);
    
    // Keep only last 20 items
    if (equationHistory.length > 20) {
        equationHistory.pop();
    }
    
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    if (equationHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <p>No calculations yet</p>
                <p class="hint">Your calculations will appear here</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    equationHistory.forEach((item) => {
        const icon = item.type === 'graph' ? 'fa-chart-line' : 
                     item.type === 'simplification' ? 'fa-compress-alt' :
                     item.type === 'factoring' ? 'fa-sitemap' : 'fa-calculator';
        
        html += `
            <div class="history-item" data-id="${item.id}">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <i class="fas ${icon}"></i>
                    <div class="history-equation">${item.equation}</div>
                </div>
                <div class="history-solution">${item.solution}</div>
                <div class="history-time">
                    <i class="far fa-clock"></i>
                    ${item.timestamp}
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = html;
    
    // Add click event to history items
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            const historyItem = equationHistory.find(h => h.id === id);
            if (historyItem) {
                equationInput.value = historyItem.equation;
                
                // If it was a graph, replot it
                if (historyItem.type === 'graph') {
                    plotEquation();
                } else {
                    solveEquation();
                }
                
                showMessage('Equation loaded from history', 'info');
            }
        });
    });
}

// Clear history
function clearHistoryList() {
    if (equationHistory.length === 0) {
        showMessage('History is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
        equationHistory = [];
        updateHistoryDisplay();
        showMessage('History cleared', 'success');
    }
}

// Copy results
function copyResults() {
    const text = resultsContent.innerText;
    if (!text || text.includes('Welcome to AlgebraPro')) {
        showMessage('No results to copy', 'error');
        return;
    }
    
    navigator.clipboard.writeText(text)
        .then(() => showMessage('Results copied to clipboard', 'success'))
        .catch(() => showError('Failed to copy results'));
}

// Export results
function exportResults() {
    const text = resultsContent.innerText;
    if (!text || text.includes('Welcome to AlgebraPro')) {
        showMessage('No results to export', 'error');
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algebrapro-solution-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('Results exported as text file', 'success');
}

// Toggle theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    const icon = themeToggle.querySelector('i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.innerHTML = `<i class="${icon.className}"></i> ${isDarkMode ? 'Light' : 'Dark'}`;
    
    // Update graph colors if graph exists
    if (graphData.length > 0) {
        updateGraphDisplay();
    }
    
    // Save theme preference in memory
    if (isDarkMode) {
        document.body.style.setProperty('--theme', 'dark');
    } else {
        document.body.style.setProperty('--theme', 'light');
    }
    
    showMessage(`Switched to ${isDarkMode ? 'dark' : 'light'} theme`, 'info');
}

// Load theme preference
function loadThemePreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        toggleTheme(); // Switch to dark mode if system prefers dark
    }
}

// Show modal
function showModal(modal) {
    modal.classList.remove('hidden');
}

// Hide modal
function hideModal(modal) {
    modal.classList.add('hidden');
}

// Show loading overlay
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Show message toast
function showMessage(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast-message').forEach(toast => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast-message ${type === 'error' ? 'error' : ''}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'var(--danger)' : 'var(--success)'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initCalculator);

// Export functions for testing
window.algebraCalculator = {
    solveEquation,
    plotEquation,
    simplifyExpression,
    factorExpression,
    clearGraphData,
    resetGraphView,
    toggleTheme
};
